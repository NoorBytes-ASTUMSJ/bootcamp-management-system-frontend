import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiBell, FiUser, FiMoon, FiLogOut } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const currentView = location.pathname.substring(1) || "home";

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    navigate("/");
  };

  const getDashboardPath = () => {
    if (!user) return "/";
    switch (user.role) {
      case "student":
        return "/student/dashboard";
      case "mentor":
        return "/mentor/dashboard";
      case "admin":
        return "/admin/dashboard";
      default:
        return "/";
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur-md border-b border-border transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="text-lg font-black tracking-tight text-primary focus:outline-none cursor-pointer"
        >
          ASTU MSJ
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-text-muted">
          {[
            { id: "home", label: "Home", path: "/" },
            { id: "about", label: "About", path: "/about" },
            { id: "tracks", label: "Tracks", path: "/tracks" },
            { id: "mentors", label: "Mentors", path: "/mentors" },
            { id: "faq", label: "FAQ", path: "/faq" },
            { id: "contact", label: "Contact", path: "/contact" },
          ].map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={`cursor-pointer transition-colors focus:outline-none ${
                currentView === item.id ||
                (item.id === "home" && currentView === "")
                  ? "text-primary border-b-2 border-primary pb-0.5 font-semibold"
                  : "hover:text-text-primary pb-0.5 border-b-2 border-transparent"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-4">
              <Link
                to={getDashboardPath()}
                className="hidden sm:block text-xs font-semibold text-text-primary hover:text-primary transition-colors focus:outline-none"
              >
                Dashboard
              </Link>
              <Link
                to={
                  user?.role === "student"
                    ? "/student/announcements"
                    : user?.role === "mentor"
                      ? "/mentor/announcements"
                      : user?.role === "admin"
                        ? "/admin/announcements"
                        : "/announcements" // Default for applicants
                }
                className="text-text-muted hover:text-text-primary transition-colors relative focus:outline-none"
              >
                <FiBell className="h-5 w-5" />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary"></span>
              </Link>
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface text-text-muted hover:text-text-primary hover:bg-surface-subtle transition-colors focus:outline-none"
                >
                  <FiUser className="h-4 w-4" />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 top-10 mt-2 w-48 rounded-md bg-surface border border-border shadow-lg py-1 z-50">
                    <div className="px-4 py-2 border-b border-border">
                      <p className="text-sm font-bold text-text-primary truncate">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-text-muted truncate capitalize">
                        {user.role}
                      </p>
                    </div>
                    <Link
                      onClick={() => setIsProfileOpen(false)}
                      to={`${getDashboardPath().split("/dashboard")[0]}/settings`}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-text-muted hover:bg-surface-subtle hover:text-text-primary"
                    >
                      <FiUser className="h-4 w-4" /> Profile
                    </Link>
                    <button className="flex w-full items-center gap-2 px-4 py-2 text-sm text-text-muted hover:bg-surface-subtle hover:text-text-primary text-left">
                      <FiMoon className="h-4 w-4" /> Dark Mode
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-primary hover:bg-primary-light text-left focus:outline-none"
                    >
                      <FiLogOut className="h-4 w-4" /> Log out
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="text-xs font-semibold text-text-primary hover:text-primary px-3 py-1.5 transition-colors cursor-pointer focus:outline-none"
              >
                Log in
              </Link>
              <Link
                to="/role-select"
                className="text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary-hover px-3.5 py-1.5 rounded-lg transition-colors shadow-sm cursor-pointer focus:outline-none"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
