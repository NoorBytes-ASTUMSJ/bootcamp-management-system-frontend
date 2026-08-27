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
    <div className="w-full font-sans bg-[#FAFBFC] dark:bg-[#0E1117] text-neutral-900 dark:text-neutral-100 transition-colors">
      {/* ================= MAIN CONTENT CONTAINER ================= */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Dashboard Main Content */}
        <main className="px-8 py-6 space-y-6">
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
                      className="appearance-none pl-3.5 pr-8 py-2 rounded-xl text-xs bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 text-neutral-700 dark:text-neutral-200 focus:outline-none focus:border-[#B91C1C] cursor-pointer shadow-xs font-medium"
                    >
                      {(data?.availableBatches || []).map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={12}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() =>
                    onNavigateAdminView &&
                    onNavigateAdminView("dashboard-announcements")
                  }
                  className="px-4 py-2 rounded-xl bg-[#B91C1C] hover:bg-[#991B1B] text-white text-xs font-medium transition-all duration-300 cursor-pointer shadow-md shadow-red-500/10 hover:-translate-y-0.5"
                >
                  Create Announcement
                </button>
                <button
                  onClick={() =>
                    onNavigateAdminView &&
                    onNavigateAdminView("dashboard-students")
                  }
                  className="px-4 py-2 rounded-xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-200 text-xs font-medium transition-all duration-300 cursor-pointer shadow-xs hover:border-[#B91C1C]/40"
                >
                  + Add Student
                </button>
                <button
                  onClick={() =>
                    onNavigateAdminView &&
                    onNavigateAdminView("dashboard-mentors")
                  }
                  className="px-4 py-2 rounded-xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-200 text-xs font-medium transition-all duration-300 cursor-pointer shadow-xs hover:border-[#B91C1C]/40"
                >
                  + Add Mentor
                </button>
                <button
                  onClick={() =>
                    onNavigateAdminView &&
                    onNavigateAdminView("dashboard-batches")
                  }
                  className="px-4 py-2 rounded-xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-200 text-xs font-medium transition-all duration-300 cursor-pointer shadow-xs hover:border-[#B91C1C]/40"
                >
                  Create Batch
                </button>
              </div>

              {/* 4 Stats Cards with Modern Hover Effect */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Students */}
                <div className="p-5 rounded-2xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-md shadow-neutral-200/50 dark:shadow-none flex flex-col justify-between transition-all duration-300 hover:border-[#B91C1C]/50 hover:-translate-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                      STUDENTS
                    </span>
                    <GraduationCap size={16} className="text-[#B91C1C]" />
                  </div>
                  <div className="mt-3">
                    <div className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
                      {data?.metrics?.students || 248}
                    </div>
                    <span className="text-[10px] text-neutral-400 mt-0.5 block">
                      Active Count
                    </span>
                  </div>
                </div>

                {/* 2. Mentors */}
                <div className="p-5 rounded-2xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-md shadow-neutral-200/50 dark:shadow-none flex flex-col justify-between transition-all duration-300 hover:border-[#B91C1C]/50 hover:-translate-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                      MENTORS
                    </span>
                    <Users size={16} className="text-[#B91C1C]" />
                  </div>
                  <div className="mt-3">
                    <div className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
                      {data?.metrics?.mentors || 32}
                    </div>
                    <span className="text-[10px] text-neutral-400 mt-0.5 block">
                      Active Count
                    </span>
                  </div>
                </div>

                {/* 3. Batches */}
                <div className="p-5 rounded-2xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-md shadow-neutral-200/50 dark:shadow-none flex flex-col justify-between transition-all duration-300 hover:border-[#B91C1C]/50 hover:-translate-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                      BATCHES
                    </span>
                    <Layers size={16} className="text-[#B91C1C]" />
                  </div>
                  <div className="mt-3">
                    <div className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
                      {data?.metrics?.batches || 8}
                    </div>
                    <span className="text-[10px] text-neutral-400 mt-0.5 block">
                      Active Count
                    </span>
                  </div>
                </div>

                {/* 4. Attendance */}
                <div className="p-5 rounded-2xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-md shadow-neutral-200/50 dark:shadow-none flex flex-col justify-between transition-all duration-300 hover:border-[#B91C1C]/50 hover:-translate-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                      ATTENDANCE
                    </span>
                    <CalendarCheck size={16} className="text-[#B91C1C]" />
                  </div>
                  <div className="mt-3">
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
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Column (Span 8): Attendance & Assignment Overview */}
                <div className="lg:col-span-8 space-y-6">
                  {/* Attendance Overview Card */}
                  <div className="p-6 rounded-2xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-md shadow-neutral-200/50 dark:shadow-none space-y-4 transition-all duration-300">
                    <h3 className="font-bold text-xs text-neutral-900 dark:text-white tracking-tight">
                      Attendance Overview
                    </h3>

                    {/* Present - Emerald / Green */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                          Present
                        </span>
                        <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                          {selectedBatch?.attendanceBreakdown?.present || 85}%
                        </span>
                      </div>
                      <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${selectedBatch?.attendanceBreakdown?.present || 85}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Late - Amber / Yellow */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                          Late
                        </span>
                        <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                          {selectedBatch?.attendanceBreakdown?.late || 10}%
                        </span>
                      </div>
                      <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-amber-500 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${selectedBatch?.attendanceBreakdown?.late || 10}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Absent - Rose / Red */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                          Absent
                        </span>
                        <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                          {selectedBatch?.attendanceBreakdown?.absent || 5}%
                        </span>
                      </div>
                      <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-rose-500 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${selectedBatch?.attendanceBreakdown?.absent || 5}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Assignment Overview Card */}
                  <div className="p-6 rounded-2xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-md shadow-neutral-200/50 dark:shadow-none space-y-4 transition-all duration-300">
                    <h3 className="font-bold text-xs text-neutral-900 dark:text-white tracking-tight">
                      Assignment Overview
                    </h3>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {/* Total */}
                      <div className="p-3.5 rounded-xl border border-neutral-100 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-800/20 text-center">
                        <div className="text-lg font-black text-neutral-900 dark:text-white">
                          {selectedBatch?.assignmentStats?.total || 42}
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 block mt-0.5">
                          TOTAL
                        </span>
                      </div>

                      {/* Active */}
                      <div className="p-3.5 rounded-xl border border-neutral-100 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-800/20 text-center">
                        <div className="text-lg font-black text-neutral-900 dark:text-white">
                          {selectedBatch?.assignmentStats?.active || 12}
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 block mt-0.5">
                          ACTIVE
                        </span>
                      </div>

                      {/* Pending Review */}
                      <div className="p-3.5 rounded-xl border border-neutral-100 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-800/20 text-center">
                        <div className="text-lg font-black text-neutral-900 dark:text-white">
                          {selectedBatch?.assignmentStats?.pendingReview || 28}
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 block mt-0.5">
                          PENDING REVIEW
                        </span>
                      </div>

                      {/* Past Due */}
                      <div className="p-3.5 rounded-xl border border-red-100 dark:border-red-900/30 bg-[#FEF2F2]/60 dark:bg-red-950/20 text-center">
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
                <div className="lg:col-span-4 space-y-6">
                  {/* Selected Batch Details */}
                  <div className="p-6 rounded-2xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-md shadow-neutral-200/50 dark:shadow-none space-y-4 transition-all duration-300">
                    <h3 className="font-bold text-xs text-neutral-900 dark:text-white tracking-tight">
                      Selected Batch
                    </h3>

                    <div className="space-y-3 text-xs">
                      <div className="flex items-center justify-between pb-2.5 border-b border-neutral-100 dark:border-neutral-800">
                        <span className="text-neutral-400 text-[11px]">
                          Students
                        </span>
                        <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                          {selectedBatch?.students || 45}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pb-2.5 border-b border-neutral-100 dark:border-neutral-800">
                        <span className="text-neutral-400 text-[11px]">
                          Mentors
                        </span>
                        <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                          {selectedBatch?.mentors || 4}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pb-2.5 border-b border-neutral-100 dark:border-neutral-800">
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
                  <div className="p-6 rounded-2xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-md shadow-neutral-200/50 dark:shadow-none space-y-4 transition-all duration-300">
                    <h3 className="font-bold text-xs text-neutral-900 dark:text-white tracking-tight">
                      Recent Activity
                    </h3>

                    <div className="space-y-4">
                      {(data?.recentActivities || []).map((act, i) => (
                        <div key={i} className="flex items-start gap-3 text-xs">
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
