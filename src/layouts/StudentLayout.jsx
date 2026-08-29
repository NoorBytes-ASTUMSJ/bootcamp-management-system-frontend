import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import {
  Bell,
  User,
  Sun,
  Moon,
  LogOut,
  Globe,
  Check,
  Menu,
  X,
} from "lucide-react";
import StudentSidebar from "../components/layout/StudentSidebar";

export default function StudentLayout() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const profileRef = useRef(null);
  const mobileNavRef = useRef(null);

  // Auto-close dropdown on route changes
  useEffect(() => {
    setIsMobileNavOpen(false);
  }, [location.pathname]);

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (
        mobileNavRef.current &&
        !mobileNavRef.current.contains(event.target)
      ) {
        setIsMobileNavOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const student = {
    firstName: user?.firstName || user?.name || "Alex",
    lastName: user?.lastName || "Johnson",
  };

  const getHeaderTitle = () => {
    const pathSegment = location.pathname.split("/student/")[1] || "dashboard";
    return pathSegment.charAt(0).toUpperCase() + pathSegment.slice(1);
  };

  const handleLogout = () => {
    setIsProfileOpen(false);
    setIsMobileNavOpen(false);
    if (logout) {
      logout();
    }
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login", { replace: true });
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      return next;
    });
  };

  return (
    <div className="flex h-screen bg-neutral-50 dark:bg-[#0d1117] text-neutral-900 dark:text-neutral-100 overflow-hidden w-full">
      {/* Desktop Persistent Sidebar */}
      <StudentSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden transition-all duration-300 ease-in-out w-full md:pl-56">
        <header className="sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-[#151921] px-4 sm:px-8 shrink-0 relative select-none">
          {/* Header Title / Mobile Logo */}
          <div className="flex items-center gap-2">
            <span className="md:hidden font-black text-xs text-[#B91C1C]">
              ASTU MSJ
            </span>
            <span className="hidden md:inline text-xs sm:text-sm font-semibold tracking-tight text-neutral-800 dark:text-neutral-200">
              {getHeaderTitle()} Portal
            </span>
          </div>

          {/* Right Controls Container */}
          <div className="flex items-center gap-2 sm:gap-3" ref={mobileNavRef}>
            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleDarkMode}
              className="p-1.5 rounded-xl bg-neutral-100 dark:bg-[#1A1F29] border border-neutral-200 dark:border-neutral-800 text-neutral-400 hover:text-[#B91C1C] dark:text-neutral-300 dark:hover:text-[#B91C1C] transition-all cursor-pointer focus:outline-none"
              title="Toggle theme"
            >
              {isDarkMode ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            {/* Notifications */}
            <button className="relative p-1.5 rounded-xl bg-neutral-100 dark:bg-[#1A1F29] border border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:text-[#B91C1C] dark:text-neutral-400 dark:hover:text-[#B91C1C] transition-colors cursor-pointer">
              <Bell size={15} />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#B91C1C] animate-pulse" />
            </button>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-[#1A1F29] border border-neutral-200 dark:border-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:border-[#B91C1C]/40 transition-all cursor-pointer"
              >
                <User size={15} />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 top-11 w-52 rounded-2xl bg-white dark:bg-[#1A1F29] border border-neutral-200 dark:border-neutral-800 shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1">
                  <div className="px-2 py-1.5 border-b border-neutral-100 dark:border-neutral-800 mb-1">
                    <p className="font-bold text-xs text-neutral-900 dark:text-neutral-100 truncate">
                      {student.firstName} {student.lastName}
                    </p>
                    <p className="text-[10px] text-[#B91C1C] font-mono capitalize">
                      Student
                    </p>
                  </div>

                  <Link
                    onClick={() => setIsProfileOpen(false)}
                    to="/student/settings"
                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors cursor-pointer text-neutral-700 dark:text-neutral-300"
                  >
                    <User size={13} className="text-neutral-400" />
                    <span>Profile & Settings</span>
                  </Link>

                  <Link
                    onClick={() => setIsProfileOpen(false)}
                    to="/"
                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors cursor-pointer text-neutral-700 dark:text-neutral-300"
                  >
                    <Globe size={13} className="text-neutral-400" />
                    <span>Public Home</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-semibold text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                  >
                    <LogOut size={13} />
                    <span>Log out</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              className="md:hidden p-1.5 rounded-xl bg-neutral-100 dark:bg-[#1A1F29] border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-200 hover:text-[#B91C1C] focus:outline-none cursor-pointer"
              aria-label="Toggle navigation"
            >
              {isMobileNavOpen ? <X size={17} /> : <Menu size={17} />}
            </button>

            {/* Mobile Floating Dropdown Menu */}
            {isMobileNavOpen && (
              <div className="absolute right-3 top-12 w-[230px] rounded-2xl bg-white/98 dark:bg-[#151921]/98 backdrop-blur-xl border border-neutral-200 dark:border-neutral-800 shadow-2xl p-2.5 z-50 md:hidden animate-in fade-in zoom-in-95 duration-150">
                <StudentSidebar
                  isMobile={true}
                  onItemClick={() => setIsMobileNavOpen(false)}
                />
              </div>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-neutral-50 dark:bg-[#0d1117]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
