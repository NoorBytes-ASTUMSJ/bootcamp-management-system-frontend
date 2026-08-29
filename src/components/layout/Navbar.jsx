import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Bell,
  User,
  Moon,
  Sun,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import jemeaLogo from "../../assets/jemea-logo.jpg";

export default function Navbar({ currentView: propCurrentView }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const menuRef = useRef(null);

  const activePath = location.pathname.substring(1) || "home";
  const currentView = propCurrentView || activePath;

  // ገጽ ሲቀየር የሞባይል ሜኑውን በራሱ መዝጋት
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

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
    setIsMobileMenuOpen(false);
    navigate("/");
  };

  const navLinks = [
    { id: "home", label: "Home", path: "/" },
    { id: "about", label: "About", path: "/about" },
    { id: "tracks", label: "Tracks", path: "/tracks" },
    { id: "mentors", label: "Mentors", path: "/mentors" },
    { id: "faq", label: "FAQ", path: "/faq" },
    { id: "contact", label: "Contact", path: "/contact" },
  ];

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
    <header className="sticky top-0 z-50 w-full bg-background/90 backdrop-blur-md border-b border-border transition-colors select-none">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* ================= 1. BRAND LOGO & TITLE (ቋሚ እና የማይሰበር) ================= */}
        <Link
          to="/"
          className="flex items-center gap-2.5 sm:gap-3 shrink-0 focus:outline-none cursor-pointer"
        >
          {/* Logo Icon */}
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white p-0.5 border-2 border-slate-200/90 dark:border-border shadow-xs shrink-0 overflow-hidden flex items-center justify-center">
            <img
              src={jemeaLogo}
              alt="ASTU MSJ Official Logo"
              className="w-full h-full object-cover scale-105 rounded-full shrink-0"
              style={{
                clipPath: "circle(48% at 50% 50%)",
              }}
            />
          </div>

          {/* ASTU MSJ Text + Badge (በአንድ መስመር ላይ ተቆልፏል) */}
          <div className="flex items-center gap-2 shrink-0 whitespace-nowrap">
            <span className="text-base sm:text-lg font-black tracking-tight text-text-primary shrink-0 leading-none">
              ASTU <span className="text-primary">MSJ</span>
            </span>
            <span className="px-1.5 py-0.5 rounded-md text-[9px] sm:text-[10px] font-mono font-bold bg-secondary text-primary uppercase border border-border-subtle tracking-wide shrink-0">
              Bootcamp
            </span>
          </div>
        </Link>

        {/* ================= 2. DESKTOP NAVIGATION ================= */}
        <nav className="hidden md:flex items-center gap-6 text-[13px] font-medium text-text-muted shrink-0">
          {navLinks.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={`cursor-pointer transition-all duration-200 focus:outline-none whitespace-nowrap ${
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

        {/* ================= 3. RIGHT CONTROLS ================= */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-surface border border-border hover:border-primary/50 text-text-muted hover:text-primary shadow-xs transition-all duration-200 cursor-pointer focus:outline-none"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle theme"
          >
            {isDarkMode ? (
              <Sun size={17} className="text-amber-400" />
            ) : (
              <Moon size={17} className="text-primary" />
            )}
          </button>

          {/* Logged in User Dropdown (Desktop & Mobile) */}
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                to={getAnnouncementsPath()}
                className="p-2 rounded-xl bg-surface border border-border text-text-muted hover:text-primary transition-all relative"
              >
                <Bell size={17} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary animate-pulse" />
              </Link>

              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="w-9 h-9 rounded-xl bg-secondary border border-border-subtle flex items-center justify-center text-primary cursor-pointer focus:outline-none"
                >
                  <User size={17} />
                </button>

                {isOpen && (
                  <div className="absolute right-0 top-12 w-56 rounded-2xl bg-surface border border-border shadow-xl p-3 z-50">
                    <div className="px-2.5 py-2 border-b border-border mb-2">
                      <p className="font-bold text-xs text-text-primary truncate">
                        {user.firstName
                          ? `${user.firstName} ${user.lastName || ""}`
                          : "User Account"}
                      </p>
                      <p className="text-[10px] text-primary font-mono capitalize">
                        {user.role || "Member"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      {["student", "mentor", "admin"].includes(user.role) && (
                        <Link
                          to={getDashboardPath()}
                          onClick={() => setIsOpen(false)}
                          className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-semibold text-primary hover:bg-primary/10 transition-colors"
                        >
                          <LayoutDashboard size={14} />
                          <span>Dashboard</span>
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-medium text-red-500 hover:bg-red-500/10 transition-colors"
                      >
                        <LogOut size={14} />
                        <span>Log out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Desktop Auth Buttons */
            <div className="hidden md:flex items-center gap-2.5 shrink-0">
              <Link
                to="/login"
                className="text-xs sm:text-sm font-semibold text-text-primary hover:text-primary px-3 py-1.5 transition-colors cursor-pointer"
              >
                Log in
              </Link>
              <Link
                to="/role-select"
                className="text-xs sm:text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary-hover px-3.5 py-1.5 rounded-xl transition-all shadow-sm"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Toggle Button (በስልክ ላይ ብቻ ይታያል) */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-surface border border-border text-text-primary hover:text-primary focus:outline-none cursor-pointer"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* ================= 4. MOBILE DRAWER / MENU PANEL ================= */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-background/98 backdrop-blur-xl px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-4 duration-200 shadow-2xl">
          {/* Navigation Links */}
          <div className="flex flex-col space-y-1">
            {navLinks.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  currentView === item.id ||
                  (item.id === "home" && currentView === "")
                    ? "bg-primary/10 text-primary"
                    : "text-text-muted hover:bg-surface hover:text-text-primary"
                }`}
              >
                <span>{item.label}</span>
                <ChevronRight size={14} className="opacity-50" />
              </Link>
            ))}
          </div>

          {/* Mobile Auth Buttons (ያልገቡ ከሆነ) */}
          {!user && (
            <div className="pt-3 border-t border-border flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl text-xs font-semibold bg-surface border border-border text-text-primary hover:border-primary/50 transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/role-select"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl text-xs font-semibold bg-primary text-primary-foreground shadow-md shadow-primary/20 transition-all"
              >
                Sign Up for Batch 3
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
