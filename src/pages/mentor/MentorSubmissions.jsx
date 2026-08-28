import React, { useState, useEffect, useCallback } from "react";
import {
  FiFileText,
  FiClock,
  FiCheckCircle,
  FiSearch,
  FiChevronDown,
  FiMoreVertical,
  FiX,
  FiGithub,
  FiExternalLink,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import API from "../../services/api";

export default function MentorSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [reviewForm, setReviewForm] = useState({
    score: "",
    feedback: "",
    status: "Reviewed",
  });

  const fetchMentorSubmissions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await API.get("/submissions/mentor");
      const raw =
        response.data?.data?.submissions || response.data?.submissions || [];

      const formatted = raw.map((s) => ({
        id: s._id,
        studentName: s.member?.user?.fullName || "Student",
        studentEmail: s.member?.user?.email || "No Email",
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${s.member?.user?.fullName || "Student"}`,
        assignment: s.assignment?.title || "Assignment",
        submittedDate: s.submittedAt
          ? new Date(s.submittedAt).toLocaleDateString()
          : "Not Submitted",
        submittedTime: s.submittedAt
          ? new Date(s.submittedAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "",
        status:
          s.status === "graded"
            ? "Reviewed"
            : s.status === "needs_resubmission"
              ? "Resubmission Requested"
              : "Pending Review",
        score: s.score !== undefined ? s.score : null,
        githubUrl: s.githubUrl || "",
        liveDemoUrl: s.liveDemoUrl || "",
        studentNotes: s.notes || "",
        feedback: s.feedback || "",
      }));

      setSubmissions(formatted);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMentorSubmissions();
  }, [fetchMentorSubmissions]);

  const openReviewPanel = (submission) => {
    setSelectedSubmission(submission);
    setReviewForm({
      score: submission.score !== null ? submission.score : "",
      feedback: submission.feedback || "",
      status:
        submission.status === "Pending Review" ? "Reviewed" : submission.status,
    });
  };

  const closeReviewPanel = () => {
    setSelectedSubmission(null);
  };

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveReview = async (e) => {
    e.preventDefault();
    if (!selectedSubmission) return;

    try {
      await API.patch(`/submissions/${selectedSubmission.id}/grade`, {
        score: Number(reviewForm.score),
        feedback: reviewForm.feedback,
        needsResubmission: reviewForm.status === "Resubmission Requested",
      });

      closeReviewPanel();
      fetchMentorSubmissions();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to submit review.");
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "Pending Review":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-sm shadow-amber-500/5";
      case "Reviewed":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-sm shadow-emerald-500/5";
      case "Resubmission Requested":
        return "bg-rose-500/10 text-rose-500 border-rose-500/20 shadow-sm shadow-rose-500/5";
      default:
        return "bg-surface-subtle text-text-muted border-border shadow-sm";
    }
  };

  const totalCount = submissions.length;
  const pendingCount = submissions.filter(
    (s) => s.status === "Pending Review",
  ).length;
  const reviewedCount = submissions.filter(
    (s) => s.status === "Reviewed",
  ).length;

  const cardStyle =
    "group relative overflow-hidden flex items-center gap-5 rounded-2xl border border-border/60 bg-surface/80 backdrop-blur-sm p-6 shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl hover:border-primary/40";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700 pb-12 px-4 sm:px-6 lg:px-8 mt-4">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">
          Submissions Workspace
        </h1>
        <p className="text-sm text-text-muted">
          Review student submissions, evaluate code, and provide actionable
          feedback.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
        <div className={cardStyle}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10 transition-opacity group-hover:opacity-100 opacity-0 duration-500"></div>
          <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 shadow-inner transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
            <FiFileText className="w-6 h-6" />
          </div>
          <div className="relative z-10">
            <div className="text-[11px] text-text-muted font-bold uppercase tracking-widest mb-1">
              Total Submissions
            </div>
            <div className="text-3xl font-black text-text-primary leading-none">
              {totalCount}
            </div>
          </div>
        </div>

        <div className={cardStyle}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl -mr-10 -mt-10 transition-opacity group-hover:opacity-100 opacity-0 duration-500"></div>
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0 shadow-inner transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3">
            <FiClock className="w-6 h-6" />
          </div>
          <div className="relative z-10">
            <div className="text-[11px] text-text-muted font-bold uppercase tracking-widest mb-1">
              Pending Review
            </div>
            <div className="text-3xl font-black text-text-primary leading-none">
              {pendingCount}
            </div>
          </div>
        </div>

        <div className={cardStyle}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -mr-10 -mt-10 transition-opacity group-hover:opacity-100 opacity-0 duration-500"></div>
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0 shadow-inner transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
            <FiCheckCircle className="w-6 h-6" />
          </div>
          <div className="relative z-10">
            <div className="text-[11px] text-text-muted font-bold uppercase tracking-widest mb-1">
              Reviewed
            </div>
            <div className="text-3xl font-black text-text-primary leading-none">
              {reviewedCount}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-surface/80 backdrop-blur-md border border-border/60 shadow-lg shadow-black/5 rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="border-b border-border/60 bg-surface-subtle/50 text-[11px] font-mono font-bold text-text-muted uppercase tracking-wider">
                <th className="py-4 px-6">Student</th>
                <th className="py-4 px-6">Assignment</th>
                <th className="py-4 px-6">Submitted Date</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Score</th>
                <th className="py-4 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 text-sm">
              {submissions.map((sub) => (
                <tr
                  key={sub.id}
                  className="group hover:bg-surface-subtle/80 transition-colors duration-200"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3.5">
                      <div className="relative">
                        <img
                          src={sub.avatar}
                          alt={sub.studentName}
                          className="w-10 h-10 rounded-full object-cover border-2 border-surface shadow-sm transition-all duration-300 group-hover:border-primary/20"
                        />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-text-primary transition-colors group-hover:text-primary">
                          {sub.studentName}
                        </div>
                        <div className="text-[11px] text-text-muted font-mono mt-0.5">
                          {sub.studentEmail}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm font-semibold text-text-primary truncate max-w-[200px]">
                      {sub.assignment}
                    </div>
                  </td>
                  <td className="py-4 px-6 font-mono">
                    <div className="text-sm text-text-primary">
                      {sub.submittedDate}
                    </div>
                    <div className="text-[10px] text-text-muted mt-0.5">
                      {sub.submittedTime}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border backdrop-blur-sm ${getStatusStyles(sub.status)}`}
                    >
                      {sub.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-mono">
                    <div className="text-sm font-bold text-text-primary">
                      {sub.score !== null ? (
                        `${sub.score} / 100`
                      ) : (
                        <span className="text-text-muted">--</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => openReviewPanel(sub)}
                      className={`px-5 py-2 rounded-xl text-xs font-bold transition-all duration-300 border focus:outline-none ${
                        sub.status === "Pending Review"
                          ? "bg-primary text-primary-foreground hover:bg-primary-hover border-primary shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/40 hover:-translate-y-0.5"
                          : "bg-surface-subtle text-text-primary hover:bg-border border-border/80 hover:shadow-sm hover:-translate-y-0.5"
                      }`}
                    >
                      {sub.status === "Pending Review"
                        ? "Review Work"
                        : "View Feedback"}
                    </button>
                  </td>
                </tr>
              ))}
              {submissions.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="py-16 text-center text-text-muted text-sm"
                  >
                    No submissions found. Students have not submitted yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedSubmission && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-in fade-in duration-300"
            onClick={closeReviewPanel}
          ></div>

          <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-surface/95 backdrop-blur-xl border-l border-border/50 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-400 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-border/50 bg-surface/80 backdrop-blur-xl z-20">
              <h2 className="text-lg font-black text-text-primary tracking-tight">
                Grading Workspace
              </h2>
              <button
                onClick={closeReviewPanel}
                className="text-text-muted hover:text-text-primary hover:bg-surface-subtle transition-all p-2 rounded-xl"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth">
              <div className="flex items-center gap-4">
                <img
                  src={selectedSubmission.avatar}
                  alt={selectedSubmission.studentName}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-border shadow-md"
                />
                <div>
                  <div className="text-lg font-bold text-text-primary">
                    {selectedSubmission.studentName}
                  </div>
                  <div className="text-xs text-text-muted font-mono mt-0.5">
                    {selectedSubmission.studentEmail}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-[11px] font-mono font-bold text-primary uppercase tracking-widest border-b border-border/50 pb-2">
                  Submission Details
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl border border-border/60 bg-surface-subtle/50 shadow-sm">
                    <div className="text-[10px] font-mono font-bold text-text-muted uppercase tracking-wider mb-1.5">
                      Assignment
                    </div>
                    <div className="text-sm font-bold text-text-primary leading-tight">
                      {selectedSubmission.assignment}
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl border border-border/60 bg-surface-subtle/50 shadow-sm">
                    <div className="text-[10px] font-mono font-bold text-text-muted uppercase tracking-wider mb-1.5">
                      Submitted
                    </div>
                    <div className="text-sm font-bold text-text-primary font-mono leading-tight">
                      {selectedSubmission.submittedDate}{" "}
                      <span className="text-xs text-text-muted block mt-0.5">
                        {selectedSubmission.submittedTime}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  {selectedSubmission.githubUrl && (
                    <div>
                      <div className="text-[11px] font-mono font-bold text-text-muted uppercase tracking-widest mb-2">
                        GitHub Repository URL
                      </div>
                      <a
                        href={selectedSubmission.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between p-3 bg-surface-subtle/50 border border-border/60 rounded-xl hover:border-primary/50 hover:bg-surface-subtle transition-all duration-300 group text-primary shadow-sm"
                      >
                        <div className="flex items-center gap-3 truncate">
                          <FiGithub className="shrink-0 w-4 h-4" />
                          <span className="text-sm font-medium truncate">
                            {selectedSubmission.githubUrl}
                          </span>
                        </div>
                        <FiExternalLink className="shrink-0 w-4 h-4 ml-3 text-text-muted group-hover:text-primary transition-colors" />
                      </a>
                    </div>
                  )}

                  {selectedSubmission.liveDemoUrl && (
                    <div>
                      <div className="text-[11px] font-mono font-bold text-text-muted uppercase tracking-widest mb-2">
                        Live Demo URL
                      </div>
                      <a
                        href={selectedSubmission.liveDemoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between p-3 bg-surface-subtle/50 border border-border/60 rounded-xl hover:border-primary/50 hover:bg-surface-subtle transition-all duration-300 group text-primary shadow-sm"
                      >
                        <div className="flex items-center gap-3 truncate">
                          <FiExternalLink className="shrink-0 w-4 h-4" />
                          <span className="text-sm font-medium truncate font-mono">
                            {selectedSubmission.liveDemoUrl}
                          </span>
                        </div>
                        <FiExternalLink className="shrink-0 w-4 h-4 ml-3 text-text-muted group-hover:text-primary transition-colors" />
                      </a>
                    </div>
                  )}
                </div>

                {selectedSubmission.studentNotes && (
                  <div className="pt-2">
                    <div className="text-[11px] font-mono font-bold text-text-muted uppercase tracking-widest mb-3">
                      Student Notes
                    </div>
                    <div className="p-5 bg-surface-subtle/40 border border-border/60 rounded-2xl text-sm text-text-secondary leading-relaxed shadow-inner">
                      {selectedSubmission.studentNotes}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-[11px] font-mono font-bold text-primary uppercase tracking-widest border-b border-border/50 pb-2">
                  Your Review
                </h3>

                <form onSubmit={handleSaveReview} className="space-y-5">
                  <div>
                    <label className="text-xs font-bold text-text-primary mb-2 block">
                      Score (out of 100){" "}
                      <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative max-w-[120px]">
                      <input
                        type="number"
                        name="score"
                        value={reviewForm.score}
                        onChange={handleReviewChange}
                        required
                        min="0"
                        max="100"
                        className="w-full pl-4 pr-8 py-3 bg-surface-subtle/50 border border-border/60 rounded-xl text-lg font-black text-text-primary focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-sm"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted font-bold text-sm">
                        %
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-text-primary mb-2 block">
                      Feedback <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      name="feedback"
                      value={reviewForm.feedback}
                      onChange={handleReviewChange}
                      required
                      placeholder="Provide constructive feedback..."
                      rows="5"
                      className="w-full p-4 bg-surface-subtle/50 border border-border/60 rounded-xl text-sm text-text-primary focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary resize-y transition-all shadow-sm leading-relaxed"
                    ></textarea>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-text-primary mb-2 block">
                      Review Status <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative group">
                      <select
                        name="status"
                        value={reviewForm.status}
                        onChange={handleReviewChange}
                        className="w-full appearance-none pl-4 pr-10 py-3.5 bg-surface-subtle/50 border border-border/60 rounded-xl text-sm text-text-primary font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary cursor-pointer transition-all shadow-sm"
                      >
                        <option value="Reviewed">
                          Approve & Mark as Reviewed
                        </option>
                        <option value="Resubmission Requested">
                          Reject & Request Resubmission
                        </option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-md bg-surface border border-border/50 group-hover:border-primary/50 transition-colors pointer-events-none">
                        <FiChevronDown className="text-text-muted w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            <div className="p-6 border-t border-border/50 bg-surface/80 backdrop-blur-xl flex flex-wrap gap-3 justify-end items-center z-20">
              <button
                type="button"
                onClick={closeReviewPanel}
                className="px-6 py-3 bg-surface text-text-primary border border-border/80 hover:bg-surface-subtle hover:border-text-muted/30 font-bold text-sm rounded-xl transition-all duration-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveReview}
                className="px-6 py-3 bg-primary text-primary-foreground hover:bg-primary-hover font-bold text-sm rounded-xl transition-all duration-300 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/40 hover:-translate-y-0.5"
              >
                Save Review
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
