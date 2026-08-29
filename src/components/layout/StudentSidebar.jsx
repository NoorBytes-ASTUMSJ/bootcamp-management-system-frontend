import React from "react";
import { NavLink } from "react-router-dom";
import {
  FiGrid,
  FiUsers,
  FiCheckCircle,
  FiTrendingUp,
  FiBookOpen,
  FiBell,
  FiSettings,
} from "react-icons/fi";

const NAV_CONFIG = [
  {
    section: "MAIN",
    items: [
      { name: "Dashboard", path: "/student/dashboard", icon: FiGrid },
      { name: "All Members", path: "/student/members", icon: FiUsers },
    ],
  },
  {
    section: "LEARNING",
    items: [
      { name: "Attendance", path: "/student/attendance", icon: FiCheckCircle },
      { name: "Progress", path: "/student/progress", icon: FiTrendingUp },
      { name: "Assignments", path: "/student/assignments", icon: FiBookOpen },
    ],
  },
  {
    section: "COMMUNICATION",
    items: [
      { name: "Announcements", path: "/student/announcements", icon: FiBell },
    ],
  },
  {
    section: "ACCOUNT",
    items: [{ name: "Settings", path: "/student/settings", icon: FiSettings }],
  },
];

export default function StudentSidebar({ isMobile = false, onItemClick }) {
  // Mobile Floating Compact List
  if (isMobile) {
    return (
      <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
        {NAV_CONFIG.map((group, index) => (
          <div key={index} className="space-y-1">
            <div className="px-2 text-[9px] font-mono font-bold tracking-wider text-neutral-400 dark:text-neutral-500 uppercase">
              {group.section}
            </div>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    onClick={onItemClick}
                    className={({ isActive }) =>
                      `w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isActive
                          ? "bg-[#B91C1C] text-white shadow-xs"
                          : "text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-[#151921]"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <div className="flex items-center gap-2">
                        <Icon
                          size={13}
                          className={
                            isActive ? "text-white" : "text-neutral-400"
                          }
                        />
                        <span>{item.name}</span>
                      </div>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Desktop Persistent Sidebar
  return (
    <aside className="hidden md:flex w-56 bg-white dark:bg-[#151921] border-r border-neutral-200/80 dark:border-neutral-800/80 flex-col shrink-0 select-none z-10 fixed inset-y-0 left-0 h-screen">
      <div className="pt-6 pb-4 px-6">
        <h1 className="text-base font-black tracking-tight text-[#B91C1C]">
          ASTU MSJ
        </h1>
        <p className="text-[10px] text-neutral-400 font-normal mt-0.5">
          Student Portal
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-4 custom-scrollbar">
        {NAV_CONFIG.map((group, index) => (
          <div key={index} className="space-y-1">
            <div className="px-3 text-[10px] font-bold tracking-wider text-neutral-400 dark:text-neutral-500 uppercase mb-1">
              {group.section}
            </div>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    className={({ isActive }) =>
                      `w-full flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-medium transition-all text-left cursor-pointer ${
                        isActive
                          ? "bg-[#FEF2F2] text-[#B91C1C] font-semibold dark:bg-red-500/10"
                          : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800/40"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon
                          size={15}
                          className={
                            isActive
                              ? "text-[#B91C1C]"
                              : "text-neutral-400 dark:text-neutral-500"
                          }
                        />
                        <span>{item.name}</span>
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
