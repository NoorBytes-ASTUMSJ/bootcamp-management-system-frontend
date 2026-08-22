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

export default function StudentSidebar({ isOpen }) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex h-screen w-62.5 flex-col bg-surface border-r border-border transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-border">
        <span className="truncate text-base font-bold text-text-primary tracking-tight">
          Student Portal
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto py-5 custom-scrollbar">
        <div className="space-y-6">
          {NAV_CONFIG.map((group, index) => (
            <div key={index} className="px-3">
              <h3 className="mb-2 px-3 text-[11px] font-bold uppercase tracking-wider text-text-muted">
                {group.section}
              </h3>
              <ul className="space-y-1">
                {group.items.map((item) => (
                  <li key={item.name}>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-primary-light text-primary"
                            : "text-text-muted hover:bg-surface-subtle hover:text-text-primary"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && (
                            <span className="absolute -left-3 top-1/2 h-full max-h-[70%] w-1 -translate-y-1/2 rounded-r-md bg-primary" />
                          )}
                          <item.icon className="h-4.5 w-4.5 shrink-0" />
                          <span>{item.name}</span>
                        </>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </nav>
    </aside>
  );
}
