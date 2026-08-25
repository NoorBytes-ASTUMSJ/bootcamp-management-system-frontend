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
    "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border whitespace-nowrap ";
  if (status === "Present")
    styles += "bg-success/10 text-success border-success/20";
  else if (status === "Absent")
    styles += "bg-error/10 text-error border-error/20";
  else if (status === "Late")
    styles += "bg-warning/10 text-warning border-warning/20";
  else if (status === "Excused")
    styles += "bg-info/10 text-info border-info/20";
  else styles += "bg-surface-subtle text-muted border-border";

  return <span className={styles}>{status}</span>;
};

const AttendanceTrendChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-48 mt-4 flex items-center justify-center border-2 border-dashed border-border rounded-xl">
        <span className="text-sm font-bold text-muted">
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
              stroke="var(--border, #374151)"
              strokeWidth="1"
              strokeDasharray="4 4"
              opacity="0.3"
            />
            <text
              x="30"
              y={y + 4}
              fill="var(--text-muted, #9CA3AF)"
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
            <stop
              offset="0%"
              stopColor="var(--primary, #3B82F6)"
              stopOpacity="0.2"
            />
            <stop
              offset="100%"
              stopColor="var(--primary, #3B82F6)"
              stopOpacity="0"
            />
          </linearGradient>
        </defs>
        <polygon points={polygonPoints} fill="url(#primaryGradient)" />
        <polyline
          points={pointsString}
          fill="none"
          stroke="var(--primary, #3B82F6)"
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
                y={point.y - 15}
                fill="var(--foreground, #F9FAFB)"
                fontSize="12"
                textAnchor="middle"
                className="font-bold"
              >
                {point.value}%
              </text>
              <circle
                cx={xPos}
                cy={point.y}
                r="5"
                fill="var(--surface, #111827)"
                stroke="var(--primary, #3B82F6)"
                strokeWidth="2.5"
                className="transition-all hover:r-[6px] cursor-pointer"
              />
              <text
                x={xPos}
                y="220"
                fill="var(--text-muted, #9CA3AF)"
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 pb-10 px-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-surface border border-border p-5 rounded-2xl shadow-sm">
        <div>
          <h1 className="text-2xl sm:text-[26px] font-bold text-foreground tracking-tight flex items-center gap-2">
            <FiActivity className="text-primary" /> My Attendance
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-1">
            Track your bootcamp participation and mentor session history.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
        <div className="md:col-span-12 lg:col-span-5 bg-surface border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-center">
          <h3 className="text-xs font-black text-muted uppercase tracking-widest mb-6">
            Overall Health
          </h3>
          <div className="flex items-end gap-4 mb-6">
            <h4 className="text-[48px] font-black text-foreground leading-none">
              {overview.percentage}%
            </h4>
            <div className="pb-2">
              <span className="text-sm font-bold text-success bg-success/10 border border-success/20 px-2 py-1 rounded-md">
                {overview.attendedSessions} / {overview.totalSessions} Sessions
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface-subtle border border-border rounded-xl p-4 flex flex-col justify-center">
              <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px] text-muted mb-1">
                <FiLayers className="text-primary" /> Admin (Bootcamp)
              </span>
              <span className="text-2xl font-black text-foreground">
                {overview.adminPercentage}%
              </span>
            </div>
            <div className="bg-surface-subtle border border-border rounded-xl p-4 flex flex-col justify-center">
              <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px] text-muted mb-1">
                <FiUser className="text-primary" /> Mentor Sessions
              </span>
              <span className="text-2xl font-black text-foreground">
                {overview.mentorPercentage}%
              </span>
            </div>
          </div>
        </div>

        <div className="md:col-span-12 lg:col-span-7 grid grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-surface border border-border shadow-sm rounded-2xl p-5 sm:p-6 flex flex-col justify-center hover:border-border-strong transition-colors">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-success/10 flex items-center justify-center text-success mb-4">
              <FiCheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="text-xs sm:text-sm text-muted font-bold uppercase tracking-wider mb-1">
              Present
            </div>
            <div className="flex items-end gap-2">
              <div className="text-2xl sm:text-3xl font-black text-foreground leading-none">
                {overview.present.count}
              </div>
              <div className="text-xs text-success font-bold pb-0.5">
                ({overview.present.percentage}%)
              </div>
            </div>
          </div>

          <div className="bg-surface border border-border shadow-sm rounded-2xl p-5 sm:p-6 flex flex-col justify-center hover:border-border-strong transition-colors">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-error/10 flex items-center justify-center text-error mb-4">
              <FiXCircle className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="text-xs sm:text-sm text-muted font-bold uppercase tracking-wider mb-1">
              Absent
            </div>
            <div className="flex items-end gap-2">
              <div className="text-2xl sm:text-3xl font-black text-foreground leading-none">
                {overview.absent.count}
              </div>
              <div className="text-xs text-error font-bold pb-0.5">
                ({overview.absent.percentage}%)
              </div>
            </div>
          </div>

          <div className="bg-surface border border-border shadow-sm rounded-2xl p-5 sm:p-6 flex flex-col justify-center hover:border-border-strong transition-colors">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-warning/10 flex items-center justify-center text-warning mb-4">
              <FiClock className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="text-xs sm:text-sm text-muted font-bold uppercase tracking-wider mb-1">
              Late
            </div>
            <div className="flex items-end gap-2">
              <div className="text-2xl sm:text-3xl font-black text-foreground leading-none">
                {overview.late.count}
              </div>
              <div className="text-xs text-warning font-bold pb-0.5">
                ({overview.late.percentage}%)
              </div>
            </div>
          </div>

          <div className="bg-surface border border-border shadow-sm rounded-2xl p-5 sm:p-6 flex flex-col justify-center hover:border-border-strong transition-colors">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-info/10 flex items-center justify-center text-info mb-4">
              <FiInfo className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="text-xs sm:text-sm text-muted font-bold uppercase tracking-wider mb-1">
              Excused
            </div>
            <div className="flex items-end gap-2">
              <div className="text-2xl sm:text-3xl font-black text-foreground leading-none">
                {overview.excused.count}
              </div>
              <div className="text-xs text-info font-bold pb-0.5">
                ({overview.excused.percentage}%)
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
        <h3 className="text-xs font-black text-muted uppercase tracking-widest mb-2">
          Recent Performance Trend
        </h3>
        <AttendanceTrendChart data={trendData} />
      </div>

      <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-border bg-surface-subtle/30 flex items-center justify-between">
          <h3 className="text-xs font-black text-muted uppercase tracking-widest">
            Session History
          </h3>
          <span className="text-xs font-bold text-muted">
            {totalSessions} Total Records
          </span>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-175">
            <thead>
              <tr className="bg-surface-subtle/50 text-[10px] font-black text-muted uppercase tracking-widest border-b border-border">
                <th className="px-5 py-4 w-[20%]">Date</th>
                <th className="px-5 py-4 w-[40%]">Session Details</th>
                <th className="px-5 py-4 w-[15%] text-center">Status</th>
                <th className="px-5 py-4 w-[25%]">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
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
                      className="hover:bg-surface-subtle/30 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <p className="text-sm font-bold text-foreground">
                          {format(formattedDate, "MMM d, yyyy")}
                        </p>
                        <p className="text-xs text-muted font-medium mt-0.5">
                          {format(formattedDate, "EEEE")}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm font-bold text-foreground">
                          {session.sessionTopic || "Untitled Session"}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-black tracking-wider border ${
                              isMentor
                                ? "bg-primary/10 text-primary border-primary/20"
                                : "bg-surface text-muted border-border"
                            }`}
                          >
                            {isMentor ? "Mentor Session" : "Admin Session"}
                          </span>
                          <span className="text-[10px] text-muted capitalize">
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
                          className={`text-sm ${session.notes && session.notes.trim() !== "" ? "text-muted" : "text-border-strong"}`}
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
                    className="text-center py-8 text-sm text-muted"
                  >
                    You have no attendance records yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="border-t border-border px-6 py-4 flex items-center justify-center bg-surface-subtle/20">
            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-colors outline-none ${
                  currentPage === 1
                    ? "bg-surface border-transparent text-muted/30 cursor-not-allowed"
                    : "border-border bg-surface text-muted hover:bg-surface-subtle hover:text-foreground focus:ring-2 focus:ring-primary/20"
                }`}
              >
                <FiChevronLeft className="h-4 w-4" />
              </button>

              <span className="text-xs font-bold text-muted px-2">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-colors outline-none ${
                  currentPage === totalPages
                    ? "bg-surface border-transparent text-muted/30 cursor-not-allowed"
                    : "border-border bg-surface text-muted hover:bg-surface-subtle hover:text-foreground focus:ring-2 focus:ring-primary/20"
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
