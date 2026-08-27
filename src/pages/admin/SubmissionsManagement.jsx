import React, { useState, useEffect, useRef } from "react";
import AdminSidebar from "../../components/layout/AdminSidebar";
import API from "../../services/api";
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
  FileText,
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
  const [selectedAssignmentId, setSelectedAssignmentId] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
        const query = {};
        if (selectedAssignmentId && selectedAssignmentId !== "ALL") {
          query.assignmentId = selectedAssignmentId;
        }
        if (statusFilter && statusFilter !== "ALL") {
          query.status = statusFilter;
        }

        const response = await API.get("/submissions/admin", { params: query });

        if (response.data && response.data.data) {
          setData(response.data.data);
        } else if (response.data) {
          setData(response.data);
        }
      } catch (error) {}
      setLoading(false);
    }
    loadData();
  }, [selectedAssignmentId, statusFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedAssignmentId, statusFilter]);

  const submissionsList = data?.submissions || [];
  const globalAssignments = data?.globalAssignments || [];
  const availableStatuses = [
    "Pending Review",
    "Reviewed",
    "Needs Resubmission",
    "Late",
  ];

  const filteredSubmissions = submissionsList.filter((s) => {
    const query = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !query ||
      (s.studentName || "").toLowerCase().includes(query) ||
      (s.assignmentTitle || "").toLowerCase().includes(query);

    return matchesSearch;
  });

  const totalItems = filteredSubmissions.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSubmissions = filteredSubmissions.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const startItem = totalItems === 0 ? 0 : startIndex + 1;
  const endItem = Math.min(startIndex + itemsPerPage, totalItems);

  const isAssignmentSelected = selectedAssignmentId !== "ALL";
  const displayMetrics = {
    totalSubmissions: isAssignmentSelected
      ? data?.metrics?.totalSubmissions || 0
      : 0,
    pendingReview: isAssignmentSelected ? data?.metrics?.pendingReview || 0 : 0,
    reviewed: isAssignmentSelected ? data?.metrics?.reviewed || 0 : 0,
    lateSubmissions: isAssignmentSelected
      ? data?.metrics?.lateSubmissions || 0
      : 0,
  };

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
      case "Needs Resubmission":
        return (
          <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200/50 dark:border-purple-800/40">
            NEEDS RESUBMISSION
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
        <main className="px-8 py-6 space-y-6">
          {loading && !data ? (
            <div className="flex items-center justify-center py-24 gap-2 text-xs text-neutral-500">
              <Loader2 className="animate-spin text-[#B91C1C]" size={18} />
              <span>Loading submissions data...</span>
            </div>
          ) : (
            <>
              <div>
                <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
                  Submissions
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Review student assignment submissions and grading progress.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-white dark:bg-[#151921] shadow-sm hover:shadow-md dark:shadow-none transition-all duration-300 hover:-translate-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                    TOTAL SUBMISSIONS
                  </span>
                  <div className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
                    {displayMetrics.totalSubmissions}
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-[#151921] shadow-sm hover:shadow-md dark:shadow-none transition-all duration-300 hover:-translate-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-500 block mb-1">
                    PENDING REVIEW
                  </span>
                  <div className="text-2xl font-black tracking-tight text-sky-600 dark:text-sky-500">
                    {displayMetrics.pendingReview}
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-[#151921] shadow-sm hover:shadow-md dark:shadow-none transition-all duration-300 hover:-translate-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-500 block mb-1">
                    REVIEWED
                  </span>
                  <div className="text-2xl font-black tracking-tight text-emerald-600 dark:text-emerald-500">
                    {displayMetrics.reviewed}
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-[#151921] shadow-sm hover:shadow-md dark:shadow-none transition-all duration-300 hover:-translate-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-500 block mb-1">
                    LATE SUBMISSIONS
                  </span>
                  <div className="text-2xl font-black tracking-tight text-orange-600 dark:text-orange-500">
                    {displayMetrics.lateSubmissions}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white dark:bg-[#151921] rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-md shadow-neutral-200/50 dark:shadow-none transition-all duration-300 hover:border-[#B91C1C]/40">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex-1 min-w-50 relative">
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

                  <div className="relative min-w-55">
                    <select
                      value={selectedAssignmentId}
                      onChange={(e) => setSelectedAssignmentId(e.target.value)}
                      className="appearance-none w-full pl-3.5 pr-8 py-2 rounded-xl text-xs bg-white dark:bg-[#0E1117] border border-neutral-200/80 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 focus:outline-none focus:border-[#B91C1C] cursor-pointer shadow-xs font-medium"
                    >
                      <option value="ALL">Select Assignment...</option>
                      {Array.isArray(globalAssignments) &&
                        globalAssignments.map((a) => (
                          <option key={a._id} value={a._id}>
                            {a.title} {a.batch?.name ? `(${a.batch.name})` : ""}
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
                </div>
              </div>

              {!isAssignmentSelected ? (
                <div className="bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 rounded-2xl p-16 text-center space-y-3 shadow-md">
                  <FileText className="w-10 h-10 mx-auto text-neutral-400 opacity-60" />
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                    Please Select an Assignment
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto">
                    Use the assignment dropdown filter above to choose a task
                    and view its student submissions, grading status, and
                    metrics.
                  </p>
                </div>
              ) : (
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
                            {paginatedSubmissions.length === 0 ? (
                              <tr>
                                <td
                                  colSpan={7}
                                  className="text-center py-12 text-neutral-400 text-xs"
                                >
                                  No submissions found for this assignment.
                                </td>
                              </tr>
                            ) : (
                              paginatedSubmissions.map((s) => (
                                <tr
                                  key={s.id}
                                  onClick={() => setSelectedSubmission(s)}
                                  className={`hover:bg-neutral-50/70 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer ${
                                    selectedSubmission?.id === s.id
                                      ? "bg-neutral-100/70 dark:bg-neutral-800/60"
                                      : ""
                                  }`}
                                >
                                  <td className="py-4 px-5 font-semibold text-neutral-900 dark:text-white">
                                    {s.studentName}
                                  </td>

                                  <td className="py-4 px-5 text-neutral-600 dark:text-neutral-300">
                                    {s.assignmentTitle}
                                  </td>

                                  <td className="py-4 px-5 text-neutral-600 dark:text-neutral-400">
                                    {s.batchName}
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
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>

                      <div className="px-5 py-3.5 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400 bg-neutral-50/30 dark:bg-neutral-800/20">
                        <span>
                          {totalItems === 0
                            ? "Showing 0 of 0 entries"
                            : `Showing ${startItem} to ${endItem} of ${totalItems} entries`}
                        </span>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() =>
                              setCurrentPage((prev) => Math.max(prev - 1, 1))
                            }
                            disabled={currentPage === 1 || totalItems === 0}
                            className={`cursor-pointer transition-colors font-medium ${currentPage === 1 || totalItems === 0 ? "text-neutral-300 dark:text-neutral-600 cursor-not-allowed" : "hover:text-neutral-700 dark:hover:text-neutral-200 text-neutral-500 dark:text-neutral-400"}`}
                          >
                            Previous
                          </button>
                          <button
                            onClick={() =>
                              setCurrentPage((prev) =>
                                Math.min(prev + 1, totalPages),
                              )
                            }
                            disabled={
                              currentPage === totalPages || totalItems === 0
                            }
                            className={`cursor-pointer transition-colors font-medium ${currentPage === totalPages || totalItems === 0 ? "text-neutral-300 dark:text-neutral-600 cursor-not-allowed" : "hover:text-neutral-700 dark:hover:text-neutral-200 text-neutral-500 dark:text-neutral-400"}`}
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

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
                            {selectedSubmission.batchName}
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
                            <div>
                              {getStatusBadge(selectedSubmission.status)}
                            </div>
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
                              <ExternalLink
                                size={14}
                                className="text-[#B91C1C]"
                              />
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

                      <div className="pt-4 mt-4 border-t border-neutral-100 dark:border-neutral-800">
                        <p className="text-[10px] text-center text-neutral-400 italic">
                          Only assigned Mentors can grade or update feedback.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
