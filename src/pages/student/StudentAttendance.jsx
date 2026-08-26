import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiInfo,
  FiArrowRight,
  FiChevronLeft,
  FiChevronRight,
  FiActivity,
  FiLayers,
  FiUser,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import API from "../../services/api";

const MENTOR_TYPES = [
  "weekly_meeting",
  "question_answer",
  "contest_review",
  "assignment_presentation",
];

const StatusBadge = ({ status }) => {
  let styles =
    "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border whitespace-nowrap ";
  if (status === "Present")
    styles += "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
  else if (status === "Absent")
    styles += "bg-rose-500/10 text-rose-500 border-rose-500/20";
  else if (status === "Late")
    styles += "bg-amber-500/10 text-amber-500 border-amber-500/20";
  else if (status === "Excused")
    styles += "bg-blue-500/10 text-blue-500 border-blue-500/20";
  else styles += "bg-surface-subtle text-text-muted border border-border";

  return <span className={styles}>{status}</span>;
};

const AttendanceTrendChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-48 mt-4 flex items-center justify-center border-2 border-dashed border-border rounded-xl">
        <span className="text-xs font-bold text-text-muted">
          No attendance data recorded yet
        </span>
      </div>
    );
  }

  const getX = (index) => {
    if (data.length === 1) return 440;
    return 80 + index * (720 / (data.length - 1));
  };

  const pointsString = data.map((p, i) => `${getX(i)},${p.y}`).join(" ");
  const startX = getX(0);
  const endX = getX(data.length - 1);
  const polygonPoints = `${startX},200 ${pointsString} ${endX},200`;

  return (
    <div className="relative w-full h-48 mt-4">
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
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="4 4"
              className="text-border"
              opacity="0.4"
            />
            <text
              x="30"
              y={y + 4}
              fill="currentColor"
              fontSize="11"
              textAnchor="end"
              className="font-mono text-text-muted"
            >
              {100 - i * 25}%
            </text>
          </g>
        ))}
        <defs>
          <linearGradient id="primaryGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={polygonPoints} fill="url(#primaryGradient)" />
        <polyline
          points={pointsString}
          fill="none"
          stroke="var(--primary)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {data.map((point, i) => {
          const xPos = getX(i);
          return (
            <g key={i}>
              <text
                x={xPos}
                y={point.y - 12}
                fill="currentColor"
                fontSize="11"
                textAnchor="middle"
                className="font-mono font-bold text-text-primary"
              >
                {point.value}%
              </text>
              <circle
                cx={xPos}
                cy={point.y}
                r="5"
                className="fill-surface stroke-primary transition-all hover:r-[6px] cursor-pointer"
                strokeWidth="2.5"
              />
              <text
                x={xPos}
                y="220"
                fill="currentColor"
                fontSize="11"
                textAnchor="middle"
                className="font-mono text-text-muted"
              >
                {point.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default function StudentAttendance() {
  const [loading, setLoading] = useState(true);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchMyAttendance = async () => {
      try {
        const res = await API.get("/attendance/my-attendance");
        const payloadData = res.data?.data?.attendanceData;

        let allRecords = [];

        if (Array.isArray(payloadData)) {
          allRecords = payloadData;
        } else if (payloadData && typeof payloadData === "object") {
          const arrayKey = Object.keys(payloadData).find((key) =>
            Array.isArray(payloadData[key]),
          );
          if (arrayKey) {
            allRecords = payloadData[arrayKey];
          }
        }

        const sortedRecords = allRecords.sort(
          (a, b) => new Date(b.date) - new Date(a.date),
        );
        setAttendanceRecords(sortedRecords);
      } catch (err) {
        console.error("Failed to fetch student attendance", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyAttendance();
  }, []);

  const totalSessions = attendanceRecords.length;
  let presentCount = 0,
    absentCount = 0,
    lateCount = 0,
    excusedCount = 0;
  let adminScore = 0,
    adminTotal = 0;
  let mentorScore = 0,
    mentorTotal = 0;
  let overallScore = 0;

  attendanceRecords.forEach((record) => {
    const status = record.status ? record.status.toLowerCase() : "";
    const isMentor = MENTOR_TYPES.includes(record.sessionType);

    if (status === "present") presentCount++;
    else if (status === "absent") absentCount++;
    else if (status === "late") lateCount++;
    else if (status === "excused") excusedCount++;

    let score = 0;
    if (status === "present") score = 1;
    else if (status === "late") score = 0.5;
    else if (status === "excused") score = 1;

    overallScore += score;

    if (isMentor) {
      mentorScore += score;
      mentorTotal++;
    } else {
      adminScore += score;
      adminTotal++;
    }
  });

  const calcPercent = (score, total) =>
    total === 0 ? 100 : Math.round((score / total) * 100);
  const calcRawPercent = (count, total) =>
    total === 0 ? 0 : Number(((count / total) * 100).toFixed(1));

  const overview = {
    percentage: calcPercent(overallScore, totalSessions),
    adminPercentage: calcPercent(adminScore, adminTotal),
    mentorPercentage: calcPercent(mentorScore, mentorTotal),
    attendedSessions: presentCount + lateCount + excusedCount,
    totalSessions: totalSessions,
    present: {
      count: presentCount,
      percentage: calcRawPercent(presentCount, totalSessions),
    },
    absent: {
      count: absentCount,
      percentage: calcRawPercent(absentCount, totalSessions),
    },
    late: {
      count: lateCount,
      percentage: calcRawPercent(lateCount, totalSessions),
    },
    excused: {
      count: excusedCount,
      percentage: calcRawPercent(excusedCount, totalSessions),
    },
  };

  const generateTrendData = (records) => {
    if (!records || records.length === 0) return [];

    const chronological = [...records].sort(
      (a, b) => new Date(a.date) - new Date(b.date),
    );

    let runningScore = 0;
    let runningTotal = 0;
    const cumulativeData = [];

    chronological.forEach((r) => {
      const stat = r.status ? r.status.toLowerCase() : "";
      if (stat === "present" || stat === "excused") runningScore += 1;
      else if (stat === "late") runningScore += 0.5;
      runningTotal += 1;

      const dateLabel = format(new Date(r.date), "MMM d");
      const currentPercent = Math.round((runningScore / runningTotal) * 100);
      const yPosition = 200 - (currentPercent / 100) * 150;

      if (
        cumulativeData.length > 0 &&
        cumulativeData[cumulativeData.length - 1].label === dateLabel
      ) {
        cumulativeData[cumulativeData.length - 1].value = currentPercent;
        cumulativeData[cumulativeData.length - 1].y = yPosition;
      } else {
        cumulativeData.push({
          label: dateLabel,
          value: currentPercent,
          y: yPosition,
        });
      }
    });

    return cumulativeData.length > 7
      ? cumulativeData.slice(-7)
      : cumulativeData;
  };

  const trendData = generateTrendData(attendanceRecords);

  const totalPages = Math.ceil(attendanceRecords.length / itemsPerPage) || 1;
  const currentRecords = attendanceRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // Shared modern card style
  const cardStyle =
    "bg-surface border border-border rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-primary/50 hover:-translate-y-0.5 transition-all duration-200";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 pb-12 px-4">
      <div
        className={`${cardStyle} flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5`}
      >
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight flex items-center gap-2">
            <FiActivity className="text-primary" /> My Attendance
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-0.5">
            Track your bootcamp participation and mentor session history.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
        <div
          className={`md:col-span-12 lg:col-span-5 ${cardStyle} p-6 flex flex-col justify-center`}
        >
          <h3 className="text-xs font-mono font-bold text-text-muted uppercase tracking-wider mb-6">
            Overall Health
          </h3>
          <div className="flex items-end gap-4 mb-6">
            <h4 className="text-4xl sm:text-5xl font-black text-text-primary leading-none font-mono">
              {overview.percentage}%
            </h4>
            <div className="pb-1">
              <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full font-mono">
                {overview.attendedSessions} / {overview.totalSessions} Sessions
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface-subtle border border-border rounded-xl p-4 flex flex-col justify-center shadow-2xs">
              <span className="flex items-center gap-1.5 font-mono font-bold uppercase tracking-wider text-[10px] text-text-muted mb-1">
                <FiLayers className="text-primary" /> Admin (Bootcamp)
              </span>
              <span className="text-2xl font-black text-text-primary font-mono">
                {overview.adminPercentage}%
              </span>
            </div>
            <div className="bg-surface-subtle border border-border rounded-xl p-4 flex flex-col justify-center shadow-2xs">
              <span className="flex items-center gap-1.5 font-mono font-bold uppercase tracking-wider text-[10px] text-text-muted mb-1">
                <FiUser className="text-primary" /> Mentor Sessions
              </span>
              <span className="text-2xl font-black text-text-primary font-mono">
                {overview.mentorPercentage}%
              </span>
            </div>
          </div>
        </div>

        <div className="md:col-span-12 lg:col-span-7 grid grid-cols-2 gap-4 sm:gap-6">
          <div
            className={`${cardStyle} p-5 sm:p-6 flex flex-col justify-center`}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 mb-4 shadow-2xs">
              <FiCheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="text-xs text-text-muted font-bold uppercase tracking-wider mb-1">
              Present
            </div>
            <div className="flex items-end gap-2 font-mono">
              <div className="text-2xl sm:text-3xl font-black text-text-primary leading-none">
                {overview.present.count}
              </div>
              <div className="text-xs text-emerald-500 font-bold pb-0.5">
                ({overview.present.percentage}%)
              </div>
            </div>
          </div>

          <div
            className={`${cardStyle} p-5 sm:p-6 flex flex-col justify-center`}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 mb-4 shadow-2xs">
              <FiXCircle className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="text-xs text-text-muted font-bold uppercase tracking-wider mb-1">
              Absent
            </div>
            <div className="flex items-end gap-2 font-mono">
              <div className="text-2xl sm:text-3xl font-black text-text-primary leading-none">
                {overview.absent.count}
              </div>
              <div className="text-xs text-rose-500 font-bold pb-0.5">
                ({overview.absent.percentage}%)
              </div>
            </div>
          </div>

          <div
            className={`${cardStyle} p-5 sm:p-6 flex flex-col justify-center`}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mb-4 shadow-2xs">
              <FiClock className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="text-xs text-text-muted font-bold uppercase tracking-wider mb-1">
              Late
            </div>
            <div className="flex items-end gap-2 font-mono">
              <div className="text-2xl sm:text-3xl font-black text-text-primary leading-none">
                {overview.late.count}
              </div>
              <div className="text-xs text-amber-500 font-bold pb-0.5">
                ({overview.late.percentage}%)
              </div>
            </div>
          </div>

          <div
            className={`${cardStyle} p-5 sm:p-6 flex flex-col justify-center`}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 mb-4 shadow-2xs">
              <FiInfo className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="text-xs text-text-muted font-bold uppercase tracking-wider mb-1">
              Excused
            </div>
            <div className="flex items-end gap-2 font-mono">
              <div className="text-2xl sm:text-3xl font-black text-text-primary leading-none">
                {overview.excused.count}
              </div>
              <div className="text-xs text-blue-500 font-bold pb-0.5">
                ({overview.excused.percentage}%)
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={cardStyle}>
        <h3 className="text-xs font-mono font-bold text-text-muted uppercase tracking-wider mb-2">
          Recent Performance Trend
        </h3>
        <AttendanceTrendChart data={trendData} />
      </div>

      <div className={`${cardStyle} overflow-hidden p-0!`}>
        <div className="p-5 border-b border-border bg-surface-subtle/50 flex items-center justify-between">
          <h3 className="text-xs font-mono font-bold text-text-muted uppercase tracking-wider">
            Session History
          </h3>
          <span className="text-xs font-bold text-text-muted font-mono">
            {totalSessions} Total Records
          </span>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-175">
            <thead>
              <tr className="bg-surface-subtle text-[11px] font-mono font-bold text-text-muted uppercase tracking-wider border-b border-border">
                <th className="px-5 py-3.5 w-[20%]">Date</th>
                <th className="px-5 py-3.5 w-[40%]">Session Details</th>
                <th className="px-5 py-3.5 w-[15%] text-center">Status</th>
                <th className="px-5 py-3.5 w-[25%]">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-xs sm:text-sm">
              {currentRecords.length > 0 ? (
                currentRecords.map((session, index) => {
                  const isMentor = MENTOR_TYPES.includes(session.sessionType);
                  const formattedDate = session.date
                    ? new Date(session.date)
                    : new Date();
                  const displayStatus = session.status
                    ? session.status.charAt(0).toUpperCase() +
                      session.status.slice(1)
                    : "Unknown";

                  return (
                    <tr
                      key={session._id || index}
                      className="hover:bg-surface-subtle/50 transition-colors"
                    >
                      <td className="px-5 py-4 font-mono">
                        <p className="text-xs sm:text-sm font-bold text-text-primary">
                          {format(formattedDate, "MMM d, yyyy")}
                        </p>
                        <p className="text-[11px] text-text-muted mt-0.5">
                          {format(formattedDate, "EEEE")}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-xs sm:text-sm font-bold text-text-primary">
                          {session.sessionTopic || "Untitled Session"}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span
                            className={`text-[9px] px-2 py-0.5 rounded-md uppercase font-mono font-bold tracking-wider border ${
                              isMentor
                                ? "bg-primary/10 text-primary border-primary/20"
                                : "bg-surface-subtle text-text-muted border-border"
                            }`}
                          >
                            {isMentor ? "Mentor Session" : "Admin Session"}
                          </span>
                          <span className="text-[11px] text-text-muted capitalize font-mono">
                            {session.sessionType?.replace("_", " ") ||
                              "Lecture"}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <StatusBadge status={displayStatus} />
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`text-xs sm:text-sm ${session.notes && session.notes.trim() !== "" ? "text-text-muted" : "text-text-muted/30"}`}
                        >
                          {session.notes && session.notes.trim() !== ""
                            ? session.notes
                            : "-"}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center py-12 text-xs text-text-muted"
                  >
                    You have no attendance records yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="border-t border-border px-6 py-4 flex items-center justify-center bg-surface-subtle/50">
            <div className="flex items-center gap-1.5 font-mono">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`flex h-8 w-8 items-center justify-center rounded-xl border transition-colors outline-none cursor-pointer ${
                  currentPage === 1
                    ? "bg-surface border-transparent text-text-muted/30 cursor-not-allowed"
                    : "border-border bg-surface text-text-muted hover:bg-surface-subtle hover:text-text-primary shadow-2xs"
                }`}
              >
                <FiChevronLeft className="h-4 w-4" />
              </button>

              <span className="text-xs font-bold text-text-muted px-2">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`flex h-8 w-8 items-center justify-center rounded-xl border transition-colors outline-none cursor-pointer ${
                  currentPage === totalPages
                    ? "bg-surface border-transparent text-text-muted/30 cursor-not-allowed"
                    : "border-border bg-surface text-text-muted hover:bg-surface-subtle hover:text-text-primary shadow-2xs"
                }`}
              >
                <FiChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
