import React, { useState } from "react";

// Public Marketing Pages
import Home from "./pages/public/Home";
import About from "./pages/public/About";
import Tracks from "./pages/public/Tracks";
import Mentors from "./pages/public/Mentors";
import FAQ from "./pages/public/FAQ";
import Contact from "./pages/public/Contact";

// Auth & Form Components
import Login from "./components/forms/Login";
import RoleSelect from "./components/forms/RoleSelect";
import StudentRegister from "./components/forms/StudentRegister";
import MentorRegister from "./components/forms/MentorRegister";

// Admin Dashboard Views
import MainDashboard from "./pages/admin/MainDashboard";
import StudentsDashboard from "./pages/admin/StudentsDashboard";
import MentorsManagement from "./pages/admin/MentorsManagement";
import BatchesManagement from "./pages/admin/BatchesManagement";
import AllUsersManagement from "./pages/admin/AllUsersManagement";
import AttendanceManagement from "./pages/admin/AttendanceManagement";
import ProgressManagement from "./pages/admin/ProgressManagement";
import AssignmentsManagement from "./pages/admin/AssignmentsManagement";
import SubmissionsManagement from "./pages/admin/SubmissionsManagement";
import AnnouncementsManagement from "./pages/admin/AnnouncementsManagement";
import SettingsManagement from "./pages/admin/SettingsManagement";

export default function App() {
  const [currentView, setCurrentView] = useState("home");
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleToggleTheme = (dark) => {
    setIsDarkMode(dark);
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <main className="min-h-screen bg-background text-inherit transition-colors duration-200">
      {/* 1. Landing Page (Home) */}
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

      {/* 7. Login Page */}
      {currentView === "login" && (
        <Login
          onNavigateSignUp={() => setCurrentView("role-select")}
          onBackToPublic={() => setCurrentView("home")}
          onForgotPassword={() => alert("Forgot password flow...")}
          onSuccessLogin={() => setCurrentView("dashboard-main")}
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

      {/* 11. Main Overview Dashboard */}
      {(currentView === "dashboard" || currentView === "dashboard-main") && (
        <MainDashboard
          isDarkMode={isDarkMode}
          onToggleTheme={handleToggleTheme}
          onNavigateAdminView={(view) => setCurrentView(view)}
          onLogout={() => setCurrentView("home")}
        />
      )}

      {/* 12. Students Dashboard */}
      {currentView === "dashboard-students" && (
        <StudentsDashboard
          isDarkMode={isDarkMode}
          onToggleTheme={handleToggleTheme}
          onNavigateAdminView={(view) => setCurrentView(view)}
          onLogout={() => setCurrentView("home")}
        />
      )}

      {/* 13. Mentors Dashboard */}
      {currentView === "dashboard-mentors" && (
        <MentorsManagement
          isDarkMode={isDarkMode}
          onToggleTheme={handleToggleTheme}
          onNavigateAdminView={(view) => setCurrentView(view)}
          onLogout={() => setCurrentView("home")}
        />
      )}

      {/* 14. Batches Dashboard */}
      {currentView === "dashboard-batches" && (
        <BatchesManagement
          isDarkMode={isDarkMode}
          onToggleTheme={handleToggleTheme}
          onNavigateAdminView={(view) => setCurrentView(view)}
          onLogout={() => setCurrentView("home")}
        />
      )}

      {/* 15. All Users Dashboard */}
      {currentView === "dashboard-users" && (
        <AllUsersManagement
          isDarkMode={isDarkMode}
          onToggleTheme={handleToggleTheme}
          onNavigateAdminView={(view) => setCurrentView(view)}
          onLogout={() => setCurrentView("home")}
        />
      )}

      {/* 16. Attendance Management Dashboard */}
      {currentView === "dashboard-attendance" && (
        <AttendanceManagement
          isDarkMode={isDarkMode}
          onToggleTheme={handleToggleTheme}
          onNavigateAdminView={(view) => setCurrentView(view)}
          onLogout={() => setCurrentView("home")}
        />
      )}

      {/* 17. Progress Management Dashboard */}
      {currentView === "dashboard-progress" && (
        <ProgressManagement
          isDarkMode={isDarkMode}
          onToggleTheme={handleToggleTheme}
          onNavigateAdminView={(view) => setCurrentView(view)}
          onLogout={() => setCurrentView("home")}
        />
      )}

      {/* 18. Assignments Management Dashboard */}
      {currentView === "dashboard-assignments" && (
        <AssignmentsManagement
          isDarkMode={isDarkMode}
          onToggleTheme={handleToggleTheme}
          onNavigateAdminView={(view) => setCurrentView(view)}
          onLogout={() => setCurrentView("home")}
        />
      )}

      {/* 19. Submissions Management Dashboard */}
      {currentView === "dashboard-submissions" && (
        <SubmissionsManagement
          isDarkMode={isDarkMode}
          onToggleTheme={handleToggleTheme}
          onNavigateAdminView={(view) => setCurrentView(view)}
          onLogout={() => setCurrentView("home")}
        />
      )}

      {/* 20. Announcements Management Dashboard */}
      {currentView === "dashboard-announcements" && (
        <AnnouncementsManagement
          isDarkMode={isDarkMode}
          onToggleTheme={handleToggleTheme}
          onNavigateAdminView={(view) => setCurrentView(view)}
          onLogout={() => setCurrentView("home")}
        />
      )}

      {/* 21. Settings Dashboard */}
      {currentView === "dashboard-settings" && (
        <SettingsManagement
          isDarkMode={isDarkMode}
          onToggleTheme={handleToggleTheme}
          onNavigateAdminView={(view) => setCurrentView(view)}
          onLogout={() => setCurrentView("home")}
        />
      )}
    </main>
  );
}
