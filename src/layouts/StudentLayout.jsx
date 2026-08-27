import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { Bell, User, Sun, Moon, LogOut, Globe, Check } from "lucide-react";
import StudentSidebar from "../components/layout/StudentSidebar";

export default function StudentLayout() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const student = {
    firstName: user?.firstName || user?.name || "Alex",
    lastName: user?.lastName || "Johnson",
  };

  // Compute active page title for the header
  const getHeaderTitle = () => {
    const pathSegment = location.pathname.split("/student/")[1] || "dashboard";
    return pathSegment.charAt(0).toUpperCase() + pathSegment.slice(1);
  };

  const handleLogout = () => {
    setIsProfileOpen(false);
    if (logout) {
      logout();
    }
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login", { replace: true });
  };

  const toggleDarkMode = (enabled) => {
    setIsDarkMode(enabled);
    if (enabled) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <div className="flex h-screen bg-neutral-50 dark:bg-[#0d1117] text-neutral-900 dark:text-neutral-100 overflow-hidden w-full">
      {/* Permanent Fixed Sidebar */}
      <StudentSidebar />

      <div className="flex-1 flex flex-col h-full overflow-hidden transition-all duration-300 ease-in-out w-full pl-56">
        <header className="sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-[#151921] px-8 shrink-0">
          <div className="text-xs sm:text-sm font-semibold tracking-tight text-neutral-800 dark:text-neutral-200">
            {getHeaderTitle()} Portal
          </div>

          <div className="flex items-center gap-3 relative">
            <button className="relative p-1.5 rounded-full text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors cursor-pointer">
              <Bell size={17} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#B91C1C]" />
            </button>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-7 h-7 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:opacity-80 transition-opacity cursor-pointer overflow-hidden"
              >
                <User size={15} />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 top-10 w-52 rounded-xl bg-white dark:bg-[#1A1F29] border border-neutral-200 dark:border-neutral-800 shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-2 py-1.5 border-b border-neutral-100 dark:border-neutral-800 mb-1.5">
                    <p className="font-semibold text-xs text-neutral-900 dark:text-neutral-100 truncate">
                      {student.firstName} {student.lastName}
                    </p>
                    <p className="text-[10px] text-neutral-400 capitalize">
                      Student
                    </p>
                  </div>

                  <div className="space-y-0.5">
                    <Link
                      onClick={() => setIsProfileOpen(false)}
                      to="/student/settings"
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer text-neutral-700 dark:text-neutral-300"
                    >
                      <User size={13} className="text-neutral-400" />
                      <span>Profile</span>
                    </Link>

                    <Link
                      onClick={() => setIsProfileOpen(false)}
                      to="/"
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer text-neutral-700 dark:text-neutral-300"
                    >
                      <Globe size={13} className="text-neutral-400" />
                      <span>Public Home</span>
                    </Link>

                    <button
                      onClick={() => toggleDarkMode(!isDarkMode)}
                      className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer text-neutral-700 dark:text-neutral-300"
                    >
                      <div className="flex items-center gap-2">
                        {isDarkMode ? (
                          <Sun size={13} className="text-neutral-400" />
                        ) : (
                          <Moon size={13} className="text-neutral-400" />
                        )}
                        <span>Dark Mode</span>
                      </div>
                      {isDarkMode && (
                        <Check size={12} className="text-[#B91C1C]" />
                      )}
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-medium text-[#B91C1C] hover:bg-red-500/10 transition-colors cursor-pointer"
                    >
                      <LogOut size={13} className="text-[#B91C1C]" />
                      <span>Log out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 bg-neutral-50 dark:bg-[#0d1117]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
