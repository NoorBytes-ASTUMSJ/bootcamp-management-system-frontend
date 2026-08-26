import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiInfo,
  FiChevronLeft,
  FiChevronRight,
  FiActivity,
  FiLayers,
  FiUser,
} from "react-icons/fi";
import API from "../../services/api";

const MENTOR_TYPES = [
  "weekly_meeting",
  "question_answer",
  "contest_review",
  "assignment_presentation",
];

const StatusBadge = ({ status }) => {
  let styles =
    "px-2 py-0.5 rounded-md text-[11px] font-semibold border whitespace-nowrap ";
  if (status === "Present")
    styles += "bg-success/10 text-success border-success/20";
  else if (status === "Absent")
    styles += "bg-error/10 text-error border-error/20";
  else if (status === "Late")
    styles += "bg-warning/10 text-warning border-warning/20";
  else if (status === "Excused")
    styles += "bg-info/10 text-info border-info/20";
  else styles += "bg-surface-subtle text-muted border-border";

  return (
    <span className={styles}>
      {status === "Present"
        ? "Attended"
        : status === "Absent"
          ? "Missed"
          : status}
    </span>
  );
};

// Sleek, Shadcn-style CSS Bar Chart
const AttendanceTrendChart = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="w-full mt-2">
      <div className="flex items-end h-28 gap-2">
        {data.map((point, i) => (
          <div
            key={i}
            className="flex flex-col items-center flex-1 gap-1.5 group cursor-default"
          >
            <div className="relative w-full flex justify-center items-end h-20 bg-surface-subtle/50 rounded-md overflow-hidden">
              <div
                className="w-full bg-primary/40 group-hover:bg-primary transition-colors duration-300 rounded-t-sm"
                style={{ height: `${point.value}%` }}
              ></div>
              <span className="absolute bottom-1 opacity-0 group-hover:opacity-100 text-[10px] font-bold text-primary-foreground drop-shadow-md transition-opacity duration-300">
                {point.value}%
              </span>
            </div>
            <span className="text-[10px] text-muted font-medium truncate w-full text-center">
              {point.label}
            </span>
          </div>
        ))}
      </div>
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
    else if (status === "excused") score = 0.25;

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

      if (stat === "present") runningScore += 1;
      else if (stat === "late") runningScore += 0.5;
      else if (stat === "excused") runningScore += 0.25;

      runningTotal += 1;

      const dateLabel = format(new Date(r.date), "MMM d");
      const currentPercent = Math.round((runningScore / runningTotal) * 100);

      if (
        cumulativeData.length > 0 &&
        cumulativeData[cumulativeData.length - 1].label === dateLabel
      ) {
        cumulativeData[cumulativeData.length - 1].value = currentPercent;
      } else {
        cumulativeData.push({
          label: dateLabel,
          value: currentPercent,
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
    <div className="max-w-6xl mx-auto space-y-5 animate-in fade-in duration-500 pb-10 px-4">
      {/* Header */}
      <div className="flex flex-col gap-1 mb-6 mt-4">
        <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
          <FiActivity className="text-primary" /> Attendance Overview
        </h1>
        <p className="text-sm text-muted">
          Monitor your bootcamp participation and cumulative performance
          metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Overall Health */}
        <div className="lg:col-span-4 bg-surface border border-border rounded-xl p-5 shadow-sm flex flex-col justify-between hover:-translate-y-0.5 hover:shadow-md hover:border-primary/30 transition-all duration-300">
          <div>
            <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">
              Cumulative Performance
            </h3>
            <div className="flex items-end gap-3 mb-6">
              <h4 className="text-4xl font-bold text-foreground leading-none">
                {overview.percentage}%
              </h4>
              <div className="pb-1">
                <span className="text-xs font-medium text-success bg-success/10 border border-success/20 px-2 py-1 rounded-md">
                  {overview.attendedSessions} / {overview.totalSessions} Logged
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-auto">
            <div className="bg-surface-subtle border border-border rounded-lg p-3">
              <span className="flex items-center gap-1.5 font-semibold text-[10px] text-muted mb-1">
                <FiLayers className="text-primary w-3 h-3" /> BOOTCAMP SESSIONS
              </span>
              <span className="text-lg font-bold text-foreground">
                {overview.adminPercentage}%
              </span>
            </div>
            <div className="bg-surface-subtle border border-border rounded-lg p-3">
              <span className="flex items-center gap-1.5 font-semibold text-[10px] text-muted mb-1">
                <FiUser className="text-primary w-3 h-3" /> MENTOR SYNCS
              </span>
              <span className="text-lg font-bold text-foreground">
                {overview.mentorPercentage}%
              </span>
            </div>
          </div>
        </div>

        {/* 4 Status Cards + Graph Side-by-side */}
        <div className="lg:col-span-8 flex flex-col gap-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-surface border border-border shadow-sm rounded-xl p-4 flex flex-col hover:-translate-y-0.5 hover:shadow-md hover:border-success/30 transition-all duration-300">
              <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center text-success mb-3">
                <FiCheckCircle className="w-4 h-4" />
              </div>
              <div className="text-xs text-muted font-medium mb-1">
                Attended
              </div>
              <div className="flex items-baseline gap-2">
                <div className="text-2xl font-bold text-foreground leading-none">
                  {overview.present.count}
                </div>
                <div className="text-[10px] text-success font-medium">
                  ({overview.present.percentage}%)
                </div>
              </div>
            </div>

            <div className="bg-surface border border-border shadow-sm rounded-xl p-4 flex flex-col hover:-translate-y-0.5 hover:shadow-md hover:border-error/30 transition-all duration-300">
              <div className="w-8 h-8 rounded-full bg-error/10 flex items-center justify-center text-error mb-3">
                <FiXCircle className="w-4 h-4" />
              </div>
              <div className="text-xs text-muted font-medium mb-1">Missed</div>
              <div className="flex items-baseline gap-2">
                <div className="text-2xl font-bold text-foreground leading-none">
                  {overview.absent.count}
                </div>
                <div className="text-[10px] text-error font-medium">
                  ({overview.absent.percentage}%)
                </div>
              </div>
            </div>

            <div className="bg-surface border border-border shadow-sm rounded-xl p-4 flex flex-col hover:-translate-y-0.5 hover:shadow-md hover:border-warning/30 transition-all duration-300">
              <div className="w-8 h-8 rounded-full bg-warning/10 flex items-center justify-center text-warning mb-3">
                <FiClock className="w-4 h-4" />
              </div>
              <div className="text-xs text-muted font-medium mb-1">Late</div>
              <div className="flex items-baseline gap-2">
                <div className="text-2xl font-bold text-foreground leading-none">
                  {overview.late.count}
                </div>
                <div className="text-[10px] text-warning font-medium">
                  ({overview.late.percentage}%)
                </div>
              </div>
            </div>

            <div className="bg-surface border border-border shadow-sm rounded-xl p-4 flex flex-col hover:-translate-y-0.5 hover:shadow-md hover:border-info/30 transition-all duration-300">
              <div className="w-8 h-8 rounded-full bg-info/10 flex items-center justify-center text-info mb-3">
                <FiInfo className="w-4 h-4" />
              </div>
              <div className="text-xs text-muted font-medium mb-1">Excused</div>
              <div className="flex items-baseline gap-2">
                <div className="text-2xl font-bold text-foreground leading-none">
                  {overview.excused.count}
                </div>
                <div className="text-[10px] text-info font-medium">
                  ({overview.excused.percentage}%)
                </div>
              </div>
            </div>
          </div>

          {/* Clean Bar Chart */}
          {trendData.length > 0 && (
            <div className="bg-surface border border-border rounded-xl p-4 shadow-sm flex-1 hover:-translate-y-0.5 hover:shadow-md hover:border-primary/30 transition-all duration-300">
              <h3 className="text-xs font-semibold text-muted uppercase tracking-wider">
                Recent Trajectory
              </h3>
              <AttendanceTrendChart data={trendData} />
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-sm hover:-translate-y-0.5 hover:shadow-md hover:border-primary/30 transition-all duration-300">
        <div className="px-5 py-4 border-b border-border bg-surface-subtle/30 flex items-center justify-between">
          <h3 className="text-xs font-semibold text-muted uppercase tracking-wider">
            Detailed Attendance Log
          </h3>
          <span className="text-xs font-medium text-muted">
            {totalSessions} Total Records
          </span>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-162.5">
            <thead>
              <tr className="bg-surface-subtle/50 text-xs font-semibold text-muted border-b border-border">
                <th className="px-4 py-3 w-[20%] font-medium">Date</th>
                <th className="px-4 py-3 w-[40%] font-medium">
                  Session Context
                </th>
                <th className="px-4 py-3 w-[15%] text-center font-medium">
                  Status
                </th>
                <th className="px-4 py-3 w-[25%] font-medium">
                  Instructor Notes
                </th>
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
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-foreground">
                          {format(formattedDate, "MMM d, yyyy")}
                        </p>
                        <p className="text-xs text-muted mt-0.5">
                          {format(formattedDate, "EEEE")}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-foreground">
                          {session.sessionTopic || "Untitled Session"}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded font-semibold tracking-wider border ${
                              isMentor
                                ? "bg-primary/10 text-primary border-primary/20"
                                : "bg-surface-muted text-muted border-border"
                            }`}
                          >
                            {isMentor ? "MENTOR" : "BOOTCAMP"}
                          </span>
                          <span className="text-[11px] text-muted capitalize">
                            {session.sessionType?.replace("_", " ") ||
                              "Lecture"}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <StatusBadge status={displayStatus} />
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-sm ${session.notes && session.notes.trim() !== "" ? "text-muted" : "text-muted/40"}`}
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
                    No attendance records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="border-t border-border px-4 py-3 flex items-center justify-center bg-surface-subtle/20">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`flex h-7 w-7 items-center justify-center rounded border transition-colors outline-none ${
                  currentPage === 1
                    ? "bg-transparent border-transparent text-muted/30 cursor-not-allowed"
                    : "border-border bg-surface text-muted hover:bg-surface-subtle hover:text-foreground"
                }`}
              >
                <FiChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-xs font-medium text-muted px-2">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`flex h-7 w-7 items-center justify-center rounded border transition-colors outline-none ${
                  currentPage === totalPages
                    ? "bg-transparent border-transparent text-muted/30 cursor-not-allowed"
                    : "border-border bg-surface text-muted hover:bg-surface-subtle hover:text-foreground"
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
