import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  getDashboardAnnouncements,
  createAnnouncement,
  deleteAnnouncement,
} from "../../services/announcementService";
import {
  FiBell,
  FiPlus,
  FiX,
  FiTrash2,
  FiLoader,
  FiAlertTriangle,
  FiEye,
} from "react-icons/fi";

// Pulls the mentor's own batch id from whatever shape the auth `user`
// object happens to have. Add/reorder fields here if your API uses a
// different field name — this is the single place that needs to change.
function resolveMentorBatchId(user) {
  return (
    user?.batch?._id ||
    user?.batch ||
    user?.assignedBatch?._id ||
    user?.assignedBatch ||
    user?.batchId ||
    user?.mentorBatch?._id ||
    user?.mentorBatch ||
    null
  );
}

function resolveMentorBatchName(user) {
  return (
    user?.batch?.name ||
    user?.assignedBatch?.name ||
    user?.mentorBatch?.name ||
    null
  );
}

export default function MentorAnnouncements() {
  const { user } = useAuth();

  const mentorBatchId = resolveMentorBatchId(user);
  const mentorBatchName = resolveMentorBatchName(user);

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Form fields (targetAudience removed since it's handled automatically for students)
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [priority, setPriority] = useState("normal");

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Detail Modal State
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      const data = await getDashboardAnnouncements();
      // This mentor-facing list only ever shows published announcements —
      // drafts (including a mentor's own unpublished ones) stay hidden here.
      const publishedOnly = (data || []).filter(
        (a) => (a.status || "").toLowerCase() === "published",
      );
      setAnnouncements(publishedOnly);
    } catch (err) {
      console.error("Failed to fetch mentor announcements:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    // Guard: without a batch, this would post as "mentor group, no batch"
    // again — refuse instead of silently creating an unscoped announcement.
    if (!mentorBatchId) {
      setErrorMsg(
        "We couldn't find a batch assigned to your mentor account, so this announcement can't be scoped correctly. Please contact an admin to confirm your batch assignment.",
      );
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg("");

      const payload = {
        title,
        content,
        targetAudience: "mentor_group",
        priority,
        status: "published",
        batch: mentorBatchId,
      };

      const created = await createAnnouncement(payload);
      setAnnouncements((prev) => [created, ...prev]);
      setTitle("");
      setContent("");
      setPriority("normal");
      setShowForm(false);
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message ||
          err.message ||
          "Failed to publish announcement.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenDelete = (id, e) => {
    if (e) e.stopPropagation();
    setAnnouncementToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!announcementToDelete) return;
    try {
      setDeleting(true);
      await deleteAnnouncement(announcementToDelete);
      setAnnouncements((prev) =>
        prev.filter((a) => (a._id || a.id) !== announcementToDelete),
      );
      setIsDeleteModalOpen(false);
      setAnnouncementToDelete(null);
    } catch (err) {
      alert(err.message || "Failed to delete announcement.");
    } finally {
      setDeleting(false);
    }
  };

  const handleRowClick = (item) => {
    setSelectedAnnouncement(item);
    setIsDetailModalOpen(true);
  };

  const getPriorityBadge = (prio) => {
    switch (prio?.toLowerCase()) {
      case "urgent":
      case "high":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-rose-500/10 text-rose-500 border border-rose-500/20">
            {prio}
          </span>
        );
      case "normal":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-blue-500/10 text-blue-500 border border-blue-500/20">
            Normal
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-surface-subtle text-text-muted border border-border">
            {prio || "Normal"}
          </span>
        );
    }
  };

  // Shared modern card style
  const cardStyle =
    "bg-surface border border-border rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-primary/50 hover:-translate-y-0.5 transition-all duration-200";

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 pb-12 px-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight">
            Announcements & Notices
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-0.5">
            Broadcast updates, lab schedules, and notices directly to your
            assigned students.
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex justify-center items-center gap-2 bg-primary text-primary-foreground font-semibold px-4 py-2.5 rounded-xl hover:bg-primary-hover active:scale-[0.99] transition text-xs sm:text-sm shadow-md hover:shadow-lg hover:shadow-primary/20 whitespace-nowrap cursor-pointer"
        >
          {showForm ? (
            <FiX className="h-4 w-4" />
          ) : (
            <FiPlus className="h-4 w-4" />
          )}
          {showForm ? "Cancel" : "Post Announcement"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handlePostSubmit}
          className={`${cardStyle} space-y-4 animate-in zoom-in-95 duration-200`}
        >
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h2 className="text-sm font-bold text-text-primary">
              Create New Announcement
            </h2>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-bold uppercase tracking-wide border border-primary/20">
              Target:{" "}
              {mentorBatchName
                ? `Mentor Group — ${mentorBatchName}`
                : "Assigned Mentees"}
            </span>
          </div>

          {!mentorBatchId && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/25 text-amber-500 rounded-xl text-xs font-medium">
              No batch is linked to your mentor account yet, so you won't be
              able to publish until an admin assigns one.
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/25 text-rose-500 rounded-xl text-xs font-medium">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-[10px] font-mono font-bold tracking-wider text-text-muted uppercase mb-1">
              Title <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Lab Schedule Update"
              className="w-full bg-surface-subtle border border-border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-text-primary placeholder:text-text-muted/50 hover:border-primary hover:shadow-[0_0_0_1px_rgba(234,88,12,0.25)] focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all outline-none duration-150 shadow-2xs"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono font-bold tracking-wider text-text-muted uppercase mb-1">
              Priority Level
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full bg-surface-subtle border border-border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-text-primary hover:border-primary focus:border-primary transition outline-none shadow-2xs cursor-pointer"
            >
              <option value="normal">Normal</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-mono font-bold tracking-wider text-text-muted uppercase mb-1">
              Content <span className="text-primary">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your notice details here..."
              rows="4"
              className="w-full p-3.5 bg-surface-subtle border border-border rounded-xl text-xs sm:text-sm text-text-primary placeholder:text-text-muted/50 hover:border-primary focus:border-primary transition outline-none resize-none shadow-2xs"
              required
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-2 border-t border-border">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-surface text-text-primary border border-border hover:bg-surface-subtle font-semibold text-xs rounded-xl transition cursor-pointer shadow-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !mentorBatchId}
              className="px-4 py-2 bg-primary text-primary-foreground font-semibold text-xs rounded-xl hover:bg-primary-hover transition shadow-md hover:shadow-lg hover:shadow-primary/20 flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              {submitting && <FiLoader className="animate-spin h-3.5 w-3.5" />}
              <span>Publish Notice</span>
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20 text-xs text-text-muted gap-2">
          <FiLoader className="animate-spin h-4 w-4 text-primary" />
          <span>Loading announcements...</span>
        </div>
      ) : announcements.length > 0 ? (
        <div className="space-y-3">
          {announcements.map((item) => {
            const itemId = item._id || item.id;
            const authorName = item.createdBy?.fullName || "System Admin";
            const isOwner =
              item.createdBy?._id === user?._id || item.createdBy === user?._id;
            const dateStr = item.publishDate
              ? new Date(item.publishDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "Recent";

            return (
              <div
                key={itemId}
                onClick={() => handleRowClick(item)}
                className={`${cardStyle} flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer group`}
              >
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-sm sm:text-base font-bold text-text-primary truncate group-hover:text-primary transition-colors">
                      {item.title}
                    </h2>
                    {getPriorityBadge(item.priority)}
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-bold uppercase tracking-wide border border-primary/20">
                      {item.targetAudience}
                    </span>
                  </div>

                  <p className="text-text-muted text-xs line-clamp-1">
                    {item.content}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-text-muted pt-1 font-mono">
                    <span>
                      By{" "}
                      <strong className="text-text-primary font-medium">
                        {authorName}
                      </strong>
                    </span>
                    <span>•</span>
                    <span>{dateStr}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRowClick(item);
                    }}
                    title="View details"
                    className="p-2 rounded-xl bg-surface-subtle text-text-muted hover:text-text-primary hover:bg-border/50 transition cursor-pointer border border-border"
                  >
                    <FiEye className="h-4 w-4" />
                  </button>

                  {isOwner && (
                    <button
                      type="button"
                      onClick={(e) => handleOpenDelete(itemId, e)}
                      title="Delete announcement"
                      className="p-2 rounded-xl bg-surface-subtle text-text-muted hover:text-rose-500 hover:bg-rose-500/10 transition cursor-pointer border border-border"
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-surface border border-border rounded-2xl shadow-sm">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 text-primary mb-3 border border-primary/20 shadow-2xs">
            <FiBell className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-text-primary mb-1">
            No announcements available
          </h3>
          <p className="text-text-muted max-w-sm mx-auto text-xs">
            There are no notices or updates posted for your account currently.
          </p>
        </div>
      )}

      {/* DETAIL MODAL */}
      {isDetailModalOpen && selectedAnnouncement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-surface w-full max-w-lg rounded-2xl border border-border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface-subtle">
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-text-primary">
                  {selectedAnnouncement.title}
                </h3>
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="text-text-muted hover:text-text-primary cursor-pointer p-2 rounded-xl hover:bg-surface border border-transparent hover:border-border transition-colors"
              >
                <FiX className="h-4 w-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              <div className="flex flex-wrap items-center gap-3 pb-3 border-b border-border text-text-muted font-mono">
                <div>
                  <span className="font-semibold text-text-primary">
                    Audience:
                  </span>{" "}
                  <span className="capitalize px-2 py-0.5 bg-surface-subtle rounded-md border border-border">
                    {selectedAnnouncement.targetAudience}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-text-primary">
                    Priority:
                  </span>{" "}
                  {getPriorityBadge(selectedAnnouncement.priority)}
                </div>
                <div>
                  <span className="font-semibold text-text-primary">
                    Author:
                  </span>{" "}
                  <span>
                    {selectedAnnouncement.createdBy?.fullName || "System Admin"}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-mono font-bold text-text-muted uppercase tracking-wider text-[10px] mb-2">
                  Notice Content
                </h4>
                <div className="bg-surface-subtle p-4 rounded-xl border border-border text-text-primary whitespace-pre-wrap leading-relaxed">
                  {selectedAnnouncement.content}
                </div>
              </div>

              <div className="text-[11px] text-text-muted pt-2 font-mono">
                Published on:{" "}
                {selectedAnnouncement.publishDate
                  ? new Date(selectedAnnouncement.publishDate).toLocaleString()
                  : "Recently"}
              </div>
            </div>

            <div className="px-6 py-3 bg-surface-subtle border-t border-border flex justify-end">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4 py-2 bg-surface text-text-primary border border-border hover:bg-surface-subtle font-bold rounded-xl text-xs transition cursor-pointer shadow-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-surface w-full max-w-sm rounded-2xl border border-border shadow-2xl overflow-hidden p-6 text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center shadow-2xs">
              <FiAlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-text-primary">
                Delete Announcement?
              </h3>
              <p className="text-xs text-text-muted mt-1">
                This action cannot be undone. This will permanently remove the
                notice from the system.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-surface hover:bg-surface-subtle text-text-primary font-bold text-xs cursor-pointer transition shadow-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={confirmDelete}
                className="flex-1 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer transition shadow-md hover:shadow-lg hover:shadow-rose-600/20"
              >
                {deleting && <FiLoader className="animate-spin h-3.5 w-3.5" />}
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
