import React from "react";
import { NavLink } from "react-router-dom";
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
    </aside>
  );
}
