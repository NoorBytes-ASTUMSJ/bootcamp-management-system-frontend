import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Bell, User, Moon, Sun, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import jemeaLogo from "../../assets/jemea-logo.jpg";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const menuRef = useRef(null);

  const currentView = location.pathname.substring(1) || "home";

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

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
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
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
    <header className="sticky top-0 z-40 w-full bg-background/85 backdrop-blur-md border-b border-border transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Minimal Clean Branding with Enlarged Logo & Border Contrast */}
        <Link
          to="/"
          className="group flex items-center gap-3.5 focus:outline-hidden cursor-pointer select-none"
        >
          <div className="w-12 h-12 sm:w-[50px] sm:h-[50px] rounded-full bg-white p-1 border-2 border-slate-200/90 dark:border-border group-hover:border-primary shadow-sm group-hover:shadow-md group-hover:shadow-primary/15 group-hover:scale-105 transition-all duration-300 shrink-0 overflow-hidden flex items-center justify-center">
            <img
              src={jemeaLogo}
              alt="ASTU MSJ Official Logo"
              className="w-full h-full object-cover scale-110 rounded-full"
              style={{
                clipPath: "circle(48% at 50% 50%)",
              }}
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-lg sm:text-xl font-black tracking-tight text-text-primary group-hover:text-primary transition-colors">
              ASTU <span className="text-primary">MSJ</span>
            </span>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-secondary text-primary uppercase border border-border-subtle tracking-wide">
              Bootcamp
            </span>
          </div>
        </Link>

        {/* Public Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs sm:text-[13px] font-medium text-text-muted">
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
              className={`cursor-pointer transition-all duration-200 focus:outline-hidden ${
                currentView === item.id ||
                (item.id === "home" && currentView === "")
                  ? "text-primary border-b-2 border-primary pb-0.5 font-bold shadow-2xs"
                  : "hover:text-text-primary pb-0.5 border-b-2 border-transparent hover:border-primary/40"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Action Controls & Theme Switcher */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-surface border border-border hover:border-primary/50 text-text-muted hover:text-primary shadow-xs hover:shadow-md hover:shadow-primary/5 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer focus:outline-hidden relative overflow-hidden"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle theme"
          >
            {isDarkMode ? (
              <Sun
                size={17}
                className="text-amber-400 rotate-0 transition-transform duration-300"
              />
            ) : (
              <Moon
                size={17}
                className="text-primary -rotate-12 transition-transform duration-300"
              />
            )}
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              <Link
                to={getAnnouncementsPath()}
                className="relative p-2 rounded-xl bg-surface border border-border hover:border-primary/50 text-text-muted hover:text-primary transition-all duration-200 cursor-pointer focus:outline-hidden shadow-xs hover:-translate-y-0.5"
                title="Announcements"
              >
                <Bell size={17} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary ring-2 ring-background animate-pulse" />
              </Link>

              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="w-9 h-9 rounded-xl bg-secondary border border-border-subtle hover:border-primary/50 flex items-center justify-center text-primary transition-all duration-200 cursor-pointer focus:outline-hidden shadow-2xs hover:scale-105"
                >
                  <User size={17} />
                </button>

                {isOpen && (
                  <div className="absolute right-0 top-12 w-60 rounded-2xl bg-surface border border-border hover:border-primary/40 shadow-xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-2.5 py-2 border-b border-border mb-2">
                      <p className="font-bold text-xs sm:text-sm text-text-primary truncate">
                        {user.firstName
                          ? `${user.firstName} ${user.lastName || ""}`
                          : "User Account"}
                      </p>
                      <p className="text-[11px] text-primary font-mono capitalize mt-0.5">
                        {user.role || "Member"}
                      </p>
                    </div>

                    <div className="space-y-1">
                      {(user.role === "student" ||
                        user.role === "mentor" ||
                        user.role === "admin") && (
                        <Link
                          to={getDashboardPath()}
                          onClick={() => setIsOpen(false)}
                          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                        >
                          <LayoutDashboard size={15} className="text-primary" />
                          <span>Dashboard</span>
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs sm:text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                      >
                        <LogOut size={15} className="text-red-500" />
                        <span>Log out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link
                to="/login"
                className="text-xs sm:text-sm font-semibold text-text-primary hover:text-primary px-3.5 py-2 transition-colors cursor-pointer focus:outline-hidden"
              >
                Log in
              </Link>
              <Link
                to="/role-select"
                className="text-xs sm:text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary-hover px-4 py-2 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 cursor-pointer focus:outline-hidden"
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
