import React, { useState, useEffect, useRef } from "react";
import AdminSidebar from "../../components/layout/AdminSidebar";
import { getAttendanceOverview } from "../../services/attendanceService";
import {
  Calendar,
  Download,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  Search,
  ChevronDown,
  RotateCcw,
  Bell,
  User,
  Moon,
  Sun,
  LogOut,
  Check,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Pencil,
  Trash2,
} from "lucide-react";

export default function AttendanceManagement({
  isDarkMode,
  onToggleTheme,
  onNavigateAdminView,
  onLogout,
}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [batchFilter, setBatchFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sessionFilter, setSessionFilter] = useState("ALL");

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const overview = await getAttendanceOverview();
      setData(overview);
      setLoading(false);
    }
    loadData();
  }, []);

  const handleResetFilters = () => {
    setSearchTerm("");
    setBatchFilter("ALL");
    setStatusFilter("ALL");
    setSessionFilter("ALL");
  };

  const handleDeleteRecord = (id) => {
    if (!data) return;
    const updated = data.records.filter((r) => r.id !== id);
    setData({ ...data, records: updated });
  };

  const records = data?.records || [];

  const availableBatches = [
    ...new Set(records.map((r) => r.batch).filter(Boolean)),
  ];
  const availableStatuses = [
    ...new Set(records.map((r) => r.status).filter(Boolean)),
  ];
  const availableSessions = [
    ...new Set(records.map((r) => r.session).filter(Boolean)),
  ];

  const filteredRecords = records.filter((r) => {
    const q = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !q ||
      r.studentName.toLowerCase().includes(q) ||
      r.studentId.toLowerCase().includes(q);
    const matchesBatch = batchFilter === "ALL" || r.batch === batchFilter;
    const matchesStatus = statusFilter === "ALL" || r.status === statusFilter;
    const matchesSession =
      sessionFilter === "ALL" || r.session === sessionFilter;

    return matchesSearch && matchesBatch && matchesStatus && matchesSession;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "Present":
        return (
          <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/40">
            Present
          </span>
        );
      case "Absent":
        return (
          <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-medium bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 border border-rose-200/50 dark:border-rose-800/40">
            Absent
          </span>
        );
      case "Late":
        return (
          <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-medium bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-300 border border-amber-200/50 dark:border-amber-800/40">
            Late
          </span>
        );
      case "Excused":
        return (
          <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-medium bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-300 border border-sky-200/50 dark:border-sky-800/40">
            Excused
          </span>
        );
      default:
        return null;
    }
  };

  const getBatchBadgeColor = (batch) => {
    switch (batch) {
      case "Batch 1":
        return "bg-rose-50 text-rose-600 border-rose-200/60 dark:bg-rose-950/30 dark:text-rose-300 dark:border-rose-900/40";
      case "Batch 2":
        return "bg-sky-50 text-sky-600 border-sky-200/60 dark:bg-sky-950/30 dark:text-sky-300 dark:border-sky-900/40";
      default:
        return "bg-neutral-50 text-neutral-600 border-neutral-200/60 dark:bg-neutral-800 dark:text-neutral-300";
    }
  };

  return (
    <div className="w-full font-sans bg-[#FAFBFC] dark:bg-[#0E1117] text-neutral-900 dark:text-neutral-100 transition-colors">
      <div className="flex-1 flex flex-col min-w-0">
        {/* Content Body */}
        <main className="px-8 py-6 space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-24 gap-2 text-xs text-neutral-500">
              <Loader2 className="animate-spin text-[#B91C1C]" size={18} />
              <span>Loading attendance data...</span>
            </div>
          ) : (
            <>
              {/* Header Title + Action Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#B91C1C] flex items-center justify-center text-white shrink-0 shadow-sm">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
                      Attendance
                    </h2>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                      Monitor and analyze attendance across all batches and
                      students.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#151921] hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-medium text-[#B91C1C] transition-all cursor-pointer shadow-xs hover:border-[#B91C1C]/40">
                    <Download size={13} className="text-[#B91C1C]" />
                    <span>Export Report</span>
                  </button>
                </div>
              </div>

              {/* 5 Top Metric Cards with Modern Hover Effect */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* 1. Overall Attendance */}
                <div className="p-5 rounded-2xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-md shadow-neutral-200/50 dark:shadow-none flex items-center justify-between transition-all duration-300 hover:border-[#B91C1C]/50 hover:-translate-y-1">
                  <div>
                    <span className="text-[11px] font-medium text-neutral-500 block mb-1">
                      Overall Attendance
                    </span>
                    <div className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
                      {data?.summary?.overallAttendance || "78.6%"}
                    </div>
                    <span className="text-[10px] text-emerald-600 font-medium block mt-1">
                      ▲ 5.4% from last week
                    </span>
                  </div>
                  <div className="relative w-11 h-11 shrink-0">
                    <svg
                      className="w-full h-full transform -rotate-90"
                      viewBox="0 0 36 36"
                    >
                      <path
                        className="text-neutral-100 dark:text-neutral-800 stroke-current"
                        strokeWidth="3.5"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-[#B91C1C] stroke-current"
                        strokeDasharray="78.6, 100"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                  </div>
                </div>

                {/* 2. Present */}
                <div className="p-5 rounded-2xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-md shadow-neutral-200/50 dark:shadow-none flex items-center justify-between transition-all duration-300 hover:border-[#B91C1C]/50 hover:-translate-y-1">
                  <div>
                    <span className="text-[11px] font-medium text-neutral-500 block mb-1">
                      Present
                    </span>
                    <div className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
                      {data?.summary?.counts?.present || 842}
                    </div>
                    <span className="text-[10px] text-emerald-600 font-medium block mt-1">
                      {data?.summary?.counts?.presentPct || "59.1%"}
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-500">
                    <CheckCircle2 size={18} />
                  </div>
                </div>

                {/* 3. Absent */}
                <div className="p-5 rounded-2xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-md shadow-neutral-200/50 dark:shadow-none flex items-center justify-between transition-all duration-300 hover:border-[#B91C1C]/50 hover:-translate-y-1">
                  <div>
                    <span className="text-[11px] font-medium text-neutral-500 block mb-1">
                      Absent
                    </span>
                    <div className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
                      {data?.summary?.counts?.absent || 416}
                    </div>
                    <span className="text-[10px] text-rose-600 font-medium block mt-1">
                      {data?.summary?.counts?.absentPct || "29.2%"}
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center text-rose-500">
                    <XCircle size={18} />
                  </div>
                </div>

                {/* 4. Late */}
                <div className="p-5 rounded-2xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-md shadow-neutral-200/50 dark:shadow-none flex items-center justify-between transition-all duration-300 hover:border-[#B91C1C]/50 hover:-translate-y-1">
                  <div>
                    <span className="text-[11px] font-medium text-neutral-500 block mb-1">
                      Late
                    </span>
                    <div className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
                      {data?.summary?.counts?.late || 124}
                    </div>
                    <span className="text-[10px] text-amber-600 font-medium block mt-1">
                      {data?.summary?.counts?.latePct || "8.7%"}
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center text-amber-500">
                    <Clock size={18} />
                  </div>
                </div>

                {/* 5. Excused */}
                <div className="p-5 rounded-2xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-md shadow-neutral-200/50 dark:shadow-none flex items-center justify-between transition-all duration-300 hover:border-[#B91C1C]/50 hover:-translate-y-1">
                  <div>
                    <span className="text-[11px] font-medium text-neutral-500 block mb-1">
                      Excused
                    </span>
                    <div className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
                      {data?.summary?.counts?.excused || 46}
                    </div>
                    <span className="text-[10px] text-sky-600 font-medium block mt-1">
                      {data?.summary?.counts?.excusedPct || "3.2%"}
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/40 flex items-center justify-center text-sky-500">
                    <FileText size={18} />
                  </div>
                </div>
              </div>

              {/* Middle Section: Full-Width Attendance by Status Card */}
              <div className="p-6 rounded-2xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-md shadow-neutral-200/50 dark:shadow-none transition-all duration-300">
                <h3 className="font-bold text-xs text-neutral-900 dark:text-white tracking-tight mb-5">
                  Attendance by Status
                </h3>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-10 sm:gap-20 py-2">
                  {/* Multi-color Donut Graphic */}
                  <div className="relative w-44 h-44 shrink-0">
                    <svg
                      className="w-full h-full transform -rotate-90"
                      viewBox="0 0 36 36"
                    >
                      <path
                        className="text-neutral-100 dark:text-neutral-800 stroke-current"
                        strokeWidth="4"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-[#10B981] stroke-current"
                        strokeDasharray="59.1, 100"
                        strokeWidth="4"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-[#DC2626] stroke-current"
                        strokeDasharray="29.2, 100"
                        strokeDashoffset="-59.1"
                        strokeWidth="4"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-[#F59E0B] stroke-current"
                        strokeDasharray="8.7, 100"
                        strokeDashoffset="-88.3"
                        strokeWidth="4"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-[#0EA5E9] stroke-current"
                        strokeDasharray="3.2, 100"
                        strokeDashoffset="-97"
                        strokeWidth="4"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                  </div>

                  {/* Legend Breakdown */}
                  <div className="w-full sm:w-64 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-2.5 text-neutral-600 dark:text-neutral-400">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                        Present
                      </span>
                      <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                        59.1% (842)
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-2.5 text-neutral-600 dark:text-neutral-400">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626]" />
                        Absent
                      </span>
                      <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                        29.2% (416)
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-2.5 text-neutral-600 dark:text-neutral-400">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                        Late
                      </span>
                      <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                        8.7% (124)
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-2.5 text-neutral-600 dark:text-neutral-400">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#0EA5E9]" />
                        Excused
                      </span>
                      <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                        3.2% (46)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Search & Filter Bar */}
              <div className="p-4 bg-white dark:bg-[#151921] rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-md shadow-neutral-200/50 dark:shadow-none transition-all duration-300 hover:border-[#B91C1C]/40">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex-1 min-w-[200px] relative">
                    <Search
                      size={13}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
                    />
                    <input
                      type="text"
                      placeholder="Search by student name or ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2 rounded-xl text-xs bg-neutral-50/50 dark:bg-[#0E1117] border border-neutral-200/80 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 placeholder:text-neutral-400 focus:outline-none focus:border-[#B91C1C] transition-colors shadow-xs"
                    />
                  </div>

                  <div className="relative">
                    <select
                      value={batchFilter}
                      onChange={(e) => setBatchFilter(e.target.value)}
                      className="appearance-none pl-3.5 pr-8 py-2 rounded-xl text-xs bg-white dark:bg-[#0E1117] border border-neutral-200/80 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 focus:outline-none focus:border-[#B91C1C] cursor-pointer shadow-xs font-medium"
                    >
                      <option value="ALL">All Batches</option>
                      {availableBatches.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={12}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
                    />
                  </div>

                  <div className="relative">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="appearance-none pl-3.5 pr-8 py-2 rounded-xl text-xs bg-white dark:bg-[#0E1117] border border-neutral-200/80 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 focus:outline-none focus:border-[#B91C1C] cursor-pointer shadow-xs font-medium"
                    >
                      <option value="ALL">All Status</option>
                      {availableStatuses.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={12}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
                    />
                  </div>

                  <div className="relative">
                    <select
                      value={sessionFilter}
                      onChange={(e) => setSessionFilter(e.target.value)}
                      className="appearance-none pl-3.5 pr-8 py-2 rounded-xl text-xs bg-white dark:bg-[#0E1117] border border-neutral-200/80 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 focus:outline-none focus:border-[#B91C1C] cursor-pointer shadow-xs font-medium"
                    >
                      <option value="ALL">All Sessions</option>
                      {availableSessions.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={12}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs bg-white dark:bg-[#0E1117] border border-neutral-200/80 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 hover:text-[#B91C1C] transition-colors cursor-pointer shadow-xs font-medium"
                  >
                    <RotateCcw size={12} />
                    <span>Reset Filters</span>
                  </button>
                </div>
              </div>

              {/* Records Table */}
              <div className="bg-white dark:bg-[#151921] rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 overflow-hidden shadow-md shadow-neutral-200/50 dark:shadow-none transition-all duration-300">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                        <th className="py-3.5 px-5 w-10">#</th>
                        <th className="py-3.5 px-5">STUDENT</th>
                        <th className="py-3.5 px-5">BATCH</th>
                        <th className="py-3.5 px-5">DATE</th>
                        <th className="py-3.5 px-5">SESSION</th>
                        <th className="py-3.5 px-5">STATUS</th>
                        <th className="py-3.5 px-5">MARKED BY</th>
                        <th className="py-3.5 px-5">ATTENDANCE %</th>
                        <th className="py-3.5 px-5 text-right">ACTION</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
                      {filteredRecords.length === 0 ? (
                        <tr>
                          <td
                            colSpan={9}
                            className="text-center py-12 text-neutral-400 text-xs"
                          >
                            No attendance records found.
                          </td>
                        </tr>
                      ) : (
                        filteredRecords.map((r, index) => (
                          <tr
                            key={r.id}
                            className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/50 transition-colors"
                          >
                            <td className="py-4 px-5 text-neutral-400 font-medium">
                              {index + 1}
                            </td>

                            <td className="py-4 px-5">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center font-bold text-[10px] shrink-0 text-neutral-500 dark:text-neutral-400">
                                  {r.initials}
                                </div>
                                <div>
                                  <span className="font-semibold text-neutral-900 dark:text-neutral-100 block leading-snug">
                                    {r.studentName}
                                  </span>
                                  <span className="text-[10px] text-neutral-400 mt-0.5 block">
                                    {r.studentId}
                                  </span>
                                </div>
                              </div>
                            </td>

                            <td className="py-4 px-5">
                              <span
                                className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-medium border ${getBatchBadgeColor(
                                  r.batch,
                                )}`}
                              >
                                {r.batch}
                              </span>
                            </td>

                            <td className="py-4 px-5 text-neutral-600 dark:text-neutral-400 text-xs">
                              {r.date}
                            </td>

                            <td className="py-4 px-5 text-neutral-600 dark:text-neutral-400 text-xs">
                              {r.session}
                            </td>

                            <td className="py-4 px-5">
                              {getStatusBadge(r.status)}
                            </td>

                            <td className="py-4 px-5 text-neutral-600 dark:text-neutral-400 text-xs">
                              {r.markedBy}
                            </td>

                            <td className="py-4 px-5 font-semibold text-neutral-700 dark:text-neutral-300 text-xs">
                              {r.attendanceRate}
                            </td>

                            <td className="py-4 px-5 text-right">
                              <div className="flex items-center justify-end gap-1.5 text-neutral-400">
                                <button
                                  type="button"
                                  title="Edit"
                                  onClick={() =>
                                    onNavigateAdminView &&
                                    onNavigateAdminView("dashboard-students")
                                  }
                                  className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 flex items-center justify-center hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-[#B91C1C] transition-colors cursor-pointer"
                                >
                                  <Pencil size={12} />
                                </button>
                                <button
                                  type="button"
                                  title="Delete"
                                  onClick={() => handleDeleteRecord(r.id)}
                                  className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 flex items-center justify-center hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-[#B91C1C] transition-colors cursor-pointer"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Footer */}
                <div className="px-5 py-3.5 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400 bg-neutral-50/30 dark:bg-neutral-800/20">
                  <span>
                    Showing 1 to {filteredRecords.length} of 124 entries
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button className="w-6 h-6 rounded flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 cursor-pointer transition-colors">
                      <ChevronLeft size={13} />
                    </button>
                    <button className="w-6 h-6 rounded bg-[#B91C1C] text-white font-semibold flex items-center justify-center text-[11px] cursor-pointer shadow-xs">
                      1
                    </button>
                    <button className="w-6 h-6 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 flex items-center justify-center text-[11px] cursor-pointer transition-colors">
                      2
                    </button>
                    <button className="w-6 h-6 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 flex items-center justify-center text-[11px] cursor-pointer transition-colors">
                      3
                    </button>
                    <span className="px-1 text-neutral-400">...</span>
                    <button className="w-6 h-6 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 flex items-center justify-center text-[11px] cursor-pointer transition-colors">
                      13
                    </button>
                    <button className="w-6 h-6 rounded flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 cursor-pointer transition-colors">
                      <ChevronRight size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
