import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { FiMenu, FiBell, FiUser, FiMoon, FiLogOut } from "react-icons/fi";
import MentorSidebar from "../components/layout/MentorSidebar";

export default function MentorLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { logout } = useAuth(); // Extracted logout from useAuth context
  const navigate = useNavigate();

  const mentor = { firstName: "John", lastName: "Doe" };

  const handleLogout = () => {
    setIsProfileOpen(false);
    if (logout) {
      logout();
    }
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login", { replace: true });
  };

  return (
    <div className="w-full font-sans bg-[#FAFBFC] dark:bg-[#0E1117] text-neutral-900 dark:text-neutral-100 transition-colors flex overflow-hidden min-h-screen">
      <MentorSidebar isOpen={isSidebarOpen} />

      <div
        className={`flex-1 flex flex-col min-h-screen min-w-0 transition-all duration-300 ease-in-out w-full ${
          isSidebarOpen ? "md:pl-64" : "pl-0"
        }`}
      >
        <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#151921] px-4 md:px-8 shrink-0 shadow-xs">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-[#B91C1C] transition-colors focus:outline-none cursor-pointer"
            >
              <FiMenu className="h-5 w-5" />
            </button>
            <div className="flex flex-col">
              <span className="text-sm font-black tracking-tight text-neutral-900 dark:text-white">
                ASTU MSJ
              </span>
              <span className="text-[10px] text-neutral-400 font-medium tracking-wide uppercase">
                Mentor Management
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 relative">
            <button className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors relative cursor-pointer p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800">
              <FiBell className="h-4 w-4" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-[#B91C1C]"></span>
            </button>

            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#151921] text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors focus:outline-none cursor-pointer"
            >
              <FiUser className="h-4 w-4" />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 top-12 mt-1 w-52 rounded-2xl bg-white dark:bg-[#151921] border border-neutral-200 dark:border-neutral-800 shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-4 py-2.5 border-b border-neutral-100 dark:border-neutral-800">
                  <p className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                    {mentor.firstName} {mentor.lastName}
                  </p>
                  <p className="text-[10px] text-neutral-400 truncate mt-0.5">
                    Mentor Account
                  </p>
                </div>
                <NavLink
                  onClick={() => setIsProfileOpen(false)}
                  to="/mentor/settings"
                  className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors"
                >
                  <FiUser className="h-3.5 w-3.5" /> Profile Settings
                </NavLink>
                <button
                  onClick={() => setIsProfileOpen(false)}
                  className="flex w-full items-center gap-2 px-4 py-2 text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors text-left cursor-pointer"
                >
                  <FiMoon className="h-3.5 w-3.5" /> Dark Mode
                </button>
                <div className="pt-1 mt-1 border-t border-neutral-100 dark:border-neutral-800">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-[#B91C1C] hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer text-left"
                  >
                    <FiLogOut className="h-3.5 w-3.5" />
                    <span>Log out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 min-w-0 overflow-x-hidden overflow-y-auto px-8 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
