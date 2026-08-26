import React, { useState, useEffect } from "react";
import {
  FiPlus,
  FiClipboard,
  FiCalendar,
  FiUsers,
  FiTrash2,
  FiX,
} from "react-icons/fi";

export default function MentorAssignments() {
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newTrack, setNewTrack] = useState("Frontend Web Development");
  const [newDueDate, setNewDueDate] = useState("");
  const [newDescription, setNewDescription] = useState("");

  // Simulate loading data
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setAssignments([
        {
          id: 1,
          title: "React Components & Props Lab",
          track: "Frontend Web Development",
          dueDate: "2026-08-28",
          totalSubmissions: 12,
          totalStudents: 15,
          description:
            "Build a reusable multi-card component layout using React props and Tailwind CSS.",
        },
        {
          id: 2,
          title: "JavaScript Array Methods Challenge",
          track: "Frontend Web Development",
          dueDate: "2026-08-22",
          totalSubmissions: 15,
          totalStudents: 15,
          description:
            "Complete algorithmic tasks using map, filter, reduce, and sort methods.",
        },
      ]);
      setLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  const handleCreateAssignment = (e) => {
    e.preventDefault();
    if (!newTitle || !newDueDate) return;

    const newAssignmentItem = {
      id: Date.now(),
      title: newTitle,
      track: newTrack,
      dueDate: newDueDate,
      totalSubmissions: 0,
      totalStudents: 15,
      description: newDescription || "No description provided.",
    };

    setAssignments([newAssignmentItem, ...assignments]);
    setNewTitle("");
    setNewDueDate("");
    setNewDescription("");
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    setAssignments(assignments.filter((item) => item.id !== id));
  };

  // Shared modern card style
  const cardStyle =
    "bg-surface border border-border rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-primary/50 hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between space-y-4";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-100">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 pb-12 px-4">
      {/* Header & Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight">
            Assignments
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-0.5">
            Create and manage assignments for your student tracks.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-semibold text-xs sm:text-sm rounded-xl hover:bg-primary-hover active:scale-[0.99] transition-all shadow-md hover:shadow-lg hover:shadow-primary/20 cursor-pointer whitespace-nowrap"
        >
          <FiPlus className="w-4 h-4" />
          Create Assignment
        </button>
      </div>

      {/* Assignments List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {assignments.map((item) => (
          <div key={item.id} className={cardStyle}>
            <div>
              <div className="flex items-start justify-between gap-2">
                <span className="inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-primary/10 text-primary border border-primary/20">
                  {item.track}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-text-muted hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-border"
                    title="Delete Assignment"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-text-primary mt-3 tracking-tight">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-text-muted mt-1 line-clamp-2">
                {item.description}
              </p>
            </div>

            <div className="pt-4 border-t border-border flex items-center justify-between text-xs text-text-muted font-mono">
              <div className="flex items-center gap-1.5">
                <FiCalendar className="w-4 h-4 text-primary" />
                <span>
                  Due:{" "}
                  <strong className="text-text-primary font-semibold">
                    {item.dueDate}
                  </strong>
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <FiUsers className="w-4 h-4 text-primary" />
                <span>
                  Submitted:{" "}
                  <strong className="text-text-primary font-semibold">
                    {item.totalSubmissions} / {item.totalStudents}
                  </strong>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {assignments.length === 0 && (
        <div className="bg-surface border border-border rounded-2xl p-16 text-center text-text-muted shadow-sm">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 text-primary mb-3 border border-primary/20 shadow-2xs">
            <FiClipboard className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-text-primary mb-1">
            No active assignments created yet
          </h3>
          <p className="text-text-muted text-xs">
            Create an assignment above to start tracking student submissions.
          </p>
        </div>
      )}

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-surface border border-border rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface-subtle">
              <h3 className="text-base font-bold text-text-primary">
                Create New Assignment
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-text-muted hover:bg-surface hover:text-text-primary transition-colors cursor-pointer border border-transparent hover:border-border"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-mono font-bold tracking-wider text-text-muted uppercase mb-1.5">
                  Assignment Title <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. State Management in React"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-surface-subtle border border-border rounded-xl text-xs sm:text-sm text-text-primary placeholder:text-text-muted/50 hover:border-primary hover:shadow-[0_0_0_1px_rgba(234,88,12,0.25)] focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all outline-none duration-150 shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold tracking-wider text-text-muted uppercase mb-1.5">
                  Track <span className="text-primary">*</span>
                </label>
                <select
                  value={newTrack}
                  onChange={(e) => setNewTrack(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-surface-subtle border border-border rounded-xl text-xs sm:text-sm text-text-primary hover:border-primary focus:border-primary transition outline-none shadow-2xs cursor-pointer"
                >
                  <option>Frontend Web Development</option>
                  <option>Backend Engineering</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold tracking-wider text-text-muted uppercase mb-1.5">
                  Due Date <span className="text-primary">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-surface-subtle border border-border rounded-xl text-xs sm:text-sm text-text-primary hover:border-primary focus:border-primary transition outline-none shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold tracking-wider text-text-muted uppercase mb-1.5">
                  Description & Instructions
                </label>
                <textarea
                  rows="3"
                  placeholder="Provide instructions or requirements for the students..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-surface-subtle border border-border rounded-xl text-xs sm:text-sm text-text-primary placeholder:text-text-muted/50 hover:border-primary focus:border-primary transition outline-none resize-none shadow-2xs"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 border border-border bg-surface text-text-primary hover:bg-surface-subtle font-semibold text-xs rounded-xl transition-colors shadow-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-primary text-primary-foreground font-semibold text-xs rounded-xl hover:bg-primary-hover active:scale-[0.99] transition-all shadow-md hover:shadow-lg hover:shadow-primary/20 cursor-pointer"
                >
                  Publish Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
