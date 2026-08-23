import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Bell, User, Moon, Sun, LogOut, Check } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const menuRef = useRef(null);

  const currentView = location.pathname.substring(1) || "home";

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTheme = () => {
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

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/");
  };

  const getAnnouncementsPath = () => {
    if (!user) return "/announcements";
    switch (user.role) {
      case "student":
        return "/student/announcements";
      case "mentor":
        return "/mentor/announcements";
      case "admin":
        return "/admin/announcements";
      default:
        return "/announcements";
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur-md border-b border-border transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          to="/"
          className="text-lg font-black tracking-tight text-primary focus:outline-none cursor-pointer"
        >
          ASTU MSJ
        </Link>

        {/* Public Navigation Links */}
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

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              {/* Notification Bell pointing to Announcements */}
              <Link
                to={getAnnouncementsPath()}
                className="relative p-2 rounded-full text-text-muted hover:text-text-primary transition-colors cursor-pointer focus:outline-none"
                title="Announcements"
              >
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary ring-2 ring-background" />
              </Link>

              {/* User Dropdown */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center text-text-muted hover:text-text-primary transition-colors cursor-pointer focus:outline-none"
                >
                  <User size={16} />
                </button>

                {isOpen && (
                  <div className="absolute right-0 top-11 w-56 rounded-2xl bg-surface border border-border shadow-lg p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-2 py-1.5 border-b border-border mb-2">
                      <p className="font-semibold text-xs text-text-primary truncate">
                        {user.firstName ? `${user.firstName} ${user.lastName || ""}` : "User Account"}
                      </p>
                      <p className="text-[11px] text-text-muted capitalize">
                        {user.role || "Member"}
                      </p>
                    </div>

                    <div className="space-y-0.5">
                      <button
                        onClick={toggleTheme}
                        className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs font-medium hover:bg-surface-subtle text-text-primary transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          {isDarkMode ? (
                            <Sun size={14} className="text-text-muted" />
                          ) : (
                            <Moon size={14} className="text-text-muted" />
                          )}
                          <span>Dark Mode</span>
                        </div>
                        {isDarkMode && <Check size={13} className="text-primary" />}
                      </button>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-xs font-medium text-primary hover:bg-surface-subtle transition-colors cursor-pointer"
                      >
                        <LogOut size={14} className="text-primary" />
                        <span>Log out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
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
            </div>
          )}
        </div>
      </div>
    </header>
  );
}