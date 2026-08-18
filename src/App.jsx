import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Public pages
import Home from "./components/home/Home";
import About from "./components/pages/About";
import Tracks from "./components/pages/Tracks";
import Mentors from "./components/pages/Mentors";
import FAQ from "./components/pages/FAQ";
import Contact from "./components/pages/Contact";

// Authentication
import Login from "./components/auth/Login";
import RoleSelect from "./components/auth/RoleSelect";
import StudentRegister from "./components/auth/StudentRegister";
import MentorRegister from "./components/auth/MentorRegister";

// Existing dashboard
import MembersDashboard from "./components/dashboard/MembersDashboard";

// Student dashboard
import StudentLayout from "./layouts/StudentLayout";
import StudentDashboard from "./pages/student/Dashboard";
import StudentAttendance from "./pages/student/Attendance";
import StudentProgress from "./pages/student/StudentProgress";
import StudentAssignments from "./pages/student/StudentAssignments";

export default function App() {
  const [currentView, setCurrentView] = useState("home");
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Theme
  const handleToggleTheme = (dark) => {
    setIsDarkMode(dark);

    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <BrowserRouter>
      {/* PUBLIC / AUTH / EXISTING DASHBOARD */}
      <main className="min-h-screen bg-theme-bg text-theme-text transition-colors duration-200">
        {/* 1. Landing Page */}
        {currentView === "home" && (
          <Home
            onNavigatePage={(page) => setCurrentView(page)}
            onNavigateLogin={() => setCurrentView("login")}
            onNavigateSignUp={() => setCurrentView("role-select")}
          />
        )}

        {/* 2. About Page */}
        {currentView === "about" && (
          <About
            onNavigatePage={(page) => setCurrentView(page)}
            onNavigateLogin={() => setCurrentView("login")}
            onNavigateSignUp={() => setCurrentView("role-select")}
          />
        )}

        {/* 3. Tracks Page */}
        {currentView === "tracks" && (
          <Tracks
            onNavigatePage={(page) => setCurrentView(page)}
            onNavigateLogin={() => setCurrentView("login")}
            onNavigateSignUp={() => setCurrentView("role-select")}
          />
        )}

        {/* 4. Mentors Page */}
        {currentView === "mentors" && (
          <Mentors
            onNavigatePage={(page) => setCurrentView(page)}
            onNavigateLogin={() => setCurrentView("login")}
            onNavigateSignUp={() => setCurrentView("role-select")}
          />
        )}

        {/* 5. FAQ Page */}
        {currentView === "faq" && (
          <FAQ
            onNavigatePage={(page) => setCurrentView(page)}
            onNavigateLogin={() => setCurrentView("login")}
            onNavigateSignUp={() => setCurrentView("role-select")}
          />
        )}

        {/* 6. Contact Page */}
        {currentView === "contact" && (
          <Contact
            onNavigatePage={(page) => setCurrentView(page)}
            onNavigateLogin={() => setCurrentView("login")}
            onNavigateSignUp={() => setCurrentView("role-select")}
          />
        )}

        {/* 7. Login */}
        {currentView === "login" && (
          <Login
            onNavigateSignUp={() => setCurrentView("role-select")}
            onBackToPublic={() => setCurrentView("home")}
            onForgotPassword={() => alert("Forgot password flow...")}
            onSuccessLogin={() => setCurrentView("dashboard")}
          />
        )}

        {/* 8. Role Selection */}
        {currentView === "role-select" && (
          <RoleSelect
            onSelectRole={(role) =>
              setCurrentView(
                role === "student" ? "student-register" : "mentor-register",
              )
            }
            onNavigateLogin={() => setCurrentView("login")}
            onBackToHome={() => setCurrentView("home")}
          />
        )}

        {/* 9. Student Registration */}
        {currentView === "student-register" && (
          <StudentRegister
            onNavigateLogin={() => setCurrentView("login")}
            onBackToHome={() => setCurrentView("role-select")}
          />
        )}

        {/* 10. Mentor Registration */}
        {currentView === "mentor-register" && (
          <MentorRegister
            onNavigateLogin={() => setCurrentView("login")}
            onBackToHome={() => setCurrentView("role-select")}
          />
        )}

        {/* 11. Existing Members Dashboard */}
        {currentView === "dashboard" && (
          <MembersDashboard
            isDarkMode={isDarkMode}
            onToggleTheme={handleToggleTheme}
          />
        )}
      </main>

      {/* STUDENT ROUTES */}
      <Routes>
        <Route path="/student" element={<StudentLayout />}>
          <Route path="dashboard" element={<StudentDashboard />} />

          <Route path="attendance" element={<StudentAttendance />} />

          <Route path="progress" element={<StudentProgress />} />

          <Route path="assignments" element={<StudentAssignments />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
