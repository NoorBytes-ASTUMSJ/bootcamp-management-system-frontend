import React, { useState, useEffect } from "react";
import {
  FiPlus,
  FiClipboard,
  FiCalendar,
  FiUsers,
  FiTrash2,
  FiX,
  FiEdit2,
  FiPaperclip,
  FiAlertCircle,
} from "react-icons/fi";
import { assignmentService } from "../../services/assignmentService";
import API from "../../services/api";
import { Input } from "@/components/ui/input";

export default function MentorAssignments() {
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState([]);
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newDeadline, setNewDeadline] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newMaxScore, setNewMaxScore] = useState(100);
  const [newResourceLink, setNewResourceLink] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchMentorAssignments();
  }, []);

  const fetchMentorAssignments = async () => {
    setLoading(true);
    try {
      const response = await API.get("/assignments/mentor");
      const rawAssignments = response.data.data.assignments;

      const formatted = rawAssignments.map((a) => ({
        id: a._id,
        title: a.title,
        description: a.description,
        scope: a.scope,
        deadline: new Date(a.deadline).toISOString().slice(0, 16),
        deadlineFormatted: new Date(a.deadline).toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
        }),
        totalSubmissions: a.submissionsCount || 0,
        totalStudents: a.totalStudents || 0,
        maxScore: a.maxScore || 100,
        resourceLink: a.fileUrl || "",
        fileName: a.fileName || "",
      }));

      setAssignments(formatted);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setIsEditMode(false);
    setEditId(null);
    setNewTitle("");
    setNewDeadline("");
    setNewDescription("");
    setNewMaxScore(100);
    setNewResourceLink("");
    setSelectedFile(null);
    setErrorMessage("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setIsEditMode(true);
    setEditId(item.id);
    setNewTitle(item.title);
    setNewDeadline(item.deadline);
    setNewDescription(item.description);
    setNewMaxScore(item.maxScore);
    setNewResourceLink(item.resourceLink);
    setSelectedFile(null);
    setErrorMessage("");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTitle || !newDeadline) return;

    setIsSubmitting(true);
    setErrorMessage("");
    try {
      const payload = new FormData();
      payload.append("title", newTitle);
      payload.append("description", newDescription || "");
      payload.append("deadline", newDeadline);
      payload.append("scope", "mentor_assigned");
      payload.append("maxScore", newMaxScore);
      payload.append("resourceLink", newResourceLink || "");

      if (selectedFile) {
        payload.append("file", selectedFile);
      }

      if (isEditMode) {
        await assignmentService.updateAssignment(editId, payload);
      } else {
        await assignmentService.createAssignment(payload);
      }

      setIsModalOpen(false);
      fetchMentorAssignments();
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "Failed to save assignment. Please check your connection or file size (Max 2MB).",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const promptDelete = (id) => {
    setDeleteTargetId(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      await assignmentService.deleteAssignment(deleteTargetId);
      setAssignments(assignments.filter((item) => item.id !== deleteTargetId));
      setDeleteModalOpen(false);
      setDeleteTargetId(null);
    } catch (error) {
      console.error("Failed to delete assignment");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredAssignments = assignments.filter((a) => {
    if (typeFilter === "ALL") return true;
    if (typeFilter === "Global") return a.scope === "global";
    if (typeFilter === "Mentor Assigned") return a.scope === "mentor_assigned";
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-100">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight">
            Assignments
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Manage your assignments and view global tasks for your students.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3.5 py-2.5 bg-surface border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary font-medium cursor-pointer"
          >
            <option value="ALL">All Types</option>
            <option value="Global">Global Assignments</option>
            <option value="Mentor Assigned">My Assignments</option>
          </select>

          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-bold text-sm rounded-lg hover:bg-primary-hover transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <FiPlus className="w-4 h-4" />
            Create Assignment
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredAssignments.map((item) => (
          <div
            key={item.id}
            className="bg-surface border border-border shadow-sm rounded-xl p-6 flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <span
                  className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold border ${
                    item.scope === "global"
                      ? "bg-blue-50 text-blue-700 border-blue-200"
                      : "bg-primary/10 text-primary border-primary/20"
                  }`}
                >
                  {item.scope === "global"
                    ? "Global Assignment"
                    : "Mentor Assigned"}
                </span>

                {item.scope !== "global" && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 text-text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => promptDelete(item.id)}
                      className="p-1.5 text-text-muted hover:text-error hover:bg-error/10 rounded-lg transition-colors"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <h3 className="text-base sm:text-lg font-bold text-text-primary mt-3 tracking-tight">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-text-muted mt-1 line-clamp-2">
                {item.description}
              </p>

              {item.fileName && (
                <div className="mt-3 flex items-center gap-1.5 text-xs text-primary font-medium">
                  <FiPaperclip className="w-3.5 h-3.5" />
                  <span className="truncate">{item.fileName}</span>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-border flex items-center justify-between text-xs text-text-muted font-mono">
              <div className="flex items-center gap-1.5">
                <FiCalendar className="w-4 h-4 text-primary" />
                <span>
                  Due:{" "}
                  <strong className="text-text-primary">
                    {item.deadlineFormatted}
                  </strong>
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <FiUsers className="w-4 h-4 text-primary" />
                <span>
                  Submissions:{" "}
                  <strong className="text-text-primary">
                    {item.totalSubmissions} / {item.totalStudents}
                  </strong>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAssignments.length === 0 && (
        <div className="bg-surface border border-border rounded-xl p-12 text-center text-text-muted">
          <FiClipboard className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>No assignments found.</p>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-surface border border-border rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface-subtle/30">
              <h3 className="text-lg font-bold text-text-primary">
                {isEditMode ? "Edit Assignment" : "Create New Assignment"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-text-muted hover:bg-surface hover:text-text-primary transition-colors cursor-pointer border border-transparent hover:border-border"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {errorMessage && (
                <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-lg flex items-center gap-2 text-xs text-red-700 dark:text-red-300">
                  <FiAlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">
                  Assignment Title *
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
                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">
                  Deadline (Date & Time) *
                </label>
                <Input
                  type="datetime-local"
                  required
                  value={newDeadline}
                  onChange={(e) => setNewDeadline(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  style={{ colorScheme: "light" }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">
                    Max Score
                  </label>
                  <input
                    type="number"
                    value={newMaxScore}
                    onChange={(e) => setNewMaxScore(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-surface border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">
                    PDF Attachment (Max 2MB)
                  </label>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                    className="w-full text-xs text-text-muted file:mr-2 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">
                  Resource Link (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/..."
                  value={newResourceLink}
                  onChange={(e) => setNewResourceLink(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-surface border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold tracking-wider text-text-muted uppercase mb-1.5">
                  Description & Instructions
                </label>
                <textarea
                  rows="3"
                  placeholder="Provide instructions or requirements for your students..."
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
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-primary text-primary-foreground font-bold text-sm rounded-lg hover:bg-primary-hover transition-colors shadow-sm disabled:opacity-50"
                >
                  {isSubmitting
                    ? "Saving..."
                    : isEditMode
                      ? "Save Changes"
                      : "Publish to Assigned Students"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-surface border border-border rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4">
            <h3 className="text-base font-bold text-text-primary">
              Delete Assignment
            </h3>
            <p className="text-xs text-text-muted">
              Are you sure you want to delete this assignment? This action
              cannot be undone and removes all associated submissions.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                className="px-3 py-1.5 border border-border text-text-secondary text-xs font-bold rounded-lg hover:bg-surface-subtle transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={confirmDelete}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
