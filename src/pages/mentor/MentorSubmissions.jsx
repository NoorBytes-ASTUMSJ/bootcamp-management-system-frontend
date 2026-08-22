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

export default function MentorSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [reviewForm, setReviewForm] = useState({
    score: "",
    feedback: "",
    status: "Reviewed",
  });

  const MOCK_SUBMISSIONS = [
    {
      id: 1,
      studentName: "Alex Johnson",
      studentEmail: "alex.johnson@example.com",
      avatar: "https://i.pravatar.cc/150?u=alex",
      assignment: "React Components Development",
      submittedDate: "May 24, 2026",
      submittedTime: "10:30 PM",
      status: "Pending Review",
      score: null,
      githubUrl: "https://github.com/alexjohnson/react-components",
      liveDemoUrl: "https://react-components-demo.vercel.app",
      studentNotes:
        "I focused on component reusability and state management. Please review the responsive design as well.",
    },
    {
      id: 2,
      studentName: "Maya Smith",
      studentEmail: "maya.smith@example.com",
      avatar: "https://i.pravatar.cc/150?u=maya",
      assignment: "JavaScript Functions & Scope",
      submittedDate: "May 23, 2026",
      submittedTime: "09:15 PM",
      status: "Reviewed",
      score: 85,
      githubUrl: "https://github.com/mayasmith/js-functions",
      liveDemoUrl: "",
      studentNotes: "",
    },
    {
      id: 3,
      studentName: "James Wilson",
      studentEmail: "james.wilson@example.com",
      avatar: "https://i.pravatar.cc/150?u=james",
      assignment: "HTML & CSS Layout",
      submittedDate: "May 22, 2026",
      submittedTime: "11:45 PM",
      status: "Resubmission Requested",
      score: 65,
      githubUrl: "https://github.com/jamesw/html-layout",
      liveDemoUrl: "",
      studentNotes: "",
    },
    {
      id: 4,
      studentName: "Sophia Brown",
      studentEmail: "sophia.brown@example.com",
      avatar: "https://i.pravatar.cc/150?u=sophia",
      assignment: "Node.js Fundamentals",
      submittedDate: "May 21, 2026",
      submittedTime: "08:20 PM",
      status: "Pending Review",
      score: null,
      githubUrl: "https://github.com/sophiabrown/node-basics",
      liveDemoUrl: "",
      studentNotes: "",
    },
    {
      id: 5,
      studentName: "Liam Davis",
      studentEmail: "liam.davis@example.com",
      avatar: "https://i.pravatar.cc/150?u=liam",
      assignment: "API Integration Project",
      submittedDate: "May 21, 2026",
      submittedTime: "07:10 PM",
      status: "Reviewed",
      score: 90,
      githubUrl: "https://github.com/liamdavis/api-project",
      liveDemoUrl: "",
      studentNotes: "",
    },
    {
      id: 6,
      studentName: "Olivia Miller",
      studentEmail: "olivia.miller@example.com",
      avatar: "https://i.pravatar.cc/150?u=olivia",
      assignment: "Database Design Basics",
      submittedDate: "May 20, 2026",
      submittedTime: "06:05 PM",
      status: "Pending Review",
      score: null,
      githubUrl: "https://github.com/oliviamiller/db-design",
      liveDemoUrl: "",
      studentNotes: "",
    },
    {
      id: 7,
      studentName: "Noah Martinez",
      studentEmail: "noah.martinez@example.com",
      avatar: "https://i.pravatar.cc/150?u=noah",
      assignment: "Git & GitHub Workflow",
      submittedDate: "May 19, 2026",
      submittedTime: "04:30 PM",
      status: "Reviewed",
      score: 80,
      githubUrl: "https://github.com/noahmartinez/git-workflow",
      liveDemoUrl: "",
      studentNotes: "",
    },
    {
      id: 8,
      studentName: "Isabella Anderson",
      studentEmail: "isabella.anderson@example.com",
      avatar: "https://i.pravatar.cc/150?u=isabella",
      assignment: "Final Project",
      submittedDate: "May 18, 2026",
      submittedTime: "03:50 PM",
      status: "Resubmission Requested",
      score: 70,
      githubUrl: "https://github.com/isabellaa/final-project",
      liveDemoUrl: "",
      studentNotes: "",
    },
  ];

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setSubmissions(MOCK_SUBMISSIONS);
      setLoading(false);
    }, 400);
  }, []);

  const openReviewPanel = (submission) => {
    setSelectedSubmission(submission);
    setReviewForm({
      score: submission.score || "",
      feedback: "",
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

  const handleSaveReview = (e) => {
    e.preventDefault();
    closeReviewPanel();
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
              28
            </div>
            <div className="text-xs text-text-muted mt-1">
              All time submissions
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
              8
            </div>
            <div className="text-xs text-text-muted mt-1">
              Awaiting your review
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
              20
            </div>
            <div className="text-xs text-text-muted mt-1">
              Completed reviews
            </div>
          </div>
        </div>
      </div>

      <div className="bg-surface border border-border shadow-sm rounded-xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 justify-between items-center bg-surface-subtle/30">
          <div className="relative w-full sm:w-80">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
            <input
              type="text"
              placeholder="Search student or assignment..."
              className="w-full pl-9 pr-4 py-2 bg-surface border border-border rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-shadow"
            />
          </div>
          <div className="flex w-full sm:w-auto gap-3">
            <div className="relative w-full sm:w-40">
              <select className="w-full appearance-none pl-3 pr-8 py-2 bg-surface border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer">
                <option>All Assignments</option>
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
            </div>
            <div className="relative w-full sm:w-36">
              <select className="w-full appearance-none pl-3 pr-8 py-2 bg-surface border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer">
                <option>All Statuses</option>
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
            </div>
            <div className="relative w-full sm:w-40">
              <select className="w-full appearance-none pl-3 pr-8 py-2 bg-surface border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer">
                <option>Sort by: Newest</option>
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
            </div>
          </div>
        </div>

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
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openReviewPanel(sub)}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors border focus:outline-none focus:ring-2 focus:ring-offset-1 ${sub.status === "Pending Review" ? "bg-primary text-primary-foreground hover:bg-primary-hover border-primary focus:ring-primary" : "bg-surface text-text-primary hover:bg-surface-subtle border-border focus:ring-border"}`}
                      >
                        {sub.status === "Pending Review"
                          ? "Review"
                          : "View Review"}
                      </button>
                      <button className="p-1.5 text-text-muted hover:text-text-primary rounded-lg transition-colors">
                        <FiMoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4 bg-surface-subtle/30">
          <div className="text-sm text-text-muted">
            Showing <span className="font-medium text-text-primary">1</span> to{" "}
            <span className="font-medium text-text-primary">8</span> of{" "}
            <span className="font-medium text-text-primary">28</span>{" "}
            submissions
          </div>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded border border-border text-text-muted hover:bg-surface-subtle hover:text-text-primary disabled:opacity-50 transition-colors">
              <FiChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-primary bg-primary text-primary-foreground font-medium text-sm transition-colors">
              1
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-border text-text-primary hover:bg-surface-subtle font-medium text-sm transition-colors">
              2
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-border text-text-primary hover:bg-surface-subtle font-medium text-sm transition-colors">
              3
            </button>
            <span className="w-8 h-8 flex items-center justify-center text-text-muted text-sm">
              ...
            </span>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-border text-text-primary hover:bg-surface-subtle font-medium text-sm transition-colors">
              4
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-border text-text-muted hover:bg-surface-subtle hover:text-text-primary disabled:opacity-50 transition-colors">
              <FiChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {selectedSubmission && (
        <>
          <div
            className="fixed inset-0 bg-background/50 backdrop-blur-sm z-40 animate-in fade-in duration-200"
            onClick={closeReviewPanel}
          ></div>

          <div className="fixed inset-y-0 right-0 w-full max-w-120 bg-surface border-l border-border shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300 overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-surface">
              <h2 className="text-lg font-bold text-text-primary">
                Review Submission
              </h2>
              <button
                onClick={closeReviewPanel}
                className="text-text-muted hover:text-text-primary transition-colors p-1 rounded-md hover:bg-border-subtle"
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
                <span className="px-3 py-1 bg-success/10 text-success text-[10px] font-bold uppercase tracking-wider rounded-full border border-success/20">
                  On Track
                </span>
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
                      Submitted Date
                    </div>
                    <div className="text-sm font-medium text-text-primary">
                      {selectedSubmission.submittedDate}{" "}
                      {selectedSubmission.submittedTime}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-xs text-text-muted mb-1">
                    GitHub Repository URL
                  </div>
                  <a
                    href={selectedSubmission.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-3 bg-surface-subtle border border-border rounded-lg hover:border-primary transition-colors group"
                  >
                    <div className="flex items-center gap-3 overflow-hidden text-primary">
                      <FiGithub className="shrink-0 w-4 h-4" />
                      <span className="text-sm font-medium truncate">
                        {selectedSubmission.githubUrl}
                      </span>
                    </div>
                    <FiExternalLink className="shrink-0 text-text-muted group-hover:text-primary transition-colors w-4 h-4 ml-3" />
                  </a>
                </div>

                <div>
                  <div className="text-xs text-text-muted mb-1">
                    Live Demo URL (Optional)
                  </div>
                  {selectedSubmission.liveDemoUrl ? (
                    <a
                      href={selectedSubmission.liveDemoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between p-3 bg-surface-subtle border border-border rounded-lg hover:border-primary transition-colors group"
                    >
                      <div className="flex items-center gap-3 overflow-hidden text-primary">
                        <FiExternalLink className="shrink-0 w-4 h-4" />
                        <span className="text-sm font-medium truncate">
                          {selectedSubmission.liveDemoUrl}
                        </span>
                      </div>
                      <FiExternalLink className="shrink-0 text-text-muted group-hover:text-primary transition-colors w-4 h-4 ml-3" />
                    </a>
                  ) : (
                    <div className="p-3 bg-surface-subtle border border-border border-dashed rounded-lg text-sm text-text-muted italic">
                      No live demo provided.
                    </div>
                  )}
                </div>

                <div>
                  <div className="text-xs text-text-muted mb-1">
                    Student Notes
                  </div>
                  <div className="p-4 bg-surface-subtle border border-border rounded-lg text-sm text-text-secondary leading-relaxed min-h-20">
                    {selectedSubmission.studentNotes || (
                      <span className="italic text-text-muted">
                        No notes provided by the student.
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
                      Score (out of 100) <span className="text-error">*</span>
                    </label>
                    <input
                      type="number"
                      name="score"
                      value={reviewForm.score}
                      onChange={handleReviewChange}
                      required
                      min="0"
                      max="100"
                      className="w-24 px-3 py-2 bg-surface border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-shadow"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-text-primary mb-1.5 block">
                      Feedback <span className="text-error">*</span>
                    </label>
                    <textarea
                      name="feedback"
                      value={reviewForm.feedback}
                      onChange={handleReviewChange}
                      required
                      rows="4"
                      className="w-full p-3 bg-surface border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-shadow resize-y"
                    ></textarea>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-text-primary mb-1.5 block">
                      Review Status <span className="text-error">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="status"
                        value={reviewForm.status}
                        onChange={handleReviewChange}
                        className="w-full appearance-none pl-3 pr-8 py-2.5 bg-surface border border-border rounded-lg text-sm text-text-primary font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer"
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
                className="px-5 py-2.5 bg-surface text-text-primary border border-border hover:bg-surface-subtle font-bold text-sm rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-border focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={(e) => {
                  setReviewForm((prev) => ({
                    ...prev,
                    status: "Resubmission Requested",
                  }));
                  handleSaveReview(e);
                }}
                className="px-5 py-2.5 bg-surface text-error border border-error/20 hover:bg-error/10 font-bold text-sm rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-error/20 focus:ring-offset-2"
              >
                Request Resubmission
              </button>
              <button
                type="submit"
                onClick={handleSaveReview}
                className="px-5 py-2.5 bg-primary text-primary-foreground hover:bg-primary-hover font-bold text-sm rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 shadow-sm"
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
