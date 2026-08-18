import React, { useState } from "react";
import { Outlet, NavLink, Link } from "react-router-dom";
import { FiMenu, FiBell, FiUser, FiMoon, FiLogOut } from "react-icons/fi";
import StudentSidebar from "../components/layout/StudentSidebar";

export default function StudentLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const student = { firstName: "Alex", lastName: "Johnson" };

  const navLinks = [
    { name: "Dashboard", path: "/student/dashboard" },
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Tracks", path: "/tracks" },
    { name: "Mentors", path: "/mentors" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <div className="min-h-screen bg-[#F8F8F6] flex overflow-hidden w-full">
      <StudentSidebar isOpen={isSidebarOpen} />

      <div
        className={`flex-1 flex flex-col min-h-screen min-w-0 transition-all duration-300 ease-in-out w-full ${
          isSidebarOpen ? "md:pl-[250px]" : "pl-0"
        }`}
      >
        <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-[#E5E5E5] bg-white px-4 md:px-6 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="flex h-8 w-8 items-center justify-center rounded-md text-[#777777] hover:bg-[#F8F8F6] hover:text-[#B93325] transition-colors focus:outline-none"
            >
              <FiMenu className="h-5 w-5" />
            </button>
            <span className="text-lg font-bold text-[#B93325] tracking-tight">
              ASTU MSJ
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `transition-all duration-200 hover:text-[#B93325] ${
                    isActive
                      ? "text-[#B93325] underline underline-offset-4 decoration-2"
                      : "text-[#777777]"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-4 relative">
            <button className="text-[#777777] hover:text-[#171717] transition-colors relative">
              <FiBell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-[#B93325]"></span>
            </button>

            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E5E5E5] bg-white text-[#777777] hover:text-[#171717] hover:bg-[#F8F8F6] transition-colors focus:outline-none"
            >
              <FiUser className="h-4 w-4" />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 top-10 mt-2 w-48 rounded-md bg-white border border-[#E5E5E5] shadow-lg py-1 z-50">
                <div className="px-4 py-2 border-b border-[#E5E5E5]">
                  <p className="text-sm font-bold text-[#171717] truncate">
                    {student.firstName} {student.lastName}
                  </p>
                  <p className="text-xs text-[#777777] truncate">Student</p>
                </div>
                <Link
                  onClick={() => setIsProfileOpen(false)}
                  to="/student/settings"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-[#777777] hover:bg-[#F8F8F6] hover:text-[#171717]"
                >
                  <FiUser className="h-4 w-4" /> Profile
                </Link>
                <button className="flex w-full items-center gap-2 px-4 py-2 text-sm text-[#777777] hover:bg-[#F8F8F6] hover:text-[#171717] text-left">
                  <FiMoon className="h-4 w-4" /> Dark Mode
                </button>
                <button className="flex w-full items-center gap-2 px-4 py-2 text-sm text-[#B93325] hover:bg-[#B93325]/10 text-left">
                  <FiLogOut className="h-4 w-4" /> Log out
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
