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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-100">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 pb-10">
      {/* Header & Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">
            Assignments
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Create and manage assignments for your student tracks.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-bold text-sm rounded-lg hover:bg-primary-hover transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          <FiPlus className="w-4 h-4" />
          Create Assignment
        </button>
      </div>

      {/* Assignments List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {assignments.map((item) => (
          <div
            key={item.id}
            className="bg-surface border border-border shadow-sm rounded-xl p-6 flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                  {item.track}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 text-text-muted hover:text-error hover:bg-error/10 rounded-lg transition-colors"
                    title="Delete Assignment"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-bold text-text-primary mt-3">
                {item.title}
              </h3>
              <p className="text-sm text-text-muted mt-1 line-clamp-2">
                {item.description}
              </p>
            </div>

            <div className="pt-4 border-t border-border flex items-center justify-between text-xs text-text-muted">
              <div className="flex items-center gap-1.5">
                <FiCalendar className="w-4 h-4 text-primary" />
                <span>
                  Due:{" "}
                  <strong className="text-text-primary">{item.dueDate}</strong>
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <FiUsers className="w-4 h-4 text-primary" />
                <span>
                  Submitted:{" "}
                  <strong className="text-text-primary">
                    {item.totalSubmissions} / {item.totalStudents}
                  </strong>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {assignments.length === 0 && (
        <div className="bg-surface border border-border rounded-xl p-12 text-center text-text-muted">
          <FiClipboard className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>No active assignments created yet.</p>
        </div>
      )}

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-surface border border-border rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface-subtle/30">
              <h3 className="text-lg font-bold text-text-primary">
                Create New Assignment
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-text-muted hover:text-text-primary rounded-lg transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">
                  Assignment Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. State Management in React"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-surface border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">
                  Track
                </label>
                <select
                  value={newTrack}
                  onChange={(e) => setNewTrack(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-surface border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer"
                >
                  <option>Frontend Web Development</option>
                  <option>Backend Engineering</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">
                  Due Date
                </label>
                <input
                  type="date"
                  required
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-surface border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">
                  Description & Instructions
                </label>
                <textarea
                  rows="3"
                  placeholder="Provide instructions or requirements for the students..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-surface border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-border text-text-secondary hover:bg-surface-subtle font-bold text-sm rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary text-primary-foreground font-bold text-sm rounded-lg hover:bg-primary-hover transition-colors shadow-sm"
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
