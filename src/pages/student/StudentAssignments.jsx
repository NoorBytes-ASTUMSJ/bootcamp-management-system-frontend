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
    timeColor: "text-info",
    icon: <FiCode className="w-5 h-5 text-primary" />,
    iconBg: "bg-primary-light",
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
    timeColor: "text-warning",
    icon: <span className="text-[10px] font-bold text-warning">API</span>,
    iconBg: "bg-warning/10",
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
    timeColor: "text-success",
    icon: <FiDatabase className="w-5 h-5 text-success" />,
    iconBg: "bg-success/10",
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
    timeColor: "text-success",
    icon: <span className="text-[10px] font-bold text-info">JS</span>,
    iconBg: "bg-info/10",
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
    timeColor: "text-info",
    icon: <FiEdit2 className="w-5 h-5 text-secondary-foreground" />,
    iconBg: "bg-secondary",
    action: "Submit",
    actionState: "active",
  },
];

const getStatusBadge = (status) => {
  if (status === "In Progress") return "bg-info/10 text-info";
  if (status === "Not Started") return "bg-warning/10 text-warning";
  if (status === "Submitted") return "bg-success/10 text-success";
  if (status === "Graded") return "bg-success/10 text-success";
  return "bg-surface-muted text-text-muted";
};

export default function StudentAssignments() {
  const [activeTab, setActiveTab] = useState("All Assignments");

  return (
    <div className="mx-auto w-full max-w-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-bold text-text-primary tracking-tight">
            Assignments
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            View your assignments, deadlines, and submission status.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-text-muted">
              <FiSearch className="w-4 h-4" />
            </div>
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 border border-border bg-surface rounded-lg text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="Search assignments..."
            />
          </div>
          <button className="inline-flex justify-center items-center gap-2 rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-text-primary hover:bg-surface-subtle transition-colors shadow-sm whitespace-nowrap">
            All Status
            <FiChevronDown className="h-4 w-4 text-text-muted" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="flex items-center gap-4 rounded-xl border border-border bg-surface p-5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary">
            <FiClipboard className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-text-muted mb-0.5">
              Total Assignments
            </p>
            <h4 className="text-2xl font-bold text-text-primary leading-none mb-1">
              12
            </h4>
            <p className="text-[11px] font-medium text-text-muted">All time</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-xl border border-border bg-surface p-5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-warning/10 text-warning">
            <FiClock className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-text-muted mb-0.5">
              Pending
            </p>
            <h4 className="text-2xl font-bold text-text-primary leading-none mb-1">
              3
            </h4>
            <p className="text-[11px] font-medium text-text-muted">
              Need to start or continue
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-xl border border-border bg-surface p-5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-info/10 text-info">
            <FiDroplet className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-text-muted mb-0.5">
              Submitted
            </p>
            <h4 className="text-2xl font-bold text-text-primary leading-none mb-1">
              6
            </h4>
            <p className="text-[11px] font-medium text-text-muted">
              Awaiting feedback
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-xl border border-border bg-surface p-5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-success/10 text-success">
            <FiCheckCircle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-text-muted mb-0.5">
              Completed
            </p>
            <h4 className="text-2xl font-bold text-text-primary leading-none mb-1">
              3
            </h4>
            <p className="text-[11px] font-medium text-text-muted">Graded</p>
          </div>
        </div>
      </div>

      <div className="bg-surface rounded-xl border border-border flex flex-col mb-10 w-full">
        <div className="border-b border-border px-2 flex gap-2 sm:gap-6 overflow-x-auto w-full">
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
              className={`flex items-center gap-2 px-3 sm:px-4 py-4 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? "border-primary text-primary"
                  : "border-transparent text-text-muted hover:text-text-primary"
              }`}
            >
              {tab}
              {tab === "Pending" && (
                <span className="flex items-center justify-center bg-surface-muted text-text-muted rounded-full px-2 py-0.5 text-[10px]">
                  3
                </span>
              )}
              {tab === "In Progress" && (
                <span className="flex items-center justify-center bg-surface-muted text-text-muted rounded-full px-2 py-0.5 text-[10px]">
                  2
                </span>
              )}
              {tab === "Submitted" && (
                <span className="flex items-center justify-center bg-surface-muted text-text-muted rounded-full px-2 py-0.5 text-[10px]">
                  6
                </span>
              )}
              {tab === "Graded" && (
                <span className="flex items-center justify-center bg-surface-muted text-text-muted rounded-full px-2 py-0.5 text-[10px]">
                  3
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-250">
            <thead>
              <tr className="border-b border-border text-[11px] uppercase tracking-wider text-text-muted font-bold">
                <th className="px-6 py-4 w-[35%]">Assignment</th>
                <th className="px-6 py-4 w-[15%]">Topic / Week</th>
                <th className="px-6 py-4 w-[15%]">Status</th>
                <th className="px-6 py-4 w-[20%]">Due Date</th>
                <th className="px-6 py-4 w-[15%] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {mockAssignments.map((assignment) => (
                <tr
                  key={assignment.id}
                  className="hover:bg-surface-subtle transition-colors group"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex h-10 w-10 mt-1 shrink-0 items-center justify-center rounded-lg ${assignment.iconBg}`}
                      >
                        {assignment.icon}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-text-primary">
                          {assignment.title}
                        </h4>
                        <p className="text-xs text-text-muted mt-1 leading-relaxed pr-4">
                          {assignment.description}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 align-top pt-6">
                    <p className="text-sm font-bold text-text-primary">
                      {assignment.topic}
                    </p>
                    <p className="text-xs text-text-muted mt-0.5">
                      {assignment.week}
                    </p>
                  </td>
                  <td className="px-6 py-5 align-top pt-6">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wide uppercase ${getStatusBadge(assignment.status)}`}
                    >
                      {assignment.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 align-top pt-6">
                    <p className="text-sm font-bold text-text-primary">
                      {assignment.dueDate}
                    </p>
                    <p className="text-xs text-text-muted mt-0.5">
                      {assignment.dueTime}
                    </p>
                    <p
                      className={`text-[11px] font-medium mt-1 ${assignment.timeColor}`}
                    >
                      {assignment.timeRemaining}
                    </p>
                  </td>
                  <td className="px-6 py-5 align-top pt-6 text-right">
                    <div className="flex items-center justify-end gap-3">
                      {assignment.actionState === "active" ? (
                        <button className="px-4 py-1.5 rounded text-sm font-medium text-primary border border-primary hover:bg-primary-light transition-colors">
                          {assignment.action}
                        </button>
                      ) : (
                        <button
                          disabled
                          className="px-4 py-1.5 rounded text-sm font-medium text-text-disabled border border-border bg-surface-subtle cursor-not-allowed"
                        >
                          {assignment.action}
                        </button>
                      )}
                      <button className="text-text-muted hover:text-text-primary p-1 rounded-md hover:bg-surface-subtle">
                        <FiMoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-border px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-text-muted">
            Showing 1 to 5 of 12 assignments
          </span>
          <div className="flex items-center gap-1">
            <button className="flex h-8 w-8 items-center justify-center rounded border border-border bg-surface text-text-muted hover:bg-surface-subtle transition-colors">
              <FiChevronLeft className="h-4 w-4" />
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded border border-primary bg-primary text-primary-foreground font-medium text-sm transition-colors">
              1
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded border border-border bg-surface text-text-muted hover:bg-surface-subtle font-medium text-sm transition-colors">
              2
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded border border-border bg-surface text-text-muted hover:bg-surface-subtle font-medium text-sm transition-colors">
              3
            </button>
            <span className="flex h-8 w-8 items-center justify-center text-text-muted text-sm tracking-widest">
              ...
            </span>
            <button className="flex h-8 w-8 items-center justify-center rounded border border-border bg-surface text-text-muted hover:bg-surface-subtle font-medium text-sm transition-colors">
              4
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded border border-border bg-surface text-text-muted hover:bg-surface-subtle transition-colors">
              <FiChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
