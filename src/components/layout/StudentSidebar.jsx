import React from "react";
import { NavLink } from "react-router-dom";
import {
  FiGrid,
  FiUsers,
  FiCheckCircle,
  FiTrendingUp,
  FiBookOpen,
  FiUpload,
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
      { name: "Submissions", path: "/student/submissions", icon: FiUpload },
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

export default function StudentSidebar() {
  return (
    <aside className="w-56 bg-white dark:bg-[#151921] border-r border-neutral-200/80 dark:border-neutral-800/80 flex flex-col shrink-0 select-none z-10 fixed inset-y-0 left-0 h-screen">
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
                            isActive.toString().includes("true") // simple check for active icon color
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
