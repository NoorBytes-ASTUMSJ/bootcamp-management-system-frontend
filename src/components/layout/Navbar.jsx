import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function Navbar({
  currentView = "home",
  onNavigatePage,
  onNavigateLogin,
  onNavigateSignUp,
}) {
  const navigate = useNavigate();

  const navLinks = [
    { name: "Home", path: "/", id: "home" },
    { name: "About", path: "/about", id: "about" },
    { name: "Tracks", path: "/tracks", id: "tracks" },
    { name: "Mentors", path: "/mentors", id: "mentors" },
    { name: "FAQ", path: "/faq", id: "faq" },
    { name: "Contact", path: "/contact", id: "contact" },
  ];

  const handleLinkClick = (path, id, e) => {
    if (onNavigatePage) {
      e.preventDefault();
      onNavigatePage(id);
    }
  };

  const handleLoginClick = () => {
    if (onNavigateLogin) {
      onNavigateLogin();
    } else {
      navigate("/login");
    }
  };

  const handleSignUpClick = () => {
    if (onNavigateSignUp) {
      onNavigateSignUp();
    } else {
      navigate("/role-select");
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur-md border-b border-border transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <NavLink
          to="/"
          onClick={(e) => handleLinkClick("/", "home", e)}
          className="text-lg font-black tracking-tight text-primary focus:outline-none cursor-pointer"
        >
          ASTU MSJ
        </NavLink>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-muted">
          {navLinks.map((link) => {
            // Evaluates active strictly against currentView when in state-based routing
            const isTabActive = currentView === link.id;

            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={(e) => handleLinkClick(link.path, link.id, e)}
                className={`cursor-pointer transition-colors pb-1 border-b-2 font-medium focus:outline-none ${
                  isTabActive
                    ? "text-primary border-primary font-semibold"
                    : "border-transparent text-muted hover:text-foreground"
                }`}
              >
                {link.name}
              </NavLink>
            );
          })}
        </nav>

        {/* Right Auth Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleLoginClick}
            className="text-xs font-semibold text-foreground hover:text-primary px-3 py-1.5 transition-colors cursor-pointer focus:outline-none"
          >
            Log in
          </button>
          <button
            type="button"
            onClick={handleSignUpClick}
            className="text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary-hover px-4 py-2 rounded-lg transition-colors shadow-2xs cursor-pointer focus:outline-none"
          >
            Sign Up
          </button>
        </div>
      </div>
    </header>
  );
}
