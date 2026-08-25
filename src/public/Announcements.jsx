import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/layout/Navbar"; // Adjust if your Navbar folder differs (e.g., "../components/layout/Navbar")
import Footer from "../components/layout/Footer"; // Adjust if your Footer folder differs
import { getPublicAnnouncements } from "../services/announcementService";
import { FiBell, FiX, FiLoader, FiCalendar, FiUser } from "react-icons/fi";

export default function Announcements() {
  const { user } = useAuth();

  // Block only administrative/mentor roles if they accidentally land on the public page view
  const isInternalRole = user && (user.role === "admin" || user.role === "mentor");

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  // Detail Modal State
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  useEffect(() => {
    // Internal roles never see this list, so skip the fetch for them
    if (isInternalRole) {
      setLoading(false);
      return;
    }

    const loadAnnouncements = async () => {
      try {
        setLoading(true);
        const data = await getPublicAnnouncements();
        setAnnouncements(data);
      } catch (err) {
        console.error("Failed to fetch public announcements:", err);
      } finally {
        setLoading(false);
      }
    };

    loadAnnouncements();
  }, [isInternalRole]);

  const handleOpenDetail = (item) => {
    setSelectedAnnouncement(item);
    setIsDetailModalOpen(true);
  };

  const formatDate = (dateVal) =>
    dateVal
      ? new Date(dateVal).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "Recent";

  const getPriorityBadge = (prio) => {
    switch (prio?.toLowerCase()) {
      case "urgent":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-300 border border-red-200/60 dark:border-red-900/40">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            Urgent
          </span>
        );
      case "high":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-300 border border-orange-200/60 dark:border-orange-900/40">
            High
          </span>
        );
      case "low":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold bg-surface-subtle text-text-muted border border-border">
            Low
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 border border-blue-200/60 dark:border-blue-900/40">
            Normal
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-text-primary">
      {/* Top Navbar Header */}
      <Navbar />

      {/* Main Container */}
      <main className="flex-1 mx-auto w-full max-w-[1200px] py-10 px-4 sm:px-6 space-y-8 animate-in fade-in duration-500">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
            <FiBell className="w-5 h-5" />
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl sm:text-[28px] font-bold text-text-primary tracking-tight">
              Announcements
            </h1>
            <p className="text-xs sm:text-sm text-text-muted">
              Stay up to date with the latest news, cohort updates, and program schedules.
            </p>
          </div>
        </div>

        {isInternalRole ? (
          <div className="text-center py-12 px-4 bg-surface border border-border rounded-xl shadow-sm">
            <p className="text-sm text-text-muted">
              You are logged in as a{" "}
              <span className="font-semibold text-primary capitalize">{user.role}</span>. Please
              access your dedicated dashboard portal to manage or view internal announcements.
            </p>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center gap-2 py-20 text-sm text-text-muted">
            <FiLoader className="animate-spin h-4 w-4 text-primary" />
            <span>Loading announcements...</span>
          </div>
        ) : announcements.length > 0 ? (
          <div className="space-y-4">
            {announcements.map((item) => {
              const itemId = item._id || item.id;

              return (
                <div
                  key={itemId}
                  onClick={() => handleOpenDetail(item)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") handleOpenDetail(item);
                  }}
                  className="group bg-surface border border-border rounded-xl p-5 sm:p-6 shadow-sm transition-all hover:border-primary/50 hover:shadow-md active:scale-[0.99] cursor-pointer flex flex-col gap-3"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2 min-w-0">
                      <h2 className="text-base sm:text-lg font-bold text-text-primary group-hover:text-primary transition-colors truncate">
                        {item.title}
                      </h2>
                      {item.isPinned && (
                        <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-900/40 rounded-md font-medium whitespace-nowrap">
                          Pinned
                        </span>
                      )}
                    </div>
                    {getPriorityBadge(item.priority)}
                  </div>

                  <p className="text-text-muted text-sm leading-relaxed line-clamp-2">
                    {item.content}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-text-muted pt-1 border-t border-border/60 mt-1">
                    <span className="flex items-center gap-1">
                      <FiUser className="w-3 h-3" />
                      {item.createdBy?.fullName || "System Admin"}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <FiCalendar className="w-3 h-3" />
                      {formatDate(item.publishDate)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 px-4 bg-surface border border-border rounded-xl shadow-sm">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-3 text-xl">
              📢
            </div>
            <h3 className="text-base font-bold text-text-primary mb-1">
              No announcements yet
            </h3>
            <p className="text-text-muted max-w-sm mx-auto text-xs">
              Stay updated! Important notices and cohort news will appear right
              here as soon as information is released.
            </p>
          </div>
        )}
      </main>

      {/* DETAIL MODAL */}
      {isDetailModalOpen && selectedAnnouncement && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4"
          onClick={() => setIsDetailModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-surface w-full max-w-lg rounded-2xl border border-border shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-200"
          >
            <div className="flex items-start justify-between gap-3 px-6 py-4 border-b border-border bg-surface-subtle/50">
              <div className="flex flex-wrap items-center gap-2 min-w-0">
                <h3 className="text-base font-bold text-text-primary">
                  {selectedAnnouncement.title}
                </h3>
                {selectedAnnouncement.isPinned && (
                  <span className="text-[10px] px-2 py-0.5 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 rounded-md font-medium whitespace-nowrap">
                    Pinned
                  </span>
                )}
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="text-text-muted hover:text-text-primary cursor-pointer p-1 shrink-0"
              >
                <FiX className="h-4 w-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-sm">
              <div className="flex flex-wrap items-center gap-2.5 pb-4 border-b border-border">
                {getPriorityBadge(selectedAnnouncement.priority)}
                <span className="flex items-center gap-1 text-xs text-text-muted">
                  <FiUser className="w-3.5 h-3.5" />
                  {selectedAnnouncement.createdBy?.fullName || "System Admin"}
                </span>
                <span className="flex items-center gap-1 text-xs text-text-muted">
                  <FiCalendar className="w-3.5 h-3.5" />
                  {formatDate(selectedAnnouncement.publishDate)}
                </span>
              </div>

              <p className="text-text-primary whitespace-pre-wrap leading-relaxed">
                {selectedAnnouncement.content}
              </p>
            </div>

            <div className="px-6 py-3.5 bg-surface-subtle/50 border-t border-border flex justify-end">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-surface hover:bg-surface-subtle border border-border text-text-primary font-semibold cursor-pointer text-xs transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}