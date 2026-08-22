<<<<<<< HEAD
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
          <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/40">
            Present
          </span>
        );
      case "Absent":
        return (
          <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-medium bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200/50 dark:border-rose-800/40">
            Absent
          </span>
        );
      case "Late":
        return (
          <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-medium bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/50 dark:border-amber-800/40">
            Late
          </span>
        );
      case "Excused":
        return (
          <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-medium bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200/50 dark:border-sky-800/40">
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
        return "bg-rose-50 text-rose-700 border-rose-200/60 dark:bg-rose-950/30 dark:text-rose-300 dark:border-rose-900/40";
      case "Batch 2":
        return "bg-sky-50 text-sky-700 border-sky-200/60 dark:bg-sky-950/30 dark:text-sky-300 dark:border-sky-900/40";
      default:
        return "bg-neutral-50 text-neutral-700 border-neutral-200/60 dark:bg-neutral-800 dark:text-neutral-300";
    }
  };

  return (
    <div className="flex h-screen w-full font-sans overflow-hidden bg-[#FAFBFC] dark:bg-[#0E1117] text-neutral-900 dark:text-neutral-100 transition-colors">
      <AdminSidebar
        currentView="dashboard-attendance"
        onNavigateAdminView={onNavigateAdminView}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#FAFBFC] dark:bg-[#0E1117]">
        {/* Top Header */}
        <header className="h-14 bg-white dark:bg-[#151921] border-b border-neutral-200/80 dark:border-neutral-800/80 px-8 flex items-center justify-between shrink-0">
          <div className="text-xs sm:text-sm font-semibold tracking-tight text-neutral-800 dark:text-neutral-200">
            Attendance
          </div>

          <div className="flex items-center gap-3">
            <button className="relative p-1.5 rounded-full text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors cursor-pointer">
              <Bell size={17} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#B91C1C] ring-2 ring-white dark:ring-[#151921]" />
            </button>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-7 h-7 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:opacity-80 transition-opacity cursor-pointer overflow-hidden"
              >
                <User size={15} />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 top-10 w-52 rounded-xl bg-white dark:bg-[#1A1F29] border border-neutral-200 dark:border-neutral-800 shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-2 py-1.5 border-b border-neutral-100 dark:border-neutral-800 mb-1.5">
                    <p className="font-semibold text-xs text-neutral-900 dark:text-neutral-100">
                      Miftahudin Mohammed
                    </p>
                    <p className="text-[10px] text-neutral-400">Admin</p>
                  </div>

                  <div className="space-y-0.5">
                    <button className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer text-neutral-700 dark:text-neutral-300">
                      <User size={13} className="text-neutral-400" />
                      <span>Profile</span>
                    </button>

                    <button
                      onClick={() =>
                        onToggleTheme && onToggleTheme(!isDarkMode)
                      }
                      className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer text-neutral-700 dark:text-neutral-300"
                    >
                      <div className="flex items-center gap-2">
                        {isDarkMode ? (
                          <Sun size={13} className="text-neutral-400" />
                        ) : (
                          <Moon size={13} className="text-neutral-400" />
                        )}
                        <span>Dark Mode</span>
                      </div>
                      {isDarkMode && (
                        <Check size={12} className="text-[#B91C1C]" />
                      )}
                    </button>

                    <button
                      onClick={onLogout}
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-medium text-[#B91C1C] hover:bg-red-500/10 transition-colors cursor-pointer"
                    >
                      <LogOut size={13} className="text-[#B91C1C]" />
                      <span>Log out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto px-8 py-6 space-y-5">
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
                  <div className="w-9 h-9 rounded-lg bg-[#B91C1C] flex items-center justify-center text-white shrink-0">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
                      Attendance
                    </h2>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                      Monitor and view attendance across all batches and
                      students.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#151921] text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    <Calendar size={13} className="text-neutral-400" />
                    <span>{data?.dateRange || "May 12 – May 18, 2026"}</span>
                    <ChevronDown size={12} className="text-neutral-400 ml-1" />
                  </div>

                  <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#151921] hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-medium text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer">
                    <Download size={13} className="text-neutral-400" />
                    <span>Export Report</span>
                  </button>
                </div>
              </div>

              {/* 5 Top Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                {/* 1. Overall Attendance */}
                <div className="p-4 rounded-xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-2xs flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-medium text-neutral-500 block mb-1">
                      Overall Attendance
                    </span>
                    <div className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
                      {data?.summary?.overallAttendance || "78.6%"}
                    </div>
                    <span className="text-[10px] text-emerald-600 font-medium block mt-1">
                      ↑ 5.4% from last week
                    </span>
                  </div>
                  <div className="relative w-12 h-12 shrink-0">
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
                <div className="p-4 rounded-xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-2xs flex items-center justify-between">
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
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600">
                    <CheckCircle2 size={18} />
                  </div>
                </div>

                {/* 3. Absent */}
                <div className="p-4 rounded-xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-2xs flex items-center justify-between">
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
                  <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center text-rose-600">
                    <XCircle size={18} />
                  </div>
                </div>

                {/* 4. Late */}
                <div className="p-4 rounded-xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-2xs flex items-center justify-between">
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
                  <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center text-amber-600">
                    <Clock size={18} />
                  </div>
                </div>

                {/* 5. Excused */}
                <div className="p-4 rounded-xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-2xs flex items-center justify-between">
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
                  <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/40 flex items-center justify-center text-sky-600">
                    <FileText size={18} />
                  </div>
                </div>
              </div>

              {/* Middle Section: Batch 1 & 2 Bars Chart + Status Donut */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                {/* Left Chart: Attendance by Batch (Only Batch 1 and Batch 2) */}
                <div className="lg:col-span-7 p-5 rounded-xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-2xs flex flex-col justify-between">
                  <h3 className="font-bold text-xs text-neutral-900 dark:text-white tracking-tight mb-4">
                    Attendance by Batch
                  </h3>

                  <div className="flex items-end justify-center gap-16 h-44 pt-4 px-2">
                    {(data?.batchBars || []).map((b, i) => (
                      <div
                        key={i}
                        className="w-20 flex flex-col items-center gap-2 h-full justify-end"
                      >
                        <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                          {b.rate}%
                        </span>
                        <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-t-md h-full flex items-end">
                          <div
                            className="w-full bg-[#B91C1C] rounded-t-md transition-all duration-500"
                            style={{ height: `${b.rate}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mt-1">
                          {b.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Chart: Attendance by Status */}
                <div className="lg:col-span-5 p-5 rounded-xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-2xs flex flex-col justify-between">
                  <h3 className="font-bold text-xs text-neutral-900 dark:text-white tracking-tight mb-2">
                    Attendance by Status
                  </h3>

                  <div className="flex items-center justify-between gap-4 flex-1">
                    {/* Donut graphic */}
                    <div className="relative w-32 h-32 shrink-0">
                      <svg
                        className="w-full h-full transform -rotate-90"
                        viewBox="0 0 36 36"
                      >
                        <path
                          className="text-neutral-100 dark:text-neutral-800 stroke-current"
                          strokeWidth="5"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="text-emerald-500 stroke-current"
                          strokeDasharray="59.1, 100"
                          strokeWidth="5"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="text-[#DC2626] stroke-current"
                          strokeDasharray="29.2, 100"
                          strokeDashoffset="-59.1"
                          strokeWidth="5"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="text-amber-500 stroke-current"
                          strokeDasharray="8.7, 100"
                          strokeDashoffset="-88.3"
                          strokeWidth="5"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="text-sky-500 stroke-current"
                          strokeDasharray="3.2, 100"
                          strokeDashoffset="-97"
                          strokeWidth="5"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                    </div>

                    {/* Breakdown legend */}
                    <div className="flex-1 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          Present
                        </span>
                        <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                          59.1% (842)
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                          <span className="w-2 h-2 rounded-full bg-[#DC2626]" />
                          Absent
                        </span>
                        <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                          29.2% (416)
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                          <span className="w-2 h-2 rounded-full bg-amber-500" />
                          Late
                        </span>
                        <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                          8.7% (124)
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                          <span className="w-2 h-2 rounded-full bg-sky-500" />
                          Excused
                        </span>
                        <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                          3.2% (46)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Search & Filter Bar */}
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="flex-1 min-w-[200px] relative">
                  <Search
                    size={13}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                  />
                  <input
                    type="text"
                    placeholder="Search by student name or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 rounded-md text-xs bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 text-neutral-800 dark:text-neutral-200 placeholder:text-neutral-400 focus:outline-none focus:border-[#B91C1C]"
                  />
                </div>

                <div className="relative">
                  <select
                    value={batchFilter}
                    onChange={(e) => setBatchFilter(e.target.value)}
                    className="appearance-none pl-3 pr-7 py-1.5 rounded-md text-xs bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 text-neutral-600 dark:text-neutral-300 focus:outline-none focus:border-[#B91C1C] cursor-pointer"
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
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
                  />
                </div>

                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="appearance-none pl-3 pr-7 py-1.5 rounded-md text-xs bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 text-neutral-600 dark:text-neutral-300 focus:outline-none focus:border-[#B91C1C] cursor-pointer"
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
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
                  />
                </div>

                <div className="relative">
                  <select
                    value={sessionFilter}
                    onChange={(e) => setSessionFilter(e.target.value)}
                    className="appearance-none pl-3 pr-7 py-1.5 rounded-md text-xs bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 text-neutral-600 dark:text-neutral-300 focus:outline-none focus:border-[#B91C1C] cursor-pointer"
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
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 text-neutral-600 dark:text-neutral-300 hover:text-[#B91C1C] transition-colors cursor-pointer"
                >
                  <RotateCcw size={12} />
                  <span>Reset Filters</span>
                </button>
              </div>

              {/* Records Table */}
              <div className="bg-white dark:bg-[#151921] rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                        <th className="py-2.5 px-4 w-10">#</th>
                        <th className="py-2.5 px-4">STUDENT</th>
                        <th className="py-2.5 px-4">BATCH</th>
                        <th className="py-2.5 px-4">DATE</th>
                        <th className="py-2.5 px-4">SESSION</th>
                        <th className="py-2.5 px-4">STATUS</th>
                        <th className="py-2.5 px-4">MARKED BY</th>
                        <th className="py-2.5 px-4">ATTENDANCE %</th>
                        <th className="py-2.5 px-4 text-right">ACTION</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
                      {filteredRecords.length === 0 ? (
                        <tr>
                          <td
                            colSpan={9}
                            className="text-center py-10 text-neutral-400 text-xs"
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
                            <td className="py-3 px-4 text-neutral-400">
                              {index + 1}
                            </td>

                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center font-bold text-[10px] shrink-0 text-neutral-500 dark:text-neutral-400">
                                  {r.initials}
                                </div>
                                <div>
                                  <span className="font-semibold text-neutral-900 dark:text-neutral-100 block leading-snug">
                                    {r.studentName}
                                  </span>
                                  <span className="text-[10px] text-neutral-400">
                                    {r.studentId}
                                  </span>
                                </div>
                              </div>
                            </td>

                            <td className="py-3 px-4">
                              <span
                                className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium border ${getBatchBadgeColor(r.batch)}`}
                              >
                                {r.batch}
                              </span>
                            </td>

                            <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400">
                              {r.date}
                            </td>

                            <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400">
                              {r.session}
                            </td>

                            <td className="py-3 px-4">
                              {getStatusBadge(r.status)}
                            </td>

                            <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400">
                              {r.markedBy}
                            </td>

                            <td className="py-3 px-4 font-medium text-neutral-700 dark:text-neutral-300">
                              {r.attendanceRate}
                            </td>

                            {/* Two Action Icons: Edit (Pencil) & Delete (Trash2) */}
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-2 text-neutral-400">
                                <button
                                  type="button"
                                  title="Edit"
                                  onClick={() =>
                                    onNavigateAdminView &&
                                    onNavigateAdminView("dashboard-students")
                                  }
                                  className="p-1 hover:text-[#B91C1C] transition-colors cursor-pointer"
                                >
                                  <Pencil size={13} />
                                </button>
                                <button
                                  type="button"
                                  title="Delete"
                                  onClick={() => handleDeleteRecord(r.id)}
                                  className="p-1 hover:text-[#B91C1C] transition-colors cursor-pointer"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Table Pagination Footer */}
                <div className="px-4 py-2.5 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400">
                  <span>
                    Showing 1 to {filteredRecords.length} of 124 entries
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button className="w-6 h-6 rounded flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 cursor-pointer">
                      <ChevronLeft size={13} />
                    </button>
                    <button className="w-6 h-6 rounded bg-[#B91C1C] text-white font-semibold flex items-center justify-center text-[11px] cursor-pointer">
                      1
                    </button>
                    <button className="w-6 h-6 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 flex items-center justify-center text-[11px] cursor-pointer">
                      2
                    </button>
                    <button className="w-6 h-6 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 flex items-center justify-center text-[11px] cursor-pointer">
                      3
                    </button>
                    <span className="px-1 text-neutral-400">...</span>
                    <button className="w-6 h-6 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 flex items-center justify-center text-[11px] cursor-pointer">
                      13
                    </button>
                    <button className="w-6 h-6 rounded flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 cursor-pointer">
                      <ChevronRight size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
=======
import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { FiMenu, FiBell, FiUser, FiMoon, FiLogOut } from "react-icons/fi";
import MentorSidebar from "../components/layout/MentorSidebar";

export default function MentorLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  const mentor = { firstName: "John", lastName: "Doe" };

  const navLinks = [
    { name: "Dashboard", path: "/mentor/dashboard" },
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Tracks", path: "/tracks" },
    { name: "Mentors", path: "/mentors" },
    { name: "Contact", path: "/contact" },
  ];

  const handleLogout = () => {
    setIsProfileOpen(false);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background flex overflow-hidden w-full">
      <MentorSidebar isOpen={isSidebarOpen} />

      <div
        className={`flex-1 flex flex-col min-h-screen min-w-0 transition-all duration-300 ease-in-out w-full ${
          isSidebarOpen ? "md:pl-64" : "pl-0"
        }`}
      >
        <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-border bg-surface px-4 md:px-6 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="flex h-8 w-8 items-center justify-center rounded-md text-text-muted hover:bg-surface-subtle hover:text-primary transition-colors focus:outline-none"
            >
              <FiMenu className="h-5 w-5" />
            </button>
            <span className="text-lg font-bold text-primary tracking-tight">
              ASTU MSJ
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `transition-all duration-200 hover:text-primary ${
                    isActive
                      ? "text-primary underline underline-offset-4 decoration-2"
                      : "text-text-muted"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-4 relative">
            <button className="text-text-muted hover:text-text-primary transition-colors relative">
              <FiBell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary"></span>
            </button>

            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface text-text-muted hover:text-text-primary hover:bg-surface-subtle transition-colors focus:outline-none"
            >
              <FiUser className="h-4 w-4" />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 top-10 mt-2 w-48 rounded-md bg-surface border border-border shadow-lg py-1 z-50">
                <div className="px-4 py-2 border-b border-border">
                  <p className="text-sm font-bold text-text-primary truncate">
                    {mentor.firstName} {mentor.lastName}
                  </p>
                  <p className="text-xs text-text-muted truncate">Mentor</p>
                </div>
                <NavLink
                  onClick={() => setIsProfileOpen(false)}
                  to="/mentor/settings"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-text-muted hover:bg-surface-subtle hover:text-text-primary"
                >
                  <FiUser className="h-4 w-4" /> Profile
                </NavLink>
                <button className="flex w-full items-center gap-2 px-4 py-2 text-sm text-text-muted hover:bg-surface-subtle hover:text-text-primary text-left">
                  <FiMoon className="h-4 w-4" /> Dark Mode
                </button>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-primary hover:bg-primary-light text-left"
                >
                  <FiLogOut className="h-4 w-4" /> Log out
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 min-w-0 overflow-x-hidden overflow-y-auto p-4 md:p-8">
          <Outlet />
>>>>>>> 27d492b4e1fef52818f4ac14ab1ed0e3ead2c914
        </main>
      </div>
    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 27d492b4e1fef52818f4ac14ab1ed0e3ead2c914
