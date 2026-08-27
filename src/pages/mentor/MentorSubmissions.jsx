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
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "Reviewed":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "Resubmission Requested":
        return "bg-rose-500/10 text-rose-500 border-rose-500/20";
      default:
        return "bg-surface-subtle text-text-muted border-border";
    }
  };

<<<<<<< HEAD
  const totalCount = submissions.length;
  const pendingCount = submissions.filter(
    (s) => s.status === "Pending Review",
  ).length;
  const reviewedCount = submissions.filter(
    (s) => s.status === "Reviewed",
  ).length;
=======
  // Shared modern card style
  const cardStyle =
    "bg-surface border border-border rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-primary/50 hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-4";
>>>>>>> eab9157771d080b4f06b8939e423d35737885c86

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-100">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 pb-12 px-4">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight">
          Submissions
        </h1>
        <p className="text-xs sm:text-sm text-text-muted mt-0.5">
          Review student submissions and provide feedback.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <div className={cardStyle}>
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 shadow-2xs">
            <FiFileText className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-text-muted font-bold uppercase tracking-wider mb-0.5">
              Total Submissions
            </div>
            <div className="text-2xl font-black text-text-primary leading-none">
<<<<<<< HEAD
              {totalCount}
=======
              28
            </div>
            <div className="text-[11px] text-text-muted mt-1">
              All time submissions
>>>>>>> eab9157771d080b4f06b8939e423d35737885c86
            </div>
          </div>
        </div>

        <div className={cardStyle}>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0 shadow-2xs">
            <FiClock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-text-muted font-bold uppercase tracking-wider mb-0.5">
              Pending Review
            </div>
            <div className="text-2xl font-black text-text-primary leading-none">
<<<<<<< HEAD
              {pendingCount}
=======
              8
            </div>
            <div className="text-[11px] text-text-muted mt-1">
              Awaiting your review
>>>>>>> eab9157771d080b4f06b8939e423d35737885c86
            </div>
          </div>
        </div>

        <div className={cardStyle}>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0 shadow-2xs">
            <FiCheckCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-text-muted font-bold uppercase tracking-wider mb-0.5">
              Reviewed
            </div>
            <div className="text-2xl font-black text-text-primary leading-none">
<<<<<<< HEAD
              {reviewedCount}
=======
              20
            </div>
            <div className="text-[11px] text-text-muted mt-1">
              Completed reviews
>>>>>>> eab9157771d080b4f06b8939e423d35737885c86
            </div>
          </div>
        </div>
      </div>

<<<<<<< HEAD
      <div className="bg-surface border border-border shadow-sm rounded-xl overflow-hidden flex flex-col">
=======
      <div className="bg-surface border border-border shadow-sm rounded-2xl overflow-hidden flex flex-col hover:border-primary/40 transition-all duration-200">
        <div className="p-4 sm:p-5 border-b border-border flex flex-col sm:flex-row gap-4 justify-between items-center bg-surface-subtle/50">
          <div className="relative w-full sm:w-80">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
            <input
              type="text"
              placeholder="Search student or assignment..."
              className="w-full pl-10 pr-4 py-2.5 bg-surface border border-border rounded-xl text-xs sm:text-sm text-text-primary placeholder:text-text-muted/50 hover:border-primary hover:shadow-[0_0_0_1px_rgba(234,88,12,0.25)] focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all outline-none duration-150 shadow-2xs"
            />
          </div>
          <div className="flex w-full sm:w-auto gap-2.5">
            <div className="relative w-full sm:w-40">
              <select className="w-full appearance-none pl-3.5 pr-8 py-2.5 bg-surface border border-border rounded-xl text-xs sm:text-sm text-text-primary hover:border-primary focus:border-primary outline-none transition-all shadow-2xs cursor-pointer">
                <option>All Assignments</option>
              </select>
              <FiChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none w-4 h-4" />
            </div>
            <div className="relative w-full sm:w-36">
              <select className="w-full appearance-none pl-3.5 pr-8 py-2.5 bg-surface border border-border rounded-xl text-xs sm:text-sm text-text-primary hover:border-primary focus:border-primary outline-none transition-all shadow-2xs cursor-pointer">
                <option>All Statuses</option>
              </select>
              <FiChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none w-4 h-4" />
            </div>
            <div className="relative w-full sm:w-40">
              <select className="w-full appearance-none pl-3.5 pr-8 py-2.5 bg-surface border border-border rounded-xl text-xs sm:text-sm text-text-primary hover:border-primary focus:border-primary outline-none transition-all shadow-2xs cursor-pointer">
                <option>Sort by: Newest</option>
              </select>
              <FiChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none w-4 h-4" />
            </div>
          </div>
        </div>

>>>>>>> eab9157771d080b4f06b8939e423d35737885c86
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="border-b border-border bg-surface-subtle text-[11px] font-mono font-bold text-text-muted uppercase tracking-wider">
                <th className="py-3.5 px-5">Student</th>
                <th className="py-3.5 px-5">Assignment</th>
                <th className="py-3.5 px-5">Submitted Date</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5">Score</th>
                <th className="py-3.5 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-xs sm:text-sm">
              {submissions.map((sub) => (
                <tr
                  key={sub.id}
                  className="hover:bg-surface-subtle/50 transition-colors"
                >
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-3">
                      <img
                        src={sub.avatar}
                        alt={sub.studentName}
                        className="w-9 h-9 rounded-xl object-cover border border-border shadow-2xs"
                      />
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-text-primary">
                          {sub.studentName}
                        </div>
                        <div className="text-[11px] text-text-muted font-mono">
                          {sub.studentEmail}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-5">
                    <div className="text-xs sm:text-sm font-semibold text-text-primary">
                      {sub.assignment}
                    </div>
                  </td>
                  <td className="py-3 px-5 font-mono">
                    <div className="text-xs text-text-primary">
                      {sub.submittedDate}
                    </div>
                    <div className="text-[10px] text-text-muted">
                      {sub.submittedTime}
                    </div>
                  </td>
                  <td className="py-3 px-5">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${getStatusStyles(sub.status)}`}
                    >
                      {sub.status}
                    </span>
                  </td>
                  <td className="py-3 px-5 font-mono">
                    <div className="text-xs sm:text-sm font-bold text-text-primary">
                      {sub.score !== null ? `${sub.score} / 100` : "--"}
                    </div>
                  </td>
                  <td className="py-3 px-5 text-right">
<<<<<<< HEAD
                    <button
                      onClick={() => openReviewPanel(sub)}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors border focus:outline-none ${sub.status === "Pending Review" ? "bg-primary text-primary-foreground hover:bg-primary-hover border-primary" : "bg-surface text-text-primary hover:bg-surface-subtle border-border"}`}
                    >
                      {sub.status === "Pending Review"
                        ? "Review"
                        : "View Review"}
                    </button>
=======
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openReviewPanel(sub)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${sub.status === "Pending Review" ? "bg-primary text-primary-foreground hover:bg-primary-hover border-primary shadow-xs" : "bg-surface text-text-primary hover:bg-surface-subtle border-border"}`}
                      >
                        {sub.status === "Pending Review"
                          ? "Review"
                          : "View Review"}
                      </button>
                      <button className="p-2 text-text-muted hover:text-text-primary rounded-xl transition-colors cursor-pointer border border-transparent hover:border-border">
                        <FiMoreVertical className="w-4 h-4" />
                      </button>
                    </div>
>>>>>>> eab9157771d080b4f06b8939e423d35737885c86
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
<<<<<<< HEAD
=======

        <div className="p-4 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4 bg-surface-subtle/50 text-xs">
          <div className="text-text-muted">
            Showing <span className="font-bold text-text-primary">1</span> to{" "}
            <span className="font-bold text-text-primary">8</span> of{" "}
            <span className="font-bold text-text-primary">28</span> submissions
          </div>
          <div className="flex items-center gap-1 font-mono">
            <button className="w-8 h-8 flex items-center justify-center rounded-xl border border-border text-text-muted hover:bg-surface hover:text-text-primary disabled:opacity-50 transition-colors cursor-pointer">
              <FiChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-xl border border-primary bg-primary text-primary-foreground font-bold text-xs transition-colors cursor-pointer">
              1
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-xl border border-border text-text-primary hover:bg-surface font-semibold text-xs transition-colors cursor-pointer">
              2
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-xl border border-border text-text-primary hover:bg-surface font-semibold text-xs transition-colors cursor-pointer">
              3
            </button>
            <span className="w-8 h-8 flex items-center justify-center text-text-muted text-xs">
              ...
            </span>
            <button className="w-8 h-8 flex items-center justify-center rounded-xl border border-border text-text-primary hover:bg-surface font-semibold text-xs transition-colors cursor-pointer">
              4
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-xl border border-border text-text-muted hover:bg-surface hover:text-text-primary disabled:opacity-50 transition-colors cursor-pointer">
              <FiChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
>>>>>>> eab9157771d080b4f06b8939e423d35737885c86
      </div>

      {selectedSubmission && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 animate-in fade-in duration-200"
            onClick={closeReviewPanel}
          ></div>

<<<<<<< HEAD
          <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-surface border-l border-border shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300 overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-surface">
              <h2 className="text-lg font-bold text-text-primary">
=======
          <div className="fixed inset-y-0 right-0 w-full max-w-120 bg-surface border-l border-border shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300 overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-surface z-10">
              <h2 className="text-base font-bold text-text-primary">
>>>>>>> eab9157771d080b4f06b8939e423d35737885c86
                Review Submission
              </h2>
              <button
                onClick={closeReviewPanel}
<<<<<<< HEAD
                className="text-text-muted hover:text-text-primary transition-colors p-1 rounded-md"
=======
                className="text-text-muted hover:text-text-primary transition-colors p-2 rounded-xl hover:bg-surface-subtle cursor-pointer border border-transparent hover:border-border"
>>>>>>> eab9157771d080b4f06b8939e423d35737885c86
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 p-5 sm:p-7 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <img
                    src={selectedSubmission.avatar}
                    alt={selectedSubmission.studentName}
                    className="w-12 h-12 rounded-2xl object-cover border border-border shadow-2xs"
                  />
                  <div>
                    <div className="text-sm sm:text-base font-bold text-text-primary">
                      {selectedSubmission.studentName}
                    </div>
                    <div className="text-xs text-text-muted font-mono">
                      {selectedSubmission.studentEmail}
                    </div>
                  </div>
                </div>
<<<<<<< HEAD
=======
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-wide rounded-full border border-emerald-500/20">
                  On Track
                </span>
>>>>>>> eab9157771d080b4f06b8939e423d35737885c86
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-mono font-bold text-text-muted uppercase tracking-wider border-b border-border pb-2">
                  Submission Details
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-xl border border-border bg-surface-subtle shadow-2xs">
                    <div className="text-[10px] font-mono font-bold text-text-muted uppercase mb-1">
                      Assignment
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-text-primary">
                      {selectedSubmission.assignment}
                    </div>
                  </div>
<<<<<<< HEAD
                  <div>
                    <div className="text-xs text-text-muted mb-1">
                      Submitted
=======
                  <div className="p-3.5 rounded-xl border border-border bg-surface-subtle shadow-2xs">
                    <div className="text-[10px] font-mono font-bold text-text-muted uppercase mb-1">
                      Submitted Date
>>>>>>> eab9157771d080b4f06b8939e423d35737885c86
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-text-primary font-mono">
                      {selectedSubmission.submittedDate}{" "}
                      {selectedSubmission.submittedTime}
                    </div>
                  </div>
                </div>

<<<<<<< HEAD
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
=======
                <div>
                  <div className="text-[10px] font-mono font-bold text-text-muted uppercase mb-1">
                    GitHub Repository URL
                  </div>
                  <a
                    href={selectedSubmission.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-3.5 bg-surface-subtle border border-border rounded-xl hover:border-primary transition-colors group shadow-2xs"
                  >
                    <div className="flex items-center gap-3 overflow-hidden text-primary">
                      <FiGithub className="shrink-0 w-4 h-4" />
                      <span className="text-xs sm:text-sm font-medium truncate font-mono">
                        {selectedSubmission.githubUrl}
                      </span>
                    </div>
                    <FiExternalLink className="shrink-0 text-text-muted group-hover:text-primary transition-colors w-4 h-4 ml-3" />
                  </a>
                </div>

                <div>
                  <div className="text-[10px] font-mono font-bold text-text-muted uppercase mb-1">
                    Live Demo URL (Optional)
>>>>>>> eab9157771d080b4f06b8939e423d35737885c86
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
<<<<<<< HEAD
                      className="flex items-center justify-between p-3 bg-surface-subtle border border-border rounded-lg hover:border-primary transition-colors group text-primary"
=======
                      className="flex items-center justify-between p-3.5 bg-surface-subtle border border-border rounded-xl hover:border-primary transition-colors group shadow-2xs"
>>>>>>> eab9157771d080b4f06b8939e423d35737885c86
                    >
                      <div className="flex items-center gap-3 truncate">
                        <FiExternalLink className="shrink-0 w-4 h-4" />
                        <span className="text-xs sm:text-sm font-medium truncate font-mono">
                          {selectedSubmission.liveDemoUrl}
                        </span>
                      </div>
                      <FiExternalLink className="shrink-0 w-4 h-4 ml-3 text-text-muted group-hover:text-primary" />
                    </a>
<<<<<<< HEAD
                  </div>
                )}
=======
                  ) : (
                    <div className="p-3.5 bg-surface-subtle border border-border border-dashed rounded-xl text-xs text-text-muted italic">
                      No live demo provided.
                    </div>
                  )}
                </div>
>>>>>>> eab9157771d080b4f06b8939e423d35737885c86

                <div>
                  <div className="text-[10px] font-mono font-bold text-text-muted uppercase mb-1">
                    Student Notes
                  </div>
<<<<<<< HEAD
                  <div className="p-4 bg-surface-subtle border border-border rounded-lg text-sm text-text-secondary leading-relaxed">
=======
                  <div className="p-4 bg-surface-subtle border border-border rounded-xl text-xs sm:text-sm text-text-secondary leading-relaxed min-h-20 shadow-2xs">
>>>>>>> eab9157771d080b4f06b8939e423d35737885c86
                    {selectedSubmission.studentNotes || (
                      <span className="italic text-text-muted">
                        No notes provided.
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-mono font-bold text-text-muted uppercase tracking-wider border-b border-border pb-2">
                  Your Review
                </h3>

                <form onSubmit={handleSaveReview} className="space-y-4">
                  <div>
<<<<<<< HEAD
                    <label className="text-xs font-bold text-text-primary mb-1.5 block">
                      Score (out of 100) *
=======
                    <label className="text-[10px] font-mono font-bold text-text-muted uppercase tracking-wider mb-1.5 block">
                      Score (out of 100) <span className="text-primary">*</span>
>>>>>>> eab9157771d080b4f06b8939e423d35737885c86
                    </label>
                    <input
                      type="number"
                      name="score"
                      value={reviewForm.score}
                      onChange={handleReviewChange}
                      required
                      min="0"
                      max="100"
<<<<<<< HEAD
                      className="w-24 px-3 py-2 bg-surface border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary"
=======
                      className="w-24 px-3.5 py-2.5 bg-surface-subtle border border-border rounded-xl text-xs sm:text-sm text-text-primary font-mono placeholder:text-text-muted/50 hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all outline-none shadow-2xs"
>>>>>>> eab9157771d080b4f06b8939e423d35737885c86
                    />
                  </div>

                  <div>
<<<<<<< HEAD
                    <label className="text-xs font-bold text-text-primary mb-1.5 block">
                      Feedback *
=======
                    <label className="text-[10px] font-mono font-bold text-text-muted uppercase tracking-wider mb-1.5 block">
                      Feedback <span className="text-primary">*</span>
>>>>>>> eab9157771d080b4f06b8939e423d35737885c86
                    </label>
                    <textarea
                      name="feedback"
                      value={reviewForm.feedback}
                      onChange={handleReviewChange}
                      required
                      rows="4"
<<<<<<< HEAD
                      className="w-full p-3 bg-surface border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary resize-y"
=======
                      placeholder="Write your feedback here..."
                      className="w-full p-3.5 bg-surface-subtle border border-border rounded-xl text-xs sm:text-sm text-text-primary placeholder:text-text-muted/50 hover:border-primary focus:border-primary transition outline-none resize-y shadow-2xs"
>>>>>>> eab9157771d080b4f06b8939e423d35737885c86
                    ></textarea>
                  </div>

                  <div>
<<<<<<< HEAD
                    <label className="text-xs font-bold text-text-primary mb-1.5 block">
                      Review Status *
=======
                    <label className="text-[10px] font-mono font-bold text-text-muted uppercase tracking-wider mb-1.5 block">
                      Review Status <span className="text-primary">*</span>
>>>>>>> eab9157771d080b4f06b8939e423d35737885c86
                    </label>
                    <div className="relative">
                      <select
                        name="status"
                        value={reviewForm.status}
                        onChange={handleReviewChange}
<<<<<<< HEAD
                        className="w-full appearance-none pl-3 pr-8 py-2.5 bg-surface border border-border rounded-lg text-sm text-text-primary font-medium focus:outline-none focus:border-primary cursor-pointer"
=======
                        className="w-full appearance-none pl-3.5 pr-10 py-2.5 bg-surface-subtle border border-border rounded-xl text-xs sm:text-sm text-text-primary font-semibold hover:border-primary focus:border-primary transition outline-none shadow-2xs cursor-pointer"
>>>>>>> eab9157771d080b4f06b8939e423d35737885c86
                      >
                        <option value="Reviewed">Reviewed</option>
                        <option value="Resubmission Requested">
                          Resubmission Requested
                        </option>
                      </select>
                      <FiChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none w-4 h-4" />
                    </div>
                  </div>
                </form>
              </div>
            </div>

            <div className="p-5 border-t border-border bg-surface-subtle flex flex-wrap gap-2.5 justify-end items-center sticky bottom-0 z-10">
              <button
                type="button"
                onClick={closeReviewPanel}
<<<<<<< HEAD
                className="px-5 py-2.5 bg-surface text-text-primary border border-border hover:bg-surface-subtle font-bold text-sm rounded-lg transition-colors"
=======
                className="px-4 py-2.5 bg-surface text-text-primary border border-border hover:bg-surface-subtle font-semibold text-xs rounded-xl transition-colors shadow-xs cursor-pointer"
>>>>>>> eab9157771d080b4f06b8939e423d35737885c86
              >
                Cancel
              </button>
              <button
                type="button"
<<<<<<< HEAD
                onClick={handleSaveReview}
                className="px-5 py-2.5 bg-primary text-primary-foreground hover:bg-primary-hover font-bold text-sm rounded-lg transition-colors shadow-sm"
=======
                onClick={(e) => {
                  setReviewForm((prev) => ({
                    ...prev,
                    status: "Resubmission Requested",
                  }));
                  handleSaveReview(e);
                }}
                className="px-4 py-2.5 bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500/20 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Request Resubmission
              </button>
              <button
                type="submit"
                onClick={handleSaveReview}
                className="px-5 py-2.5 bg-primary text-primary-foreground hover:bg-primary-hover font-semibold text-xs rounded-xl transition-all shadow-md hover:shadow-lg hover:shadow-primary/20 cursor-pointer"
>>>>>>> eab9157771d080b4f06b8939e423d35737885c86
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
