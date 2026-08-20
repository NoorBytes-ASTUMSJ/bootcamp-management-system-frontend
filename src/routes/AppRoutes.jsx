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

// Layouts & Mentor Pages
import MentorLayout from "../layouts/MentorLayout";
import MentorSubmissions from "../pages/mentor/MentorSubmissions";

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
        <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
          <Route path="/student" element={<StudentLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="attendance" element={<StudentAttendance />} />
            <Route path="progress" element={<StudentProgress />} />
            <Route path="assignments" element={<StudentAssignments />} />
            <Route path="submissions" element={<StudentSubmissions />} />
          </Route>
        </Route>

        {/* Protected Mentor Portal */}
        <Route element={<ProtectedRoute allowedRoles={["mentor"]} />}>
          <Route path="/mentor" element={<MentorLayout />}>
            <Route index element={<Navigate to="submissions" replace />} />
            <Route path="submissions" element={<MentorSubmissions />} />
          </Route>
        </Route>

        {/* Fallback Redirection */}
        <Route
          path="*"
          element={<Navigate to={user ? getRedirectPath(user.role) : "/"} replace />}
        />
      </Routes>
    </main>
  );
}