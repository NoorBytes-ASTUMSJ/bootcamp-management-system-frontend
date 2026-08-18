import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiCalendar,
  FiTrendingUp,
  FiClipboard,
  FiStar,
  FiChevronRight,
  FiAlertCircle,
  FiBookOpen,
} from "react-icons/fi";

const MOCK_DATA = {
  student: { firstName: "Alex" },
  overview: { attendance: 92, progress: 68, assignments: 3, averageGrade: 86 },
  progressSummary: [
    {
      id: 1,
      topic: "HTML / CSS",
      percentage: 100,
      status: "Completed",
      iconText: "5",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
    {
      id: 2,
      topic: "JavaScript",
      percentage: 72,
      status: "In Progress",
      iconText: "JS",
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
    {
      id: 3,
      topic: "React",
      percentage: 45,
      status: "Needs Improvement",
      iconText: "Re",
      iconBg: "bg-cyan-100",
      iconColor: "text-cyan-600",
    },
    {
      id: 4,
      topic: "Node.js",
      percentage: 60,
      status: "In Progress",
      iconText: "nS",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
  ],
  announcements: [
    {
      id: 1,
      title: "Project Submission Deadline Updated",
      date: "Aug 14, 2025",
      preview: "The deadline for this week's project has been updated.",
      priority: "High",
    },
    {
      id: 2,
      title: "New Learning Resources Added",
      date: "Aug 12, 2025",
      preview: "Check out the new resources for advanced JavaScript.",
      priority: "Normal",
    },
  ],
  upcomingDeadlines: [
    {
      id: 1,
      title: "React Portfolio Project",
      description: "Build and deploy your portfolio website.",
      date: "Aug 20, 2025",
      status: "In Progress",
    },
    {
      id: 2,
      title: "Backend API Assignment",
      description: "Create RESTful API with authentication.",
      date: "Aug 24, 2025",
      status: "Not Started",
    },
  ],
  recentFeedback: [
    {
      id: 1,
      title: "React Portfolio Project",
      feedback:
        "Great component structure and clean code. Work on accessibility and responsiveness.",
      score: 92,
      maxScore: 100,
      date: "Aug 13, 2025",
    },
  ],
};

const StatCard = ({ icon: Icon, title, value, subtitle }) => (
  <div className="flex flex-col justify-between rounded-xl border border-[#E5E5E5] bg-white p-5">
    <div className="flex items-center gap-4 mb-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#B93325]/10 text-[#B93325]">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs font-medium text-[#777777]">{title}</p>
        <h4 className="text-2xl font-bold text-[#171717]">{value}</h4>
      </div>
    </div>
    <p className="text-xs text-[#777777]">{subtitle}</p>
  </div>
);

const SectionHeader = ({ title, actionText, actionLink }) => (
  <div className="flex items-center justify-between mb-5">
    <h3 className="text-base font-bold text-[#171717]">{title}</h3>
    <Link
      to={actionLink}
      className="group flex items-center gap-1 text-xs font-bold text-[#B93325] hover:underline"
    >
      {actionText}{" "}
      <FiChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
    </Link>
  </div>
);

const StatusBadge = ({ status }) => {
  let styles = "bg-gray-100 text-gray-700";
  if (status === "Completed") styles = "bg-green-100 text-green-700";
  if (status === "In Progress") styles = "bg-blue-100 text-blue-700";
  if (status === "Needs Improvement") styles = "bg-orange-100 text-orange-700";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide ${styles}`}
    >
      {status}
    </span>
  );
};

export default function StudentDashboard() {
  const [dashboardData, setDashboardData] = useState(MOCK_DATA);
  const {
    student,
    overview,
    progressSummary,
    announcements,
    upcomingDeadlines,
    recentFeedback,
  } = dashboardData;

  return (
    <div className="mx-auto max-w-6xl">
      {/* HEADER SECTION */}
      <div className="mb-8">
        <h2 className="text-[28px] font-bold text-[#171717] tracking-tight">
          Welcome back, {student.firstName}
          <span className="text-[#B93325]">.</span>
        </h2>
        <p className="text-sm text-[#777777] mt-1">
          Here's an overview of your bootcamp progress.
        </p>
      </div>

      {/* OVERVIEW STATS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          icon={FiCalendar}
          title="Attendance"
          value={`${overview.attendance}%`}
          subtitle="Based on applicable sessions"
        />
        <StatCard
          icon={FiTrendingUp}
          title="Progress"
          value={`${overview.progress}%`}
          subtitle="Across current topics"
        />
        <StatCard
          icon={FiClipboard}
          title="Assignments"
          value={overview.assignments}
          subtitle="Pending"
        />
        <StatCard
          icon={FiStar}
          title="Average Grade"
          value={`${overview.averageGrade}%`}
          subtitle="From graded submissions"
        />
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 pb-10">
        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-6">
          <div className="rounded-xl border border-[#E5E5E5] bg-white p-6">
            <SectionHeader
              title="Progress Summary"
              actionText="View Progress"
              actionLink="/student/progress"
            />
            <div className="space-y-6">
              {progressSummary.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded ${item.iconBg} ${item.iconColor} font-bold text-xs`}
                  >
                    {item.iconText}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-semibold text-[#171717]">
                        {item.topic}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-[#171717]">
                          {item.percentage}%
                        </span>
                        <StatusBadge status={item.status} />
                      </div>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#F8F8F6]">
                      <div
                        className="h-full rounded-full bg-[#B93325]"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-[#E5E5E5] bg-white p-6">
            <SectionHeader
              title="Upcoming Deadlines"
              actionText="View Assignments"
              actionLink="/student/assignments"
            />
            <div className="space-y-4">
              {upcomingDeadlines.map((deadline) => (
                <div
                  key={deadline.id}
                  className="flex items-start gap-4 rounded-lg border border-[#F8F8F6] p-4"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#B93325]/10 text-[#B93325]">
                    <FiClipboard className="h-4 w-4" />
                  </div>
                  <div className="flex-1 pt-0.5">
                    <div className="flex items-start justify-between">
                      <h4 className="text-sm font-bold text-[#171717]">
                        {deadline.title}
                      </h4>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-xs font-semibold text-[#171717]">
                          {deadline.date}
                        </span>
                        <span
                          className={`text-[10px] font-bold ${deadline.status === "In Progress" ? "text-blue-600" : "text-[#777777]"}`}
                        >
                          {deadline.status}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-[#777777] mt-1">
                      {deadline.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col gap-6">
          <div className="rounded-xl border border-[#E5E5E5] bg-white p-6">
            <SectionHeader
              title="Recent Announcements"
              actionText="View All"
              actionLink="/student/announcements"
            />
            <div className="space-y-5">
              {announcements.map((announcement) => (
                <div
                  key={announcement.id}
                  className="flex items-start gap-4 border-b border-[#F8F8F6] pb-5 last:border-0 last:pb-0"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#B93325]/10 text-[#B93325] mt-1">
                    {announcement.priority === "High" ? (
                      <FiAlertCircle className="h-4 w-4" />
                    ) : (
                      <FiBookOpen className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="text-sm font-bold text-[#171717]">
                        {announcement.title}
                      </h4>
                      <span className="text-[11px] font-medium text-[#777777] ml-2">
                        {announcement.date}
                      </span>
                    </div>
                    <p className="text-xs text-[#777777]">
                      {announcement.preview}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-[#E5E5E5] bg-white p-6">
            <SectionHeader
              title="Recent Feedback"
              actionText="View Submissions"
              actionLink="/student/submissions"
            />
            <div className="space-y-4">
              {recentFeedback.map((feedback) => (
                <div
                  key={feedback.id}
                  className="flex items-start gap-4 rounded-lg border border-[#F8F8F6] p-4"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#B93325]/10 text-[#B93325]">
                    <FiStar className="h-4 w-4" />
                  </div>
                  <div className="flex-1 pt-0.5">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="text-sm font-bold text-[#171717]">
                        {feedback.title}
                      </h4>
                      <span className="text-sm font-bold text-green-600">
                        {feedback.score}{" "}
                        <span className="text-[#171717]">
                          / {feedback.maxScore}
                        </span>
                      </span>
                    </div>
                    <p className="text-xs text-[#777777] leading-relaxed mb-2">
                      {feedback.feedback}
                    </p>
                    <div className="flex justify-end">
                      <span className="text-[11px] font-medium text-[#777777]">
                        {feedback.date}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
