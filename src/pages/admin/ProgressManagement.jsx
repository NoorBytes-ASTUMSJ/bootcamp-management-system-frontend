import React, { useState, useEffect, useRef } from "react";
import AdminSidebar from "../../components/layout/AdminSidebar";
import { getProgressOverview } from "../../services/progressService";
import {
  Search,
  ChevronDown,
  Bell,
  User,
  Moon,
  Sun,
  LogOut,
  Check,
  X,
  Loader2,
  Pencil,
  Trash2,
} from "lucide-react";

export default function ProgressManagement({
  isDarkMode,
  onToggleTheme,
  onNavigateAdminView,
  onLogout,
}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [batchFilter, setBatchFilter] = useState("ALL");
  const [mentorFilter, setMentorFilter] = useState("ALL");
  const [selectedStudent, setSelectedStudent] = useState(null);

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
      const overview = await getProgressOverview();
      setData(overview);
      if (overview?.students?.length > 0) {
        setSelectedStudent(overview.students[0]);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const handleDeleteStudent = (id) => {
    if (!data) return;
    const updated = data.students.filter((s) => s.id !== id);
    setData({ ...data, students: updated });
    if (selectedStudent?.id === id) {
      setSelectedStudent(null);
    }
  };

  const studentsList = data?.students || [];

  const availableBatches = [
    ...new Set(studentsList.map((s) => s.batch).filter(Boolean)),
  ];
  const availableMentors = [
    ...new Set(studentsList.map((s) => s.mentor).filter(Boolean)),
  ];

  const filteredStudents = studentsList.filter((st) => {
    const query = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !query ||
      (st.name || "").toLowerCase().includes(query) ||
      (st.track || "").toLowerCase().includes(query) ||
      (st.mentor || "").toLowerCase().includes(query);
    const matchesBatch =
      batchFilter === "ALL" ||
      (st.batch || "").toLowerCase() === batchFilter.toLowerCase();
    const matchesMentor =
      mentorFilter === "ALL" ||
      (st.mentor || "").toLowerCase() === mentorFilter.toLowerCase();
    return matchesSearch && matchesBatch && matchesMentor;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "On Track":
        return (
          <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/40">
            On Track
          </span>
        );
      case "Needs Attention":
        return (
          <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/50 dark:border-amber-800/40">
            Needs Attention
          </span>
        );
      case "Completed":
        return (
          <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/40">
            Completed
          </span>
        );
      default:
        return (
          <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
            {status}
          </span>
        );
    }
  };

  const getProgressBarColor = (status) => {
    switch (status) {
      case "On Track":
        return "bg-[#B91C1C]";
      case "Needs Attention":
        return "bg-[#F59E0B]";
      case "Completed":
        return "bg-[#2563EB]";
      default:
        return "bg-[#B91C1C]";
    }
  };

  return (
    <div className="flex h-screen w-full font-sans overflow-hidden bg-[#FAFBFC] dark:bg-[#0E1117] text-neutral-900 dark:text-neutral-100 transition-colors">
     
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#FAFBFC] dark:bg-[#0E1117]">
        {/* Content Body */}
        <main className="flex-1 overflow-y-auto px-8 py-6 space-y-5">
          {loading ? (
            <div className="flex items-center justify-center py-24 gap-2 text-xs text-neutral-500">
              <Loader2 className="animate-spin text-[#B91C1C]" size={18} />
              <span>Loading progress data...</span>
            </div>
          ) : (
            <>
              {/* Header Title & Dropdown Filter Bars */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
                    Progress
                  </h2>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    Monitor student progress across your bootcamp.
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <select
                      value={batchFilter}
                      onChange={(e) => setBatchFilter(e.target.value)}
                      className="appearance-none pl-3 pr-7 py-1.5 rounded-md text-xs bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 text-neutral-700 dark:text-neutral-200 focus:outline-none focus:border-[#B91C1C] cursor-pointer"
                    >
                      <option value="ALL">All Batches</option>
                      {availableBatches.map((b) => (
                        <option key={b} value={b}>
                          {b} Batch
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
                      value={mentorFilter}
                      onChange={(e) => setMentorFilter(e.target.value)}
                      className="appearance-none pl-3 pr-7 py-1.5 rounded-md text-xs bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 text-neutral-700 dark:text-neutral-200 focus:outline-none focus:border-[#B91C1C] cursor-pointer"
                    >
                      <option value="ALL">All Mentors</option>
                      {availableMentors.map((m) => (
                        <option key={m} value={m}>
                          {m}
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

              {/* 4 Summary Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                <div className="p-4 rounded-xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-2xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                    STUDENTS
                  </span>
                  <div className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
                    {(data?.metrics?.students || 0).toLocaleString()}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-2xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                    ON TRACK
                  </span>
                  <div className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
                    {(data?.metrics?.onTrack || 0).toLocaleString()}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-2xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                    NEEDS ATTENTION
                  </span>
                  <div className="text-2xl font-black tracking-tight text-[#DC2626]">
                    {data?.metrics?.needsAttention || 0}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-2xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                    AVERAGE PROGRESS
                  </span>
                  <div className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
                    {data?.metrics?.averageProgress || "0%"}
                  </div>
                </div>
              </div>

              {/* Grid: Table + Dynamic Detail Drawer */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                <div
                  className={`space-y-3 transition-all duration-300 ${
                    selectedStudent ? "lg:col-span-8" : "lg:col-span-12"
                  }`}
                >
                  <div className="bg-white dark:bg-[#151921] rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 overflow-hidden shadow-2xs">
                    {/* Search & Header */}
                    <div className="p-4 flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 gap-4">
                      <h3 className="font-bold text-xs text-neutral-900 dark:text-white">
                        Student Progress
                      </h3>
                      <div className="relative w-56">
                        <Search
                          size={13}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                        />
                        <input
                          type="text"
                          placeholder="Search students..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-8 pr-3 py-1 rounded-md text-xs bg-neutral-50/50 dark:bg-[#0E1117] border border-neutral-200/80 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 placeholder:text-neutral-400 focus:outline-none focus:border-[#B91C1C]"
                        />
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                            <th className="py-2.5 px-4">STUDENT</th>
                            <th className="py-2.5 px-4">BATCH</th>
                            <th className="py-2.5 px-4">MENTOR</th>
                            <th className="py-2.5 px-4">PROJECTS</th>
                            <th className="py-2.5 px-4">PROGRESS</th>
                            <th className="py-2.5 px-4">STATUS</th>
                            <th className="py-2.5 px-4 text-right">ACTION</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
                          {filteredStudents.length === 0 ? (
                            <tr>
                              <td
                                colSpan={7}
                                className="text-center py-10 text-neutral-400 text-xs"
                              >
                                No matching records found.
                              </td>
                            </tr>
                          ) : (
                            filteredStudents.map((st) => (
                              <tr
                                key={st.id}
                                onClick={() => setSelectedStudent(st)}
                                className={`hover:bg-neutral-50/70 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer ${
                                  selectedStudent?.id === st.id
                                    ? "bg-[#FEF2F2]/50 dark:bg-primary/10"
                                    : ""
                                }`}
                              >
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-2.5">
                                    <div className="w-7 h-7 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center font-bold text-[10px] shrink-0 text-neutral-500 dark:text-neutral-400">
                                      {st.initials}
                                    </div>
                                    <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                                      {st.name}
                                    </span>
                                  </div>
                                </td>

                                <td className="py-3 px-4">
                                  <div className="text-[11px] font-medium text-neutral-800 dark:text-neutral-200">
                                    {st.batch}
                                  </div>
                                  <div className="text-[10px] text-neutral-400">
                                    {st.track}
                                  </div>
                                </td>

                                <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400 text-[11px]">
                                  {st.mentor}
                                </td>

                                <td className="py-3 px-4 text-neutral-600 dark:text-neutral-300 font-medium text-[11px]">
                                  {st.projectsCompleted}/{st.totalProjects}
                                </td>

                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-2">
                                    <div className="w-12 bg-neutral-100 dark:bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                                      <div
                                        className={`h-1.5 rounded-full ${getProgressBarColor(
                                          st.status,
                                        )}`}
                                        style={{ width: `${st.progress}%` }}
                                      />
                                    </div>
                                    <span className="text-[10px] text-neutral-400 font-medium">
                                      {st.progress}%
                                    </span>
                                  </div>
                                </td>

                                <td className="py-3 px-4">
                                  {getStatusBadge(st.status)}
                                </td>

                                <td className="py-3 px-4 text-right">
                                  <div className="flex items-center justify-end gap-2 text-neutral-400">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedStudent(st);
                                      }}
                                      title="Edit"
                                      className="p-1 hover:text-primary transition-colors cursor-pointer"
                                    >
                                      <Pencil size={13} />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteStudent(st.id);
                                      }}
                                      title="Delete"
                                      className="p-1 hover:text-primary transition-colors cursor-pointer"
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
                  </div>
                </div>

                {/* Right Drawer Card */}
                {selectedStudent && (
                  <div className="lg:col-span-4 bg-white dark:bg-[#151921] rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 p-5 shadow-2xs relative space-y-4 animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
                      <span className="text-xs font-bold text-neutral-900 dark:text-white">
                        Student Details
                      </span>
                      <button
                        type="button"
                        onClick={() => setSelectedStudent(null)}
                        className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 cursor-pointer"
                        title="Close Details"
                      >
                        <X size={15} />
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center font-bold text-xs text-neutral-600 dark:text-neutral-300">
                        {selectedStudent.initials}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-neutral-900 dark:text-white leading-tight">
                          {selectedStudent.name}
                        </h3>
                        <p className="text-[11px] text-neutral-400 mt-0.5">
                          {selectedStudent.batch} Batch ·{" "}
                          {selectedStudent.track}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div className="p-2.5 rounded-lg border border-neutral-100 dark:border-neutral-800 bg-neutral-50/40 dark:bg-neutral-800/20">
                        <span className="text-[9px] font-bold tracking-wider text-neutral-400 uppercase block mb-1">
                          STATUS
                        </span>
                        <div>{getStatusBadge(selectedStudent.status)}</div>
                      </div>

                      <div className="p-2.5 rounded-lg border border-neutral-100 dark:border-neutral-800 bg-neutral-50/40 dark:bg-neutral-800/20">
                        <span className="text-[9px] font-bold tracking-wider text-neutral-400 uppercase block mb-1">
                          MENTOR
                        </span>
                        <span className="text-[11px] font-medium text-neutral-800 dark:text-neutral-200 leading-snug">
                          {selectedStudent.mentor}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-neutral-800 dark:text-neutral-200">
                          Overall Progress
                        </span>
                        <span className="font-black text-[#B91C1C]">
                          {selectedStudent.progress}%
                        </span>
                      </div>
                      <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-1.5 rounded-full ${getProgressBarColor(
                            selectedStudent.status,
                          )}`}
                          style={{ width: `${selectedStudent.progress}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-neutral-400 block mt-1">
                        {selectedStudent.projectsCompleted} of{" "}
                        {selectedStudent.totalProjects} Projects Completed
                      </span>
                    </div>

                    <div className="space-y-2.5 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                      <span className="text-[10px] font-bold text-neutral-800 dark:text-neutral-200 block">
                        Recent Progress Activity
                      </span>

                      <div className="space-y-2.5">
                        {(selectedStudent.recentActivities || []).map(
                          (act, i) => (
                            <div
                              key={i}
                              className="flex items-start gap-2.5 text-xs"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-[#B91C1C] mt-1.5 shrink-0" />
                              <div>
                                <p className="text-[11px] font-medium text-neutral-800 dark:text-neutral-200 leading-snug">
                                  {act.title}
                                </p>
                                <span className="text-[10px] text-neutral-400">
                                  {act.time}
                                </span>
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800">
                      <button
                        type="button"
                        onClick={() =>
                          onNavigateAdminView &&
                          onNavigateAdminView("dashboard-students")
                        }
                        className="w-full py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                      >
                        View Full Profile
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
