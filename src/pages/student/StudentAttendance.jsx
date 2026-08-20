import React, { useState } from "react";
import {
  FiCalendar,
  FiChevronDown,
  FiCheck,
  FiX,
  FiClock,
  FiArrowRight,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { Link } from "react-router-dom";

const mockAttendanceData = {
  overview: {
    percentage: 92,
    attendedSessions: 22,
    totalSessions: 24,
    present: { count: 20, percentage: 83.3 },
    absent: { count: 3, percentage: 12.5 },
    late: { count: 1, percentage: 4.2 },
    excused: { count: 0, percentage: 0 },
  },
  trendData: [
    { label: "Week 1", value: 88, y: 50 },
    { label: "Week 2", value: 92, y: 35 },
    { label: "Week 3", value: 90, y: 42 },
    { label: "Week 4", value: 95, y: 25 },
    { label: "This Week", value: 92, y: 35 },
  ],
  recentSessions: [
    {
      id: 1,
      date: "May 14, 2025",
      day: "Wed",
      topic: "React Components & Props",
      week: "Week 6",
      status: "Present",
      time: "10:02 AM",
      notes: "-",
    },
    {
      id: 2,
      date: "May 12, 2025",
      day: "Mon",
      topic: "State Management in React",
      week: "Week 6",
      status: "Present",
      time: "10:05 AM",
      notes: "-",
    },
    {
      id: 3,
      date: "May 10, 2025",
      day: "Sat",
      topic: "JavaScript ES6+ Features",
      week: "Week 5",
      status: "Late",
      time: "10:18 AM",
      notes: "Joined late (Traffic)",
    },
    {
      id: 4,
      date: "May 7, 2025",
      day: "Wed",
      topic: "API Integration with React",
      week: "Week 5",
      status: "Absent",
      time: "-",
      notes: "-",
    },
    {
      id: 5,
      date: "May 5, 2025",
      day: "Mon",
      topic: "Custom Hooks In React",
      week: "Week 5",
      status: "Present",
      time: "10:01 AM",
      notes: "-",
    },
  ],
};

const StatusBadge = ({ status }) => {
  let styles = "text-text-primary font-medium";
  if (status === "Present")
    styles =
      "bg-success/10 text-success px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase";
  if (status === "Late")
    styles =
      "bg-warning/10 text-warning px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase";
  return <span className={styles}>{status}</span>;
};

const AttendanceTrendChart = ({ data }) => (
  <div className="relative w-full h-55 mt-6">
    <svg
      className="w-full h-full overflow-visible"
      viewBox="0 0 800 200"
      preserveAspectRatio="none"
    >
      {[0, 50, 100, 150, 200].map((y, i) => (
        <g key={i}>
          <line
            x1="40"
            y1={y}
            x2="800"
            y2={y}
            stroke="var(--border)"
            strokeWidth="1"
          />
          <text
            x="30"
            y={y + 4}
            fill="var(--text-muted)"
            fontSize="12"
            textAnchor="end"
            className="font-medium"
          >
            {100 - i * 25}%
          </text>
        </g>
      ))}
      <defs>
        <linearGradient id="primaryGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.15" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points="80,200 80,50 260,35 440,42 620,25 800,35 800,200"
        fill="url(#primaryGradient)"
      />
      <polyline
        points="80,50 260,35 440,42 620,25 800,35"
        fill="none"
        stroke="var(--primary)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {data.map((point, i) => {
        const xPos = 80 + i * 180;
        return (
          <g key={i}>
            <text
              x={xPos}
              y={point.y - 12}
              fill="var(--text-muted)"
              fontSize="12"
              textAnchor="middle"
              className="font-bold"
            >
              {point.value}%
            </text>
            <circle
              cx={xPos}
              cy={point.y}
              r="4"
              fill="var(--primary)"
              stroke="var(--surface)"
              strokeWidth="1.5"
            />
            <text
              x={xPos}
              y="220"
              fill="var(--text-muted)"
              fontSize="12"
              textAnchor="middle"
              className="font-medium"
            >
              {point.label}
            </text>
          </g>
        );
      })}
    </svg>
  </div>
);

export default function StudentAttendance() {
  const [data] = useState(mockAttendanceData);

  const { overview, trendData, recentSessions } = data;

  return (
    <div className="mx-auto w-full max-w-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-bold text-text-primary tracking-tight">
            Attendance Overview
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            Track your attendance and session history.
          </p>
        </div>
        <button className="inline-flex justify-center items-center gap-2 rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-text-primary hover:bg-surface-subtle transition-colors shadow-sm whitespace-nowrap">
          <FiCalendar className="h-4 w-4 text-text-muted" />
          This Month
          <FiChevronDown className="h-4 w-4 text-text-muted ml-1" />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <div className="flex items-center justify-between rounded-xl border border-border bg-surface p-5">
          <div>
            <p className="text-xs font-bold text-text-primary mb-1">
              Attendance
              <br />
              Percentage
            </p>
            <h4 className="text-[28px] font-bold text-primary leading-none mb-1">
              {overview.percentage}%
            </h4>
            <p className="text-[11px] font-medium text-text-muted">
              {overview.attendedSessions} / {overview.totalSessions} sessions
            </p>
          </div>
          <div className="text-primary">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="10 4.1"
            >
              <circle cx="12" cy="12" r="9" />
            </svg>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-border bg-surface p-5">
          <div>
            <p className="text-xs font-bold text-text-primary mb-1">Present</p>
            <h4 className="text-[28px] font-bold text-success leading-none mb-1">
              {overview.present.count}
            </h4>
            <p className="text-[11px] font-medium text-text-muted">
              {overview.present.percentage}%
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10 text-success">
            <FiCheck className="h-5 w-5" />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-border bg-surface p-5">
          <div>
            <p className="text-xs font-bold text-text-primary mb-1">Absent</p>
            <h4 className="text-[28px] font-bold text-primary leading-none mb-1">
              {overview.absent.count}
            </h4>
            <p className="text-[11px] font-medium text-text-muted">
              {overview.absent.percentage}%
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-light text-primary">
            <FiX className="h-5 w-5" />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-border bg-surface p-5">
          <div>
            <p className="text-xs font-bold text-text-primary mb-1">Late</p>
            <h4 className="text-[28px] font-bold text-warning leading-none mb-1">
              {overview.late.count}
            </h4>
            <p className="text-[11px] font-medium text-text-muted">
              {overview.late.percentage}%
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warning/10 text-warning">
            <FiClock className="h-5 w-5" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-6">
        <div className="rounded-xl border border-border bg-surface p-6 lg:col-span-2">
          <h3 className="text-base font-bold text-text-primary mb-2">
            Attendance Trend
          </h3>
          <AttendanceTrendChart data={trendData} />
        </div>

        <div className="rounded-xl border border-border bg-surface p-6 flex flex-col">
          <h3 className="text-base font-bold text-text-primary mb-6">
            Attendance Summary
          </h3>
          <div className="flex-1 space-y-5">
            <div className="flex justify-between items-center text-sm">
              <span className="text-text-muted">Total Sessions</span>
              <span className="font-bold text-text-primary">
                {overview.totalSessions}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-text-muted">Attended</span>
              <span className="font-bold text-text-primary">
                {overview.attendedSessions}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-text-muted">Absent</span>
              <span className="font-bold text-text-primary">
                {overview.absent.count}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-text-muted">Late</span>
              <span className="font-bold text-text-primary">
                {overview.late.count}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-text-muted">Excused</span>
              <span className="font-bold text-text-primary">
                {overview.excused.count}
              </span>
            </div>
          </div>
          <p className="text-[11px] text-text-disabled mt-8 pt-4 border-t border-border-subtle leading-relaxed">
            Percentage is calculated based on applicable sessions.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-surface flex flex-col mb-10 w-full overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5">
          <h3 className="text-base font-bold text-text-primary">
            Recent Sessions
          </h3>
          <Link
            to="#"
            className="group flex items-center gap-1 text-xs font-bold text-primary hover:underline"
          >
            View All Sessions{" "}
            <FiArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-200">
            <thead>
              <tr className="border-y border-border text-[11px] uppercase tracking-wider text-text-muted font-bold">
                <th className="px-6 py-4 w-[20%]">Date</th>
                <th className="px-6 py-4 w-[35%]">Session / Topic</th>
                <th className="px-6 py-4 w-[15%]">Status</th>
                <th className="px-6 py-4 w-[15%]">Check-in Time</th>
                <th className="px-6 py-4 w-[15%]">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {recentSessions.map((session) => (
                <tr
                  key={session.id}
                  className="hover:bg-surface-subtle transition-colors"
                >
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-text-primary">
                      {session.date}
                    </p>
                    <p className="text-xs text-text-muted mt-0.5">
                      ({session.day})
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-text-primary">
                      {session.topic}
                    </p>
                    <p className="text-xs text-text-muted mt-0.5">
                      {session.week}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={session.status} />
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-text-muted">
                      {session.time}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-text-muted">
                      {session.notes}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-border px-6 py-4 flex items-center justify-center">
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
            <button className="flex h-8 w-8 items-center justify-center rounded border border-border bg-surface text-text-muted hover:bg-surface-subtle transition-colors">
              <FiChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
