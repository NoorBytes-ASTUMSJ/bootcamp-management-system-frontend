import React, { useState, useEffect, useRef } from "react";
import AdminSidebar from "../../components/layout/AdminSidebar";
import { getSubmissionsOverview } from "../../services/submissionService";
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
  ExternalLink,
  AlertTriangle,
  Code2,
} from "lucide-react";

export default function SubmissionsManagement({
  isDarkMode,
  onToggleTheme,
  onNavigateAdminView,
  onLogout,
}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [batchFilter, setBatchFilter] = useState("ALL");
  const [assignmentFilter, setAssignmentFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedSubmission, setSelectedSubmission] = useState(null);

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
      const overview = await getSubmissionsOverview();
      setData(overview);
      setLoading(false);
    }
    loadData();
  }, []);

  const submissionsList = data?.submissions || [];

  const availableBatches = [
    ...new Set(submissionsList.map((s) => s.batch).filter(Boolean)),
  ];
  const availableAssignments = [
    ...new Set(submissionsList.map((s) => s.assignmentTitle).filter(Boolean)),
  ];
  const availableStatuses = [
    ...new Set(submissionsList.map((s) => s.status).filter(Boolean)),
  ];

  const filteredSubmissions = submissionsList.filter((s) => {
    const query = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !query ||
      (s.studentName || "").toLowerCase().includes(query) ||
      (s.assignmentTitle || "").toLowerCase().includes(query);
    const matchesBatch =
      batchFilter === "ALL" ||
      (s.batch || "").toLowerCase() === batchFilter.toLowerCase();
    const matchesAssignment =
      assignmentFilter === "ALL" ||
      (s.assignmentTitle || "").toLowerCase() ===
        assignmentFilter.toLowerCase();
    const matchesStatus =
      statusFilter === "ALL" ||
      (s.status || "").toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesBatch && matchesAssignment && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "Reviewed":
        return (
          <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/40">
            REVIEWED
          </span>
        );
      case "Pending Review":
        return (
          <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200/50 dark:border-sky-800/40">
            PENDING REVIEW
          </span>
        );
      case "Late":
        return (
          <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/50 dark:border-amber-800/40">
            LATE
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
    <div className="w-full font-sans bg-[#FAFBFC] dark:bg-[#0E1117] text-neutral-900 dark:text-neutral-100 transition-colors">
      <div className="flex-1 flex flex-col min-w-0">
        {/* Content Body */}
        <main className="px-8 py-6 space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-24 gap-2 text-xs text-neutral-500">
              <Loader2 className="animate-spin text-[#B91C1C]" size={18} />
              <span>Loading submissions data...</span>
            </div>
          ) : (
            <>
              {/* Header Title */}
              <div>
                <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
                  Submissions
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Review student assignment submissions and grading progress.
                </p>
              </div>

              {/* 4 Summary Stat Cards with Hover Lift */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Submissions */}
                <div className="p-5 rounded-2xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-md shadow-neutral-200/50 dark:shadow-none transition-all duration-300 hover:border-[#B91C1C]/50 hover:-translate-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                    TOTAL SUBMISSIONS
                  </span>
                  <div className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
                    {data?.metrics?.totalSubmissions || 450}
                  </div>
                </div>

                {/* Pending Review */}
                <div className="p-5 rounded-2xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-md shadow-neutral-200/50 dark:shadow-none border-l-4 border-l-[#0284C7] transition-all duration-300 hover:border-[#B91C1C]/50 hover:-translate-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                    PENDING REVIEW
                  </span>
                  <div className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
                    {data?.metrics?.pendingReview || 32}
                  </div>
                </div>

                {/* Reviewed */}
                <div className="p-5 rounded-2xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-md shadow-neutral-200/50 dark:shadow-none transition-all duration-300 hover:border-[#B91C1C]/50 hover:-translate-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                    REVIEWED
                  </span>
                  <div className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
                    {data?.metrics?.reviewed || 410}
                  </div>
                </div>

                {/* Late Submissions */}
                <div className="p-5 rounded-2xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-md shadow-neutral-200/50 dark:shadow-none border-l-4 border-l-[#EA580C] transition-all duration-300 hover:border-[#B91C1C]/50 hover:-translate-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                    LATE SUBMISSIONS
                  </span>
                  <div className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
                    {data?.metrics?.lateSubmissions || 8}
                  </div>
                </div>
              </div>

              {/* Filters Bar */}
              <div className="p-4 bg-white dark:bg-[#151921] rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-md shadow-neutral-200/50 dark:shadow-none transition-all duration-300 hover:border-[#B91C1C]/40">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex-1 min-w-[200px] relative">
                    <Search
                      size={13}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
                    />
                    <input
                      type="text"
                      placeholder="Search student or assignment..."
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
                      <option value="ALL">Filter by Batch</option>
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
                      value={assignmentFilter}
                      onChange={(e) => setAssignmentFilter(e.target.value)}
                      className="appearance-none pl-3.5 pr-8 py-2 rounded-xl text-xs bg-white dark:bg-[#0E1117] border border-neutral-200/80 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 focus:outline-none focus:border-[#B91C1C] cursor-pointer shadow-xs font-medium"
                    >
                      <option value="ALL">Filter by Assignment</option>
                      {availableAssignments.map((a) => (
                        <option key={a} value={a}>
                          {a}
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
                      <option value="ALL">Filter by Status</option>
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
                </div>
              </div>

              {/* Submission Records Card */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div
                  className={`space-y-4 transition-all duration-300 ${
                    selectedSubmission ? "lg:col-span-8" : "lg:col-span-12"
                  }`}
                >
                  <div className="bg-white dark:bg-[#151921] rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 overflow-hidden shadow-md shadow-neutral-200/50 dark:shadow-none transition-all duration-300">
                    <div className="p-4.5 border-b border-neutral-100 dark:border-neutral-800">
                      <h3 className="font-bold text-xs text-neutral-900 dark:text-white">
                        Submission Records
                      </h3>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                            <th className="py-3.5 px-5">STUDENT</th>
                            <th className="py-3.5 px-5">ASSIGNMENT</th>
                            <th className="py-3.5 px-5">BATCH</th>
                            <th className="py-3.5 px-5">SUBMITTED</th>
                            <th className="py-3.5 px-5">STATUS</th>
                            <th className="py-3.5 px-5">GRADE</th>
                            <th className="py-3.5 px-5 text-right">ACTION</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
                          {filteredSubmissions.length === 0 ? (
                            <tr>
                              <td
                                colSpan={7}
                                className="text-center py-12 text-neutral-400 text-xs"
                              >
                                No submissions found.
                              </td>
                            </tr>
                          ) : (
                            filteredSubmissions.map((s) => (
                              <tr
                                key={s.id}
                                onClick={() => setSelectedSubmission(s)}
                                className={`hover:bg-neutral-50/70 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer ${
                                  selectedSubmission?.id === s.id
                                    ? "bg-neutral-100/70 dark:bg-neutral-800/60"
                                    : ""
                                }`}
                              >
                                <td className="py-4 px-5 font-semibold text-neutral-900 dark:text-neutral-100">
                                  {s.studentName}
                                </td>

                                <td className="py-4 px-5 text-neutral-600 dark:text-neutral-300">
                                  {s.assignmentTitle}
                                </td>

                                <td className="py-4 px-5 text-neutral-600 dark:text-neutral-400">
                                  {s.batch} Batch
                                </td>

                                <td className="py-4 px-5">
                                  {s.isLate ? (
                                    <span className="inline-flex items-center gap-1 text-[#EA580C] font-medium text-xs">
                                      <AlertTriangle size={12} />
                                      {s.submittedDate}
                                    </span>
                                  ) : (
                                    <span className="text-neutral-500 dark:text-neutral-400 text-xs">
                                      {s.submittedDate}
                                    </span>
                                  )}
                                </td>

                                <td className="py-4 px-5">
                                  {getStatusBadge(s.status)}
                                </td>

                                <td className="py-4 px-5 font-medium text-neutral-700 dark:text-neutral-300">
                                  {s.grade}
                                </td>

                                <td className="py-4 px-5 text-right">
                                  {s.status === "Pending Review" ? (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedSubmission(s);
                                      }}
                                      className="px-3 py-1.5 rounded-xl bg-[#B91C1C] hover:bg-[#991B1B] text-white text-[11px] font-medium transition-colors cursor-pointer shadow-xs"
                                    >
                                      Grade
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedSubmission(s);
                                      }}
                                      className="px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-[11px] font-medium transition-colors cursor-pointer shadow-xs"
                                    >
                                      View
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>

                    <div className="px-5 py-3.5 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400 bg-neutral-50/30 dark:bg-neutral-800/20">
                      <span>
                        Showing 1 to {filteredSubmissions.length} of{" "}
                        {data?.metrics?.totalSubmissions || 450} entries
                      </span>
                      <div className="flex items-center gap-3">
                        <button className="hover:text-neutral-700 dark:hover:text-neutral-200 cursor-pointer transition-colors">
                          Previous
                        </button>
                        <button className="hover:text-neutral-700 dark:hover:text-neutral-200 cursor-pointer font-semibold text-neutral-700 dark:text-neutral-200 transition-colors">
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Submission Details Drawer */}
                {selectedSubmission && (
                  <div className="lg:col-span-4 bg-white dark:bg-[#151921] rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 p-6 shadow-md shadow-neutral-200/50 dark:shadow-none relative space-y-4 animate-in fade-in zoom-in-95 duration-200 transition-all">
                    <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
                      <span className="text-xs font-bold text-neutral-900 dark:text-white">
                        Submission Details
                      </span>
                      <button
                        type="button"
                        onClick={() => setSelectedSubmission(null)}
                        className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 cursor-pointer p-1"
                        title="Close Details"
                      >
                        <X size={15} />
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center font-bold text-xs text-neutral-600 dark:text-neutral-300">
                        {selectedSubmission.studentInitials}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-neutral-900 dark:text-white leading-tight">
                          {selectedSubmission.studentName}
                        </h3>
                        <p className="text-[11px] text-neutral-400 mt-0.5">
                          {selectedSubmission.batch} Batch
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-800 text-xs">
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 block mb-0.5">
                          ASSIGNMENT
                        </span>
                        <span className="font-semibold text-neutral-800 dark:text-neutral-200 text-xs">
                          {selectedSubmission.assignmentTitle}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-1">
                        <div>
                          <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 block mb-0.5">
                            STATUS
                          </span>
                          <div>{getStatusBadge(selectedSubmission.status)}</div>
                        </div>
                        <div>
                          <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 block mb-0.5">
                            GRADE
                          </span>
                          <span className="font-bold text-neutral-800 dark:text-neutral-200 text-xs">
                            {selectedSubmission.grade}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-800 text-xs">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 block">
                        LINKS & ARTIFACTS
                      </span>
                      <div className="space-y-2">
                        {selectedSubmission.githubUrl && (
                          <a
                            href={selectedSubmission.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-2.5 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 text-xs text-neutral-700 dark:text-neutral-300 hover:text-[#B91C1C] transition-colors"
                          >
                            <Code2 size={14} className="text-[#B91C1C]" />
                            <span className="truncate flex-1">
                              {selectedSubmission.githubUrl}
                            </span>
                            <ExternalLink
                              size={12}
                              className="text-neutral-400"
                            />
                          </a>
                        )}
                        {selectedSubmission.demoUrl && (
                          <a
                            href={selectedSubmission.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-2.5 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 text-xs text-neutral-700 dark:text-neutral-300 hover:text-[#B91C1C] transition-colors"
                          >
                            <ExternalLink size={14} />
                            <span className="truncate flex-1">Live Demo</span>
                          </a>
                        )}
                      </div>
                    </div>

                    {selectedSubmission.feedback && (
                      <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                          MENTOR FEEDBACK
                        </span>
                        <p className="text-[11px] text-neutral-600 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-800/40 p-3 rounded-xl border border-neutral-200/60 dark:border-neutral-800">
                          {selectedSubmission.feedback}
                        </p>
                      </div>
                    )}

                    <div className="pt-2">
                      {selectedSubmission.status === "Pending Review" ? (
                        <button
                          type="button"
                          className="w-full py-2.5 rounded-xl bg-[#B91C1C] hover:bg-[#991B1B] text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
                        >
                          Grade Submission
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="w-full py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer shadow-xs"
                        >
                          Update Feedback
                        </button>
                      )}
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
