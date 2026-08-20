import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  Navigate,
} from "react-router-dom";

import Home from "./public/Home";
import About from "./public/About";
import Tracks from "./public/Tracks";
import Mentors from "./public/Mentors";
import FAQ from "./public/FAQ";
import Contact from "./public/Contact";
import Login from "./components/forms/Login";
import RoleSelect from "./components/forms/RoleSelect";
import StudentRegister from "./components/forms/StudentRegister";
import MentorRegister from "./components/forms/MentorRegister";

import StudentLayout from "./layouts/StudentLayout";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentAttendance from "./pages/student/StudentAttendance";
import StudentProgress from "./pages/student/StudentProgress";
import StudentAssignments from "./pages/student/StudentAssignments";
import StudentSubmissions from "./pages/student/StudentSubmissions";

import MentorLayout from "./layouts/MentorLayout";
import MentorSubmissions from "./pages/mentor/MentorSubmissions";

function AppRoutes() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-theme-bg text-theme-text transition-colors duration-200">
      <Routes>
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
        <Route
          path="/login"
          element={
            <Login
              onNavigateSignUp={() => navigate("/role-select")}
              onBackToPublic={() => navigate("/")}
              onForgotPassword={() => alert("Forgot password flow...")}
              onSuccessLogin={() => navigate("/student/dashboard")}
            />
          }
        />
        <Route
          path="/role-select"
          element={
            <RoleSelect
              onSelectRole={(role) =>
                navigate(
                  role === "student" ? "/student-register" : "/mentor-register",
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

        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="attendance" element={<StudentAttendance />} />
          <Route path="progress" element={<StudentProgress />} />
          <Route path="assignments" element={<StudentAssignments />} />
          <Route path="submissions" element={<StudentSubmissions />} />
        </Route>

        <Route path="/mentor" element={<MentorLayout />}>
          <Route index element={<Navigate to="submissions" replace />} />
          <Route path="submissions" element={<MentorSubmissions />} />
          <Route
            path="students"
            element={
              <div className="p-6 text-text-primary font-bold">
                My Students Page
              </div>
            }
          />
          <Route
            path="attendance"
            element={
              <div className="p-6 text-text-primary font-bold">
                Attendance Page
              </div>
            }
          />
          <Route
            path="progress"
            element={
              <div className="p-6 text-text-primary font-bold">
                Progress Page
              </div>
            }
          />
          <Route
            path="assignments"
            element={
              <div className="p-6 text-text-primary font-bold">
                Assignments Page
              </div>
            }
          />
          <Route
            path="announcements"
            element={
              <div className="p-6 text-text-primary font-bold">
                Announcements Page
              </div>
            }
          />
          <Route
            path="settings"
            element={
              <div className="p-6 text-text-primary font-bold">
                Settings Page
              </div>
            }
          />
        </Route>
      </Routes>
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
