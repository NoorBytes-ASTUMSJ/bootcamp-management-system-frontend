import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { fetchDashboardOverview } from "../../services/dashboardService";
import { getProgressOverview } from "../../services/progressService";
import { useAuth } from "../../context/AuthContext";
import {
  Users,
  GraduationCap,
  CalendarCheck,
  ChevronDown,
  FileCheck2,
  Megaphone,
  UserPlus,
  Loader2,
  BookOpen,
  Calendar,
  TrendingUp,
  Star,
} from "lucide-react";

function LeaderboardCard({ title, icon: Icon, entries, accent, comingSoon }) {
  return (
    <div className="rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-800/20 p-4">
      <div className="flex items-center gap-2 mb-3.5">
        <div
          className={`flex h-7 w-7 items-center justify-center rounded-lg shrink-0 ${accent.bg} ${accent.text}`}
        >
          <Icon className="h-3.5 w-3.5" />
        </div>
        <span className="text-[11px] font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wide">
          {title}
        </span>
      </div>

      {comingSoon ? (
        <div className="flex flex-col items-center justify-center text-center py-5">
          <p className="text-[11px] font-medium text-neutral-500">
            Coming soon
          </p>
        </div>
      ) : entries.length === 0 ? (
        <p className="text-[11px] text-neutral-500 text-center py-5">
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
                    : "bg-white dark:bg-[#151921] text-neutral-500 border border-neutral-200/80 dark:border-neutral-800/80"
                }`}
              >
                {idx + 1}
              </span>
              <span className="flex-1 min-w-0 text-xs font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                {entry.name}
              </span>
              <span className="text-xs font-black text-neutral-900 dark:text-neutral-100 font-mono shrink-0">
                {entry.value}%
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function MainDashboard({ isDarkMode, onToggleTheme, onLogout }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [progressLeaderboard, setProgressLeaderboard] = useState([]);

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
      try {
        const overview = await fetchDashboardOverview();

        setData(overview);
        if (overview?.batches?.length > 0) {
          setSelectedBatchId(overview.batches[0].id || overview.batches[0]._id);
        }
      } catch (error) {
        console.error("Failed to load dashboard:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

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

  useEffect(() => {
    if (!selectedBatchId) return;

    async function fetchRankings() {
      try {
        const res = await getProgressOverview(selectedBatchId);
        const students = res.students || [];

        const progressRanking = students
          .map((student) => ({
            id: student.id,
            name: student.name,
            value: scoreTopics(student.progressMap),
          }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 5);

        setProgressLeaderboard(progressRanking);
      } catch (e) {
        console.error("Failed to load rankings", e);
      }
    }
    fetchRankings();
  }, [selectedBatchId]);

  const selectedBatch =
    data?.batches?.find(
      (b) =>
        String(b.id) === String(selectedBatchId) ||
        String(b._id) === String(selectedBatchId),
    ) || data?.batches?.[0];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const adminName = user?.name?.split(" ")[0] || user?.firstName || "Admin";

  return (
    <div className="w-full font-sans bg-[#FAFBFC] dark:bg-[#0E1117] text-neutral-900 dark:text-neutral-100 transition-colors">
      <div className="flex-1 flex flex-col min-w-0">
        <main className="px-8 py-6 space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-24 gap-2 text-xs text-neutral-500">
              <Loader2 className="animate-spin text-[#B91C1C]" size={18} />
              <span>Loading overview data...</span>
            </div>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
                    {getGreeting()}, {adminName}
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                    Here's what's happening in your bootcamp today.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <select
                      value={selectedBatchId}
                      onChange={(e) => setSelectedBatchId(e.target.value)}
                      className="appearance-none pl-3.5 pr-8 py-2 rounded-xl text-xs bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 text-neutral-700 dark:text-neutral-200 focus:outline-none focus:border-[#B91C1C] cursor-pointer shadow-xs font-medium"
                    >
                      {(data?.batches || []).map((b) => (
                        <option key={b.id || b._id} value={b.id || b._id}>
                          {b.name || "Unnamed Batch"}
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

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => navigate("/admin/announcements")}
                  className="px-4 py-2 rounded-xl bg-[#B91C1C] hover:bg-[#991B1B] text-white text-xs font-medium transition-all duration-300 cursor-pointer shadow-md shadow-red-500/10 hover:-translate-y-0.5"
                >
                  Create Announcement
                </button>
                <button
                  onClick={() => navigate("/admin/students")}
                  className="px-4 py-2 rounded-xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-200 text-xs font-medium transition-all duration-300 cursor-pointer shadow-xs hover:border-[#B91C1C]/40"
                >
                  + Add Student
                </button>
                <button
                  onClick={() => navigate("/admin/mentors")}
                  className="px-4 py-2 rounded-xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-200 text-xs font-medium transition-all duration-300 cursor-pointer shadow-xs hover:border-[#B91C1C]/40"
                >
                  + Add Mentor
                </button>
                <button
                  onClick={() => navigate("/admin/batches")}
                  className="px-4 py-2 rounded-xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-200 text-xs font-medium transition-all duration-300 cursor-pointer shadow-xs hover:border-[#B91C1C]/40"
                >
                  Create Batch
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div
                  onClick={() => navigate("/admin/students")}
                  className="p-5 rounded-2xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-md shadow-neutral-200/50 dark:shadow-none flex flex-col justify-between transition-all duration-300 hover:border-[#B91C1C]/50 hover:-translate-y-1 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                      STUDENTS
                    </span>
                    <GraduationCap size={16} className="text-[#B91C1C]" />
                  </div>
                  <div className="mt-3">
                    <div className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
                      {selectedBatch?.students ?? 0}
                    </div>
                    <span className="text-[10px] text-neutral-400 mt-0.5 block">
                      In Selected Batch
                    </span>
                  </div>
                </div>

                <div
                  onClick={() => navigate("/admin/mentors")}
                  className="p-5 rounded-2xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-md shadow-neutral-200/50 dark:shadow-none flex flex-col justify-between transition-all duration-300 hover:border-[#B91C1C]/50 hover:-translate-y-1 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                      MENTORS
                    </span>
                    <Users size={16} className="text-[#B91C1C]" />
                  </div>
                  <div className="mt-3">
                    <div className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
                      {selectedBatch?.mentors ?? 0}
                    </div>
                    <span className="text-[10px] text-neutral-400 mt-0.5 block">
                      In Selected Batch
                    </span>
                  </div>
                </div>

                <div
                  onClick={() => navigate("/admin/assignments")}
                  className="p-5 rounded-2xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-md shadow-neutral-200/50 dark:shadow-none flex flex-col justify-between transition-all duration-300 hover:border-[#B91C1C]/50 hover:-translate-y-1 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                      ASSIGNMENTS
                    </span>
                    <BookOpen size={16} className="text-[#B91C1C]" />
                  </div>
                  <div className="mt-3">
                    <div className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
                      {selectedBatch?.assignmentStats?.total ?? 0}
                    </div>
                    <span className="text-[10px] text-neutral-400 mt-0.5 block">
                      In Selected Batch
                    </span>
                  </div>
                </div>

                <div
                  onClick={() => navigate("/admin/attendance")}
                  className="p-5 rounded-2xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-md shadow-neutral-200/50 dark:shadow-none flex flex-col justify-between transition-all duration-300 hover:border-[#B91C1C]/50 hover:-translate-y-1 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                      ATTENDANCE
                    </span>
                    <CalendarCheck size={16} className="text-[#B91C1C]" />
                  </div>
                  <div className="mt-3">
                    <div className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
                      {selectedBatch?.attendanceAvg ?? "0%"}
                    </div>
                    <span className="text-[10px] text-neutral-400 mt-0.5 block">
                      Batch Average
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-md shadow-neutral-200/50 dark:shadow-none">
                <div className="mb-5">
                  <h3 className="font-bold text-sm sm:text-base text-neutral-900 dark:text-white tracking-tight">
                    Batch Leaderboard
                  </h3>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    Top 5 performers in this batch
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <LeaderboardCard
                    title="Attendance"
                    icon={Calendar}
                    entries={selectedBatch?.leaderboard?.attendance || []}
                    accent={{ bg: "bg-sky-500/10", text: "text-sky-500" }}
                  />
                  <LeaderboardCard
                    title="Progress"
                    icon={TrendingUp}
                    entries={progressLeaderboard}
                    accent={{
                      bg: "bg-emerald-500/10",
                      text: "text-emerald-500",
                    }}
                  />
                  <LeaderboardCard
                    title="Grades"
                    icon={Star}
                    entries={selectedBatch?.leaderboard?.grades || []}
                    accent={{ bg: "bg-amber-500/10", text: "text-amber-500" }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-8 space-y-6">
                  <div
                    onClick={() => navigate("/admin/attendance")}
                    className="p-6 rounded-2xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-md shadow-neutral-200/50 dark:shadow-none space-y-4 transition-all duration-300 cursor-pointer hover:border-[#B91C1C]/30 group"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-xs text-neutral-900 dark:text-white tracking-tight group-hover:text-[#B91C1C] transition-colors">
                        Attendance Breakdown
                      </h3>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                          Present
                        </span>
                        <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                          {selectedBatch?.attendanceBreakdown?.present ?? 0}%
                        </span>
                      </div>
                      <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${selectedBatch?.attendanceBreakdown?.present ?? 0}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                          Late
                        </span>
                        <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                          {selectedBatch?.attendanceBreakdown?.late ?? 0}%
                        </span>
                      </div>
                      <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-amber-500 h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${selectedBatch?.attendanceBreakdown?.late ?? 0}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                          Absent
                        </span>
                        <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                          {selectedBatch?.attendanceBreakdown?.absent ?? 0}%
                        </span>
                      </div>
                      <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-rose-500 h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${selectedBatch?.attendanceBreakdown?.absent ?? 0}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div
                    onClick={() => navigate("/admin/assignments")}
                    className="p-6 rounded-2xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-md shadow-neutral-200/50 dark:shadow-none space-y-4 transition-all duration-300 cursor-pointer hover:border-[#B91C1C]/30 group"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-xs text-neutral-900 dark:text-white tracking-tight group-hover:text-[#B91C1C] transition-colors">
                        Assignment Overview
                      </h3>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-3.5 rounded-xl border border-neutral-100 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-800/20 text-center transition-colors group-hover:bg-neutral-100 dark:group-hover:bg-neutral-800/50">
                        <div className="text-lg font-black text-neutral-900 dark:text-white">
                          {selectedBatch?.assignmentStats?.total ?? 0}
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 block mt-0.5">
                          TOTAL
                        </span>
                      </div>

                      <div className="p-3.5 rounded-xl border border-neutral-100 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-800/20 text-center transition-colors group-hover:bg-neutral-100 dark:group-hover:bg-neutral-800/50">
                        <div className="text-lg font-black text-neutral-900 dark:text-white">
                          {selectedBatch?.assignmentStats?.active ?? 0}
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 block mt-0.5">
                          ACTIVE
                        </span>
                      </div>

                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate("/admin/submissions");
                        }}
                        className="p-3.5 rounded-xl border border-neutral-100 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-800/20 text-center hover:bg-sky-50 dark:hover:bg-sky-950/30 transition-colors"
                      >
                        <div className="text-lg font-black text-neutral-900 dark:text-white">
                          {selectedBatch?.assignmentStats?.pendingReview ?? 0}
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 block mt-0.5">
                          PENDING REVIEW
                        </span>
                      </div>

                      <div className="p-3.5 rounded-xl border border-red-100 dark:border-red-900/30 bg-[#FEF2F2]/60 dark:bg-red-950/20 text-center">
                        <div className="text-lg font-black text-[#B91C1C]">
                          {selectedBatch?.assignmentStats?.pastDue ?? 0}
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-[#B91C1C]/70 block mt-0.5">
                          PAST DUE
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-4 space-y-6">
                  <div
                    onClick={() => navigate("/admin/batches")}
                    className="p-6 rounded-2xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-md shadow-neutral-200/50 dark:shadow-none space-y-4 transition-all duration-300 cursor-pointer hover:border-[#B91C1C]/30 group"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-xs text-neutral-900 dark:text-white tracking-tight group-hover:text-[#B91C1C] transition-colors">
                        Selected Batch Status
                      </h3>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div className="flex items-center justify-between pb-2.5 border-b border-neutral-100 dark:border-neutral-800">
                        <span className="text-neutral-400 text-[11px]">
                          Students
                        </span>
                        <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                          {selectedBatch?.students ?? 0}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pb-2.5 border-b border-neutral-100 dark:border-neutral-800">
                        <span className="text-neutral-400 text-[11px]">
                          Mentors
                        </span>
                        <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                          {selectedBatch?.mentors ?? 0}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-neutral-400 text-[11px]">
                          Attendance Avg
                        </span>
                        <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                          {selectedBatch?.attendanceAvg ?? "0%"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-md shadow-neutral-200/50 dark:shadow-none space-y-4 transition-all duration-300">
                    <h3 className="font-bold text-xs text-neutral-900 dark:text-white tracking-tight">
                      Recent Activity
                    </h3>

                    <div className="space-y-2">
                      {data?.recentActivities?.length > 0 ? (
                        data.recentActivities.map((act, i) => (
                          <div
                            key={i}
                            onClick={() => {
                              if (act.type === "submission")
                                navigate("/admin/submissions");
                              if (act.type === "announcement")
                                navigate("/admin/announcements");
                              if (act.type === "attendance")
                                navigate("/admin/attendance");
                              if (act.type === "enrollment")
                                navigate("/admin/students");
                            }}
                            className="flex items-start gap-3 text-xs p-2 -mx-2 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer group"
                          >
                            <div className="mt-0.5 text-neutral-400 group-hover:text-[#B91C1C] transition-colors shrink-0">
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
                              <p className="text-[11px] font-medium text-neutral-800 dark:text-neutral-200 leading-snug group-hover:text-[#B91C1C] transition-colors">
                                {act.title}
                              </p>
                              <span className="text-[10px] text-neutral-400 mt-0.5 block">
                                {act.subtitle} · {act.time}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-[11px] text-neutral-500 italic">
                          No recent activity.
                        </p>
                      )}
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
