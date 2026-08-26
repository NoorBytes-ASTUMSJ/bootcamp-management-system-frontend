import React, { useState } from "react";
import {
  FiSearch,
  FiChevronDown,
  FiClipboard,
  FiClock,
  FiDroplet,
  FiCheckCircle,
  FiCode,
  FiDatabase,
  FiEdit2,
  FiMoreVertical,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

const mockAssignments = [
  {
    id: 1,
    title: "React Portfolio Project",
    description:
      "Build and deploy a personal portfolio using React. Include at least 4 pages and a contact form.",
    topic: "React",
    week: "Week 6",
    status: "In Progress",
    dueDate: "Aug 20, 2025",
    dueTime: "11:59 PM",
    timeRemaining: "5 days left",
    timeColor: "text-blue-500",
    icon: <FiCode className="w-5 h-5 text-primary" />,
    iconBg: "bg-primary/10 border border-primary/20",
    action: "Submit",
    actionState: "active",
  },
  {
    id: 2,
    title: "Backend API Assignment",
    description:
      "Create a RESTful API with authentication using Node.js and Express.",
    topic: "Node.js / Express",
    week: "Week 6",
    status: "Not Started",
    dueDate: "Aug 24, 2025",
    dueTime: "11:59 PM",
    timeRemaining: "9 days left",
    timeColor: "text-amber-500",
    icon: (
      <span className="text-[10px] font-mono font-bold text-amber-500">
        API
      </span>
    ),
    iconBg: "bg-amber-500/10 border border-amber-500/20",
    action: "Submit",
    actionState: "active",
  },
  {
    id: 3,
    title: "MongoDB Database Design",
    description:
      "Design and implement a database schema for the blog application.",
    topic: "MongoDB",
    week: "Week 5",
    status: "Submitted",
    dueDate: "Aug 15, 2025",
    dueTime: "11:59 PM",
    timeRemaining: "Submitted",
    timeColor: "text-emerald-500",
    icon: <FiDatabase className="w-5 h-5 text-emerald-500" />,
    iconBg: "bg-emerald-500/10 border border-emerald-500/20",
    action: "Submitted",
    actionState: "disabled",
  },
  {
    id: 4,
    title: "JavaScript Quiz",
    description:
      "Complete the quiz covering ES6+ features, array methods, and async concepts.",
    topic: "JavaScript",
    week: "Week 4",
    status: "Graded",
    dueDate: "Aug 10, 2025",
    dueTime: "11:59 PM",
    timeRemaining: "Graded on Aug 09",
    timeColor: "text-emerald-500",
    icon: (
      <span className="text-[10px] font-mono font-bold text-blue-500">JS</span>
    ),
    iconBg: "bg-blue-500/10 border border-blue-500/20",
    action: "Submitted",
    actionState: "disabled",
  },
  {
    id: 5,
    title: "UI/UX Design Challenge",
    description:
      "Design a responsive landing page based on the provided Figma file.",
    topic: "HTML / CSS",
    week: "Week 4",
    status: "In Progress",
    dueDate: "Aug 18, 2025",
    dueTime: "11:59 PM",
    timeRemaining: "3 days left",
    timeColor: "text-blue-500",
    icon: <FiEdit2 className="w-5 h-5 text-primary" />,
    iconBg: "bg-primary/10 border border-primary/20",
    action: "Submit",
    actionState: "active",
  },
];

const getStatusBadge = (status) => {
  if (status === "In Progress")
    return "bg-blue-500/10 text-blue-500 border border-blue-500/20";
  if (status === "Not Started")
    return "bg-amber-500/10 text-amber-500 border border-amber-500/20";
  if (status === "Submitted")
    return "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20";
  if (status === "Graded")
    return "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20";
  return "bg-surface-subtle text-text-muted border border-border";
};

export default function StudentAssignments() {
  const [activeTab, setActiveTab] = useState("All Assignments");

  const cardStyle =
    "bg-surface border border-border rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-primary/50 hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-4";

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-12 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight">
            Assignments
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-0.5">
            View your assignments, deadlines, and submission status.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-text-muted">
              <FiSearch className="w-4 h-4" />
            </div>
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2.5 border border-border bg-surface-subtle rounded-xl text-xs sm:text-sm text-text-primary placeholder:text-text-muted/50 hover:border-primary hover:shadow-[0_0_0_1px_rgba(234,88,12,0.25)] focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all outline-none duration-150 shadow-2xs"
              placeholder="Search assignments..."
            />
          </div>
          <button className="inline-flex justify-center items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-xs sm:text-sm font-semibold text-text-primary hover:bg-surface-subtle hover:border-primary/40 transition-colors shadow-2xs whitespace-nowrap cursor-pointer">
            All Status
            <FiChevronDown className="h-4 w-4 text-text-muted" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={cardStyle}>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary shadow-2xs">
            <FiClipboard className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-text-muted mb-0.5 uppercase tracking-wider">
              Total Assignments
            </p>
            <h4 className="text-2xl font-black text-text-primary leading-none mb-1">
              12
            </h4>
            <p className="text-[11px] font-medium text-text-muted">All time</p>
          </div>
        </div>

        <div className={cardStyle}>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 shadow-2xs">
            <FiClock className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-text-muted mb-0.5 uppercase tracking-wider">
              Pending
            </p>
            <h4 className="text-2xl font-black text-text-primary leading-none mb-1">
              3
            </h4>
            <p className="text-[11px] font-medium text-text-muted">
              Need to start or continue
            </p>
          </div>
        </div>

        <div className={cardStyle}>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-500 shadow-2xs">
            <FiDroplet className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-text-muted mb-0.5 uppercase tracking-wider">
              Submitted
            </p>
            <h4 className="text-2xl font-black text-text-primary leading-none mb-1">
              6
            </h4>
            <p className="text-[11px] font-medium text-text-muted">
              Awaiting feedback
            </p>
          </div>
        </div>

        <div className={cardStyle}>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 shadow-2xs">
            <FiCheckCircle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-text-muted mb-0.5 uppercase tracking-wider">
              Completed
            </p>
            <h4 className="text-2xl font-black text-text-primary leading-none mb-1">
              3
            </h4>
            <p className="text-[11px] font-medium text-text-muted">Graded</p>
          </div>
        </div>
      </div>

      <div className="bg-surface rounded-2xl border border-border flex flex-col mb-10 w-full overflow-hidden shadow-sm hover:border-primary/40 transition-all duration-200">
        <div className="border-b border-border px-4 sm:px-6 flex gap-2 sm:gap-6 overflow-x-auto w-full bg-surface-subtle/50">
          {[
            "All Assignments",
            "Pending",
            "In Progress",
            "Submitted",
            "Graded",
          ].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-3 sm:px-4 py-4 text-xs sm:text-sm font-bold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === tab
                  ? "border-primary text-primary"
                  : "border-transparent text-text-muted hover:text-text-primary"
              }`}
            >
              {tab}
              {tab === "Pending" && (
                <span className="flex items-center justify-center bg-surface border border-border text-text-muted rounded-full px-2 py-0.5 text-[10px] font-mono font-bold">
                  3
                </span>
              )}
              {tab === "In Progress" && (
                <span className="flex items-center justify-center bg-surface border border-border text-text-muted rounded-full px-2 py-0.5 text-[10px] font-mono font-bold">
                  2
                </span>
              )}
              {tab === "Submitted" && (
                <span className="flex items-center justify-center bg-surface border border-border text-text-muted rounded-full px-2 py-0.5 text-[10px] font-mono font-bold">
                  6
                </span>
              )}
              {tab === "Graded" && (
                <span className="flex items-center justify-center bg-surface border border-border text-text-muted rounded-full px-2 py-0.5 text-[10px] font-mono font-bold">
                  3
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-250">
            <thead>
              <tr className="border-b border-border text-[11px] uppercase tracking-wider text-text-muted font-mono font-bold bg-surface-subtle">
                <th className="px-6 py-4 w-[35%]">Assignment</th>
                <th className="px-6 py-4 w-[15%]">Topic / Week</th>
                <th className="px-6 py-4 w-[15%]">Status</th>
                <th className="px-6 py-4 w-[20%]">Due Date</th>
                <th className="px-6 py-4 w-[15%] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {mockAssignments.map((assignment) => (
                <tr
                  key={assignment.id}
                  className="hover:bg-surface-subtle/50 transition-colors group"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex h-10 w-10 mt-1 shrink-0 items-center justify-center rounded-xl shadow-2xs ${assignment.iconBg}`}
                      >
                        {assignment.icon}
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-text-primary">
                          {assignment.title}
                        </h4>
                        <p className="text-xs text-text-muted mt-1 leading-relaxed pr-4">
                          {assignment.description}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 align-top pt-6">
                    <p className="text-xs sm:text-sm font-bold text-text-primary">
                      {assignment.topic}
                    </p>
                    <p className="text-xs text-text-muted mt-0.5 font-mono">
                      {assignment.week}
                    </p>
                  </td>
                  <td className="px-6 py-5 align-top pt-6">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold tracking-wide uppercase ${getStatusBadge(assignment.status)}`}
                    >
                      {assignment.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 align-top pt-6">
                    <p className="text-xs sm:text-sm font-bold text-text-primary font-mono">
                      {assignment.dueDate}
                    </p>
                    <p className="text-xs text-text-muted mt-0.5 font-mono">
                      {assignment.dueTime}
                    </p>
                    <p
                      className={`text-[11px] font-bold mt-1 font-mono ${assignment.timeColor}`}
                    >
                      {assignment.timeRemaining}
                    </p>
                  </td>
                  <td className="px-6 py-5 align-top pt-6 text-right">
                    <div className="flex items-center justify-end gap-2.5">
                      {assignment.actionState === "active" ? (
                        <button className="px-4 py-2 rounded-xl text-xs font-bold text-primary border border-primary/30 bg-primary/10 hover:bg-primary/20 transition-all cursor-pointer shadow-2xs">
                          {assignment.action}
                        </button>
                      ) : (
                        <button
                          disabled
                          className="px-4 py-2 rounded-xl text-xs font-bold text-text-muted/50 border border-border bg-surface-subtle cursor-not-allowed"
                        >
                          {assignment.action}
                        </button>
                      )}
                      <button className="text-text-muted hover:text-text-primary p-2 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-border">
                        <FiMoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-border px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-surface-subtle/50 text-xs">
          <span className="text-text-muted">
            Showing <span className="font-bold text-text-primary">1</span> to{" "}
            <span className="font-bold text-text-primary">5</span> of{" "}
            <span className="font-bold text-text-primary">12</span> assignments
          </span>
          <div className="flex items-center gap-1 font-mono">
            <button className="flex h-8 w-8 items-center justify-center rounded-xl border border-border bg-surface text-text-muted hover:bg-surface-subtle hover:text-text-primary transition-colors cursor-pointer">
              <FiChevronLeft className="h-4 w-4" />
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-xl border border-primary bg-primary text-primary-foreground font-bold text-xs transition-colors cursor-pointer shadow-2xs">
              1
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-xl border border-border bg-surface text-text-muted hover:bg-surface-subtle font-semibold text-xs transition-colors cursor-pointer">
              2
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-xl border border-border bg-surface text-text-muted hover:bg-surface-subtle font-semibold text-xs transition-colors cursor-pointer">
              3
            </button>
            <span className="flex h-8 w-8 items-center justify-center text-text-muted text-xs tracking-widest">
              ...
            </span>
            <button className="flex h-8 w-8 items-center justify-center rounded-xl border border-border bg-surface text-text-muted hover:bg-surface-subtle font-semibold text-xs transition-colors cursor-pointer">
              4
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-xl border border-border bg-surface text-text-muted hover:bg-surface-subtle hover:text-text-primary transition-colors cursor-pointer">
              <FiChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
