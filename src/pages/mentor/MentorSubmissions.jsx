import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    fetchMentorSubmissions();
  }, []);

  const fetchMentorSubmissions = async () => {
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
  };

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
        return "bg-warning/10 text-warning border-warning/20";
      case "Reviewed":
        return "bg-success/10 text-success border-success/20";
      case "Resubmission Requested":
        return "bg-error/10 text-error border-error/20";
      default:
        return "bg-surface-muted text-text-muted border-border";
    }
  };

  const totalCount = submissions.length;
  const pendingCount = submissions.filter(
    (s) => s.status === "Pending Review",
  ).length;
  const reviewedCount = submissions.filter(
    (s) => s.status === "Reviewed",
  ).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-100">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">
          Submissions
        </h1>
        <p className="text-sm text-text-muted mt-1">
          Review student submissions and provide feedback.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-surface border border-border shadow-sm rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <FiFileText className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm text-text-muted font-medium mb-0.5">
              Total Submissions
            </div>
            <div className="text-2xl font-black text-text-primary leading-none">
              {totalCount}
            </div>
          </div>
        </div>

        <div className="bg-surface border border-border shadow-sm rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center text-warning shrink-0">
            <FiClock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm text-text-muted font-medium mb-0.5">
              Pending Review
            </div>
            <div className="text-2xl font-black text-text-primary leading-none">
              {pendingCount}
            </div>
          </div>
        </div>

        <div className="bg-surface border border-border shadow-sm rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center text-success shrink-0">
            <FiCheckCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm text-text-muted font-medium mb-0.5">
              Reviewed
            </div>
            <div className="text-2xl font-black text-text-primary leading-none">
              {reviewedCount}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-surface border border-border shadow-sm rounded-xl overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="border-b border-border bg-surface-subtle/10">
                <th className="py-3 px-5 text-xs font-bold text-text-muted uppercase tracking-wider">
                  Student
                </th>
                <th className="py-3 px-5 text-xs font-bold text-text-muted uppercase tracking-wider">
                  Assignment
                </th>
                <th className="py-3 px-5 text-xs font-bold text-text-muted uppercase tracking-wider">
                  Submitted Date
                </th>
                <th className="py-3 px-5 text-xs font-bold text-text-muted uppercase tracking-wider">
                  Status
                </th>
                <th className="py-3 px-5 text-xs font-bold text-text-muted uppercase tracking-wider">
                  Score
                </th>
                <th className="py-3 px-5 text-xs font-bold text-text-muted uppercase tracking-wider text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {submissions.map((sub) => (
                <tr
                  key={sub.id}
                  className="hover:bg-surface-subtle/30 transition-colors"
                >
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-3">
                      <img
                        src={sub.avatar}
                        alt={sub.studentName}
                        className="w-9 h-9 rounded-full object-cover border border-border"
                      />
                      <div>
                        <div className="text-sm font-bold text-text-primary">
                          {sub.studentName}
                        </div>
                        <div className="text-xs text-text-muted">
                          {sub.studentEmail}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-5">
                    <div className="text-sm font-medium text-text-primary">
                      {sub.assignment}
                    </div>
                  </td>
                  <td className="py-3 px-5">
                    <div className="text-sm text-text-primary">
                      {sub.submittedDate}
                    </div>
                    <div className="text-xs text-text-muted">
                      {sub.submittedTime}
                    </div>
                  </td>
                  <td className="py-3 px-5">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusStyles(sub.status)}`}
                    >
                      {sub.status}
                    </span>
                  </td>
                  <td className="py-3 px-5">
                    <div className="text-sm font-medium text-text-primary">
                      {sub.score !== null ? `${sub.score} / 100` : "--"}
                    </div>
                  </td>
                  <td className="py-3 px-5 text-right">
                    <button
                      onClick={() => openReviewPanel(sub)}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors border focus:outline-none ${sub.status === "Pending Review" ? "bg-primary text-primary-foreground hover:bg-primary-hover border-primary" : "bg-surface text-text-primary hover:bg-surface-subtle border-border"}`}
                    >
                      {sub.status === "Pending Review"
                        ? "Review"
                        : "View Review"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedSubmission && (
        <>
          <div
            className="fixed inset-0 bg-background/50 backdrop-blur-sm z-40 animate-in fade-in duration-200"
            onClick={closeReviewPanel}
          ></div>

          <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-surface border-l border-border shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300 overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-surface">
              <h2 className="text-lg font-bold text-text-primary">
                Review Submission
              </h2>
              <button
                onClick={closeReviewPanel}
                className="text-text-muted hover:text-text-primary transition-colors p-1 rounded-md"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 p-5 sm:p-7 space-y-7">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={selectedSubmission.avatar}
                    alt={selectedSubmission.studentName}
                    className="w-12 h-12 rounded-full object-cover border border-border"
                  />
                  <div>
                    <div className="text-base font-bold text-text-primary">
                      {selectedSubmission.studentName}
                    </div>
                    <div className="text-sm text-text-muted">
                      {selectedSubmission.studentEmail}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-text-primary border-b border-border pb-2">
                  Submission Details
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-text-muted mb-1">
                      Assignment
                    </div>
                    <div className="text-sm font-medium text-text-primary">
                      {selectedSubmission.assignment}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-text-muted mb-1">
                      Submitted
                    </div>
                    <div className="text-sm font-medium text-text-primary">
                      {selectedSubmission.submittedDate}{" "}
                      {selectedSubmission.submittedTime}
                    </div>
                  </div>
                </div>

                {selectedSubmission.githubUrl && (
                  <div>
                    <div className="text-xs text-text-muted mb-1">
                      GitHub Repository URL
                    </div>
                    <a
                      href={selectedSubmission.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between p-3 bg-surface-subtle border border-border rounded-lg hover:border-primary transition-colors group text-primary"
                    >
                      <div className="flex items-center gap-3 truncate">
                        <FiGithub className="shrink-0 w-4 h-4" />
                        <span className="text-sm font-medium truncate">
                          {selectedSubmission.githubUrl}
                        </span>
                      </div>
                      <FiExternalLink className="shrink-0 w-4 h-4 ml-3 text-text-muted group-hover:text-primary" />
                    </a>
                  </div>
                )}

                {selectedSubmission.liveDemoUrl && (
                  <div>
                    <div className="text-xs text-text-muted mb-1">
                      Live Demo URL
                    </div>
                    <a
                      href={selectedSubmission.liveDemoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between p-3 bg-surface-subtle border border-border rounded-lg hover:border-primary transition-colors group text-primary"
                    >
                      <div className="flex items-center gap-3 truncate">
                        <FiExternalLink className="shrink-0 w-4 h-4" />
                        <span className="text-sm font-medium truncate">
                          {selectedSubmission.liveDemoUrl}
                        </span>
                      </div>
                      <FiExternalLink className="shrink-0 w-4 h-4 ml-3 text-text-muted group-hover:text-primary" />
                    </a>
                  </div>
                )}

                <div>
                  <div className="text-xs text-text-muted mb-1">
                    Student Notes
                  </div>
                  <div className="p-4 bg-surface-subtle border border-border rounded-lg text-sm text-text-secondary leading-relaxed">
                    {selectedSubmission.studentNotes || (
                      <span className="italic text-text-muted">
                        No notes provided.
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-text-primary border-b border-border pb-2">
                  Your Review
                </h3>

                <form onSubmit={handleSaveReview} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-text-primary mb-1.5 block">
                      Score (out of 100) *
                    </label>
                    <input
                      type="number"
                      name="score"
                      value={reviewForm.score}
                      onChange={handleReviewChange}
                      required
                      min="0"
                      max="100"
                      className="w-24 px-3 py-2 bg-surface border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-text-primary mb-1.5 block">
                      Feedback *
                    </label>
                    <textarea
                      name="feedback"
                      value={reviewForm.feedback}
                      onChange={handleReviewChange}
                      required
                      rows="4"
                      className="w-full p-3 bg-surface border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary resize-y"
                    ></textarea>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-text-primary mb-1.5 block">
                      Review Status *
                    </label>
                    <div className="relative">
                      <select
                        name="status"
                        value={reviewForm.status}
                        onChange={handleReviewChange}
                        className="w-full appearance-none pl-3 pr-8 py-2.5 bg-surface border border-border rounded-lg text-sm text-text-primary font-medium focus:outline-none focus:border-primary cursor-pointer"
                      >
                        <option value="Reviewed">Reviewed</option>
                        <option value="Resubmission Requested">
                          Resubmission Requested
                        </option>
                      </select>
                      <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                    </div>
                  </div>
                </form>
              </div>
            </div>

            <div className="p-5 border-t border-border bg-surface-subtle/30 flex gap-3 justify-end items-center sticky bottom-0">
              <button
                type="button"
                onClick={closeReviewPanel}
                className="px-5 py-2.5 bg-surface text-text-primary border border-border hover:bg-surface-subtle font-bold text-sm rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveReview}
                className="px-5 py-2.5 bg-primary text-primary-foreground hover:bg-primary-hover font-bold text-sm rounded-lg transition-colors shadow-sm"
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
