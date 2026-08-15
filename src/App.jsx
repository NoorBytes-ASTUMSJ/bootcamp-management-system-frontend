import { useState } from "react";
import StudentRegister from "./components/auth/StudentRegister";
import MentorRegister from "./components/auth/MentorRegister";

export default function App() {
  // 'student' or 'mentor' to choose which registration from to display.
  const [currentView, setCurrentView] = useState("mentor");

  return (
    <main className="min-h-screen bg-[#FAFAFA] dark:bg-brand-dark-bg transition-colors duration-200">
      <div className="fixed top-4 right-4 z-50 flex items-center bg-white dark:bg-brand-dark-surface p-1 rounded-lg border border-gray-200 dark:border-brand-dark-border shadow-sm text-xs font-medium">
        <button
          onClick={() => setCurrentView("student")}
          className={`px-3 py-1.5 rounded-md transition-all ${
            currentView === "student"
              ? "bg-[#B93325] text-white"
              : "text-gray-600 dark:text-brand-dark-muted hover:text-gray-900"
          }`}
        >
          Student
        </button>
        <button
          onClick={() => setCurrentView("mentor")}
          className={`px-3 py-1.5 rounded-md transition-all ${
            currentView === "mentor"
              ? "bg-[#B93325] text-white"
              : "text-gray-600 dark:text-brand-dark-muted hover:text-gray-900"
          }`}
        >
          Mentor
        </button>
      </div>

      {/* Render the appropriate registration form based on the current view */}
      {currentView === "student" ? <StudentRegister /> : <MentorRegister />}
    </main>
  );
}
