import { useState } from "react";
import Login from "./components/auth/Login";
import RoleSelect from "./components/auth/RoleSelect";
import StudentRegister from "./components/auth/StudentRegister";
import MentorRegister from "./components/auth/MentorRegister";

export default function App() {
  // view states: 'login' | 'role-select' | 'student-register' | 'mentor-register'
  const [currentView, setCurrentView] = useState("login");

  const handleBackToHome = () => {
    // በኋላ ወደ Landing Page ራውት የሚደረግበት
    setCurrentView("login");
  };

  return (
    <main className="min-h-screen bg-[#FAFAFA] dark:bg-brand-dark-bg transition-colors duration-200">
      {/* 1. Login Page */}
      {currentView === "login" && (
        <Login
          onNavigateSignUp={() => setCurrentView("role-select")}
          onBackToPublic={handleBackToHome}
          onForgotPassword={() => alert("Forgot password flow...")}
        />
      )}

      {/* 2. Choose Role (Middle Step) */}
      {currentView === "role-select" && (
        <RoleSelect
          onSelectRole={(role) =>
            setCurrentView(
              role === "student" ? "student-register" : "mentor-register",
            )
          }
          onNavigateLogin={() => setCurrentView("login")}
          onBackToHome={() => setCurrentView("login")}
        />
      )}

      {/* 3. Student Multi-step Registration */}
      {currentView === "student-register" && (
        <StudentRegister
          onNavigateLogin={() => setCurrentView("login")}
          onBackToHome={() => setCurrentView("role-select")}
        />
      )}

      {/* 4. Mentor Multi-step Application */}
      {currentView === "mentor-register" && (
        <MentorRegister
          onNavigateLogin={() => setCurrentView("login")}
          onBackToHome={() => setCurrentView("role-select")}
        />
      )}
    </main>
  );
}
