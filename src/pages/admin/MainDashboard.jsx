import React, { useState, useEffect, useRef } from "react";
import AdminSidebar from "../../components/layout/AdminSidebar";
import { getDashboardOverview } from "../../services/dashboardService";
import {
  Users,
  GraduationCap,
  Layers,
  CalendarCheck,
  Bell,
  User,
  Moon,
  Sun,
  LogOut,
  Check,
  ChevronDown,
  FileCheck2,
  Megaphone,
  UserPlus,
  Loader2,
} from "lucide-react";

export default function MainDashboard({
  isDarkMode,
  onToggleTheme,
  onNavigateAdminView,
  onLogout,
}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedBatchId, setSelectedBatchId] = useState("b24");

  // Profile dropdown
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
      const overview = await getDashboardOverview();
      setData(overview);
      if (overview?.availableBatches?.length > 0) {
        setSelectedBatchId(overview.availableBatches[0].id);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const selectedBatch =
    data?.availableBatches?.find((b) => b.id === selectedBatchId) ||
    data?.availableBatches?.[0];

  return (
    <div className="flex h-screen w-full font-sans overflow-hidden bg-[#FAFBFC] dark:bg-[#0E1117] text-neutral-900 dark:text-neutral-100 transition-colors">
      {/* ================= REUSABLE SIDEBAR ================= */}
      <AdminSidebar
        currentView="dashboard-main"
        onNavigateAdminView={onNavigateAdminView}
      />

      {/* ================= MAIN CONTENT CONTAINER ================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#FAFBFC] dark:bg-[#0E1117]">
        {/* Header Bar */}
        <header className="h-14 bg-white dark:bg-[#151921] border-b border-neutral-200/80 dark:border-neutral-800/80 px-8 flex items-center justify-between shrink-0">
          <div className="text-xs sm:text-sm font-semibold tracking-tight text-neutral-800 dark:text-neutral-200">
            Dashboard
          </div>

          <div className="flex items-center gap-3">
            <button className="relative p-1.5 rounded-full text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors cursor-pointer">
              <Bell size={17} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary ring-2 ring-white dark:ring-[#151921]" />
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
                        <Check size={12} className="text-primary" />
                      )}
                    </button>

                    <button
                      onClick={onLogout}
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-medium text-primary hover:bg-red-500/10 transition-colors cursor-pointer"
                    >
                      <LogOut size={13} className="text-primary" />
                      <span>Log out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard Main Content */}
        <main className="flex-1 overflow-y-auto px-8 py-6 space-y-5">
          {loading ? (
            <div className="flex items-center justify-center py-24 gap-2 text-xs text-neutral-500">
              <Loader2 className="animate-spin text-[#B91C1C]" size={18} />
              <span>Loading overview data...</span>
            </div>
          ) : (
            <>
              {/* Header Title & Current Batch Filter */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
                    Dashboard
                  </h2>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    Overview of your bootcamp.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-neutral-400 font-medium">
                    Current Batch:
                  </span>
                  <div className="relative">
                    <select
                      value={selectedBatchId}
                      onChange={(e) => setSelectedBatchId(e.target.value)}
                      className="appearance-none pl-3 pr-7 py-1.5 rounded-md text-xs bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 text-neutral-700 dark:text-neutral-200 focus:outline-none focus:border-[#B91C1C] cursor-pointer"
                    >
                      {(data?.availableBatches || []).map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={12}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() =>
                    onNavigateAdminView &&
                    onNavigateAdminView("dashboard-announcements")
                  }
                  className="px-3.5 py-1.5 rounded-md bg-[#B91C1C] hover:bg-[#991B1B] text-white text-xs font-medium transition-colors cursor-pointer shadow-2xs"
                >
                  Create Announcement
                </button>
                <button
                  onClick={() =>
                    onNavigateAdminView &&
                    onNavigateAdminView("dashboard-students")
                  }
                  className="px-3.5 py-1.5 rounded-md bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-200 text-xs font-medium transition-colors cursor-pointer"
                >
                  + Add Student
                </button>
                <button
                  onClick={() =>
                    onNavigateAdminView &&
                    onNavigateAdminView("dashboard-mentors")
                  }
                  className="px-3.5 py-1.5 rounded-md bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-200 text-xs font-medium transition-colors cursor-pointer"
                >
                  + Add Mentor
                </button>
                <button
                  onClick={() =>
                    onNavigateAdminView &&
                    onNavigateAdminView("dashboard-batches")
                  }
                  className="px-3.5 py-1.5 rounded-md bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-200 text-xs font-medium transition-colors cursor-pointer"
                >
                  Create Batch
                </button>
              </div>

              {/* 4 Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {/* 1. Students */}
                <div className="p-4 rounded-xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-2xs flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                      STUDENTS
                    </span>
                    <GraduationCap size={15} className="text-[#B91C1C]" />
                  </div>
                  <div className="mt-2">
                    <div className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
                      {data?.metrics?.students || 248}
                    </div>
                    <span className="text-[10px] text-neutral-400 mt-0.5 block">
                      Active Count
                    </span>
                  </div>
                </div>

                {/* 2. Mentors */}
                <div className="p-4 rounded-xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-2xs flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                      MENTORS
                    </span>
                    <Users size={15} className="text-[#B91C1C]" />
                  </div>
                  <div className="mt-2">
                    <div className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
                      {data?.metrics?.mentors || 32}
                    </div>
                    <span className="text-[10px] text-neutral-400 mt-0.5 block">
                      Active Count
                    </span>
                  </div>
                </div>

                {/* 3. Batches */}
                <div className="p-4 rounded-xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-2xs flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                      BATCHES
                    </span>
                    <Layers size={15} className="text-[#B91C1C]" />
                  </div>
                  <div className="mt-2">
                    <div className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
                      {data?.metrics?.batches || 8}
                    </div>
                    <span className="text-[10px] text-neutral-400 mt-0.5 block">
                      Active Count
                    </span>
                  </div>
                </div>

                {/* 4. Attendance */}
                <div className="p-4 rounded-xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-2xs flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                      ATTENDANCE
                    </span>
                    <CalendarCheck size={15} className="text-[#B91C1C]" />
                  </div>
                  <div className="mt-2">
                    <div className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
                      {data?.metrics?.attendance || "92%"}
                    </div>
                    <span className="text-[10px] text-neutral-400 mt-0.5 block">
                      Overall Average
                    </span>
                  </div>
                </div>
              </div>

              {/* Main Content 2-Column Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                {/* Left Column (Span 8): Attendance & Assignment Overview */}
                <div className="lg:col-span-8 space-y-5">
                  {/* Attendance Overview Card */}
                  <div className="p-5 rounded-xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-2xs space-y-4">
                    <h3 className="font-bold text-xs text-neutral-900 dark:text-white tracking-tight">
                      Attendance Overview
                    </h3>

                    {/* Present - Emerald / Green */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                          Present
                        </span>
                        <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                          {selectedBatch?.attendanceBreakdown?.present || 85}%
                        </span>
                      </div>
                      <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300"
                          style={{
                            width: `${selectedBatch?.attendanceBreakdown?.present || 85}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Late - Amber / Yellow */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                          Late
                        </span>
                        <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                          {selectedBatch?.attendanceBreakdown?.late || 10}%
                        </span>
                      </div>
                      <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-amber-500 h-1.5 rounded-full transition-all duration-300"
                          style={{
                            width: `${selectedBatch?.attendanceBreakdown?.late || 10}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Absent - Rose / Red */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
                          Absent
                        </span>
                        <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                          {selectedBatch?.attendanceBreakdown?.absent || 5}%
                        </span>
                      </div>
                      <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-rose-500 h-1.5 rounded-full transition-all duration-300"
                          style={{
                            width: `${selectedBatch?.attendanceBreakdown?.absent || 5}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Assignment Overview Card */}
                  <div className="p-5 rounded-xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-2xs space-y-4">
                    <h3 className="font-bold text-xs text-neutral-900 dark:text-white tracking-tight">
                      Assignment Overview
                    </h3>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {/* Total */}
                      <div className="p-3 rounded-lg border border-neutral-100 dark:border-neutral-800 bg-neutral-50/40 dark:bg-neutral-800/20 text-center">
                        <div className="text-lg font-black text-neutral-900 dark:text-white">
                          {selectedBatch?.assignmentStats?.total || 42}
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 block mt-0.5">
                          TOTAL
                        </span>
                      </div>

                      {/* Active */}
                      <div className="p-3 rounded-lg border border-neutral-100 dark:border-neutral-800 bg-neutral-50/40 dark:bg-neutral-800/20 text-center">
                        <div className="text-lg font-black text-neutral-900 dark:text-white">
                          {selectedBatch?.assignmentStats?.active || 12}
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 block mt-0.5">
                          ACTIVE
                        </span>
                      </div>

                      {/* Pending Review */}
                      <div className="p-3 rounded-lg border border-neutral-100 dark:border-neutral-800 bg-neutral-50/40 dark:bg-neutral-800/20 text-center">
                        <div className="text-lg font-black text-neutral-900 dark:text-white">
                          {selectedBatch?.assignmentStats?.pendingReview || 28}
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 block mt-0.5">
                          PENDING REVIEW
                        </span>
                      </div>

                      {/* Past Due */}
                      <div className="p-3 rounded-lg border border-red-100 dark:border-red-900/30 bg-[#FEF2F2]/60 dark:bg-red-950/20 text-center">
                        <div className="text-lg font-black text-[#B91C1C]">
                          {selectedBatch?.assignmentStats?.pastDue || 5}
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-[#B91C1C]/70 block mt-0.5">
                          PAST DUE
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column (Span 4): Selected Batch Details & Recent Activity */}
                <div className="lg:col-span-4 space-y-5">
                  {/* Selected Batch Details */}
                  <div className="p-5 rounded-xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-2xs space-y-3.5">
                    <h3 className="font-bold text-xs text-neutral-900 dark:text-white tracking-tight">
                      Selected Batch
                    </h3>

                    <div className="space-y-2.5 text-xs">
                      <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
                        <span className="text-neutral-400 text-[11px]">
                          Students
                        </span>
                        <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                          {selectedBatch?.students || 45}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
                        <span className="text-neutral-400 text-[11px]">
                          Mentors
                        </span>
                        <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                          {selectedBatch?.mentors || 4}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
                        <span className="text-neutral-400 text-[11px]">
                          Attendance Avg
                        </span>
                        <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                          {selectedBatch?.attendanceAvg || "94%"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-0.5">
                        <span className="text-neutral-400 text-[11px]">
                          Progress
                        </span>
                        <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                          {selectedBatch?.progress || "Week 4/12"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity Stream */}
                  <div className="p-5 rounded-xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-2xs space-y-3.5">
                    <h3 className="font-bold text-xs text-neutral-900 dark:text-white tracking-tight">
                      Recent Activity
                    </h3>

                    <div className="space-y-3.5">
                      {(data?.recentActivities || []).map((act, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2.5 text-xs"
                        >
                          <div className="mt-0.5 text-neutral-400 shrink-0">
                            {act.type === "submission" && (
                              <FileCheck2 size={14} />
                            )}
                            {act.type === "announcement" && (
                              <Megaphone size={14} />
                            )}
                            {act.type === "attendance" && (
                              <CalendarCheck size={14} />
                            )}
                            {act.type === "enrollment" && (
                              <UserPlus size={14} />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-medium text-neutral-800 dark:text-neutral-200 leading-snug">
                              {act.title}
                            </p>
                            <span className="text-[10px] text-neutral-400 block mt-0.5">
                              {act.subtitle} · {act.time}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
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
