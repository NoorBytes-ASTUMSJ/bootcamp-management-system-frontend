import React, { useState } from "react";
import {
  FiCalendar,
  FiCheckCircle,
  FiAlertTriangle,
  FiClock,
  FiGithub,
  FiLink,
  FiX,
  FiUpload,
  FiPaperclip,
  FiDownload,
} from "react-icons/fi";

export default function StudentSubmissions() {
  const [submissions] = useState([
    {
      id: 4,
      assignmentTitle: "Build a REST API with Node & Express",
      description:
        "Create a complete RESTful API for a blog application. Your API should include CRUD operations for posts and users, and implement JWT authentication. Please refer to the attached SRS document for exact endpoint specifications.",
      attachmentName: "blog-api-requirements.pdf",
      attachmentUrl: "#",
      submittedDate: "--",
      status: "unsubmitted",
      score: null,
      maxScore: 100,
      feedback:
        "New assignment from your mentor. Submit your GitHub repository link and live URL when ready.",
    },
    {
      id: 1,
      assignmentTitle: "React Hooks Deep Dive",
      description:
        "Refactor the provided class-based React application to use functional components and hooks (useState, useEffect, useContext).",
      attachmentName: "starter-code.zip",
      attachmentUrl: "#",
      submittedDate: "Oct 24, 2026",
      status: "reviewed",
      score: 92,
      maxScore: 100,
      feedback:
        "Excellent use of custom hooks to manage complex state. The code is clean and modular. One small suggestion on useEffect dependencies...",
    },
    {
      id: 2,
      assignmentTitle: "Advanced State Management with Redux",
      description:
        "Integrate Redux Toolkit into the e-commerce mock app. Handle async actions using createAsyncThunk for fetching products.",
      attachmentName: null,
      attachmentUrl: null,
      submittedDate: "Nov 02, 2026",
      status: "resubmission_requested",
      score: null,
      maxScore: 100,
      feedback:
        "The reducer logic looks solid, but the async actions are not handling errors correctly. Please review the middleware section and update...",
    },
    {
      id: 3,
      assignmentTitle: "Frontend Performance Optimization",
      description:
        "Audit the attached React application using Lighthouse. Implement code splitting, lazy loading, and image optimization to achieve a performance score above 90.",
      attachmentName: "legacy-app-v1.zip",
      attachmentUrl: "#",
      submittedDate: "Nov 10, 2026",
      status: "submitted",
      score: null,
      maxScore: 100,
      feedback:
        "Awaiting mentor review. You will be notified once feedback is available.",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeAssignment, setActiveAssignment] = useState(null);
  const [formData, setFormData] = useState({
    githubUrl: "",
    liveDemoUrl: "",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      setTimeout(() => {
        setIsSubmitting(false);
        setIsModalOpen(false);
        setFormData({ githubUrl: "", liveDemoUrl: "", notes: "" });
      }, 1000);
    } catch (error) {
      console.error("Submission failed", error);
      setIsSubmitting(false);
    }
  };

  const openSubmitModal = (assignment) => {
    setActiveAssignment(assignment);
    setIsModalOpen(true);
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "unsubmitted":
        return {
          icon: <FiUpload className="w-3.5 h-3.5" />,
          label: "Action Required",
          classes: "bg-surface-subtle text-text-primary border-border",
        };
      case "reviewed":
        return {
          icon: <FiCheckCircle className="w-3.5 h-3.5" />,
          label: "Reviewed",
          classes: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
        };
      case "resubmission_requested":
        return {
          icon: <FiAlertTriangle className="w-3.5 h-3.5" />,
          label: "Resubmission Requested",
          classes: "bg-amber-500/10 text-amber-500 border-amber-500/20",
        };
      case "submitted":
        return {
          icon: <FiClock className="w-3.5 h-3.5" />,
          label: "Submitted",
          classes: "bg-blue-500/10 text-blue-500 border-blue-500/20",
        };
      default:
        return {
          icon: <FiClock className="w-3.5 h-3.5" />,
          label: "Pending",
          classes: "bg-surface-subtle text-text-muted border-border",
        };
    }
  };

  // Shared modern card style
  const cardStyle =
    "bg-surface border border-border rounded-2xl p-6 sm:p-7 shadow-sm hover:shadow-md hover:border-primary/50 hover:-translate-y-0.5 transition-all duration-200";

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 animate-in fade-in duration-500 pb-12 px-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight">
            Submissions
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-0.5">
            View your assignment submissions, grades, and feedback.
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {submissions.map((item) => {
          const statusConfig = getStatusConfig(item.status);
          const isPendingSubmission =
            item.status === "unsubmitted" ||
            item.status === "resubmission_requested";

          return (
            <div
              key={item.id}
              className={`${cardStyle} ${item.status === "unsubmitted" ? "border-primary/40 shadow-md" : ""} flex flex-col gap-5`}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="space-y-1.5">
                  <h2 className="text-base sm:text-lg font-bold text-text-primary tracking-tight">
                    {item.assignmentTitle}
                  </h2>
                  <div className="flex items-center gap-1.5 text-xs text-text-muted font-mono">
                    <FiCalendar className="w-3.5 h-3.5 text-primary" />
                    Submitted: {item.submittedDate}
                  </div>
                </div>

                <div className="flex items-center gap-4 sm:gap-6 self-start sm:self-center">
                  <span
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wide border ${statusConfig.classes}`}
                  >
                    {statusConfig.icon}
                    {statusConfig.label}
                  </span>

                  <div className="text-right">
                    <div className="text-xl sm:text-2xl font-black text-text-primary leading-none font-mono">
                      {item.score !== null ? item.score : "--"}
                      <span className="text-xs font-semibold text-text-muted">
                        /{item.maxScore}
                      </span>
                    </div>
                    <div className="text-[10px] sm:text-xs text-text-muted font-mono font-bold mt-0.5 uppercase tracking-wider">
                      {item.status === "reviewed" ? "Score" : "Pending"}
                    </div>
                  </div>
                </div>
              </div>

              {(item.description || item.attachmentName) && (
                <div className="py-4 border-t border-b border-border/60 space-y-3">
                  {item.description && (
                    <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                      {item.description}
                    </p>
                  )}
                  {item.attachmentName && (
                    <a
                      href={item.attachmentUrl}
                      download
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface-subtle border border-border rounded-xl text-xs font-medium text-text-primary hover:border-primary transition-colors w-fit shadow-2xs"
                    >
                      <FiPaperclip className="w-3.5 h-3.5 text-text-muted" />
                      {item.attachmentName}
                      <FiDownload className="w-3.5 h-3.5 ml-1 text-text-muted" />
                    </a>
                  )}
                </div>
              )}

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-1">
                <p
                  className={`text-xs sm:text-sm leading-relaxed max-w-2xl ${item.status === "unsubmitted" || item.status === "submitted" ? "text-text-muted" : "italic text-text-secondary font-serif"}`}
                >
                  {item.status === "unsubmitted" || item.status === "submitted"
                    ? item.feedback
                    : `"${item.feedback}"`}
                </p>

                <div className="shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
                  {isPendingSubmission ? (
                    <button
                      onClick={() => openSubmitModal(item)}
                      className="w-full sm:w-auto px-5 py-2.5 bg-primary text-primary-foreground hover:bg-primary-hover active:scale-[0.99] font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md hover:shadow-lg hover:shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <FiUpload className="w-4 h-4" />
                      {item.status === "unsubmitted"
                        ? "Submit Assignment"
                        : "Resubmit Now"}
                    </button>
                  ) : (
                    <button className="w-full sm:w-auto px-5 py-2.5 bg-surface text-text-primary border border-border hover:bg-surface-subtle font-bold text-xs sm:text-sm rounded-xl transition-colors shadow-xs cursor-pointer">
                      {item.status === "reviewed"
                        ? "View Details"
                        : "View Submission"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-surface border border-border shadow-2xl rounded-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center px-6 py-4 border-b border-border bg-surface-subtle">
              <div>
                <h3 className="text-base font-bold text-text-primary">
                  {activeAssignment?.status === "unsubmitted"
                    ? "Submit Assignment"
                    : "Resubmit Assignment"}
                </h3>
                <p className="text-xs text-text-muted mt-0.5 font-mono">
                  {activeAssignment?.assignmentTitle}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-text-muted hover:text-text-primary transition-colors p-2 rounded-xl hover:bg-surface border border-transparent hover:border-border cursor-pointer"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold tracking-wider text-text-muted uppercase mb-1.5 block">
                  GitHub Repository URL <span className="text-primary">*</span>
                </label>
                <div className="relative">
                  <FiGithub className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
                  <input
                    required
                    type="url"
                    name="githubUrl"
                    value={formData.githubUrl}
                    onChange={handleInputChange}
                    placeholder="https://github.com/username/repo"
                    className="w-full pl-10 pr-4 py-2.5 bg-surface-subtle border border-border rounded-xl text-xs sm:text-sm text-text-primary placeholder:text-text-muted/50 hover:border-primary hover:shadow-[0_0_0_1px_rgba(234,88,12,0.25)] focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all outline-none duration-150 shadow-2xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold tracking-wider text-text-muted uppercase mb-1.5 block">
                  Live Demo URL{" "}
                  <span className="text-text-muted font-normal">
                    (Optional)
                  </span>
                </label>
                <div className="relative">
                  <FiLink className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
                  <input
                    type="url"
                    name="liveDemoUrl"
                    value={formData.liveDemoUrl}
                    onChange={handleInputChange}
                    placeholder="https://my-project.vercel.app"
                    className="w-full pl-10 pr-4 py-2.5 bg-surface-subtle border border-border rounded-xl text-xs sm:text-sm text-text-primary placeholder:text-text-muted/50 hover:border-primary hover:shadow-[0_0_0_1px_rgba(234,88,12,0.25)] focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all outline-none duration-150 shadow-2xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold tracking-wider text-text-muted uppercase mb-1.5 block">
                  Submission Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Any context or notes for your mentor..."
                  className="w-full p-3.5 bg-surface-subtle border border-border rounded-xl text-xs sm:text-sm text-text-primary placeholder:text-text-muted/50 hover:border-primary focus:border-primary transition outline-none resize-none shadow-2xs"
                ></textarea>
              </div>

              <div className="flex gap-2.5 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 bg-surface text-text-primary border border-border hover:bg-surface-subtle font-semibold text-xs rounded-xl transition-colors shadow-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground hover:bg-primary-hover active:scale-[0.99] font-semibold text-xs rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:shadow-primary/20 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                      Submitting...
                    </>
                  ) : (
                    "Confirm Submission"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
