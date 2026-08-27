import React, { useState, useEffect } from "react";
import API from "../../services/api";
import {
  Search,
  ClipboardList,
  Clock,
  CheckCircle,
  AlertTriangle,
  UploadCloud,
  FileText,
  Code2,
  ExternalLink,
  X,
  Loader2,
  Paperclip,
  Calendar,
} from "lucide-react";

export default function StudentAssignments() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSubmission, setActiveSubmission] = useState(null);
  const [formData, setFormData] = useState({
    githubUrl: "",
    liveDemoUrl: "",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchMySubmissions();
  }, []);

  const fetchMySubmissions = async () => {
    setLoading(true);
    try {
      const response = await API.get("/submissions/me");
      const data = response.data?.data?.submissions || [];

      const formatted = data.map((sub) => ({
        id: sub._id,
        assignmentTitle: sub.assignment?.title || "Untitled Assignment",
        description: sub.assignment?.description || "",
        batchName: sub.assignment?.batch?.name || "",
        deadline: sub.assignment?.deadline,
        deadlineFormatted: sub.assignment?.deadline
          ? new Date(sub.assignment.deadline).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "No Deadline",
        fileName: sub.assignment?.fileName || "",
        fileUrl: sub.assignment?.fileUrl || "",
        status: sub.status,
        score: sub.score,
        maxScore: sub.assignment?.maxScore || 100,
        feedback: sub.feedback || "",
        githubUrl: sub.githubUrl || "",
        demoUrl: sub.liveDemoUrl || "",
        submittedAt: sub.submittedAt
          ? new Date(sub.submittedAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })
          : null,
      }));
      setSubmissions(formatted);
    } catch (error) {
      console.error("Failed to fetch submissions");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openSubmitModal = (sub) => {
    setActiveSubmission(sub);
    setFormData({
      githubUrl: sub.githubUrl || "",
      liveDemoUrl: sub.demoUrl || "",
      notes: "",
    });
    setErrorMessage("");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.githubUrl) {
      setErrorMessage("GitHub URL is required.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await API.patch(`/submissions/${activeSubmission.id}/submit`, formData);
      setIsModalOpen(false);
      fetchMySubmissions();
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Failed to submit assignment.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const metrics = {
    total: submissions.length,
    toDo: submissions.filter((s) =>
      ["not_started", "needs_resubmission"].includes(s.status),
    ).length,
    pending: submissions.filter((s) => s.status === "submitted").length,
    completed: submissions.filter((s) =>
      ["graded", "reviewed"].includes(s.status),
    ).length,
  };

  const filteredSubmissions = submissions.filter((s) => {
    const matchesSearch = s.assignmentTitle
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesTab =
      activeTab === "All" ||
      (activeTab === "Action Required" &&
        ["not_started", "needs_resubmission"].includes(s.status)) ||
      (activeTab === "Pending Review" && s.status === "submitted") ||
      (activeTab === "Completed" && ["graded", "reviewed"].includes(s.status));

    return matchesSearch && matchesTab;
  });

  const getStatusConfig = (status) => {
    switch (status) {
      case "not_started":
        return {
          icon: <UploadCloud className="w-3.5 h-3.5" />,
          label: "Action Required",
          classes:
            "bg-surface-muted text-neutral-600 border-neutral-200 dark:border-neutral-700",
        };
      case "needs_resubmission":
        return {
          icon: <AlertTriangle className="w-3.5 h-3.5" />,
          label: "Resubmission Needed",
          classes:
            "bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/30 dark:border-rose-900/50",
        };
      case "submitted":
        return {
          icon: <Clock className="w-3.5 h-3.5" />,
          label: "Pending Review",
          classes:
            "bg-sky-50 text-sky-600 border-sky-200 dark:bg-sky-950/30 dark:border-sky-900/50",
        };
      case "graded":
      case "reviewed":
        return {
          icon: <CheckCircle className="w-3.5 h-3.5" />,
          label: "Graded",
          classes:
            "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-900/50",
        };
      default:
        return {
          icon: <FileText className="w-3.5 h-3.5" />,
          label: status,
          classes: "bg-surface-muted text-text-muted border-border",
        };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-100 text-neutral-500">
        <Loader2 className="w-6 h-6 animate-spin text-[#B91C1C] mr-2" />
        <span className="text-sm font-medium">Loading your workspace...</span>
      </div>
    );
  }

  return (
    <div className="w-full font-sans bg-[#FAFBFC] dark:bg-[#0E1117] text-neutral-900 dark:text-neutral-100 transition-colors">
      <main className="px-8 py-6 space-y-6 max-w-7xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            My Work
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Track your assignments, submit your projects, and view mentor
            feedback.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center gap-4 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-[#151921] p-5 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
              <ClipboardList className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-0.5">
                Total Tasks
              </p>
              <h4 className="text-2xl font-black text-neutral-900 dark:text-white leading-none">
                {metrics.total}
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-[#151921] p-5 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-500">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-500 mb-0.5">
                Action Required
              </p>
              <h4 className="text-2xl font-black text-neutral-900 dark:text-white leading-none">
                {metrics.toDo}
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-[#151921] p-5 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-50 dark:bg-sky-950/30 text-sky-600 dark:text-sky-500">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-500 mb-0.5">
                Pending Review
              </p>
              <h4 className="text-2xl font-black text-neutral-900 dark:text-white leading-none">
                {metrics.pending}
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-[#151921] p-5 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-500">
              <CheckCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-500 mb-0.5">
                Completed
              </p>
              <h4 className="text-2xl font-black text-neutral-900 dark:text-white leading-none">
                {metrics.completed}
              </h4>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#151921] rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-sm overflow-hidden">
          <div className="border-b border-neutral-200/80 dark:border-neutral-800/80 px-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex gap-2 sm:gap-6 overflow-x-auto px-2">
              {["All", "Action Required", "Pending Review", "Completed"].map(
                (tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex items-center gap-2 py-4 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === tab
                        ? "border-[#B91C1C] text-[#B91C1C] dark:text-[#F87171]"
                        : "border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                    }`}
                  >
                    {tab}
                  </button>
                ),
              )}
            </div>
            <div className="p-3 sm:py-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search assignments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64 pl-9 pr-4 py-2 bg-neutral-50/50 dark:bg-[#0E1117] border border-neutral-200/80 dark:border-neutral-800 rounded-xl text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-[#B91C1C]"
                />
              </div>
            </div>
          </div>

          <div className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
            {filteredSubmissions.length === 0 ? (
              <div className="p-12 text-center text-neutral-400">
                <FileText className="w-8 h-8 mx-auto mb-3 opacity-50" />
                <p className="text-sm font-medium">
                  No assignments found in this tab.
                </p>
              </div>
            ) : (
              filteredSubmissions.map((sub) => {
                const statusConfig = getStatusConfig(sub.status);
                const isActionRequired = [
                  "not_started",
                  "needs_resubmission",
                ].includes(sub.status);

                return (
                  <div
                    key={sub.id}
                    className="p-6 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                      <div className="flex-1 space-y-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1.5">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusConfig.classes}`}
                            >
                              {statusConfig.icon}
                              {statusConfig.label}
                            </span>
                            {sub.batchName && (
                              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                                • {sub.batchName}
                              </span>
                            )}
                          </div>
                          <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                            {sub.assignmentTitle}
                          </h3>
                          <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-500 mt-1">
                            <Calendar className="w-3.5 h-3.5" />
                            Due: {sub.deadlineFormatted}
                          </div>
                        </div>

                        {sub.description && (
                          <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-3xl">
                            {sub.description}
                          </p>
                        )}

                        {sub.fileUrl && (
                          <div>
                            <a
                              href={
                                API.defaults.baseURL.replace("/api", "") +
                                sub.fileUrl
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-xs font-bold text-neutral-700 dark:text-neutral-300 rounded-lg transition-colors border border-neutral-200/50 dark:border-neutral-700/50 w-fit"
                            >
                              <Paperclip className="w-3.5 h-3.5" />
                              {sub.fileName || "Download Attachment"}
                            </a>
                          </div>
                        )}

                        {sub.feedback && (
                          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30 p-3.5 rounded-xl max-w-3xl">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-500 block mb-1">
                              Mentor Feedback
                            </span>
                            <p className="text-xs text-amber-900 dark:text-amber-200 italic leading-relaxed">
                              "{sub.feedback}"
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-start gap-4 shrink-0 lg:w-48 bg-neutral-50/50 dark:bg-neutral-800/30 p-4 rounded-xl border border-neutral-200/50 dark:border-neutral-800">
                        <div className="text-left lg:text-right">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-0.5">
                            Grade
                          </span>
                          <div className="text-2xl font-black text-neutral-900 dark:text-white leading-none">
                            {sub.score !== null && sub.score !== undefined
                              ? sub.score
                              : "--"}
                            <span className="text-sm font-bold text-neutral-400">
                              /{sub.maxScore}
                            </span>
                          </div>
                        </div>

                        {isActionRequired ? (
                          <button
                            onClick={() => openSubmitModal(sub)}
                            className="w-full px-4 py-2 bg-[#B91C1C] hover:bg-[#991B1B] text-white text-xs font-bold rounded-lg transition-colors shadow-sm shadow-red-500/20"
                          >
                            {sub.status === "not_started"
                              ? "Turn In Work"
                              : "Resubmit Work"}
                          </button>
                        ) : (
                          <button
                            disabled
                            className="w-full px-4 py-2 bg-neutral-200 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-xs font-bold rounded-lg cursor-not-allowed"
                          >
                            Work Submitted
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-[#151921] border border-neutral-200 dark:border-neutral-800 shadow-2xl rounded-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-5 border-b border-neutral-100 dark:border-neutral-800">
              <div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                  {activeSubmission?.status === "not_started"
                    ? "Turn In Assignment"
                    : "Resubmit Assignment"}
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 truncate max-w-sm">
                  {activeSubmission?.assignmentTitle}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto p-5">
              <form
                id="submissionForm"
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                {errorMessage && (
                  <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-lg text-xs font-medium text-red-600 dark:text-red-400 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    {errorMessage}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    GitHub Repository URL{" "}
                    <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Code2 className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
                    <input
                      required
                      type="url"
                      name="githubUrl"
                      value={formData.githubUrl}
                      onChange={handleInputChange}
                      placeholder="https://github.com/username/repo"
                      className="w-full pl-9 pr-4 py-2.5 bg-neutral-50 dark:bg-[#0E1117] border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-[#B91C1C]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Live Demo URL{" "}
                    <span className="text-neutral-400 lowercase capitalize-none">
                      (Optional)
                    </span>
                  </label>
                  <div className="relative">
                    <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
                    <input
                      type="url"
                      name="liveDemoUrl"
                      value={formData.liveDemoUrl}
                      onChange={handleInputChange}
                      placeholder="https://my-project.vercel.app"
                      className="w-full pl-9 pr-4 py-2.5 bg-neutral-50 dark:bg-[#0E1117] border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-[#B91C1C]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Submission Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Any context or notes for your mentor..."
                    className="w-full p-3 bg-neutral-50 dark:bg-[#0E1117] border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-[#B91C1C] resize-none"
                  ></textarea>
                </div>
              </form>
            </div>

            <div className="flex gap-3 p-5 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-2.5 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 font-bold text-xs rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="submissionForm"
                disabled={isSubmitting}
                className="flex-1 px-4 py-2.5 bg-[#B91C1C] hover:bg-[#991B1B] text-white font-bold text-xs rounded-xl transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm shadow-red-500/20"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Confirm Submission"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
