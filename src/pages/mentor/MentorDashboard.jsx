import { useState } from "react";
import {
  Users,
  Calendar,
  TrendingUp,
  FileText,
  AlertTriangle,
  MessageSquare,
  ArrowUpRight,
  BookOpen,
} from "lucide-react";

export default function MentorDashboard() {
  // 5 Stats Cards Data
  const stats = [
    {
      title: "Assigned Students",
      value: "6",
      subtitle: "Students in your group",
      icon: Users,
      color: "text-rose-500 bg-rose-500/10 border-rose-500/20",
    },
    {
      title: "Attendance",
      value: "91%",
      subtitle: "Average attendance",
      icon: Calendar,
      color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    },
    {
      title: "Progress",
      value: "78%",
      subtitle: "Average progress",
      icon: TrendingUp,
      color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: "Pending Grading",
      value: "4",
      subtitle: "Submissions to review",
      icon: FileText,
      color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    },
    {
      title: "At-Risk Students",
      value: "2",
      subtitle: "Need attention",
      icon: AlertTriangle,
      color: "text-orange-500 bg-orange-500/10 border-orange-500/20",
    },
  ];

  // Assigned Students Data with Updated Names & Initials
  const [assignedStudents] = useState([
    {
      id: 1,
      name: "Amir Nuri",
      email: "amir.nuri@example.com",
      initials: "AN",
      status: "On Track",
      lastActive: "Aug 15, 2026",
    },
    {
      id: 2,
      name: "Nabil Kedir",
      email: "nabil.kedir@example.com",
      initials: "NK",
      status: "On Track",
      lastActive: "Aug 14, 2026",
    },
    {
      id: 3,
      name: "Ramadan Adem",
      email: "ramadan.adem@example.com",
      initials: "RA",
      status: "Needs Attention",
      lastActive: "Aug 13, 2026",
    },
    {
      id: 4,
      name: "Feisal Mohammed",
      email: "feisal.mohammed@example.com",
      initials: "FM",
      status: "On Track",
      lastActive: "Aug 15, 2026",
    },
    {
      id: 5,
      name: "Isa Ibrahim",
      email: "isa.ibrahim@example.com",
      initials: "II",
      status: "On Track",
      lastActive: "Aug 12, 2026",
    },
    {
      id: 6,
      name: "Yusuf Kemal",
      email: "yusuf.kemal@example.com",
      initials: "YK",
      status: "On Track",
      lastActive: "Aug 14, 2026",
    },
  ]);

  // Pending Submissions to Grade
  const [pendingGrading] = useState([
    {
      id: 1,
      student: "Amir Nuri",
      assignment: "React Components Task",
      submitted: "Aug 15, 2026",
    },
    {
      id: 2,
      student: "Nabil Kedir",
      assignment: "JavaScript Functions",
      submitted: "Aug 14, 2026",
    },
    {
      id: 3,
      student: "Ramadan Adem",
      assignment: "HTML & CSS Project",
      submitted: "Aug 14, 2026",
    },
    {
      id: 4,
      student: "Feisal Mohammed",
      assignment: "React Hooks Practice",
      submitted: "Aug 13, 2026",
    },
  ]);

  // Students Needing Attention
  const [atRiskStudents] = useState([
    {
      id: 1,
      name: "Ramadan Adem",
      attendance: "68%",
      issue: "Missing 2 submissions",
    },
    {
      id: 2,
      name: "Isa Ibrahim",
      attendance: "72%",
      issue: "Behind on progress",
    },
  ]);

  // Progress Overview by Track/Modules
  const progressMetrics = [
    { module: "HTML/CSS", percentage: 88 },
    { module: "JavaScript", percentage: 76 },
    { module: "React", percentage: 70 },
    { module: "Node.js", percentage: 65 },
    { module: "Git & GitHub", percentage: 80 },
  ];

  // Recent Announcements
  const announcements = [
    { id: 1, title: "Bootcamp Week 5 Schedule Updated", date: "Aug 15, 2026" },
    { id: 2, title: "New Assignment: React Components", date: "Aug 14, 2026" },
    {
      id: 3,
      title: "Reminder: Project Submission Guidelines",
      date: "Aug 12, 2026",
    },
  ];

  // Shared Card Class for consistent shadows, borders, and hover movement
  const cardStyle =
    "bg-surface border border-border rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-primary/50 hover:-translate-y-0.5 transition-all duration-200";

  return (
    <div className="space-y-6 pb-10">
      {/* Top Header / Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight">
            Mentor Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-0.5">
            Overview of your assigned students and their current bootcamp
            progress.
          </p>
        </div>
      </div>

      {/* 5 Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className={cardStyle + " flex flex-col justify-between"}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-text-muted tracking-wide uppercase">
                  {stat.title}
                </span>
                <div className={`p-2 rounded-xl border ${stat.color}`}>
                  <Icon size={18} />
                </div>
              </div>
              <div>
                <div className="text-2xl font-black text-text-primary tracking-tight">
                  {stat.value}
                </div>
                <p className="text-[11px] text-text-muted mt-1">
                  {stat.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid Section (Assigned Students & Attendance Overview) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Assigned Students Table */}
        <div className={`lg:col-span-2 ${cardStyle}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm sm:text-base font-bold text-text-primary flex items-center gap-2">
              <Users size={18} className="text-primary" />
              Assigned Students
            </h2>
            <button className="text-xs font-semibold text-primary hover:underline cursor-pointer">
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border text-[11px] font-mono font-bold text-text-muted uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Student</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Last Active</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-xs sm:text-sm">
                {assignedStudents.map((student) => (
                  <tr
                    key={student.id}
                    className="hover:bg-surface-subtle/50 transition-colors"
                  >
                    <td className="py-3 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                        {student.initials}
                      </div>
                      <div>
                        <div className="font-semibold text-text-primary">
                          {student.name}
                        </div>
                        <div className="text-[11px] text-text-muted">
                          {student.email}
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                          student.status === "On Track"
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                        }`}
                      >
                        {student.status}
                      </span>
                    </td>
                    <td className="py-3 text-text-muted font-mono text-xs">
                      {student.lastActive}
                    </td>
                    <td className="py-3 text-right">
                      <button className="text-xs font-semibold text-primary hover:underline cursor-pointer">
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Column: Attendance Overview */}
        <div className={`${cardStyle} flex flex-col justify-between`}>
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm sm:text-base font-bold text-text-primary flex items-center gap-2">
                <Calendar size={18} className="text-primary" />
                Attendance Overview
              </h2>
              <span className="text-xs font-semibold text-primary cursor-pointer hover:underline">
                View Details
              </span>
            </div>

            <div className="flex flex-col items-center justify-center py-6">
              <div className="relative w-32 h-32 rounded-full border-8 border-primary/20 flex items-center justify-center border-t-primary animate-pulse">
                <div className="text-center">
                  <span className="text-3xl font-black text-text-primary">
                    91%
                  </span>
                  <div className="text-[10px] text-text-muted uppercase font-mono font-bold">
                    Average
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2 mt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-muted flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>{" "}
                  Present
                </span>
                <span className="font-bold text-text-primary font-mono">
                  28 (91%)
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-muted flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>{" "}
                  Late
                </span>
                <span className="font-bold text-text-primary font-mono">
                  2 (6%)
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-muted flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>{" "}
                  Absent
                </span>
                <span className="font-bold text-text-primary font-mono">
                  1 (3%)
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 p-3 rounded-xl bg-surface-subtle border border-border text-xs text-text-muted">
            <span className="font-bold text-text-primary">Today's Date:</span>{" "}
            Friday, August 15, 2026
            <div className="text-[11px] text-primary mt-0.5 font-medium">
              Week 5 — Session 5
            </div>
          </div>
        </div>
      </div>

      {/* Second Row Grid (Progress Overview & Pending Assignments to Grade) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress Overview Progress Bars */}
        <div className={cardStyle}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm sm:text-base font-bold text-text-primary flex items-center gap-2">
              <TrendingUp size={18} className="text-primary" />
              Progress Overview
            </h2>
            <span className="text-xs font-semibold text-primary cursor-pointer hover:underline">
              View Progress
            </span>
          </div>

          <div className="space-y-4 pt-2">
            {progressMetrics.map((item, index) => (
              <div key={index} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-text-primary">{item.module}</span>
                  <span className="text-text-muted font-mono">
                    {item.percentage}%
                  </span>
                </div>
                <div className="w-full h-2.5 bg-surface-subtle rounded-full overflow-hidden border border-border/60">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Assignments to Grade */}
        <div className={cardStyle}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm sm:text-base font-bold text-text-primary flex items-center gap-2">
              <FileText size={18} className="text-primary" />
              Pending Assignments to Grade
            </h2>
            <span className="text-xs font-semibold text-primary cursor-pointer hover:underline">
              View All
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border text-[11px] font-mono font-bold text-text-muted uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Student</th>
                  <th className="pb-3 font-semibold">Assignment</th>
                  <th className="pb-3 font-semibold">Submitted</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-xs sm:text-sm">
                {pendingGrading.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-surface-subtle/50 transition-colors"
                  >
                    <td className="py-3 font-semibold text-text-primary">
                      {item.student}
                    </td>
                    <td className="py-3 text-text-muted">{item.assignment}</td>
                    <td className="py-3 text-text-muted font-mono text-xs">
                      {item.submitted}
                    </td>
                    <td className="py-3 text-right">
                      <button className="text-xs font-bold text-primary hover:underline cursor-pointer">
                        Grade
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Third Row Grid (Students Needing Attention & Recent Announcements) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Students Needing Attention */}
        <div className={cardStyle}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm sm:text-base font-bold text-text-primary flex items-center gap-2">
              <AlertTriangle size={18} />
              Students Needing Attention
            </h2>
            <span className="text-xs font-semibold text-primary cursor-pointer hover:underline">
              View All
            </span>
          </div>

          <div className="space-y-3">
            {atRiskStudents.map((student) => (
              <div
                key={student.id}
                className="flex items-center justify-between p-3 rounded-xl bg-surface-subtle border border-border"
              >
                <div>
                  <div className="font-bold text-xs sm:text-sm text-text-primary">
                    {student.name}
                  </div>
                  <div className="text-[11px] text-text-muted mt-0.5">
                    Attendance:{" "}
                    <span className="text-rose-500 font-semibold">
                      {student.attendance}
                    </span>{" "}
                    • {student.issue}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-rose-500/10 text-rose-500 border border-rose-500/20">
                    Needs Attention
                  </span>
                  <button className="px-3 py-1.5 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground text-xs font-semibold transition-colors cursor-pointer">
                    Message
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Announcements */}
        <div className={cardStyle}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm sm:text-base font-bold text-text-primary flex items-center gap-2">
              <MessageSquare size={18} className="text-primary" />
              Recent Announcements
            </h2>
            <span className="text-xs font-semibold text-primary cursor-pointer hover:underline">
              View All
            </span>
          </div>

          <div className="divide-y divide-border/60">
            {announcements.map((ann) => (
              <div
                key={ann.id}
                className="py-3 first:pt-0 last:pb-0 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-primary shrink-0"></div>
                  <span className="text-xs sm:text-sm font-semibold text-text-primary">
                    {ann.title}
                  </span>
                </div>
                <span className="text-[11px] text-text-muted font-mono">
                  {ann.date}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions Footer Card */}
      <div className={cardStyle}>
        <h2 className="text-sm sm:text-base font-bold text-text-primary mb-4 flex items-center gap-2">
          <BookOpen size={18} className="text-primary" />
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-surface-subtle border border-border hover:border-primary/50 cursor-pointer transition-all flex items-center justify-between group">
            <div>
              <div className="text-xs font-bold text-text-primary">
                Take Attendance
              </div>
              <div className="text-[11px] text-text-muted mt-0.5">
                Mark attendance for today
              </div>
            </div>
            <ArrowUpRight
              size={16}
              className="text-text-muted group-hover:text-primary transition-colors"
            />
          </div>

          <div className="p-4 rounded-xl bg-surface-subtle border border-border hover:border-primary/50 cursor-pointer transition-all flex items-center justify-between group">
            <div>
              <div className="text-xs font-bold text-text-primary">
                Grade Submissions
              </div>
              <div className="text-[11px] text-text-muted mt-0.5">
                Review and grade submissions
              </div>
            </div>
            <ArrowUpRight
              size={16}
              className="text-text-muted group-hover:text-primary transition-colors"
            />
          </div>

          <div className="p-4 rounded-xl bg-surface-subtle border border-border hover:border-primary/50 cursor-pointer transition-all flex items-center justify-between group">
            <div>
              <div className="text-xs font-bold text-text-primary">
                Create Announcement
              </div>
              <div className="text-[11px] text-text-muted mt-0.5">
                Share updates with your students
              </div>
            </div>
            <ArrowUpRight
              size={16}
              className="text-text-muted group-hover:text-primary transition-colors"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
