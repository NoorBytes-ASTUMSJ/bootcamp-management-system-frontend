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

const progressOverview = [
  {
    id: 1,
    label: "Overall Progress",
    value: "68%",
    subtext: "+8% from last week",
    icon: FiTrendingUp,
    color: "text-primary",
    bg: "bg-primary-light",
  },
  {
    id: 2,
    label: "Completed Topics",
    value: "16",
    subtext: "16 / 24 total",
    icon: FiBookOpen,
    color: "text-info",
    bg: "bg-info/10",
  },
  {
    id: 3,
    label: "Quizzes Completed",
    value: "12",
    subtext: "80% average score",
    icon: FiCheckCircle,
    color: "text-success",
    bg: "bg-success/10",
  },
  {
    id: 4,
    label: "Total Learning Time",
    value: "42h 30m",
    subtext: "+5h from last week",
    icon: FiClock,
    color: "text-warning",
    bg: "bg-warning/10",
  },
  {
    id: 5,
    label: "Current Streak",
    value: "7 days",
    subtext: "Keep it up! 🔥",
    icon: FiAward,
    color: "text-secondary-foreground",
    bg: "bg-secondary",
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
    iconColor: "text-warning",
    iconBg: "bg-warning/10",
  },
  {
    id: 2,
    topic: "JavaScript",
    progress: 72,
    status: "In Progress",
    date: "Jun 4, 2025",
    icon: IoLogoJavascript,
    iconColor: "text-info",
    iconBg: "bg-info/10",
  },
  {
    id: 3,
    topic: "React",
    progress: 45,
    status: "Needs Improvement",
    date: "Jun 3, 2025",
    icon: FaReact,
    iconColor: "text-info",
    iconBg: "bg-info/10",
  },
  {
    id: 4,
    topic: "Node.js",
    progress: 60,
    status: "In Progress",
    date: "Jun 2, 2025",
    icon: FaNodeJs,
    iconColor: "text-success",
    iconBg: "bg-success/10",
  },
  {
    id: 5,
    topic: "MongoDB",
    progress: 50,
    status: "In Progress",
    date: "May 30, 2025",
    icon: SiMongodb,
    iconColor: "text-success",
    iconBg: "bg-success/10",
  },
];

const getStatusBadgeStyles = (status) => {
  switch (status) {
    case "Completed":
      return "bg-success/10 text-success border border-success/20";
    case "In Progress":
      return "bg-info/10 text-info border border-info/20";
    case "Needs Improvement":
      return "bg-warning/10 text-warning border border-warning/20";
    default:
      return "bg-surface-muted text-text-muted border border-border";
  }
};

const StudentProgress = () => {
  return (
    <div className="mx-auto w-full max-w-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-bold text-text-primary tracking-tight">
            Progress Overview
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            Track your learning progress across all topics and skills.
          </p>
        </div>
        <div className="relative">
          <button className="flex justify-center items-center gap-2 px-4 py-2 bg-surface border border-border rounded-lg text-sm text-text-primary shadow-sm hover:bg-surface-subtle transition-colors whitespace-nowrap">
            <FiCalendar className="w-4 h-4 text-text-muted" />
            This Week
            <svg
              className="w-4 h-4 text-text-muted ml-1"
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

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {progressOverview.map((stat) => (
          <div
            key={stat.id}
            className="bg-surface p-5 rounded-xl border border-border shadow-sm flex flex-col"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <span className="text-xs font-medium text-text-muted">
                {stat.label}
              </span>
            </div>
            <div className="mt-auto">
              <h3 className="text-2xl font-bold text-text-primary">
                {stat.value}
              </h3>
              <p
                className={`text-xs mt-1 font-medium ${stat.subtext.includes("+") ? "text-success" : "text-text-muted"}`}
              >
                {stat.subtext}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-surface p-6 rounded-xl border border-border shadow-sm lg:col-span-2 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-base font-bold text-text-primary">
              Progress Over Time
            </h2>
            <Link
              to="#"
              className="text-sm font-medium text-primary hover:text-primary-hover flex items-center gap-1"
            >
              View Full Report <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="flex-1 relative w-full min-h-50 mt-4">
            <div className="absolute inset-0 flex flex-col justify-between text-xs text-text-disabled pb-6">
              <div className="border-b border-border w-full flex items-end pb-1">
                100%
              </div>
              <div className="border-b border-border w-full flex items-end pb-1">
                75%
              </div>
              <div className="border-b border-border w-full flex items-end pb-1">
                50%
              </div>
              <div className="border-b border-border w-full flex items-end pb-1">
                25%
              </div>
              <div className="border-b border-border w-full flex items-end pb-1">
                0%
              </div>
            </div>
            <svg
              className="absolute inset-0 w-full h-[calc(100%-1.5rem)]"
              preserveAspectRatio="none"
              viewBox="0 0 100 100"
            >
              <defs>
                <linearGradient
                  id="gradientLine"
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop
                    offset="0%"
                    stopColor="var(--primary)"
                    stopOpacity="0.2"
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--primary)"
                    stopOpacity="0"
                  />
                </linearGradient>
              </defs>
              <path
                d="M0,70 L20,60 L40,55 L60,45 L80,47 L100,35 L100,100 L0,100 Z"
                fill="url(#gradientLine)"
              />
              <path
                d="M0,70 L20,60 L40,55 L60,45 L80,47 L100,35"
                fill="none"
                stroke="var(--primary)"
                strokeWidth="1.5"
              />
              <circle cx="0" cy="70" r="1.5" fill="var(--primary)" />
              <circle cx="20" cy="60" r="1.5" fill="var(--primary)" />
              <circle cx="40" cy="55" r="1.5" fill="var(--primary)" />
              <circle cx="60" cy="45" r="1.5" fill="var(--primary)" />
              <circle cx="80" cy="47" r="1.5" fill="var(--primary)" />
              <circle cx="100" cy="35" r="1.5" fill="var(--primary)" />
            </svg>
            <div className="absolute bottom-0 left-0 w-full flex justify-between text-xs text-text-disabled px-1">
              <span>May 7</span>
              <span>May 14</span>
              <span>May 21</span>
              <span>May 28</span>
              <span>Jun 4</span>
              <span>This Week</span>
            </div>
          </div>
        </div>

        <div className="bg-surface p-6 rounded-xl border border-border shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-base font-bold text-text-primary">
              Skills Breakdown
            </h2>
            <Link
              to="#"
              className="text-sm font-medium text-primary hover:text-primary-hover flex items-center gap-1"
            >
              View Skills <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="flex flex-col items-center">
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
                  stroke="var(--surface-muted)"
                  strokeWidth="4"
                ></circle>
                <circle
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="transparent"
                  stroke="var(--primary)"
                  strokeWidth="4"
                  strokeDasharray="30 70"
                  strokeDashoffset="0"
                ></circle>
                <circle
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="transparent"
                  stroke="var(--info)"
                  strokeWidth="4"
                  strokeDasharray="20 80"
                  strokeDashoffset="-30"
                ></circle>
                <circle
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="transparent"
                  stroke="var(--success)"
                  strokeWidth="4"
                  strokeDasharray="15 85"
                  strokeDashoffset="-50"
                ></circle>
                <circle
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="transparent"
                  stroke="var(--warning)"
                  strokeWidth="4"
                  strokeDasharray="15 85"
                  strokeDashoffset="-65"
                ></circle>
                <circle
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="transparent"
                  stroke="var(--secondary-foreground)"
                  strokeWidth="4"
                  strokeDasharray="20 80"
                  strokeDashoffset="-80"
                ></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-text-primary">
                  68%
                </span>
                <span className="text-xs text-text-muted">Overall</span>
              </div>
            </div>

            <div className="w-full space-y-3">
              {[
                { label: "HTML / CSS", bgClass: "bg-primary", val: "100%" },
                { label: "JavaScript", bgClass: "bg-info", val: "72%" },
                { label: "React", bgClass: "bg-success", val: "45%" },
                { label: "Node.js", bgClass: "bg-warning", val: "60%" },
                {
                  label: "MongoDB",
                  bgClass: "bg-secondary-foreground",
                  val: "50%",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2 w-28">
                    <div
                      className={`w-2 h-2 rounded-full ${item.bgClass}`}
                    ></div>
                    <span className="text-text-primary font-medium">
                      {item.label}
                    </span>
                  </div>
                  <div className="flex-1 mx-3 h-1.5 bg-surface-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.bgClass}`}
                      style={{ width: item.val }}
                    ></div>
                  </div>
                  <span className="text-text-primary font-bold w-10 text-right">
                    {item.val}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-surface rounded-xl border border-border shadow-sm flex flex-col mb-10 w-full overflow-hidden">
        <div className="p-6 border-b border-border flex justify-between items-center">
          <h2 className="text-base font-bold text-text-primary">
            Topic Progress
          </h2>
          <Link
            to="#"
            className="text-sm font-medium text-primary hover:text-primary-hover flex items-center gap-1"
          >
            View All Topics <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-200">
            <thead>
              <tr>
                <th className="pb-3 pt-4 px-6 text-xs font-semibold text-text-muted uppercase tracking-wider w-1/3">
                  Topic
                </th>
                <th className="pb-3 pt-4 px-6 text-xs font-semibold text-text-muted uppercase tracking-wider w-1/3">
                  Status
                </th>
                <th className="pb-3 pt-4 px-6 text-xs font-semibold text-text-muted uppercase tracking-wider w-1/4">
                  Last Activity
                </th>
                <th className="pb-3 pt-4 px-6 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {topicProgressData.map((topic) => (
                <tr
                  key={topic.id}
                  className="hover:bg-surface-subtle transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${topic.iconBg}`}
                      >
                        <topic.icon className={`w-5 h-5 ${topic.iconColor}`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-text-primary mb-2">
                          {topic.topic}
                        </h4>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-1.5 bg-surface-muted rounded-full max-w-30 overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${topic.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-bold text-text-primary">
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
                    <span className="text-sm text-text-muted font-medium">
                      {topic.date}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="text-text-muted hover:text-text-primary p-1 rounded-md hover:bg-surface-subtle">
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
