import React from "react";
import { NavLink } from "react-router-dom";
<<<<<<< HEAD
import { LayoutDashboard, CalendarCheck, ClipboardList } from "lucide-react";

export default function MentorSidebar() {
  const links = [
    { name: "Dashboard", path: "/mentor/dashboard", icon: LayoutDashboard },
    { name: "Attendance", path: "/mentor/attendance", icon: CalendarCheck },
    { name: "Assignments", path: "/mentor/assignments", icon: ClipboardList },
  ];

  return (
    <aside className="w-64 bg-surface border-r border-border flex flex-col shrink-0 select-none transition-colors">
      <div className="pt-8 pb-4 px-8">
        <h1 className="text-xl font-bold tracking-tight text-inherit">
          ASTU MSJ
        </h1>
        <p className="text-xs text-muted font-normal mt-0.5">Mentor Portal</p>
      </div>

      <nav className="flex-1 py-4 space-y-1">
        <div className="px-8 text-[11px] font-bold tracking-wider text-muted uppercase mb-2">
          Academic
        </div>
        {links.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `w-full flex items-center gap-3.5 px-8 py-2.5 text-xs font-medium transition-all border-l-4 ${
                  isActive
                    ? "bg-secondary text-primary font-semibold border-primary"
                    : "border-transparent text-muted hover:text-inherit hover:bg-surface-subtle"
                }`
              }
            >
              <Icon size={17} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>
=======
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
          path: "/mentor/dashboard",
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
>>>>>>> 27d492b4e1fef52818f4ac14ab1ed0e3ead2c914
    </aside>
  );
}
