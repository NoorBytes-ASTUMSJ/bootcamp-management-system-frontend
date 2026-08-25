import React, { useState, useEffect, useRef } from "react";
import AdminSidebar from "../../components/layout/AdminSidebar";
import { getAssignmentsOverview } from "../../services/assignmentService";
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
  Plus,
  Loader2,
  Paperclip,
  Pencil,
  Trash2,
} from "lucide-react";

export default function AssignmentsManagement({
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
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [selectedAssignment, setSelectedAssignment] = useState(null);

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
      const overview = await getAssignmentsOverview();
      setData(overview);
      if (overview?.assignments?.length > 0) {
        setSelectedAssignment(overview.assignments[0]);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const handleDeleteAssignment = (id) => {
    if (!data) return;
    const updated = data.assignments.filter((a) => a.id !== id);
    setData({ ...data, assignments: updated });
    if (selectedAssignment?.id === id) {
      setSelectedAssignment(null);
    }
  };

  const assignmentsList = data?.assignments || [];

  const availableBatches = [
    ...new Set(assignmentsList.map((a) => a.batch).filter(Boolean)),
  ];
  const availableStatuses = [
    ...new Set(assignmentsList.map((a) => a.status).filter(Boolean)),
  ];
  const availableTypes = [
    ...new Set(assignmentsList.map((a) => a.type).filter(Boolean)),
  ];

  const filteredAssignments = assignmentsList.filter((a) => {
    const query = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !query ||
      (a.title || "").toLowerCase().includes(query) ||
      (a.batchName || "").toLowerCase().includes(query);
    const matchesBatch =
      batchFilter === "ALL" ||
      (a.batch || "").toLowerCase() === batchFilter.toLowerCase();
    const matchesStatus =
      statusFilter === "ALL" ||
      (a.status || "").toLowerCase() === statusFilter.toLowerCase();
    const matchesType =
      typeFilter === "ALL" ||
      (a.type || "").toLowerCase() === typeFilter.toLowerCase();

    return matchesSearch && matchesBatch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "Active":
        return (
          <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-900/40">
            Active
          </span>
        );
      case "Closed":
        return (
          <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200/60 dark:border-rose-900/40">
            Closed
          </span>
        );
      case "Past Due":
        return (
          <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-semibold bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200/60 dark:border-sky-900/40">
            Past Due
          </span>
        );
      default:
        return (
          <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200/50 dark:border-neutral-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="w-full font-sans bg-[#FAFBFC] dark:bg-[#0E1117] text-neutral-900 dark:text-neutral-100 transition-colors">
      <div className="flex-1 flex flex-col min-w-0">
        {/* Main Content Area */}
        <main className="px-8 py-6 space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-24 gap-2 text-xs text-neutral-500">
              <Loader2 className="animate-spin text-[#B91C1C]" size={18} />
              <span>Loading assignments data...</span>
            </div>
          ) : (
            <>
              {/* Header Title + Create Action Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
                    Assignments
                  </h2>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    Manage assignments and monitor their progress.
                  </p>
                </div>

                <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#B91C1C] hover:bg-[#991B1B] text-white text-xs font-medium transition-all duration-300 cursor-pointer shadow-md shadow-red-500/10 hover:-translate-y-0.5">
                  <Plus size={14} />
                  <span>Create Assignment</span>
                </button>
              </div>

              {/* 4 Stat Cards with Modern Hover Effects */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-md shadow-neutral-200/50 dark:shadow-none transition-all duration-300 hover:border-[#B91C1C]/50 hover:-translate-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                    TOTAL ASSIGNMENTS
                  </span>
                  <div className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
                    {data?.metrics?.totalAssignments || 24}
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-md shadow-neutral-200/50 dark:shadow-none transition-all duration-300 hover:border-[#B91C1C]/50 hover:-translate-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-1">
                    ACTIVE
                  </span>
                  <div className="text-2xl font-black tracking-tight text-emerald-600 dark:text-emerald-400">
                    {data?.metrics?.active || 8}
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-md shadow-neutral-200/50 dark:shadow-none transition-all duration-300 hover:border-[#B91C1C]/50 hover:-translate-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                    PENDING REVIEW
                  </span>
                  <div className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
                    {data?.metrics?.pendingReview || 156}
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-md shadow-neutral-200/50 dark:shadow-none transition-all duration-300 hover:border-[#B91C1C]/50 hover:-translate-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 block mb-1">
                    PAST DUE
                  </span>
                  <div className="text-2xl font-black tracking-tight text-sky-600 dark:text-sky-400">
                    {data?.metrics?.pastDue || 3}
                  </div>
                </div>
              </div>

              {/* Filter Bar */}
              <div className="p-4 bg-white dark:bg-[#151921] rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-md shadow-neutral-200/50 dark:shadow-none transition-all duration-300 hover:border-[#B91C1C]/40">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex-1 min-w-[200px] relative">
                    <Search
                      size={13}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
                    />
                    <input
                      type="text"
                      placeholder="Search assignments..."
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
                          {b} Batch
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
                      <option value="ALL">All Statuses</option>
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
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      className="appearance-none pl-3.5 pr-8 py-2 rounded-xl text-xs bg-white dark:bg-[#0E1117] border border-neutral-200/80 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 focus:outline-none focus:border-[#B91C1C] cursor-pointer shadow-xs font-medium"
                    >
                      <option value="ALL">All Types</option>
                      {availableTypes.map((t) => (
                        <option key={t} value={t}>
                          {t}
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

              {/* Table & Detail Card Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div
                  className={`space-y-4 transition-all duration-300 ${
                    selectedAssignment ? "lg:col-span-8" : "lg:col-span-12"
                  }`}
                >
                  <div className="bg-white dark:bg-[#151921] rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 overflow-hidden shadow-md shadow-neutral-200/50 dark:shadow-none transition-all duration-300">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                            <th className="py-3.5 px-5">ASSIGNMENT</th>
                            <th className="py-3.5 px-5">BATCH</th>
                            <th className="py-3.5 px-5">DEADLINE</th>
                            <th className="py-3.5 px-5">SUBMISSIONS</th>
                            <th className="py-3.5 px-5">STATUS</th>
                            <th className="py-3.5 px-5 text-right">ACTION</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
                          {filteredAssignments.length === 0 ? (
                            <tr>
                              <td
                                colSpan={6}
                                className="text-center py-12 text-neutral-400 text-xs"
                              >
                                No assignments found.
                              </td>
                            </tr>
                          ) : (
                            filteredAssignments.map((a) => (
                              <tr
                                key={a.id}
                                onClick={() => setSelectedAssignment(a)}
                                className={`hover:bg-neutral-50/70 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer ${
                                  selectedAssignment?.id === a.id
                                    ? "bg-neutral-100/70 dark:bg-neutral-800/60"
                                    : ""
                                }`}
                              >
                                <td className="py-4 px-5 font-semibold text-neutral-900 dark:text-neutral-100">
                                  {a.title}
                                </td>

                                <td className="py-4 px-5 text-neutral-600 dark:text-neutral-300">
                                  <div className="text-[11px] font-medium">
                                    {a.batch} Batch
                                  </div>
                                </td>

                                <td className="py-4 px-5 text-xs text-neutral-500 dark:text-neutral-400">
                                  {a.deadline}
                                </td>

                                <td className="py-4 px-5 font-medium text-neutral-700 dark:text-neutral-300">
                                  {a.submissionsCount}/{a.totalStudents}
                                </td>

                                <td className="py-4 px-5">
                                  {getStatusBadge(a.status)}
                                </td>

                                <td className="py-4 px-5 text-right">
                                  <div className="flex items-center justify-end gap-2 text-neutral-400">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedAssignment(a);
                                      }}
                                      title="Edit"
                                      className="p-1.5 rounded-lg hover:text-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 dark:hover:text-neutral-100 transition-colors cursor-pointer"
                                    >
                                      <Pencil size={14} />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteAssignment(a.id);
                                      }}
                                      title="Delete"
                                      className="p-1.5 rounded-lg hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                                    >
                                      <Trash2 size={14} />
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

                {/* Right Assignment Details Drawer */}
                {selectedAssignment && (
                  <div className="lg:col-span-4 bg-white dark:bg-[#151921] rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 p-6 shadow-md shadow-neutral-200/50 dark:shadow-none relative space-y-4 animate-in fade-in zoom-in-95 duration-200 transition-all">
                    <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
                      <span className="text-xs font-bold text-neutral-900 dark:text-white">
                        Assignment Details
                      </span>
                      <button
                        type="button"
                        onClick={() => setSelectedAssignment(null)}
                        className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 cursor-pointer p-1"
                        title="Close Details"
                      >
                        <X size={15} />
                      </button>
                    </div>

                    <div>
                      {getStatusBadge(selectedAssignment.status)}
                      <h3 className="font-bold text-sm text-neutral-900 dark:text-white mt-2 leading-tight">
                        {selectedAssignment.title}
                      </h3>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                        {selectedAssignment.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-neutral-100 dark:border-neutral-800 text-xs">
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 block mb-0.5">
                          BATCH
                        </span>
                        <span className="text-[11px] font-medium text-neutral-800 dark:text-neutral-200">
                          {selectedAssignment.batch} Batch
                        </span>
                      </div>

                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 block mb-0.5">
                          TYPE
                        </span>
                        <span className="text-[11px] font-medium text-neutral-800 dark:text-neutral-200">
                          {selectedAssignment.type}
                        </span>
                      </div>

                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 block mb-0.5">
                          DEADLINE
                        </span>
                        <span className="text-[11px] font-medium text-neutral-800 dark:text-neutral-200">
                          {selectedAssignment.deadlineFull}
                        </span>
                      </div>

                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 block mb-0.5">
                          MAX SCORE
                        </span>
                        <span className="text-[11px] font-medium text-neutral-800 dark:text-neutral-200">
                          {selectedAssignment.maxScore}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                        RESOURCES
                      </span>
                      <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-sky-600 dark:text-sky-400 hover:underline cursor-pointer">
                        <Paperclip size={13} />
                        <span>{selectedAssignment.resourceName}</span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl border border-neutral-200/70 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-800/30 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-500 block mb-0.5">
                          SUBMISSIONS
                        </span>
                        <span className="font-bold text-neutral-900 dark:text-white text-xs">
                          {selectedAssignment.submissionsCount} /{" "}
                          {selectedAssignment.totalStudents}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-500 block mb-0.5">
                          PENDING REVIEW
                        </span>
                        <span className="font-black text-neutral-800 dark:text-neutral-200 text-sm">
                          {selectedAssignment.pendingReview}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() =>
                          onNavigateAdminView &&
                          onNavigateAdminView("dashboard-submissions")
                        }
                        className="w-full py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer shadow-xs"
                      >
                        View Submissions
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
