import React from "react";
import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiCheckSquare,
  FiTrendingUp,
  FiClipboard,
  FiInbox,
  FiSpeaker,
  FiSettings,
} from "react-icons/fi";

export default function MentorSidebar({ isOpen }) {
  const navSections = [
    {
      title: "MAIN",
      links: [
        {
          name: "Dashboard",
          path: "/mentor/Dashboard",
          icon: <FiHome className="w-4 h-4" />,
        },
      ],
    },
    {
      title: "MANAGEMENT",
      links: [
        {
          name: "My Students",
          path: "/mentor/students",
          icon: <FiUsers className="w-4 h-4" />,
        },
      ],
    },
    {
      title: "ACADEMIC",
      links: [
        {
          name: "Attendance",
          path: "/mentor/attendance",
          icon: <FiCheckSquare className="w-4 h-4" />,
        },
        {
          name: "Progress",
          path: "/mentor/progress",
          icon: <FiTrendingUp className="w-4 h-4" />,
        },
        {
          name: "Assignments",
          path: "/mentor/assignments",
          icon: <FiClipboard className="w-4 h-4" />,
        },
        {
          name: "Submissions",
          path: "/mentor/submissions",
          icon: <FiInbox className="w-4 h-4" />,
        },
      ],
    },
    {
      title: "COMMUNICATION",
      links: [
        {
          name: "Announcements",
          path: "/mentor/announcements",
          icon: <FiSpeaker className="w-4 h-4" />,
        },
      ],
    },
    {
      title: "ACCOUNT",
      links: [
        {
          name: "Settings",
          path: "/mentor/settings",
          icon: <FiSettings className="w-4 h-4" />,
        },
      ],
    },
  ];

  if (!isOpen) return null;

  return (
    <aside className="w-64 h-screen bg-surface border-r border-border flex flex-col fixed inset-y-0 left-0 z-50 overflow-y-auto">
      <div className="h-16 flex items-center px-6 shrink-0 border-b border-border/40">
        <span className="text-text-primary font-bold text-xs uppercase tracking-wider">
          MENTOR PAGE
        </span>
      </div>

      <div className="flex-1 py-4 space-y-6 overflow-y-auto">
        {navSections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            <h4 className="px-6 text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">
              {section.title}
            </h4>
            <div className="flex flex-col">
              {section.links.map((link, linkIdx) => (
                <NavLink
                  key={linkIdx}
                  to={link.path}
                  end
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-6 py-2.5 text-sm font-medium border-l-[3px] transition-colors ${
                      isActive
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-transparent text-text-secondary hover:bg-surface-subtle hover:text-text-primary"
                    }`
                  }
                >
                  {link.icon}
                  {link.name}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
