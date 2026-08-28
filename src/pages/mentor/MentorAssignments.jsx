import React, { useState, useEffect } from "react";
import {
  FiPlus,
  FiClipboard,
  FiCalendar,
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

      let rawAssignments = [];
      if (Array.isArray(response.data?.data?.assignments)) {
        rawAssignments = response.data.data.assignments;
      } else if (Array.isArray(response.data?.data)) {
        rawAssignments = response.data.data;
      } else if (Array.isArray(response.data?.assignments)) {
        rawAssignments = response.data.assignments;
      } else if (Array.isArray(response.data)) {
        rawAssignments = response.data;
      }

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
        error.response?.data?.message || "Failed to save assignment.",
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

  const getFileUrl = (url) => {
    if (!url) return "#";
    if (url.startsWith("http")) return url;
    const baseUrl = API.defaults.baseURL?.replace("/api", "") || "";
    return `${baseUrl}${url}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700 pb-12 px-4 sm:px-6 lg:px-8 mt-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">
            Assignments
          </h1>
          <p className="text-sm text-text-muted">
            Manage your assignments and view global tasks for your students.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative group flex-1 sm:flex-none min-w-[160px]">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full appearance-none px-4 py-3 bg-surface/80 backdrop-blur-sm border border-border/60 rounded-xl text-sm font-bold text-text-primary focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 cursor-pointer transition-all shadow-sm"
            >
              <option value="ALL">All Types</option>
              <option value="Global">Global Assignments</option>
              <option value="Mentor Assigned">My Assignments</option>
            </select>
          </div>

          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-bold text-sm rounded-xl hover:bg-primary-hover transition-all duration-300 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/40 hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-primary/20 whitespace-nowrap"
          >
            <FiPlus className="w-4 h-4" />
            Create New
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssignments.map((item) => (
          <div
            key={item.id}
            className="group relative overflow-hidden flex flex-col rounded-2xl border border-border/60 bg-surface/80 backdrop-blur-sm p-6 shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl hover:border-primary/40"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10 transition-opacity group-hover:opacity-100 opacity-0 duration-500"></div>

            <div className="relative z-10 flex-1 flex flex-col">
              <div className="flex items-start justify-between gap-3">
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border backdrop-blur-sm ${
                    item.scope === "global"
                      ? "bg-blue-500/10 text-blue-600 border-blue-500/20 shadow-sm shadow-blue-500/5"
                      : "bg-primary/10 text-primary border-primary/20 shadow-sm shadow-primary/5"
                  }`}
                >
                  {item.scope === "global" ? "Global Task" : "Your Assignment"}
                </span>

                {item.scope !== "global" && (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-2 bg-surface text-text-muted border border-border/50 hover:border-primary/50 hover:text-primary hover:bg-primary/5 rounded-lg transition-all shadow-sm hover:shadow-md"
                    >
                      <FiEdit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => promptDelete(item.id)}
                      className="p-2 bg-surface text-text-muted border border-border/50 hover:border-rose-500/50 hover:text-rose-600 hover:bg-rose-500/5 rounded-lg transition-all shadow-sm hover:shadow-md"
                    >
                      <FiTrash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-5 mb-6">
                <h3 className="text-lg font-black text-text-primary tracking-tight group-hover:text-primary transition-colors line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-sm text-text-muted mt-2 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>

                {item.fileName && (
                  <a
                    href={getFileUrl(item.resourceLink)}
                    download={item.fileName}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 px-3 py-2 bg-surface-subtle/50 hover:bg-primary/5 border border-border/50 hover:border-primary/30 rounded-lg text-xs text-primary font-bold transition-all w-fit max-w-full"
                  >
                    <FiPaperclip className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{item.fileName}</span>
                  </a>
                )}
              </div>
            </div>

            <div className="relative z-10 pt-5 border-t border-border/50 flex items-center justify-between mt-auto">
              <div>
                <div className="text-[10px] font-mono font-bold text-text-muted uppercase tracking-wider mb-1">
                  Due Date
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-text-primary">
                  <FiCalendar className="w-3.5 h-3.5 text-primary" />
                  {item.deadlineFormatted}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAssignments.length === 0 && (
        <div className="bg-surface/50 backdrop-blur-sm border border-border/60 rounded-2xl p-16 text-center text-text-muted flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-surface-subtle rounded-2xl flex items-center justify-center mb-4 border border-border/50 shadow-inner">
            <FiClipboard className="w-8 h-8 opacity-50" />
          </div>
          <p className="font-bold text-text-primary">No assignments found</p>
          <p className="text-sm mt-1">
            Try adjusting your filters or create a new one.
          </p>
        </div>
      )}

      {isModalOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-in fade-in duration-300"
            onClick={() => setIsModalOpen(false)}
          ></div>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in zoom-in-95 duration-300 pointer-events-none">
            <div className="bg-surface/95 backdrop-blur-xl border border-border/60 rounded-2xl shadow-2xl w-full max-w-xl flex flex-col max-h-[90vh] pointer-events-auto overflow-hidden">
              <div className="flex items-center justify-between px-6 py-5 border-b border-border/50 bg-surface/80 backdrop-blur-xl z-20">
                <h3 className="text-lg font-black text-text-primary tracking-tight">
                  {isEditMode ? "Edit Assignment" : "Create New Assignment"}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-xl text-text-muted hover:bg-surface-subtle hover:text-text-primary transition-all cursor-pointer border border-transparent hover:border-border/50"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <div className="overflow-y-auto p-6 scroll-smooth">
                <form
                  id="assignmentForm"
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  {errorMessage && (
                    <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-xl flex items-center gap-3 text-sm font-bold text-red-600 dark:text-red-400">
                      <FiAlertCircle className="w-5 h-5 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-mono font-bold text-text-muted uppercase tracking-widest mb-2">
                      Assignment Title <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. State Management in React"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full px-4 py-3 bg-surface-subtle/50 border border-border/60 rounded-xl text-sm font-bold text-text-primary focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono font-bold text-text-muted uppercase tracking-widest mb-2">
                      Deadline (Date & Time){" "}
                      <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      type="datetime-local"
                      required
                      value={newDeadline}
                      onChange={(e) => setNewDeadline(e.target.value)}
                      className="flex h-12 w-full rounded-xl border border-border/60 bg-surface-subtle/50 px-4 py-3 text-sm font-bold text-text-primary shadow-sm focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                      style={{ colorScheme: "light" }}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[11px] font-mono font-bold text-text-muted uppercase tracking-widest mb-2">
                        Max Score <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="number"
                        required
                        value={newMaxScore}
                        onChange={(e) => setNewMaxScore(e.target.value)}
                        className="w-full px-4 py-3 bg-surface-subtle/50 border border-border/60 rounded-xl text-sm font-bold text-text-primary focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono font-bold text-text-muted uppercase tracking-widest mb-2">
                        PDF Attachment{" "}
                        <span className="lowercase font-normal">(Max 2MB)</span>
                      </label>
                      <div className="relative overflow-hidden w-full px-3 py-2 bg-surface-subtle/50 border border-border/60 rounded-xl text-sm focus-within:ring-4 focus-within:ring-primary/10 focus-within:border-primary transition-all shadow-sm">
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={(e) => setSelectedFile(e.target.files[0])}
                          className="w-full text-xs font-bold text-text-muted file:mr-3 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-black file:bg-primary file:text-primary-foreground hover:file:bg-primary-hover cursor-pointer outline-none transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono font-bold text-text-muted uppercase tracking-widest mb-2">
                      Resource Link{" "}
                      <span className="lowercase font-normal">(Optional)</span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://github.com/..."
                      value={newResourceLink}
                      onChange={(e) => setNewResourceLink(e.target.value)}
                      className="w-full px-4 py-3 bg-surface-subtle/50 border border-border/60 rounded-xl text-sm font-bold text-text-primary focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono font-bold text-text-muted uppercase tracking-widest mb-2">
                      Description & Instructions
                    </label>
                    <textarea
                      rows="4"
                      placeholder="Provide detailed instructions or requirements for your students..."
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      className="w-full p-4 bg-surface-subtle/50 border border-border/60 rounded-xl text-sm text-text-primary focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-sm leading-relaxed resize-y"
                    ></textarea>
                  </div>
                </form>
              </div>

              <div className="p-6 border-t border-border/50 bg-surface/80 backdrop-blur-xl flex justify-end gap-3 z-20">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 border border-border/80 bg-surface text-text-primary hover:bg-surface-subtle font-bold text-sm rounded-xl transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="assignmentForm"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-primary text-primary-foreground font-bold text-sm rounded-xl hover:bg-primary-hover transition-all duration-300 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-md"
                >
                  {isSubmitting
                    ? "Saving..."
                    : isEditMode
                      ? "Save Changes"
                      : "Publish Assignment"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {deleteModalOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-300"
            onClick={() => setDeleteModalOpen(false)}
          ></div>
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-in zoom-in-95 duration-300 pointer-events-none">
            <div className="bg-surface/95 backdrop-blur-xl border border-border/60 rounded-2xl shadow-2xl w-full max-w-sm p-7 space-y-5 pointer-events-auto">
              <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 mb-2">
                <FiAlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-text-primary tracking-tight mb-2">
                  Delete Assignment?
                </h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  Are you sure you want to delete this assignment? This action
                  cannot be undone and will permanently remove all associated
                  student submissions.
                </p>
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteModalOpen(false)}
                  className="px-4 py-2 border border-border/80 text-text-secondary bg-surface text-sm font-bold rounded-xl hover:bg-surface-subtle transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold rounded-xl transition-all duration-300 shadow-md shadow-rose-600/20 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50"
                >
                  {isDeleting ? "Deleting..." : "Yes, Delete"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
