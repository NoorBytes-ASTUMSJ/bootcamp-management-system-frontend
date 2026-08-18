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
    icon: <FiCode className="w-5 h-5 text-red-400" />,
    iconBg: "bg-red-50",
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
    timeColor: "text-orange-500",
    icon: <span className="text-[10px] font-bold text-yellow-500">API</span>,
    iconBg: "bg-yellow-50",
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
    timeColor: "text-green-500",
    icon: <FiDatabase className="w-5 h-5 text-green-500" />,
    iconBg: "bg-green-50",
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
    timeColor: "text-green-500",
    icon: <span className="text-[10px] font-bold text-purple-500">JS</span>,
    iconBg: "bg-purple-50",
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
    icon: <FiEdit2 className="w-5 h-5 text-pink-500" />,
    iconBg: "bg-pink-50",
    action: "Submit",
    actionState: "active",
  },
];

const getStatusBadge = (status) => {
  if (status === "In Progress") return "bg-blue-50 text-blue-600";
  if (status === "Not Started") return "bg-orange-50 text-orange-600";
  if (status === "Submitted") return "bg-green-50 text-green-600";
  if (status === "Graded") return "bg-green-50 text-green-600";
  return "bg-gray-50 text-gray-600";
};

export default function StudentAssignments() {
  const [activeTab, setActiveTab] = useState("All Assignments");

  return (
    <div className="mx-auto w-full max-w-[1200px]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-bold text-[#171717] tracking-tight">
            Assignments
          </h1>
          <p className="text-xs sm:text-sm text-[#777777] mt-1">
            View your assignments, deadlines, and submission status.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#777777]">
              <FiSearch className="w-4 h-4" />
            </div>
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 border border-[#E5E5E5] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B93325] focus:border-transparent transition-all"
              placeholder="Search assignments..."
            />
          </div>
          <button className="inline-flex justify-center items-center gap-2 rounded-md border border-[#E5E5E5] bg-white px-4 py-2 text-sm font-medium text-[#171717] hover:bg-[#F8F8F6] transition-colors shadow-sm whitespace-nowrap">
            All Status
            <FiChevronDown className="h-4 w-4 text-[#777777]" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="flex items-center gap-4 rounded-xl border border-[#E5E5E5] bg-white p-5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-400">
            <FiClipboard className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-[#777777] mb-0.5">
              Total Assignments
            </p>
            <h4 className="text-2xl font-bold text-[#171717] leading-none mb-1">
              12
            </h4>
            <p className="text-[11px] font-medium text-[#777777]">All time</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-xl border border-[#E5E5E5] bg-white p-5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-yellow-50 text-yellow-500">
            <FiClock className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-[#777777] mb-0.5">Pending</p>
            <h4 className="text-2xl font-bold text-[#171717] leading-none mb-1">
              3
            </h4>
            <p className="text-[11px] font-medium text-[#777777]">
              Need to start or continue
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-xl border border-[#E5E5E5] bg-white p-5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-500">
            <FiDroplet className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-[#777777] mb-0.5">
              Submitted
            </p>
            <h4 className="text-2xl font-bold text-[#171717] leading-none mb-1">
              6
            </h4>
            <p className="text-[11px] font-medium text-[#777777]">
              Awaiting feedback
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-xl border border-[#E5E5E5] bg-white p-5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-500">
            <FiCheckCircle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-[#777777] mb-0.5">
              Completed
            </p>
            <h4 className="text-2xl font-bold text-[#171717] leading-none mb-1">
              3
            </h4>
            <p className="text-[11px] font-medium text-[#777777]">Graded</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#E5E5E5] flex flex-col mb-10 w-full">
        <div className="border-b border-[#E5E5E5] px-2 flex gap-2 sm:gap-6 overflow-x-auto w-full">
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
                  ? "border-[#B93325] text-[#B93325]"
                  : "border-transparent text-[#777777] hover:text-[#171717]"
              }`}
            >
              {tab}
              {tab === "Pending" && (
                <span className="flex items-center justify-center bg-gray-100 text-gray-600 rounded-full px-2 py-0.5 text-[10px]">
                  3
                </span>
              )}
              {tab === "In Progress" && (
                <span className="flex items-center justify-center bg-gray-100 text-gray-600 rounded-full px-2 py-0.5 text-[10px]">
                  2
                </span>
              )}
              {tab === "Submitted" && (
                <span className="flex items-center justify-center bg-gray-100 text-gray-600 rounded-full px-2 py-0.5 text-[10px]">
                  6
                </span>
              )}
              {tab === "Graded" && (
                <span className="flex items-center justify-center bg-gray-100 text-gray-600 rounded-full px-2 py-0.5 text-[10px]">
                  3
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="border-b border-[#E5E5E5] text-[11px] uppercase tracking-wider text-[#777777] font-bold">
                <th className="px-6 py-4 w-[35%]">Assignment</th>
                <th className="px-6 py-4 w-[15%]">Topic / Week</th>
                <th className="px-6 py-4 w-[15%]">Status</th>
                <th className="px-6 py-4 w-[20%]">Due Date</th>
                <th className="px-6 py-4 w-[15%] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F8F8F6]">
              {mockAssignments.map((assignment) => (
                <tr
                  key={assignment.id}
                  className="hover:bg-[#F8F8F6]/50 transition-colors group"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex h-10 w-10 mt-1 shrink-0 items-center justify-center rounded-lg ${assignment.iconBg}`}
                      >
                        {assignment.icon}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#171717]">
                          {assignment.title}
                        </h4>
                        <p className="text-xs text-[#777777] mt-1 leading-relaxed pr-4">
                          {assignment.description}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 align-top pt-6">
                    <p className="text-sm font-bold text-[#171717]">
                      {assignment.topic}
                    </p>
                    <p className="text-xs text-[#777777] mt-0.5">
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
                    <p className="text-sm font-bold text-[#171717]">
                      {assignment.dueDate}
                    </p>
                    <p className="text-xs text-[#777777] mt-0.5">
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
                        <button className="px-4 py-1.5 rounded text-sm font-medium text-[#B93325] border border-[#B93325]/30 hover:bg-[#B93325]/5 transition-colors">
                          {assignment.action}
                        </button>
                      ) : (
                        <button
                          disabled
                          className="px-4 py-1.5 rounded text-sm font-medium text-[#777777] border border-[#E5E5E5] bg-[#F8F8F6] cursor-not-allowed"
                        >
                          {assignment.action}
                        </button>
                      )}
                      <button className="text-[#777777] hover:text-[#171717] p-1 rounded-md hover:bg-[#F8F8F6]">
                        <FiMoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-[#E5E5E5] px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-[#777777]">
            Showing 1 to 5 of 12 assignments
          </span>
          <div className="flex items-center gap-1">
            <button className="flex h-8 w-8 items-center justify-center rounded border border-[#E5E5E5] bg-white text-[#777777] hover:bg-[#F8F8F6] transition-colors">
              <FiChevronLeft className="h-4 w-4" />
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded border border-[#B93325] bg-[#B93325] text-white font-medium text-sm transition-colors">
              1
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded border border-[#E5E5E5] bg-white text-[#777777] hover:bg-[#F8F8F6] font-medium text-sm transition-colors">
              2
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded border border-[#E5E5E5] bg-white text-[#777777] hover:bg-[#F8F8F6] font-medium text-sm transition-colors">
              3
            </button>
            <span className="flex h-8 w-8 items-center justify-center text-[#777777] text-sm tracking-widest">
              ...
            </span>
            <button className="flex h-8 w-8 items-center justify-center rounded border border-[#E5E5E5] bg-white text-[#777777] hover:bg-[#F8F8F6] font-medium text-sm transition-colors">
              4
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded border border-[#E5E5E5] bg-white text-[#777777] hover:bg-[#F8F8F6] transition-colors">
              <FiChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
