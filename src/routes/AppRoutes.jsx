import React from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ProtectedRoute } from "./ProtectedRoute";

// Public Pages
import Home from "../public/Home";
import About from "../public/About";
import Tracks from "../public/Tracks";
import Mentors from "../public/Mentors";
import FAQ from "../public/FAQ";
import Contact from "../public/Contact";
import Announcements from "../public/Announcements";

// Auth & Registration Forms
import Login from "../components/forms/Login";
import RoleSelect from "../components/forms/RoleSelect";
import StudentRegister from "../components/forms/StudentRegister";
import MentorRegister from "../components/forms/MentorRegister";

// Layouts & Student Pages
import StudentLayout from "../layouts/StudentLayout";
import StudentDashboard from "../pages/student/StudentDashboard";
import StudentAttendance from "../pages/student/StudentAttendance";
import StudentProgress from "../pages/student/StudentProgress";
import StudentAssignments from "../pages/student/StudentAssignments";
import StudentSubmissions from "../pages/student/StudentSubmissions";
import StudentAnnouncements from "../pages/student/AnnouncementsPage";

// Layouts & Mentor Pages
import MentorLayout from "../layouts/MentorLayout";
import MentorSubmissions from "../pages/mentor/MentorSubmissions";
import MentorAttendance from "../pages/mentor/MentorAttendance";
import MentorAssignments from "../pages/mentor/MentorAssignments";
import MentorProgress from "../pages/mentor/MentorProgress";
import MentorAnnouncements from "@/pages/mentor/MentorAnnouncements";

// Layouts & Admin Pages
import AdminLayout from "../layouts/AdminLayout";
import MainDashboard from "../pages/admin/MainDashboard";
import StudentsDashboard from "../pages/admin/StudentsDashboard";
import MentorsManagement from "../pages/admin/MentorsManagement";
import BatchesManagement from "../pages/admin/BatchesManagement";
import AllUsersManagement from "../pages/admin/AllUsersManagement";
import AttendanceManagement from "../pages/admin/AttendanceManagement";
import ProgressManagement from "../pages/admin/ProgressManagement";
import AssignmentsManagement from "../pages/admin/AssignmentsManagement";
import SubmissionsManagement from "../pages/admin/SubmissionsManagement";
import AnnouncementsManagement from "../pages/admin/AnnouncementsManagement";
import SettingsManagement from "../pages/admin/SettingsManagement";

// Placeholder for remaining under-construction pages
const PagePlaceholder = ({ title }) => (
  <div className="p-6">
    <h1 className="text-2xl font-bold text-text-primary">{title}</h1>
    <p className="text-sm text-text-muted mt-2">
      This section is under active development.
    </p>
  </div>
);

export default function AppRoutes() {
  const navigate = useNavigate();
  const { user, getRedirectPath } = useAuth();

  return (
    <main className="min-h-screen bg-theme-bg text-theme-text transition-colors duration-200">
      <Routes>
        {/* Public Marketing Routes */}
        <Route
          path="/"
          element={
            <Home
              onNavigatePage={(page) => navigate(`/${page}`)}
              onNavigateLogin={() => navigate("/login")}
              onNavigateSignUp={() => navigate("/role-select")}
            />
          }
        />
        <Route
          path="/about"
          element={
            <About
              onNavigatePage={(page) => navigate(`/${page}`)}
              onNavigateLogin={() => navigate("/login")}
              onNavigateSignUp={() => navigate("/role-select")}
            />
          }
        />
        <Route
          path="/tracks"
          element={
            <Tracks
              onNavigatePage={(page) => navigate(`/${page}`)}
              onNavigateLogin={() => navigate("/login")}
              onNavigateSignUp={() => navigate("/role-select")}
            />
          }
        />
        <Route
          path="/mentors"
          element={
            <Mentors
              onNavigatePage={(page) => navigate(`/${page}`)}
              onNavigateLogin={() => navigate("/login")}
              onNavigateSignUp={() => navigate("/role-select")}
            />
          }
        />
        <Route
          path="/faq"
          element={
            <FAQ
              onNavigatePage={(page) => navigate(`/${page}`)}
              onNavigateLogin={() => navigate("/login")}
              onNavigateSignUp={() => navigate("/role-select")}
            />
          }
        />
        <Route
          path="/contact"
          element={
            <Contact
              onNavigatePage={(page) => navigate(`/${page}`)}
              onNavigateLogin={() => navigate("/login")}
              onNavigateSignUp={() => navigate("/role-select")}
            />
          }
        />
        <Route path="/announcements" element={<Announcements />} />

        {/* Authentication & Role Selection Flow */}
        <Route
          path="/login"
          element={
            <Login
              onNavigateSignUp={() => navigate("/role-select")}
              onBackToPublic={() => navigate("/")}
              onForgotPassword={() => alert("Forgot password flow...")}
              onSuccessLogin={(userData) =>
                navigate(getRedirectPath(userData?.role || user?.role))
              }
            />
          }
        />
        <Route
          path="/role-select"
          element={
            <RoleSelect
              onSelectRole={(role) =>
                navigate(
                  role === "student" ? "/student-register" : "/mentor-register"
                )
              }
              onNavigateLogin={() => navigate("/login")}
              onBackToHome={() => navigate("/")}
            />
          }
        />
        <Route
          path="/student-register"
          element={
            <StudentRegister
              onNavigateLogin={() => navigate("/login")}
              onBackToHome={() => navigate("/role-select")}
            />
          }
        />
        <Route
          path="/mentor-register"
          element={
            <MentorRegister
              onNavigateLogin={() => navigate("/login")}
              onBackToHome={() => navigate("/role-select")}
            />
          }
        />

        {/* Protected Student Portal */}
        <Route element={<ProtectedRoute allowedRoles={["student", "user"]} />}>
          <Route path="/student" element={<StudentLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="attendance" element={<StudentAttendance />} />
            <Route path="progress" element={<StudentProgress />} />
            <Route path="assignments" element={<StudentAssignments />} />
            <Route path="submissions" element={<StudentSubmissions />} />
            <Route path="announcements" element={<StudentAnnouncements />} />
             <Route path="settings" element={<SettingsManagement />}/>
            
          </Route>
        </Route>

        {/* Protected Mentor Portal */}
        <Route element={<ProtectedRoute allowedRoles={["mentor"]} />}>
          <Route path="/mentor" element={<MentorLayout />}>
            <Route index element={<Navigate to="attendance" replace />} />
            <Route path="attendance" element={<MentorAttendance />} />
            <Route path="assignments" element={<MentorAssignments />} />
            <Route path="submissions" element={<MentorSubmissions />} />
            <Route path="announcements" element={<MentorAnnouncements />} />
            <Route path="progress" element={<MentorProgress />} />
            <Route
              path="dashboard"
              element={<PagePlaceholder title="Dashboard Overview" />}
            />
            <Route
              path="students"
              element={<PagePlaceholder title="My Students" />}
            />
            <Route path="settings" element={<SettingsManagement />} />
          
          </Route>
          
        </Route>

        {/* Protected Admin Portal */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />

            {/* MAIN */}
            <Route path="dashboard" element={<MainDashboard />} />

            {/* MANAGEMENT */}
            <Route path="students" element={<StudentsDashboard />} />
            <Route path="mentors" element={<MentorsManagement />} />
            <Route path="batches" element={<BatchesManagement />} />
            <Route path="users" element={<AllUsersManagement />} />

            {/* ACADEMIC */}
            <Route path="attendance" element={<AttendanceManagement />} />
            <Route path="progress" element={<ProgressManagement />} />
            <Route path="assignments" element={<AssignmentsManagement />} />
            <Route path="submissions" element={<SubmissionsManagement />} />

            {/* COMMUNICATION */}
            <Route path="announcements" element={<AnnouncementsManagement />} />

            {/* ACCOUNT */}
            <Route path="settings" element={<SettingsManagement />} />
          </Route>
        </Route>

        {/* Fallback Redirection */}
        <Route
          path="*"
          element={
            <Navigate to={user ? getRedirectPath(user.role) : "/"} replace />
          }
        />
      </Routes>
    </main>
  );
}