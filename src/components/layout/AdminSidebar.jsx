import React from "react";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Layers,
  UserCheck,
  CalendarCheck,
  TrendingUp,
  ClipboardList,
  FileCheck2,
  Megaphone,
  Settings,
} from "lucide-react";

export default function AdminSidebar({
  currentView,
  onNavigateAdminView,
  isMobile = false,
}) {
  const navSections = [
    {
      title: "MAIN",
      items: [
        {
          name: "Dashboard",
          icon: LayoutDashboard,
          view: "dashboard-main",
        },
      ],
    },
    {
      title: "MANAGEMENT",
      items: [
        { name: "Students", icon: Users, view: "dashboard-students" },
        { name: "Mentors", icon: GraduationCap, view: "dashboard-mentors" },
        { name: "Batches", icon: Layers, view: "dashboard-batches" },
        { name: "All Users", icon: UserCheck, view: "dashboard-users" },
      ],
    },
    {
      title: "ACADEMIC",
      items: [
        {
          name: "Attendance",
          icon: CalendarCheck,
          view: "dashboard-attendance",
        },
        { name: "Progress", icon: TrendingUp, view: "dashboard-progress" },
        {
          name: "Assignments",
          icon: ClipboardList,
          view: "dashboard-assignments",
        },
        {
          name: "Submissions",
          icon: FileCheck2,
          view: "dashboard-submissions",
        },
      ],
    },
    {
      title: "COMMUNICATION",
      items: [
        {
          name: "Announcements",
          icon: Megaphone,
          view: "dashboard-announcements",
        },
      ],
    },
    {
      title: "ACCOUNT",
      items: [{ name: "Settings", icon: Settings, view: "dashboard-settings" }],
    },
  ];

  // Mobile compact list version
  if (isMobile) {
    return (
      <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
        {navSections.map((group, idx) => (
          <div key={idx} className="space-y-1">
            <div className="px-2 text-[9px] font-mono font-bold tracking-wider text-neutral-400 dark:text-neutral-500 uppercase">
              {group.title}
            </div>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.view;

                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => onNavigateAdminView?.(item.view)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? "bg-[#B91C1C] text-white shadow-xs"
                        : "text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-[#151921]"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon
                        size={13}
                        className={isActive ? "text-white" : "text-neutral-400"}
                      />
                      <span>{item.name}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Desktop Full Sidebar
  return (
    <aside className="hidden md:flex w-56 bg-white dark:bg-[#151921] border-r border-neutral-200/80 dark:border-neutral-800/80 flex-col shrink-0 select-none z-10 h-full">
      <div className="pt-6 pb-4 px-6">
        <h1 className="text-base font-black tracking-tight text-[#B91C1C]">
          ASTU MSJ
        </h1>
        <p className="text-[10px] text-neutral-400 font-normal mt-0.5">
          Admin management
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-4">
        {navSections.map((group, idx) => (
          <div key={idx} className="space-y-1">
            <div className="px-3 text-[10px] font-bold tracking-wider text-neutral-400 dark:text-neutral-500 uppercase mb-1">
              {group.title}
            </div>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.view;

                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => onNavigateAdminView?.(item.view)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-medium transition-all text-left cursor-pointer ${
                      isActive
                        ? "bg-[#FEF2F2] text-[#B91C1C] font-semibold dark:bg-red-500/10"
                        : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800/40"
                    }`}
                  >
                    <Icon
                      size={15}
                      className={
                        isActive
                          ? "text-[#B91C1C]"
                          : "text-neutral-400 dark:text-neutral-500"
                      }
                    />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
