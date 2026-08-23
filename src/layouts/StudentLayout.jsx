import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Outlet, NavLink, Link, useNavigate } from "react-router-dom";
import { FiMenu, FiBell, FiUser, FiMoon, FiSun, FiLogOut } from "react-icons/fi";
import StudentSidebar from "../components/layout/StudentSidebar";

export default function StudentLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const student = {
    firstName: user?.firstName || user?.name || "Alex",
    lastName: user?.lastName || "Johnson",
  };

  const navLinks = [
    { name: "Dashboard", path: "/student/dashboard" },
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Tracks", path: "/tracks" },
    { name: "Mentors", path: "/mentors" },
    { name: "Contact", path: "/contact" },
  ];

  const handleLogout = () => {
    setIsProfileOpen(false);
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
      document.documentElement.classList.toggle("dark", next);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-background flex overflow-hidden w-full">
      <StudentSidebar isOpen={isSidebarOpen} />

      <div
        className={`flex-1 flex flex-col min-h-screen min-w-0 transition-all duration-300 ease-in-out w-full ${
          isSidebarOpen ? "md:pl-62.5" : "pl-0"
        }`}
      >
        <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-border bg-surface px-4 md:px-6 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="flex h-8 w-8 items-center justify-center rounded-md text-text-muted hover:bg-surface-subtle hover:text-primary transition-colors focus:outline-none cursor-pointer"
            >
              <FiMenu className="h-5 w-5" />
            </button>
            <span className="text-lg font-bold text-primary tracking-tight">
              ASTU MSJ
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `transition-all duration-200 hover:text-primary ${
                    isActive
                      ? "text-primary underline underline-offset-4 decoration-2"
                      : "text-text-muted"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-4 relative">
            <button className="text-text-muted hover:text-text-primary transition-colors relative cursor-pointer">
              <FiBell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary"></span>
            </button>

            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface text-text-muted hover:text-text-primary hover:bg-surface-subtle transition-colors focus:outline-none cursor-pointer"
            >
              <FiUser className="h-4 w-4" />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 top-10 mt-2 w-48 rounded-md bg-surface border border-border shadow-lg py-1 z-50">
                <div className="px-4 py-2 border-b border-border">
                  <p className="text-sm font-bold text-text-primary truncate">
                    {student.firstName} {student.lastName}
                  </p>
                  <p className="text-xs text-text-muted truncate">Student</p>
                </div>

                <Link
                  onClick={() => setIsProfileOpen(false)}
                  to="/student/settings"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-text-muted hover:bg-surface-subtle hover:text-text-primary transition-colors"
                >
                  <FiUser className="h-4 w-4" /> Profile
                </Link>

                <button
                  onClick={toggleDarkMode}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-text-muted hover:bg-surface-subtle hover:text-text-primary text-left transition-colors cursor-pointer"
                >
                  {isDarkMode ? (
                    <>
                      <FiSun className="h-4 w-4 text-amber-500" /> Light Mode
                    </>
                  ) : (
                    <>
                      <FiMoon className="h-4 w-4" /> Dark Mode
                    </>
                  )}
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#B91C1C] hover:bg-red-500/10 transition-colors text-left cursor-pointer"
                >
                  <FiLogOut className="h-4 w-4 text-[#B91C1C]" />
                  <span>Log out</span>
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 min-w-0 overflow-x-hidden overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}