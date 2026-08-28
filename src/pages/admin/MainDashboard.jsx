import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiUsers,
  FiCalendar,
  FiCheckSquare,
  FiLayers,
  FiChevronRight,
  FiAlertCircle,
  FiBookOpen,
  FiShield,
  FiClock,
} from "react-icons/fi";
import { fetchDashboardOverview } from "../../services/dashboardService";

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
    {actionText && actionLink && (
      <Link
        to={actionLink}
        className="group flex items-center gap-1 text-xs font-bold text-primary hover:underline"
      >
        {actionText}{" "}
        <FiChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </Link>
    )}
  </div>
);

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [selectedBatch, setSelectedBatch] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cardStyle =
    "bg-surface border border-border rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-primary/50 hover:-translate-y-0.5 transition-all duration-200";

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const responseData = await fetchDashboardOverview();
        // Support both direct payloads and wrapped response structures ({ success: true, data: {...} })
        setDashboardData(responseData?.data || responseData);
      } catch (err) {
        setError("Failed to load admin overview metrics from the database.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center text-text-muted animate-pulse font-mono text-sm">
        Initializing Admin Analytics Dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center text-red-500 bg-surface border border-border rounded-2xl shadow-sm">
        {error}
      </div>
    );
  }

  // Extract database values safely with fallback defaults
  // Checks dashboardData.admin, user profile, or parses local storage user if available
  let adminName = "Administrator";
  try {
    const localUser = JSON.parse(localStorage.getItem("user") || "{}");
    adminName =
      dashboardData?.admin?.firstName ||
      dashboardData?.user?.firstName ||
      localUser?.firstName ||
      localUser?.name ||
      "Admin";
  } catch {
    adminName = dashboardData?.admin?.firstName || "Admin";
  }

  const batches = dashboardData?.batches || dashboardData?.activeBatchesList || [];
  const overview = dashboardData?.overview || {
    totalStudents: dashboardData?.totalStudents || 0,
    activeBatches: dashboardData?.activeBatches || batches.length || 0,
    averageAttendance: dashboardData?.averageAttendance || "0%",
    pendingSubmissions: dashboardData?.pendingSubmissions || 0,
  };
  const recentAnnouncements = dashboardData?.announcements || [];
  const systemActivity = dashboardData?.recentActivity || [];

  return (
<<<<<<< Updated upstream
    <div className="flex h-screen w-full font-sans overflow-hidden bg-[#FAFBFC] dark:bg-[#0E1117] text-neutral-900 dark:text-neutral-100 transition-colors">
    
      {/* ================= MAIN CONTENT CONTAINER ================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#FAFBFC] dark:bg-[#0E1117]">
        
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
=======
    <div className="mx-auto max-w-7xl px-4 pb-12 space-y-8 animate-in fade-in duration-500">
      
      {/* STYLISH WELCOME BANNER HEADER */}
      <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none text-primary">
          <FiShield className="w-64 h-64" />
        </div>
        
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-bold uppercase tracking-wider">
            <FiShield className="w-3.5 h-3.5" /> Administrator Access
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">
            Welcome back, {adminName}
            <span className="text-primary">.</span>
          </h2>
          <p className="text-xs sm:text-sm text-text-muted">
            Here is your live bootcamp oversight and cross-batch analytics center.
          </p>
        </div>
>>>>>>> Stashed changes

        {/* Batch Filter Dropdown Feature */}
        {batches.length > 0 && (
          <div className="flex flex-col gap-1.5 z-10">
            <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
              Filter By Batch
            </label>
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="bg-surface-subtle border border-border text-text-primary text-xs font-bold rounded-xl px-4 py-2.5 focus:outline-hidden focus:border-primary transition-colors shadow-2xs"
            >
              <option value="all">All Active Batches</option>
              {batches.map((batch) => (
                <option key={batch._id || batch.id} value={batch._id || batch.id}>
                  {batch.name || batch.title}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* OVERVIEW STATS GRID */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={FiUsers}
          title="Total Students"
          value={overview.totalStudents}
          subtitle="Enrolled across system"
        />
        <StatCard
          icon={FiLayers}
          title="Active Batches"
          value={overview.activeBatches}
          subtitle="Currently running programs"
        />
        <StatCard
          icon={FiCalendar}
          title="Avg Attendance"
          value={overview.averageAttendance}
          subtitle="System-wide participation"
        />
        <StatCard
          icon={FiCheckSquare}
          title="Submissions"
          value={overview.pendingSubmissions}
          subtitle="Awaiting review"
        />
      </div>

      {/* MAIN TWO-COLUMN SECTION */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        
        {/* LEFT COLUMN: BATCH BREAKDOWN */}
        <div className={cardStyle}>
          <SectionHeader
            title="Batch Status & Progress"
            actionText="Manage Batches"
            actionLink="/admin/batches"
          />
          <div className="space-y-4">
            {batches.length === 0 ? (
              <div className="py-8 text-center text-xs text-text-muted">
                No active batches found in database.
              </div>
            ) : (
              batches.map((batch) => (
                <div
                  key={batch._id || batch.id}
                  className="flex items-center justify-between border-b border-border/60 pb-3 last:border-0 last:pb-0"
                >
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-text-primary">
                      {batch.name || batch.title}
                    </h4>
                    <p className="text-[11px] text-text-muted font-mono mt-0.5">
                      Enrolled: {batch.studentCount || batch.students?.length || 0} students
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-lg">
                    {batch.progress || 0}% Complete
                  </span>
<<<<<<< Updated upstream
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
=======
>>>>>>> Stashed changes
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: RECENT ANNOUNCEMENTS */}
        <div className={cardStyle}>
          <SectionHeader
            title="System Announcements"
            actionText="View All"
            actionLink="/admin/announcements"
          />
          <div className="space-y-4">
            {recentAnnouncements.length === 0 ? (
              <div className="py-8 text-center text-xs text-text-muted">
                No recent announcements recorded.
              </div>
<<<<<<< Updated upstream

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
=======
            ) : (
              recentAnnouncements.slice(0, 4).map((announcement) => (
                <div
                  key={announcement._id || announcement.id}
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
                        {new Date(
                          announcement.createdAt || announcement.date
                        ).toLocaleDateString()}
                      </span>
>>>>>>> Stashed changes
                    </div>
                    <p className="text-xs text-text-muted line-clamp-1">
                      {announcement.content || announcement.preview}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

<<<<<<< Updated upstream
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
=======
>>>>>>> Stashed changes
      </div>
    </div>
  );
}