import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, User, Moon, Sun, LogOut, Check } from "lucide-react";

export default function TopHeader({ title = "Dashboard" }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const menuRef = useRef(null);

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
    navigate("/login");
  };

  return (
    <header className="h-16 bg-background px-8 flex items-center justify-between shrink-0 border-b border-border transition-colors">
      <div className="text-base font-semibold tracking-tight text-inherit">
        {title}
      </div>

      <div className="flex items-center gap-4">
        {/* Notification Bell with Badge */}
        <button className="relative p-2 rounded-full text-muted hover:text-inherit transition-colors cursor-pointer">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary ring-2 ring-background" />
        </button>

        {/* User Dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center text-muted hover:text-inherit transition-colors cursor-pointer"
          >
            <User size={16} />
          </button>

          {isOpen && (
            <div className="absolute right-0 top-11 w-56 rounded-2xl bg-surface border border-border shadow-lg p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-2 py-1.5 border-b border-border mb-2">
                <p className="font-semibold text-xs text-inherit">
                  Miftahudin Mohammed
                </p>
                <p className="text-[11px] text-muted">User Account</p>
              </div>

              <div className="space-y-0.5">
                <button
                  onClick={toggleTheme}
                  className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs font-medium hover:bg-surface-subtle transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 text-inherit">
                    {isDarkMode ? (
                      <Sun size={14} className="text-muted" />
                    ) : (
                      <Moon size={14} className="text-muted" />
                    )}
                    <span>Dark Mode</span>
                  </div>
                  {isDarkMode && <Check size={13} className="text-primary" />}
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-xs font-medium text-primary hover:bg-secondary transition-colors cursor-pointer"
                >
                  <LogOut size={14} className="text-primary" />
                  <span>Log out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
