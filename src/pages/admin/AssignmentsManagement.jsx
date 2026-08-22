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
          <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-semibold bg-[#FEF2F2] dark:bg-red-950/40 text-[#B91C1C] dark:text-red-300 border border-red-200/50 dark:border-red-900/40">
            Active
          </span>
        );
      case "Closed":
        return (
          <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200/50 dark:border-neutral-700">
            Closed
          </span>
        );
      case "Past Due":
        return (
          <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-semibold bg-rose-50 dark:bg-rose-950/40 text-[#DC2626] dark:text-rose-300 border border-rose-200/50 dark:border-rose-900/40">
            Past Due
          </span>
        );
      default:
        return (
          <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-600">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="flex h-screen w-full font-sans overflow-hidden bg-[#FAFBFC] dark:bg-[#0E1117] text-neutral-900 dark:text-neutral-100 transition-colors">
      <AdminSidebar
        currentView="dashboard-assignments"
        onNavigateAdminView={onNavigateAdminView}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#FAFBFC] dark:bg-[#0E1117]">
        {/* Header Bar */}
        <header className="h-14 bg-white dark:bg-[#151921] border-b border-neutral-200/80 dark:border-neutral-800/80 px-8 flex items-center justify-between shrink-0">
          <div className="text-xs sm:text-sm font-semibold tracking-tight text-neutral-800 dark:text-neutral-200">
            Bootcamp Admin
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

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto px-8 py-6 space-y-5">
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

                <button className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#B91C1C] hover:bg-[#991B1B] text-white text-xs font-medium transition-colors cursor-pointer shadow-2xs">
                  <Plus size={14} />
                  <span>Create Assignment</span>
                </button>
              </div>

              {/* 4 Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                <div className="p-4 rounded-xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-2xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                    TOTAL ASSIGNMENTS
                  </span>
                  <div className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
                    {data?.metrics?.totalAssignments || 24}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-2xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                    ACTIVE
                  </span>
                  <div className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
                    {data?.metrics?.active || 8}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-2xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                    PENDING REVIEW
                  </span>
                  <div className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
                    {data?.metrics?.pendingReview || 156}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-2xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                    PAST DUE
                  </span>
                  <div className="text-2xl font-black tracking-tight text-[#B91C1C]">
                    {data?.metrics?.pastDue || 3}
                  </div>
                </div>
              </div>

              {/* Filter Bar */}
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="flex-1 min-w-[200px] relative">
                  <Search
                    size={13}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                  />
                  <input
                    type="text"
                    placeholder="Search assignments..."
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
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="appearance-none pl-3 pr-7 py-1.5 rounded-md text-xs bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 text-neutral-600 dark:text-neutral-300 focus:outline-none focus:border-[#B91C1C] cursor-pointer"
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
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
                  />
                </div>

                <div className="relative">
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="appearance-none pl-3 pr-7 py-1.5 rounded-md text-xs bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 text-neutral-600 dark:text-neutral-300 focus:outline-none focus:border-[#B91C1C] cursor-pointer"
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
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
                  />
                </div>
              </div>

              {/* Table & Detail Card Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                <div
                  className={`space-y-3 transition-all duration-300 ${
                    selectedAssignment ? "lg:col-span-8" : "lg:col-span-12"
                  }`}
                >
                  <div className="bg-white dark:bg-[#151921] rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 overflow-hidden shadow-2xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                            <th className="py-2.5 px-4">ASSIGNMENT</th>
                            <th className="py-2.5 px-4">BATCH</th>
                            <th className="py-2.5 px-4">DEADLINE</th>
                            <th className="py-2.5 px-4">SUBMISSIONS</th>
                            <th className="py-2.5 px-4">STATUS</th>
                            <th className="py-2.5 px-4 text-right">ACTION</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
                          {filteredAssignments.length === 0 ? (
                            <tr>
                              <td
                                colSpan={6}
                                className="text-center py-10 text-neutral-400 text-xs"
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
                                    ? "bg-[#FEF2F2]/50 dark:bg-primary/10"
                                    : ""
                                }`}
                              >
                                <td className="py-3 px-4 font-semibold text-neutral-900 dark:text-neutral-100">
                                  {a.title}
                                </td>

                                <td className="py-3 px-4 text-neutral-600 dark:text-neutral-300">
                                  <div className="text-[11px] font-medium">
                                    {a.batch} Batch
                                  </div>
                                </td>

                                <td className="py-3 px-4 text-xs text-neutral-500 dark:text-neutral-400">
                                  {a.deadline}
                                </td>

                                <td className="py-3 px-4 font-medium text-neutral-700 dark:text-neutral-300">
                                  {a.submissionsCount}/{a.totalStudents}
                                </td>

                                <td className="py-3 px-4">
                                  {getStatusBadge(a.status)}
                                </td>

                                <td className="py-3 px-4 text-right">
                                  <div className="flex items-center justify-end gap-2 text-neutral-400">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedAssignment(a);
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
                                        handleDeleteAssignment(a.id);
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

                {/* Right Assignment Details Drawer */}
                {selectedAssignment && (
                  <div className="lg:col-span-4 bg-white dark:bg-[#151921] rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 p-5 shadow-2xs relative space-y-4 animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
                      <span className="text-xs font-bold text-neutral-900 dark:text-white">
                        Assignment Details
                      </span>
                      <button
                        type="button"
                        onClick={() => setSelectedAssignment(null)}
                        className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 cursor-pointer"
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
                      <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#B91C1C] hover:underline cursor-pointer">
                        <Paperclip size={13} />
                        <span>{selectedAssignment.resourceName}</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg border border-red-100 dark:border-red-900/30 bg-[#FEF2F2]/60 dark:bg-red-950/20 flex items-center justify-between text-xs">
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
                        <span className="text-[9px] font-bold uppercase tracking-wider text-[#B91C1C] block mb-0.5">
                          PENDING REVIEW
                        </span>
                        <span className="font-black text-[#B91C1C] text-sm">
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
                        className="w-full py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
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
