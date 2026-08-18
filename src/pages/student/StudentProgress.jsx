import React from "react";
import { Link } from "react-router-dom";
import {
  FiCalendar,
  FiTrendingUp,
  FiBookOpen,
  FiCheckCircle,
  FiClock,
  FiAward,
  FiMoreVertical,
  FiArrowRight,
} from "react-icons/fi";
import { FaHtml5, FaReact, FaNodeJs } from "react-icons/fa";
import { IoLogoJavascript } from "react-icons/io5";
import { SiMongodb } from "react-icons/si";

// Mock Data structure designed to easily swap with a backend API response
const progressOverview = [
  {
    id: 1,
    label: "Overall Progress",
    value: "68%",
    subtext: "+8% from last week",
    icon: FiTrendingUp,
    color: "text-red-500",
    bg: "bg-red-50",
  },
  {
    id: 2,
    label: "Completed Topics",
    value: "16",
    subtext: "16 / 24 total",
    icon: FiBookOpen,
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    id: 3,
    label: "Quizzes Completed",
    value: "12",
    subtext: "80% average score",
    icon: FiCheckCircle,
    color: "text-green-500",
    bg: "bg-green-50",
  },
  {
    id: 4,
    label: "Total Learning Time",
    value: "42h 30m",
    subtext: "+5h from last week",
    icon: FiClock,
    color: "text-orange-500",
    bg: "bg-orange-50",
  },
  {
    id: 5,
    label: "Current Streak",
    value: "7 days",
    subtext: "Keep it up! 🔥",
    icon: FiAward,
    color: "text-purple-500",
    bg: "bg-purple-50",
  },
];

const topicProgressData = [
  {
    id: 1,
    topic: "HTML / CSS",
    progress: 100,
    status: "Completed",
    date: "Jun 5, 2025",
    icon: FaHtml5,
    iconColor: "text-orange-500",
    iconBg: "bg-orange-100",
  },
  {
    id: 2,
    topic: "JavaScript",
    progress: 72,
    status: "In Progress",
    date: "Jun 4, 2025",
    icon: IoLogoJavascript,
    iconColor: "text-yellow-500",
    iconBg: "bg-yellow-100",
  },
  {
    id: 3,
    topic: "React",
    progress: 45,
    status: "Needs Improvement",
    date: "Jun 3, 2025",
    icon: FaReact,
    iconColor: "text-cyan-500",
    iconBg: "bg-cyan-100",
  },
  {
    id: 4,
    topic: "Node.js",
    progress: 60,
    status: "In Progress",
    date: "Jun 2, 2025",
    icon: FaNodeJs,
    iconColor: "text-green-600",
    iconBg: "bg-green-100",
  },
  {
    id: 5,
    topic: "MongoDB",
    progress: 50,
    status: "In Progress",
    date: "May 30, 2025",
    icon: SiMongodb,
    iconColor: "text-green-500",
    iconBg: "bg-green-100",
  },
];

const getStatusBadgeStyles = (status) => {
  switch (status) {
    case "Completed":
      return "bg-green-50 text-green-600 border border-green-200";
    case "In Progress":
      return "bg-blue-50 text-blue-600 border border-blue-200";
    case "Needs Improvement":
      return "bg-orange-50 text-orange-600 border border-orange-200";
    default:
      return "bg-gray-100 text-gray-600 border border-gray-200";
  }
};

const StudentProgress = () => {
  return (
    <div className="flex-1 w-full p-8 bg-gray-50/50 min-h-screen font-sans">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Progress Overview
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Track your learning progress across all topics and skills.
          </p>
        </div>
        <div className="relative">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 shadow-sm hover:bg-gray-50 transition-colors">
            <FiCalendar className="w-4 h-4" />
            This Week
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {progressOverview.map((stat) => (
          <div
            key={stat.id}
            className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <span className="text-xs font-medium text-gray-500">
                {stat.label}
              </span>
            </div>
            <div className="mt-auto">
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
              <p
                className={`text-xs mt-1 font-medium ${stat.subtext.includes("+") ? "text-green-500" : "text-gray-500"}`}
              >
                {stat.subtext}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Middle Section: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Progress Over Time Chart (Mocked Line Chart) */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm lg:col-span-2 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-base font-bold text-gray-900">
              Progress Over Time
            </h2>
            <Link
              to="#"
              className="text-sm font-medium text-red-600 hover:text-red-700 flex items-center gap-1"
            >
              View Full Report <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="flex-1 relative w-full min-h-[200px] mt-4">
            {/* Pure CSS/SVG Mock Chart to match exact UI without heavy dependencies */}
            <div className="absolute inset-0 flex flex-col justify-between text-xs text-gray-400 pb-6">
              <div className="border-b border-gray-100 w-full flex items-end pb-1">
                100%
              </div>
              <div className="border-b border-gray-100 w-full flex items-end pb-1">
                75%
              </div>
              <div className="border-b border-gray-100 w-full flex items-end pb-1">
                50%
              </div>
              <div className="border-b border-gray-100 w-full flex items-end pb-1">
                25%
              </div>
              <div className="border-b border-gray-100 w-full flex items-end pb-1">
                0%
              </div>
            </div>
            <svg
              className="absolute inset-0 w-full h-[calc(100%-1.5rem)]"
              preserveAspectRatio="none"
              viewBox="0 0 100 100"
            >
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0,70 L20,60 L40,55 L60,45 L80,47 L100,35 L100,100 L0,100 Z"
                fill="url(#gradient)"
              />
              <path
                d="M0,70 L20,60 L40,55 L60,45 L80,47 L100,35"
                fill="none"
                stroke="#dc2626"
                strokeWidth="1.5"
              />
              <circle cx="0" cy="70" r="1.5" fill="#dc2626" />
              <circle cx="20" cy="60" r="1.5" fill="#dc2626" />
              <circle cx="40" cy="55" r="1.5" fill="#dc2626" />
              <circle cx="60" cy="45" r="1.5" fill="#dc2626" />
              <circle cx="80" cy="47" r="1.5" fill="#dc2626" />
              <circle cx="100" cy="35" r="1.5" fill="#dc2626" />
            </svg>
            <div className="absolute bottom-0 left-0 w-full flex justify-between text-xs text-gray-400 px-1">
              <span>May 7</span>
              <span>May 14</span>
              <span>May 21</span>
              <span>May 28</span>
              <span>Jun 4</span>
              <span>This Week</span>
            </div>
          </div>
        </div>

        {/* Skills Breakdown (Mocked Donut Chart) */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-base font-bold text-gray-900">
              Skills Breakdown
            </h2>
            <Link
              to="#"
              className="text-sm font-medium text-red-600 hover:text-red-700 flex items-center gap-1"
            >
              View Skills <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="flex flex-col items-center">
            {/* SVG Donut Chart */}
            <div className="relative w-40 h-40 mb-6">
              <svg
                viewBox="0 0 36 36"
                className="w-full h-full transform -rotate-90"
              >
                <circle
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="transparent"
                  stroke="#f3f4f6"
                  strokeWidth="4"
                ></circle>
                {/* Red - HTML/CSS */}
                <circle
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="transparent"
                  stroke="#dc2626"
                  strokeWidth="4"
                  strokeDasharray="30 70"
                  strokeDashoffset="0"
                ></circle>
                {/* Blue - JavaScript */}
                <circle
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="transparent"
                  stroke="#2563eb"
                  strokeWidth="4"
                  strokeDasharray="20 80"
                  strokeDashoffset="-30"
                ></circle>
                {/* Green - React */}
                <circle
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="transparent"
                  stroke="#16a34a"
                  strokeWidth="4"
                  strokeDasharray="15 85"
                  strokeDashoffset="-50"
                ></circle>
                {/* Yellow - Node */}
                <circle
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="transparent"
                  stroke="#eab308"
                  strokeWidth="4"
                  strokeDasharray="15 85"
                  strokeDashoffset="-65"
                ></circle>
                {/* Purple - Mongo */}
                <circle
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="transparent"
                  stroke="#9333ea"
                  strokeWidth="4"
                  strokeDasharray="20 80"
                  strokeDashoffset="-80"
                ></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-gray-900">68%</span>
                <span className="text-xs text-gray-500">Overall</span>
              </div>
            </div>

            {/* Legend */}
            <div className="w-full space-y-3">
              {[
                { label: "HTML / CSS", color: "bg-red-600", val: "100%" },
                { label: "JavaScript", color: "bg-blue-600", val: "72%" },
                { label: "React", color: "bg-green-600", val: "45%" },
                { label: "Node.js", color: "bg-yellow-500", val: "60%" },
                { label: "MongoDB", color: "bg-purple-600", val: "50%" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2 w-28">
                    <div className={`w-2 h-2 rounded-full ${item.color}`}></div>
                    <span className="text-gray-600 font-medium">
                      {item.label}
                    </span>
                  </div>
                  <div className="flex-1 mx-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color}`}
                      style={{ width: item.val }}
                    ></div>
                  </div>
                  <span className="text-gray-900 font-bold w-10 text-right">
                    {item.val}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Topic Progress Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-base font-bold text-gray-900">Topic Progress</h2>
          <Link
            to="#"
            className="text-sm font-medium text-red-600 hover:text-red-700 flex items-center gap-1"
          >
            View All Topics <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="pb-3 pt-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider w-1/3">
                  Topic
                </th>
                <th className="pb-3 pt-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider w-1/3">
                  Status
                </th>
                <th className="pb-3 pt-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider w-1/4">
                  Last Activity
                </th>
                <th className="pb-3 pt-4 px-6 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {topicProgressData.map((topic) => (
                <tr
                  key={topic.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${topic.iconBg}`}
                      >
                        <topic.icon className={`w-5 h-5 ${topic.iconColor}`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-gray-900 mb-2">
                          {topic.topic}
                        </h4>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-1.5 bg-gray-100 rounded-full max-w-[120px] overflow-hidden">
                            <div
                              className="h-full bg-red-700 rounded-full"
                              style={{ width: `${topic.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-bold text-gray-900">
                            {topic.progress}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-3 py-1 rounded-md text-[11px] font-bold ${getStatusBadgeStyles(topic.status)}`}
                    >
                      {topic.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-gray-500 font-medium">
                      {topic.date}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="text-gray-400 hover:text-gray-600 p-1">
                      <FiMoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentProgress;
