import React, { useState, useEffect, useMemo } from "react";
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
import API from "../../services/api";
import { getStudentProgress } from "../../services/progressService";
import { useAuth } from "../../context/AuthContext";

const TOPIC_ICON_MAP = {
  "html / css": {
    icon: FaHtml5,
    iconBg: "bg-amber-500/10 border border-amber-500/20",
    iconColor: "text-amber-500",
  },
  javascript: {
    icon: IoLogoJavascript,
    iconBg: "bg-blue-500/10 border border-blue-500/20",
    iconColor: "text-blue-500",
  },
  react: {
    icon: FaReact,
    iconBg: "bg-cyan-500/10 border border-cyan-500/20",
    iconColor: "text-cyan-500",
  },
  "node.js": {
    icon: FaNodeJs,
    iconBg: "bg-emerald-500/10 border border-emerald-500/20",
    iconColor: "text-emerald-500",
  },
};

const DEFAULT_TOPIC_CONFIG = {
  icon: FiBookOpen,
  iconBg: "bg-primary/10 border border-primary/20",
  iconColor: "text-primary",
};

const DEFAULT_DASHBOARD_DATA = {
  student: { firstName: "" },
  announcements: [],
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

function AttendanceQuickStats({ records }) {
  const stats = useMemo(() => {
    const counts = { present: 0, absent: 0, late: 0, excused: 0 };

    records.forEach((r) => {
      if (counts[r.status] !== undefined) counts[r.status] += 1;
    });

    const gradeableSessions =
      counts.present + counts.late + counts.absent + counts.excused;
    const score = counts.present + counts.late * 0.5 + counts.excused * 0.25;
    const pct =
      gradeableSessions > 0
        ? Math.round((score / gradeableSessions) * 100)
        : 100;

    return { counts, total: records.length, pct };
  }, [records]);

  if (stats.total === 0) {
    return (
      <div className="flex items-center justify-center h-full py-6">
        <p className="text-xs text-text-muted">No attendance history yet.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div className="text-center shrink-0">
        <p className="text-4xl font-black text-text-primary leading-none">
          {stats.pct}%
        </p>
        <p className="text-[10px] text-text-muted uppercase tracking-wider font-bold mt-1">
          Overall Attendance
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 flex-1 w-full">
        <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 text-center">
          <p className="text-lg font-black text-emerald-500 leading-none">
            {stats.counts.present}
          </p>
          <p className="text-[9px] text-emerald-600 font-bold uppercase tracking-wide mt-1">
            Present
          </p>
        </div>
        <div className="rounded-lg bg-rose-500/10 border border-rose-500/20 p-3 text-center">
          <p className="text-lg font-black text-rose-500 leading-none">
            {stats.counts.absent}
          </p>
          <p className="text-[9px] text-rose-600 font-bold uppercase tracking-wide mt-1">
            Absent
          </p>
        </div>
        <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-3 text-center">
          <p className="text-lg font-black text-amber-500 leading-none">
            {stats.counts.late}
          </p>
          <p className="text-[9px] text-amber-600 font-bold uppercase tracking-wide mt-1">
            Late
          </p>
        </div>
        <div className="rounded-lg bg-sky-500/10 border border-sky-500/20 p-3 text-center">
          <p className="text-lg font-black text-sky-500 leading-none">
            {stats.counts.excused}
          </p>
          <p className="text-[9px] text-sky-600 font-bold uppercase tracking-wide mt-1">
            Excused
          </p>
        </div>
      </div>
    </div>
  );
}

function ActivityTimeline({ announcements, deadlines, feedback }) {
  const items = useMemo(() => {
    const combined = [
      ...announcements.map((a) => ({
        type: "announcement",
        date: a.date,
        title: a.title,
        detail: a.preview,
        icon: FiBookOpen,
      })),
      ...deadlines.map((d) => ({
        type: "deadline",
        date: d.date,
        title: d.title,
        detail: d.description,
        icon: FiClipboard,
      })),
      ...feedback.map((f) => ({
        type: "feedback",
        date: f.date,
        title: f.title,
        detail:
          f.score !== undefined && f.maxScore !== undefined
            ? `${f.score}/${f.maxScore} — ${f.feedback || ""}`
            : f.feedback,
        icon: FiStar,
      })),
    ];

    return combined
      .filter((item) => item.date)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 8);
  }, [announcements, deadlines, feedback]);

  const typeStyles = {
    announcement: "bg-primary/10 border-primary/20 text-primary",
    deadline: "bg-amber-500/10 border-amber-500/20 text-amber-500",
    feedback: "bg-emerald-500/10 border-emerald-500/20 text-emerald-500",
  };

  if (items.length === 0) {
    return (
      <p className="text-xs text-text-muted text-center py-8">
        No recent activity yet.
      </p>
    );
  }

  return (
    <div>
      {items.map((item, idx) => {
        const Icon = item.icon;

        return (
          <div key={idx} className="flex gap-3.5">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border shadow-2xs ${typeStyles[item.type]}`}
              >
                <Icon className="h-3.5 w-3.5" />
              </div>
              {idx < items.length - 1 && (
                <div className="w-px flex-1 bg-border/60 my-1" />
              )}
            </div>

            <div
              className={`flex-1 min-w-0 ${idx < items.length - 1 ? "pb-5" : ""}`}
            >
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-xs font-bold text-text-primary">
                  {item.title}
                </h4>
                <span className="text-[10px] font-medium text-text-muted font-mono shrink-0">
                  {item.date}
                </span>
              </div>
              {item.detail && (
                <p className="text-xs text-text-muted mt-0.5 line-clamp-2">
                  {item.detail}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function LeaderboardCard({ title, icon: Icon, entries, accent, comingSoon }) {
  return (
    <div className="rounded-xl border border-border bg-surface-subtle/40 p-4">
      <div className="flex items-center gap-2 mb-3.5">
        <div
          className={`flex h-7 w-7 items-center justify-center rounded-lg shrink-0 ${accent.bg} ${accent.text}`}
        >
          <Icon className="h-3.5 w-3.5" />
        </div>
        <span className="text-[11px] font-bold text-text-primary uppercase tracking-wide">
          {title}
        </span>
      </div>

      {comingSoon ? (
        <div className="flex flex-col items-center justify-center text-center py-5">
          <p className="text-[11px] font-medium text-text-muted">Coming soon</p>
        </div>
      ) : entries.length === 0 ? (
        <p className="text-[11px] text-text-muted text-center py-5">
          Not enough data yet.
        </p>
      ) : (
        <div className="space-y-2.5">
          {entries.map((entry, idx) => (
            <div key={entry.id} className="flex items-center gap-2.5">
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-black ${
                  idx === 0
                    ? "bg-amber-400 text-amber-950"
                    : "bg-surface-subtle text-text-muted border border-border"
                }`}
              >
                {idx + 1}
              </span>
              <span className="flex-1 min-w-0 text-xs font-semibold text-text-primary truncate">
                {entry.name}
              </span>
              <span className="text-xs font-black text-text-primary font-mono shrink-0">
                {entry.value}
                {title === "Grades" ? "" : "%"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(DEFAULT_DASHBOARD_DATA);

  const [attendanceRecords, setAttendanceRecords] = useState([]);

  const attendancePercent = useMemo(() => {
    let present = 0;
    let late = 0;
    let absent = 0;
    let excuse = 0;

    attendanceRecords.forEach((r) => {
      if (r.status === "present") present += 1;
      else if (r.status === "late") late += 1;
      else if (r.status === "absent") absent += 1;
      else if (r.status === "excused") excuse += 1;
    });

    const gradeableSessions = present + late + absent + excuse;
    if (gradeableSessions === 0) return 100;

    const score = present + late * 0.5 + excuse * 0.25;
    return Math.round((score / gradeableSessions) * 100);
  }, [attendanceRecords]);

  const [selfProgressPercent, setSelfProgressPercent] = useState(0);
  const [progressSummary, setProgressSummary] = useState([]);

  const [assignmentsSummary, setAssignmentsSummary] = useState({
    pending: 0,
    averageGrade: 0,
  });
  const [derivedDeadlines, setDerivedDeadlines] = useState([]);
  const [derivedFeedback, setDerivedFeedback] = useState([]);

  const [leaderboard, setLeaderboard] = useState({
    attendance: [],
    progress: [],
    grades: [],
  });

  const scoreTopics = (topicsMap) => {
    let totalScore = 0;
    let count = 0;

    Object.keys(topicsMap || {}).forEach((topicKey) => {
      const items = Array.isArray(topicsMap[topicKey])
        ? topicsMap[topicKey]
        : [topicsMap[topicKey]];

      items.forEach((item) => {
        count++;
        const status = item.status || "Not Started";
        if (status === "Completed") totalScore += 100;
        else if (status === "In Progress" || status === "Needs Help")
          totalScore += 50;
      });
    });

    return count > 0 ? Math.round(totalScore / count) : 0;
  };

  const loadLeaderboard = async () => {
    try {
      const [progressOverview, attendanceResponse, gradesResponse] =
        await Promise.all([
          getStudentProgress(),
          API.get("/attendance/my-batch").catch((err) => {
            console.error("Failed to load batch attendance:", err);
            return null;
          }),
          API.get("/submissions/my-batch-grades").catch((err) => {
            console.error("Failed to load batch grades:", err);
            return null;
          }),
        ]);

      const students = progressOverview?.students || [];

      const nameById = {};
      students.forEach((s) => {
        nameById[s.id] = { name: s.name, initials: s.initials };
      });

      const progressRanking = students
        .map((student) => ({
          id: student.id,
          name: student.name,
          value: scoreTopics(student.progressMap),
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);

      let attendanceRanking = [];

      if (attendanceResponse) {
        const records =
          attendanceResponse.data?.data?.attendance ||
          attendanceResponse.data?.attendance ||
          attendanceResponse.data?.data ||
          [];

        attendanceRanking = (Array.isArray(records) ? records : [])
          .map((record) => ({
            id: record.memberId,
            name: nameById[record.memberId]?.name || "Student",
            value: record.percentage,
          }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 5);
      }

      let gradesRanking = [];

      if (gradesResponse) {
        const grades =
          gradesResponse.data?.data?.grades ||
          gradesResponse.data?.grades ||
          gradesResponse.data?.data ||
          [];

        gradesRanking = (Array.isArray(grades) ? grades : [])
          .filter((entry) => entry.gradedCount > 0)
          .map((entry) => ({
            id: entry.memberId,
            name: nameById[entry.memberId]?.name || "Student",
            value: entry.percentage,
          }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 5);
      }

      setLeaderboard({
        attendance: attendanceRanking,
        progress: progressRanking,
        grades: gradesRanking,
      });

      const selfStudent = students.find((s) => s.isSelf);

      if (selfStudent) {
        setSelfProgressPercent(scoreTopics(selfStudent.progressMap));

        const topicsMap = selfStudent.progressMap || {};
        const summary = Object.keys(topicsMap).map((topicKey) => {
          const items = Array.isArray(topicsMap[topicKey])
            ? topicsMap[topicKey]
            : [topicsMap[topicKey]];

          const percentage = scoreTopics({ [topicKey]: items });
          const hasNeedsHelp = items.some(
            (item) => item.status === "Needs Help",
          );

          let status = "Not Started";
          if (percentage === 100) status = "Completed";
          else if (hasNeedsHelp) status = "Needs Improvement";
          else if (percentage > 0) status = "In Progress";

          return {
            id: topicKey,
            topic: items[0]?.topic || topicKey,
            percentage,
            status,
          };
        });

        setProgressSummary(summary);
      }
    } catch (error) {
      console.error("Failed to load leaderboard/progress:", error);
      setLeaderboard({ attendance: [], progress: [], grades: [] });
    }
  };

  const loadAssignmentsData = async () => {
    try {
      const response = await API.get("/submissions/me");

      let rawData = [];
      if (Array.isArray(response.data?.data?.submissions)) {
        rawData = response.data.data.submissions;
      } else if (Array.isArray(response.data?.data)) {
        rawData = response.data.data;
      } else if (Array.isArray(response.data?.submissions)) {
        rawData = response.data.submissions;
      } else if (Array.isArray(response.data)) {
        rawData = response.data;
      }

      const pending = rawData.filter((sub) =>
        ["not_started", "needs_resubmission"].includes(sub.status),
      ).length;

      const graded = rawData.filter(
        (sub) =>
          ["graded", "reviewed"].includes(sub.status) &&
          sub.score !== null &&
          sub.score !== undefined,
      );

      const averageGrade =
        graded.length > 0
          ? Math.round(
              graded.reduce((sum, sub) => {
                const maxScore = sub.assignment?.maxScore || 100;
                return sum + (sub.score / maxScore) * 100;
              }, 0) / graded.length,
            )
          : 0;

      setAssignmentsSummary({ pending, averageGrade });

      const deadlines = rawData
        .filter((sub) =>
          ["not_started", "needs_resubmission"].includes(sub.status),
        )
        .filter((sub) => sub.assignment?.deadline)
        .sort(
          (a, b) =>
            new Date(a.assignment.deadline) - new Date(b.assignment.deadline),
        )
        .slice(0, 5)
        .map((sub) => ({
          id: sub._id,
          title: sub.assignment?.title || "Untitled Assignment",
          date: new Date(sub.assignment.deadline).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          description: sub.assignment?.description || "",
          status:
            sub.status === "needs_resubmission"
              ? "Needs Resubmission"
              : "Not Started",
        }));

      setDerivedDeadlines(deadlines);

      const feedbackItems = rawData
        .filter((sub) => sub.feedback && sub.feedback.trim().length > 0)
        .sort(
          (a, b) => new Date(b.submittedAt || 0) - new Date(a.submittedAt || 0),
        )
        .slice(0, 5)
        .map((sub) => ({
          id: sub._id,
          title: sub.assignment?.title || "Untitled Assignment",
          score: sub.score,
          maxScore: sub.assignment?.maxScore || 100,
          feedback: sub.feedback,
          date: sub.submittedAt
            ? new Date(sub.submittedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })
            : "",
        }));

      setDerivedFeedback(feedbackItems);
    } catch (error) {
      console.error("Failed to load submissions for dashboard:", error);
      setAssignmentsSummary({ pending: 0, averageGrade: 0 });
      setDerivedDeadlines([]);
      setDerivedFeedback([]);
    }
  };

  const scoreTopics = (topicsMap) => {
    let totalScore = 0;
    let count = 0;

    Object.keys(topicsMap || {}).forEach((topicKey) => {
      const items = Array.isArray(topicsMap[topicKey])
        ? topicsMap[topicKey]
        : [topicsMap[topicKey]];

      items.forEach((item) => {
        count++;
        const status = item.status || "Not Started";
        if (status === "Completed") totalScore += 100;
        else if (status === "In Progress" || status === "Needs Help")
          totalScore += 50;
      });
    });

    return count > 0 ? Math.round(totalScore / count) : 0;
  };

  const loadLeaderboard = async () => {
    try {
      const [progressOverview, attendanceResponse, gradesResponse] =
        await Promise.all([
          getStudentProgress(),
          API.get("/attendance/my-batch").catch((err) => {
            console.error("Failed to load batch attendance:", err);
            return null;
          }),
          API.get("/submissions/my-batch-grades").catch((err) => {
            console.error("Failed to load batch grades:", err);
            return null;
          }),
        ]);

      const students = progressOverview?.students || [];

      const nameById = {};
      students.forEach((s) => {
        nameById[s.id] = { name: s.name, initials: s.initials };
      });

      // Progress ranking: recompute with the same 100/50/0 scoring used
      // elsewhere in the app (overallProgress uses a different,
      // completed-only formula server-side).
      const progressRanking = students
        .map((student) => ({
          id: student.id,
          name: student.name,
          value: scoreTopics(student.progressMap),
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);

      let attendanceRanking = [];

      if (attendanceResponse) {
        const records =
          attendanceResponse.data?.data?.attendance ||
          attendanceResponse.data?.attendance ||
          attendanceResponse.data?.data ||
          [];

        attendanceRanking = (Array.isArray(records) ? records : [])
          .map((record) => ({
            id: record.memberId,
            name: nameById[record.memberId]?.name || "Student",
            value: record.percentage,
          }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 5);
      }

      let gradesRanking = [];

      if (gradesResponse) {
        const grades =
          gradesResponse.data?.data?.grades ||
          gradesResponse.data?.grades ||
          gradesResponse.data?.data ||
          [];

        gradesRanking = (Array.isArray(grades) ? grades : [])
          .filter((entry) => entry.gradedCount > 0)
          .map((entry) => ({
            id: entry.memberId,
            name: nameById[entry.memberId]?.name || "Student",
            value: entry.percentage,
          }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 5);
      }

      setLeaderboard({
        attendance: attendanceRanking,
        progress: progressRanking,
        grades: gradesRanking,
      });

      // Self progress: overall % + per-topic summary, scored the same
      // reliable way as the leaderboard above.
      const selfStudent = students.find((s) => s.isSelf);

      if (selfStudent) {
        setSelfProgressPercent(scoreTopics(selfStudent.progressMap));

        const topicsMap = selfStudent.progressMap || {};
        const summary = Object.keys(topicsMap).map((topicKey) => {
          const items = Array.isArray(topicsMap[topicKey])
            ? topicsMap[topicKey]
            : [topicsMap[topicKey]];

          const percentage = scoreTopics({ [topicKey]: items });
          const hasNeedsHelp = items.some(
            (item) => item.status === "Needs Help",
          );

          let status = "Not Started";
          if (percentage === 100) status = "Completed";
          else if (hasNeedsHelp) status = "Needs Improvement";
          else if (percentage > 0) status = "In Progress";

          return {
            id: topicKey,
            topic: items[0]?.topic || topicKey,
            percentage,
            status,
          };
        });

        setProgressSummary(summary);
      }
    } catch (error) {
      console.error("Failed to load leaderboard/progress:", error);
      setLeaderboard({ attendance: [], progress: [], grades: [] });
    }
  };

  const loadAssignmentsData = async () => {
    try {
      const response = await API.get("/submissions/me");

      let rawData = [];
      if (Array.isArray(response.data?.data?.submissions)) {
        rawData = response.data.data.submissions;
      } else if (Array.isArray(response.data?.data)) {
        rawData = response.data.data;
      } else if (Array.isArray(response.data?.submissions)) {
        rawData = response.data.submissions;
      } else if (Array.isArray(response.data)) {
        rawData = response.data;
      }

      const pending = rawData.filter((sub) =>
        ["not_started", "needs_resubmission"].includes(sub.status),
      ).length;

      const graded = rawData.filter(
        (sub) =>
          ["graded", "reviewed"].includes(sub.status) &&
          sub.score !== null &&
          sub.score !== undefined,
      );

      // Average grade is measured against every assignment the student has
      // (rawData.length — one submission record exists per assignment,
      // confirmed by the `pending` filter above matching on "not_started"),
      // not just the ones that happen to be graded. An unsubmitted or
      // ungraded assignment counts as 0 toward the average instead of being
      // silently excluded from the denominator.
      const averageGrade =
        rawData.length > 0
          ? Math.round(
              graded.reduce((sum, sub) => {
                const maxScore = sub.assignment?.maxScore || 100;
                return sum + (sub.score / maxScore) * 100;
              }, 0) / rawData.length,
            )
          : 0;

      setAssignmentsSummary({ pending, averageGrade });

      const deadlines = rawData
        .filter((sub) =>
          ["not_started", "needs_resubmission"].includes(sub.status),
        )
        .filter((sub) => sub.assignment?.deadline)
        .sort(
          (a, b) =>
            new Date(a.assignment.deadline) - new Date(b.assignment.deadline),
        )
        .slice(0, 5)
        .map((sub) => ({
          id: sub._id,
          title: sub.assignment?.title || "Untitled Assignment",
          date: new Date(sub.assignment.deadline).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          description: sub.assignment?.description || "",
          status:
            sub.status === "needs_resubmission"
              ? "Needs Resubmission"
              : "Not Started",
        }));

      setDerivedDeadlines(deadlines);

      const feedbackItems = rawData
        .filter((sub) => sub.feedback && sub.feedback.trim().length > 0)
        .sort(
          (a, b) => new Date(b.submittedAt || 0) - new Date(a.submittedAt || 0),
        )
        .slice(0, 5)
        .map((sub) => ({
          id: sub._id,
          title: sub.assignment?.title || "Untitled Assignment",
          score: sub.score,
          maxScore: sub.assignment?.maxScore || 100,
          feedback: sub.feedback,
          date: sub.submittedAt
            ? new Date(sub.submittedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })
            : "",
        }));

      setDerivedFeedback(feedbackItems);
    } catch (error) {
      console.error("Failed to load submissions for dashboard:", error);
      setAssignmentsSummary({ pending: 0, averageGrade: 0 });
      setDerivedDeadlines([]);
      setDerivedFeedback([]);
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await API.get("/dashboard/overview");
        const resData = response.data;

        const payload =
          resData?.data?.data ||
          (resData?.success ? resData.data : null) ||
          resData?.data ||
          resData ||
          {};

        setDashboardData({
          student: payload.student || DEFAULT_DASHBOARD_DATA.student,
          announcements: Array.isArray(payload.announcements)
            ? payload.announcements
            : [],
        });
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchAttendanceHistory = async () => {
      try {
        const response = await API.get("/attendance/my-attendance");

        const data =
          response.data?.data?.attendanceData ||
          response.data?.attendanceData ||
          response.data?.data ||
          {};

        setAttendanceRecords(Array.isArray(data.records) ? data.records : []);
      } catch (err) {
        console.error("Failed to load attendance history:", err);
        setAttendanceRecords([]);
      }
    };

    fetchDashboardData();
    fetchAttendanceHistory();
    loadLeaderboard();
    loadAssignmentsData();
  }, []);

  const { student, announcements } = dashboardData;

  const cardStyle =
    "bg-surface border border-border rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-primary/50 hover:-translate-y-0.5 transition-all duration-200";

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const studentName =
    user?.name?.split(" ")[0] ||
    user?.firstName ||
    user?.fullName?.split(" ")[0] ||
    student?.firstName ||
    "Student";

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <p className="text-xs font-bold uppercase tracking-wider text-text-muted animate-pulse">
          Loading your dashboard...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-500 mb-3 border border-red-500/20">
          <FiAlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-text-primary mb-1">
          Could not load dashboard
        </h3>
        <p className="text-xs text-text-muted">{error}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-12 space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-xl sm:text-[28px] font-black text-text-primary tracking-tight">
          {getGreeting()}, {studentName}
        </h2>
        <p className="text-xs sm:text-sm text-text-muted mt-0.5">
          Here's an overview of your bootcamp progress.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={FiCalendar}
          title="Attendance"
          value={`${attendancePercent}%`}
          subtitle="Based on applicable sessions"
        />
        <StatCard
          icon={FiTrendingUp}
          title="Progress"
          value={`${selfProgressPercent}%`}
          subtitle="Across current topics"
        />
        <StatCard
          icon={FiClipboard}
          title="Assignments"
          value={assignmentsSummary.pending}
          subtitle="Pending"
        />
        <StatCard
          icon={FiStar}
          title="Average Grade"
          value={`${assignmentsSummary.averageGrade}%`}
          subtitle="From graded submissions"
        />
      </div>

      <div className={cardStyle}>
        <SectionHeader
          title="Attendance Overview"
          actionText="Full History"
          actionLink="/student/attendance"
        />
        <AttendanceQuickStats records={attendanceRecords} />
      </div>

      <div className={cardStyle}>
        <div className="mb-5">
          <h3 className="text-sm sm:text-base font-bold text-text-primary tracking-tight">
            Batch Leaderboard
          </h3>
          <p className="text-[11px] text-text-muted mt-0.5">
            Top 5 performers in your batch
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <LeaderboardCard
            title="Attendance"
            icon={FiCalendar}
            entries={leaderboard.attendance}
            accent={{ bg: "bg-primary/10", text: "text-primary" }}
          />
          <LeaderboardCard
            title="Progress"
            icon={FiTrendingUp}
            entries={leaderboard.progress}
            accent={{ bg: "bg-emerald-500/10", text: "text-emerald-500" }}
          />
          <LeaderboardCard
            title="Grades"
            icon={FiStar}
            entries={leaderboard.grades}
            accent={{ bg: "bg-amber-500/10", text: "text-amber-500" }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <div className={cardStyle}>
            <SectionHeader
              title="Progress Summary"
              actionText="View Progress"
              actionLink="/student/progress"
            />
            <div className="space-y-6">
              {progressSummary.length === 0 ? (
                <p className="text-xs text-text-muted text-center py-4">
                  No progress records found.
                </p>
              ) : (
                progressSummary.map((item, idx) => {
                  const topicKeyLower = (item.topic || "").toLowerCase();
                  const config =
                    TOPIC_ICON_MAP[topicKeyLower] || DEFAULT_TOPIC_CONFIG;
                  const TopicIcon = config.icon;

                  return (
                    <div
                      key={item.id || idx}
                      className="flex items-center gap-4"
                    >
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${config.iconBg} ${config.iconColor} shadow-2xs`}
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
                })
              )}
            </div>
          </div>

          <div className={cardStyle}>
            <SectionHeader
              title="Upcoming Deadlines"
              actionText="View Assignments"
              actionLink="/student/assignments"
            />
            <div className="space-y-3.5">
              {derivedDeadlines.length === 0 ? (
                <p className="text-xs text-text-muted text-center py-4">
                  No upcoming deadlines.
                </p>
              ) : (
                derivedDeadlines.map((deadline, idx) => (
                  <div
                    key={deadline.id || idx}
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
                            className={`text-[10px] font-bold uppercase tracking-wide font-mono ${
                              deadline.status === "In Progress"
                                ? "text-blue-500"
                                : "text-text-muted"
                            }`}
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
                ))
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className={cardStyle}>
            <SectionHeader
              title="Recent Announcements"
              actionText="View All"
              actionLink="/student/announcements"
            />
            <div className="space-y-4">
              {announcements.length === 0 ? (
                <p className="text-xs text-text-muted text-center py-4">
                  No announcements available.
                </p>
              ) : (
                announcements.map((announcement, idx) => (
                  <div
                    key={announcement.id || idx}
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
                ))
              )}
            </div>
          </div>

          <div className={cardStyle}>
            <SectionHeader
              title="Recent Feedback"
              actionText="View Submissions"
              actionLink="/student/submissions"
            />
            <div className="space-y-3.5">
              {derivedFeedback.length === 0 ? (
                <p className="text-xs text-text-muted text-center py-4">
                  No recent feedback recorded.
                </p>
              ) : (
                derivedFeedback.map((feedback, idx) => (
                  <div
                    key={feedback.id || idx}
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
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={cardStyle}>
        <SectionHeader
          title="Recent Activity"
          actionText="View All"
          actionLink="/student/announcements"
        />
        <ActivityTimeline
          announcements={announcements}
          deadlines={derivedDeadlines}
          feedback={derivedFeedback}
        />
      </div>
    </div>
  );
}
