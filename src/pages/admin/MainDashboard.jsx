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

      </div>
    </div>
  );
}