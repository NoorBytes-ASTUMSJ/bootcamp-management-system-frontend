import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getUserFeedAnnouncements } from "../../services/announcementService";
import { FiBell, FiX, FiLoader, FiEye } from "react-icons/fi";

export default function StudentAnnouncements() {
  const { user } = useAuth();

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      // The backend feed endpoint (getUserAnnouncements) already restricts
      // results to status: "published" AND one of:
      //   - targetAudience: public / student / member
      //   - targetAudience: batch, batch === this student's batch
      //   - targetAudience: mentor_group, this student is in targetMembers
      // (i.e. released by their own assigned mentor)
      // No extra client-side filtering is needed here — this component
      // just displays whatever the feed returns.
      const data = await getUserFeedAnnouncements();
      setAnnouncements(data);
    } catch (err) {
      console.error("Failed to fetch student announcements:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const handleRowClick = (item) => {
    setSelectedAnnouncement(item);
    setIsDetailModalOpen(true);
  };

  const getPriorityBadge = (prio) => {
    switch (prio?.toLowerCase()) {
      case "urgent":
      case "high":
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-300 border border-red-200/50 dark:border-red-900/40">
            {prio}
          </span>
        );
      case "normal":
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/40">
            Normal
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-surface-subtle text-text-muted border border-border">
            {prio || "Normal"}
          </span>
        );
    }
  };

  const getAudienceLabel = (item) => {
    const audience = (item.targetAudience || "").toLowerCase();
    if (audience === "mentor_group" || audience === "mentor-group") {
      return "From Your Mentor";
    }
    return item.targetAudience;
  };

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8 space-y-6 animate-in fade-in duration-500 pb-12">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
          Announcements & Notices
        </h1>
        <p className="text-xs sm:text-sm text-text-muted mt-0.5">
          Updates from admin and your assigned mentor.
        </p>
      </div>

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
                className="bg-surface border border-border rounded-xl p-4 sm:p-5 shadow-2xs transition hover:border-primary/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer group"
              >
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-sm sm:text-base font-bold text-text-primary truncate group-hover:text-primary transition-colors">
                      {item.title}
                    </h2>
                    {getPriorityBadge(item.priority)}
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold uppercase tracking-wide">
                      {getAudienceLabel(item)}
                    </span>
                    {item.isPinned && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-semibold">
                        Pinned
                      </span>
                    )}
                  </div>

                  <p className="text-text-muted text-xs line-clamp-1">
                    {item.content}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-text-muted pt-1">
                    <span>By <strong className="text-text-primary font-medium">{authorName}</strong></span>
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
                    className="p-2 rounded-lg bg-surface-subtle text-text-muted hover:text-text-primary hover:bg-border/50 transition cursor-pointer"
                  >
                    <FiEye className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-surface border border-border rounded-xl shadow-2xs">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-3">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-surface w-full max-w-lg rounded-xl border border-border shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-surface-subtle/50">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-text-primary">
                  {selectedAnnouncement.title}
                </h3>
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="text-text-muted hover:text-text-primary cursor-pointer p-1"
              >
                <FiX className="h-4 w-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              <div className="flex flex-wrap items-center gap-2.5 pb-3 border-b border-border text-text-muted">
                <div>
                  <span className="font-semibold text-text-primary">From:</span>{" "}
                  <span className="px-1.5 py-0.5 bg-surface-subtle rounded border border-border">
                    {getAudienceLabel(selectedAnnouncement)}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-text-primary">Priority:</span>{" "}
                  {getPriorityBadge(selectedAnnouncement.priority)}
                </div>
                <div>
                  <span className="font-semibold text-text-primary">Author:</span>{" "}
                  <span>{selectedAnnouncement.createdBy?.fullName || "System Admin"}</span>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-text-primary mb-1.5 uppercase tracking-wider text-[10px]">
                  Notice Content
                </h4>
                <div className="bg-surface-subtle p-3.5 rounded-lg border border-border text-text-primary whitespace-pre-wrap leading-relaxed">
                  {selectedAnnouncement.content}
                </div>
              </div>

              <div className="text-[11px] text-text-muted pt-2">
                Published on: {selectedAnnouncement.publishDate ? new Date(selectedAnnouncement.publishDate).toLocaleString() : "Recently"}
              </div>
            </div>

            <div className="px-5 py-3 bg-surface-subtle/50 border-t border-border flex justify-end">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4 py-1.5 bg-surface text-text-primary border border-border hover:bg-surface-subtle font-semibold rounded-lg text-xs transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}