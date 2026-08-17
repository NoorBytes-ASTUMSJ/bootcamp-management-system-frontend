import { useState } from "react";
import Home from "./components/home/Home";
import About from "./components/pages/About";
import Tracks from "./components/pages/Tracks";
import Mentors from "./components/pages/Mentors";
import FAQ from "./components/pages/FAQ";
import Contact from "./components/pages/Contact";
import Login from "./components/auth/Login";
import RoleSelect from "./components/auth/RoleSelect";
import StudentRegister from "./components/auth/StudentRegister";
import MentorRegister from "./components/auth/MentorRegister";

export default function App() {
  // 'home' | 'about' | 'tracks' | 'mentors' | 'faq' | 'contact' | 'login' | 'role-select' | 'student-register' | 'mentor-register'
  const [currentView, setCurrentView] = useState("home");

  return (
    <main className="min-h-screen bg-white dark:bg-brand-dark-bg transition-colors duration-200">
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
        />
      )}

      {/* 8. Choose Role */}
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

      {/* 9. Student Multi-step Registration */}
      {currentView === "student-register" && (
        <StudentRegister
          onNavigateLogin={() => setCurrentView("login")}
          onBackToHome={() => setCurrentView("role-select")}
        />
      )}

      {/* 10. Mentor Multi-step Application */}
      {currentView === "mentor-register" && (
        <MentorRegister
          onNavigateLogin={() => setCurrentView("login")}
          onBackToHome={() => setCurrentView("role-select")}
        />
      )}
    </main>
  );
}
