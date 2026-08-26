import React, { useState } from "react";
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
import { FaHtml5, FaReact, FaNodeJs } from "react-icons/fa";
import { IoLogoJavascript } from "react-icons/io5";

const MOCK_DATA = {
  student: { firstName: "Alex" },
  overview: { attendance: 92, progress: 68, assignments: 3, averageGrade: 86 },
  progressSummary: [
    {
      id: 1,
      topic: "HTML / CSS",
      percentage: 100,
      status: "Completed",
      icon: FaHtml5,
      iconBg: "bg-amber-500/10 border border-amber-500/20",
      iconColor: "text-amber-500",
    },
    {
      id: 2,
      topic: "JavaScript",
      percentage: 72,
      status: "In Progress",
      icon: IoLogoJavascript,
      iconBg: "bg-blue-500/10 border border-blue-500/20",
      iconColor: "text-blue-500",
    },
    {
      id: 3,
      topic: "React",
      percentage: 45,
      status: "Needs Improvement",
      icon: FaReact,
      iconBg: "bg-cyan-500/10 border border-cyan-500/20",
      iconColor: "text-cyan-500",
    },
    {
      id: 4,
      topic: "Node.js",
      percentage: 60,
      status: "In Progress",
      icon: FaNodeJs,
      iconBg: "bg-emerald-500/10 border border-emerald-500/20",
      iconColor: "text-emerald-500",
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
  <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-primary/50 hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between">
    <div className="flex items-center gap-4 mb-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary shadow-2xs">
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-xs font-bold text-text-muted mb-0.5 uppercase tracking-wider">
          {title}
        </p>
        <h4 className="text-2xl font-black text-text-primary leading-none">
          {value}
        </h4>
      </div>
    </div>
    <p className="text-xs text-text-muted">{subtitle}</p>
  </div>
);

const SectionHeader = ({ title, actionText, actionLink }) => (
  <div className="flex items-center justify-between mb-5">
    <h3 className="text-sm sm:text-base font-bold text-text-primary tracking-tight">
      {title}
    </h3>
    <Link
      to={actionLink}
      className="group flex items-center gap-1 text-xs font-bold text-primary hover:underline"
    >
      {actionText}{" "}
      <FiChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
    </Link>
  </div>
);

const StatusBadge = ({ status }) => {
  let styles = "bg-surface-subtle text-text-muted border border-border";
  if (status === "Completed")
    styles = "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20";
  if (status === "In Progress")
    styles = "bg-blue-500/10 text-blue-500 border border-blue-500/20";
  if (status === "Needs Improvement")
    styles = "bg-amber-500/10 text-amber-500 border border-amber-500/20";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wide uppercase ${styles}`}
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

  // Shared modern card style
  const cardStyle =
    "bg-surface border border-border rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-primary/50 hover:-translate-y-0.5 transition-all duration-200";

  return (
    <div className="mx-auto max-w-7xl px-4 pb-12 space-y-8 animate-in fade-in duration-500">
      {/* HEADER SECTION */}
      <div>
        <h2 className="text-xl sm:text-[28px] font-black text-text-primary tracking-tight">
          Welcome back, {student.firstName}
          <span className="text-primary">.</span>
        </h2>
        <p className="text-xs sm:text-sm text-text-muted mt-0.5">
          Here's an overview of your bootcamp progress.
        </p>
      </div>

      {/* OVERVIEW STATS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-6">
          <div className={cardStyle}>
            <SectionHeader
              title="Progress Summary"
              actionText="View Progress"
              actionLink="/student/progress"
            />
            <div className="space-y-6">
              {progressSummary.map((item) => {
                const TopicIcon = item.icon;
                return (
                  <div key={item.id} className="flex items-center gap-4">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.iconBg} ${item.iconColor} shadow-2xs`}
                    >
                      <TopicIcon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs sm:text-sm font-bold text-text-primary">
                          {item.topic}
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-text-primary font-mono">
                            {item.percentage}%
                          </span>
                          <StatusBadge status={item.status} />
                        </div>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-surface-subtle border border-border/60">
                        <div
                          className="h-full rounded-full bg-primary transition-all duration-500"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={cardStyle}>
            <SectionHeader
              title="Upcoming Deadlines"
              actionText="View Assignments"
              actionLink="/student/assignments"
            />
            <div className="space-y-3.5">
              {upcomingDeadlines.map((deadline) => (
                <div
                  key={deadline.id}
                  className="flex items-start gap-4 rounded-xl border border-border bg-surface-subtle/50 p-4 shadow-2xs hover:border-primary/40 transition-colors"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary shadow-2xs">
                    <FiClipboard className="h-4 w-4" />
                  </div>
                  <div className="flex-1 pt-0.5">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-text-primary">
                        {deadline.title}
                      </h4>
                      <div className="flex flex-col items-end gap-0.5 shrink-0">
                        <span className="text-xs font-bold text-text-primary font-mono">
                          {deadline.date}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wide font-mono ${deadline.status === "In Progress" ? "text-blue-500" : "text-text-muted"}`}
                        >
                          {deadline.status}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-text-muted mt-1">
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
          <div className={cardStyle}>
            <SectionHeader
              title="Recent Announcements"
              actionText="View All"
              actionLink="/student/announcements"
            />
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <div
                  key={announcement.id}
                  className="flex items-start gap-4 border-b border-border/60 pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary mt-1 shadow-2xs">
                    {announcement.priority === "High" ? (
                      <FiAlertCircle className="h-4 w-4" />
                    ) : (
                      <FiBookOpen className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1 gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-text-primary truncate">
                        {announcement.title}
                      </h4>
                      <span className="text-[11px] font-medium text-text-muted ml-2 font-mono shrink-0">
                        {announcement.date}
                      </span>
                    </div>
                    <p className="text-xs text-text-muted line-clamp-1">
                      {announcement.preview}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={cardStyle}>
            <SectionHeader
              title="Recent Feedback"
              actionText="View Submissions"
              actionLink="/student/submissions"
            />
            <div className="space-y-3.5">
              {recentFeedback.map((feedback) => (
                <div
                  key={feedback.id}
                  className="flex items-start gap-4 rounded-xl border border-border bg-surface-subtle/50 p-4 shadow-2xs hover:border-primary/40 transition-colors"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary shadow-2xs">
                    <FiStar className="h-4 w-4" />
                  </div>
                  <div className="flex-1 pt-0.5">
                    <div className="flex items-start justify-between mb-1 gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-text-primary">
                        {feedback.title}
                      </h4>
                      <span className="text-xs font-bold text-emerald-500 font-mono shrink-0">
                        {feedback.score}{" "}
                        <span className="text-text-muted font-normal">
                          / {feedback.maxScore}
                        </span>
                      </span>
                    </div>
                    <p className="text-xs text-text-muted leading-relaxed mb-2">
                      {feedback.feedback}
                    </p>
                    <div className="flex justify-end">
                      <span className="text-[10px] font-medium text-text-muted font-mono">
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
