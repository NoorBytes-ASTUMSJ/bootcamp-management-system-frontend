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
  Home,
  Info,
  Layers,
  Users,
  HelpCircle,
  Mail,
  LogIn,
  UserPlus,
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
  const mobileMenuRef = useRef(null);

  const activePath = location.pathname.substring(1) || "home";
  const currentView = propCurrentView || activePath;

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

  // ከሜኑው ውጪ ባዶ ቦታ ሲነካ በራሱ እንዲዘጋ
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setIsMobileMenuOpen(false);
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
    { id: "home", label: "Home", path: "/", icon: Home },
    { id: "about", label: "About", path: "/about", icon: Info },
    { id: "tracks", label: "Tracks", path: "/tracks", icon: Layers },
    { id: "mentors", label: "Mentors", path: "/mentors", icon: Users },
    { id: "faq", label: "FAQ", path: "/faq", icon: HelpCircle },
    { id: "contact", label: "Contact", path: "/contact", icon: Mail },
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
    <header className="sticky top-0 z-40 w-full bg-background/90 backdrop-blur-md border-b border-border transition-colors select-none">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between relative">
        {/* 1. BRAND LOGO & TITLE */}
        <Link
          to="/"
          className="flex items-center gap-2 sm:gap-3 shrink-0 focus:outline-none cursor-pointer"
        >
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white p-0.5 border-2 border-slate-200/90 dark:border-border shadow-xs shrink-0 overflow-hidden flex items-center justify-center">
            <img
              src={jemeaLogo}
              alt="ASTU MSJ Official Logo"
              className="w-full h-full object-cover scale-105 rounded-full shrink-0"
              style={{
                clipPath: "circle(48% at 50% 50%)",
              }}
            />
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 whitespace-nowrap">
            <span className="text-sm sm:text-lg font-black tracking-tight text-text-primary shrink-0 leading-none">
              ASTU <span className="text-primary">MSJ</span>
            </span>
            <span className="px-1.5 py-0.5 rounded-md text-[8px] sm:text-[10px] font-mono font-bold bg-secondary text-primary uppercase border border-border-subtle tracking-wide shrink-0">
              Bootcamp
            </span>
          </div>
        </Link>

        {/* 2. DESKTOP NAVIGATION */}
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

        {/* 3. RIGHT CONTROLS & MOBILE DROPDOWN CONTAINER */}
        <div
          className="flex items-center gap-2 sm:gap-3 shrink-0 relative"
          ref={mobileMenuRef}
        >
          <button
            type="button"
            onClick={toggleTheme}
            className="p-1.5 sm:p-2 rounded-xl bg-surface border border-border hover:border-primary/50 text-text-muted hover:text-primary shadow-xs transition-all duration-200 cursor-pointer focus:outline-none"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle theme"
          >
            {isDarkMode ? (
              <Sun size={16} className="text-amber-400" />
            ) : (
              <Moon size={16} className="text-primary" />
            )}
          </button>

          {user ? (
            <div className="flex items-center gap-2">
              <Link
                to={getAnnouncementsPath()}
                className="p-1.5 sm:p-2 rounded-xl bg-surface border border-border text-text-muted hover:text-primary transition-all relative"
              >
                <Bell size={16} />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary animate-pulse" />
              </Link>

              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-secondary border border-border-subtle flex items-center justify-center text-primary cursor-pointer focus:outline-none"
                >
                  <User size={16} />
                </button>

                {isOpen && (
                  <div className="absolute right-0 top-11 sm:top-12 w-52 rounded-2xl bg-surface border border-border shadow-xl p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-2 py-1.5 border-b border-border mb-1.5">
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
                          className="w-full flex items-center gap-2 px-2 py-1.5 rounded-xl text-xs font-semibold text-primary hover:bg-primary/10 transition-colors"
                        >
                          <LayoutDashboard size={13} />
                          <span>Dashboard</span>
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-2 py-1.5 rounded-xl text-xs font-medium text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                      >
                        <LogOut size={13} />
                        <span>Log out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
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

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-1.5 rounded-xl bg-surface border border-border text-text-primary hover:text-primary focus:outline-none cursor-pointer"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          {/* ================= 4. COMPACT FLOATING DROPDOWN CARD ================= */}
          {isMobileMenuOpen && (
            <div className="absolute right-0 top-12 w-[220px] rounded-2xl bg-surface/98 backdrop-blur-xl border border-border shadow-2xl p-2 z-50 md:hidden animate-in fade-in zoom-in-95 duration-150 space-y-2">
              {/* Menu Links */}
              <div className="space-y-0.5">
                {navLinks.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    currentView === item.id ||
                    (item.id === "home" && currentView === "");
                  return (
                    <Link
                      key={item.id}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? "bg-primary text-primary-foreground shadow-xs"
                          : "text-text-muted hover:bg-background hover:text-text-primary"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon
                          size={13}
                          className={isActive ? "text-white" : "opacity-70"}
                        />
                        <span>{item.label}</span>
                      </div>
                      <ChevronRight
                        size={12}
                        className={isActive ? "text-white" : "opacity-30"}
                      />
                    </Link>
                  );
                })}
              </div>

              {/* Bottom Auth Buttons */}
              <div className="pt-2 border-t border-border space-y-1.5">
                {user ? (
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-semibold bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors cursor-pointer"
                  >
                    <LogOut size={13} />
                    <span>Log out</span>
                  </button>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-semibold bg-background border border-border text-text-primary hover:border-primary/50 transition-colors"
                    >
                      <LogIn size={13} />
                      <span>Log In</span>
                    </Link>
                    <Link
                      to="/role-select"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-semibold bg-primary text-primary-foreground shadow-xs hover:bg-primary-hover transition-all"
                    >
                      <UserPlus size={13} />
                      <span>Sign Up</span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
