import React, { useState, useEffect } from "react";
import {
  getDashboardAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "../../services/announcementService";
import API from "../../services/api";
import {
  Search,
  ChevronDown,
  Plus,
  Loader2,
  Pencil,
  Trash2,
  X,
  AlertCircle,
  AlertTriangle,
  Pin,
  Megaphone,
} from "lucide-react";

export default function AnnouncementsManagement({
  isDarkMode,
  onToggleTheme,
  onNavigateAdminView,
  onLogout,
}) {
  const [announcements, setAnnouncements] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [audienceFilter, setAudienceFilter] = useState("ALL");
  const [batchFilter, setBatchFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Detail Modal State
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  // Create / Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    status: "draft",
    targetAudience: "public",
    batch: "",
    priority: "normal",
    isPinned: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Delete Confirmation Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [annData, batchRes] = await Promise.all([
        getDashboardAnnouncements(),
        API.get("/batches").catch(() => ({ data: { data: { batches: [] } } })),
      ]);

      setAnnouncements(annData);

      const batchList =
        batchRes.data?.data?.batches ||
        batchRes.data?.batches ||
        batchRes.data ||
        [];
      setBatches(batchList);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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
      setAnnouncements((prev) => prev.filter((a) => (a._id || a.id) !== announcementToDelete));
      setIsDeleteModalOpen(false);
      setAnnouncementToDelete(null);
    } catch (err) {
      alert(err.message || "Failed to delete announcement.");
    } finally {
      setDeleting(false);
    }
  };

  const handleRowClick = (announcement) => {
    setSelectedAnnouncement(announcement);
    setIsDetailModalOpen(true);
  };

  const handleOpenCreate = () => {
    setEditingAnnouncement(null);
    setFormData({
      title: "",
      content: "",
      status: "draft",
      targetAudience: "public",
      batch: "",
      priority: "normal",
      isPinned: false,
    });
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (announcement, e) => {
    if (e) e.stopPropagation();
    setEditingAnnouncement(announcement);
    setFormData({
      title: announcement.title || "",
      content: announcement.content || "",
      status: announcement.status || "draft",
      targetAudience: announcement.targetAudience || "public",
      batch: announcement.batch?._id || announcement.batch || "",
      priority: announcement.priority || "normal",
      isPinned: announcement.isPinned || false,
    });
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSubmitting(true);

    try {
      const needsBatchScope = ["student", "mentor", "admin", "member", "mentor-group"].includes(formData.targetAudience);

      const payload = {
        ...formData,
        status: formData.status,
        batch: needsBatchScope && formData.batch !== "" ? formData.batch : null,
      };

      if (editingAnnouncement) {
        const id = editingAnnouncement._id || editingAnnouncement.id;
        const updated = await updateAnnouncement(id, payload);
        setAnnouncements((prev) =>
          prev.map((a) => (a._id === id || a.id === id ? updated : a))
        );
      } else {
        const created = await createAnnouncement(payload);
        setAnnouncements((prev) => [created, ...prev]);
      }
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || "Operation failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredAnnouncements = announcements.filter((a) => {
    const query = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !query ||
      (a.title || "").toLowerCase().includes(query) ||
      (a.content || "").toLowerCase().includes(query);

    const audienceStr = (a.targetAudience || "").toLowerCase().trim();
    const matchesAudience =
      audienceFilter === "ALL" ||
      audienceStr === audienceFilter.toLowerCase().trim() ||
      (audienceFilter.toLowerCase().trim() === "mentor-group" && (audienceStr === "mentor_group" || audienceStr === "mentorgroup"));

    const itemBatchId = a.batch?._id || a.batch || "";
    const matchesBatch =
      batchFilter === "ALL" || itemBatchId === batchFilter;

    const matchesStatus =
      statusFilter === "ALL" ||
      (a.status || "").toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesAudience && matchesBatch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "published":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Published
          </span>
        );
      case "draft":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/40">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Draft
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
            {status}
          </span>
        );
    }
  };

  // Renders the exact scope/batch text for a table row.
  // Mentor & Mentor Group announcements always show the precise batch name
  // instead of a generic "All mentors" style fallback.
  const getScopeText = (a) => {
    const audience = (a.targetAudience || "").toLowerCase().trim();
    const batchScopedAudiences = ["student", "mentor", "admin", "member", "mentor-group", "mentor_group", "mentorgroup"];

    if (!batchScopedAudiences.includes(audience)) return "—";

    const batchName = a.batch?.name;

    if (audience === "mentor-group" || audience === "mentor_group" || audience === "mentorgroup") {
      return batchName ? `Mentor Group — ${batchName}` : "Mentor Group — No Batch Assigned";
    }

    if (audience === "mentor") {
      return batchName ? batchName : "All Mentors";
    }

    return batchName || `All ${a.targetAudience}s`;
  };

  return (
    <div className="flex h-screen w-full font-sans overflow-hidden bg-[#FAFBFC] dark:bg-[#0E1117] text-neutral-900 dark:text-neutral-100 transition-colors">
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#FAFBFC] dark:bg-[#0E1117]">
        <main className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200/60 dark:border-neutral-800/80">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 text-[#B91C1C] border border-red-100 dark:border-red-900/30">
                <Megaphone size={22} />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
                  Announcements Management
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Manage public, member, student, mentor, and mentor group posts.
                </p>
              </div>
            </div>

            <button
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#B91C1C] hover:bg-[#991B1B] text-white text-xs font-semibold transition-all shadow-sm cursor-pointer"
            >
              <Plus size={15} />
              <span>Create Announcement</span>
            </button>
          </div>

          {/* Filters Bar */}
          <div className="p-4 bg-white dark:bg-[#151921] rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex-1 min-w-[240px] relative">
                <Search
                  size={14}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
                />
                <input
                  type="text"
                  placeholder="Search announcements by title or content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg text-xs bg-neutral-50/70 dark:bg-[#0E1117] border border-neutral-200/80 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 placeholder:text-neutral-400 focus:outline-none focus:border-[#B91C1C] transition-colors"
                />
              </div>

              {/* Audience Filter — Mentor Group option is KEPT here so admins can still filter by it */}
              <div className="relative">
                <select
                  value={audienceFilter}
                  onChange={(e) => setAudienceFilter(e.target.value)}
                  className="appearance-none pl-3.5 pr-8 py-2 rounded-lg text-xs bg-white dark:bg-[#0E1117] border border-neutral-200/80 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 focus:outline-none focus:border-[#B91C1C] cursor-pointer"
                >
                  <option value="ALL">All Audiences</option>
                  <option value="public">Public</option>
                  <option value="member">Member</option>
                  <option value="student">Student</option>
                  <option value="mentor">Mentor</option>
                  <option value="mentor-group">Mentor Group</option>
                  <option value="admin">Admin</option>
                </select>
                <ChevronDown
                  size={13}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
                />
              </div>

              <div className="relative">
                <select
                  value={batchFilter}
                  onChange={(e) => setBatchFilter(e.target.value)}
                  className="appearance-none pl-3.5 pr-8 py-2 rounded-lg text-xs bg-white dark:bg-[#0E1117] border border-neutral-200/80 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 focus:outline-none focus:border-[#B91C1C] cursor-pointer"
                >
                  <option value="ALL">All Batches</option>
                  {batches.map((b) => {
                    const batchId = b._id || b.id;
                    const batchName = b.name || `Batch (${batchId.slice(-6)})`;
                    return (
                      <option key={batchId} value={batchId}>
                        {batchName}
                      </option>
                    );
                  })}
                </select>
                <ChevronDown
                  size={13}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
                />
              </div>

              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none pl-3.5 pr-8 py-2 rounded-lg text-xs bg-white dark:bg-[#0E1117] border border-neutral-200/80 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 focus:outline-none focus:border-[#B91C1C] cursor-pointer"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
                <ChevronDown
                  size={13}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
                />
              </div>
            </div>
          </div>

          {/* Table Card */}
          {loading && announcements.length === 0 ? (
            <div className="flex items-center justify-center py-24 gap-2 text-xs text-neutral-500">
              <Loader2 className="animate-spin text-[#B91C1C]" size={20} />
              <span>Loading announcements...</span>
            </div>
          ) : (
            <div className="bg-white dark:bg-[#151921] rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-neutral-200/60 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-800/40 text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                      <th className="py-3.5 px-5">Title</th>
                      <th className="py-3.5 px-4">Audience</th>
                      <th className="py-3.5 px-4">Scope / Batch</th>
                      <th className="py-3.5 px-4">Date</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/70">
                    {filteredAnnouncements.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-12 text-neutral-400 text-xs">
                          No announcements match your filter criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredAnnouncements.map((a) => {
                        const rowId = a._id || a.id;
                        return (
                          <tr
                            key={rowId}
                            onClick={() => handleRowClick(a)}
                            className="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer group"
                          >
                            <td className="py-4 px-5 font-semibold text-neutral-900 dark:text-neutral-100">
                              <div className="flex items-center gap-2">
                                <span className="group-hover:text-[#B91C1C] transition-colors">{a.title}</span>
                                {a.isPinned && (
                                  <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 bg-red-50 dark:bg-red-950/60 text-[#B91C1C] border border-red-200/60 dark:border-red-900/40 rounded-md font-medium">
                                    <Pin size={10} /> Pinned
                                  </span>
                                )}
                              </div>
                            </td>

                            <td className="py-4 px-4 text-neutral-600 dark:text-neutral-400 capitalize">
                              {a.targetAudience}
                            </td>

                            <td className="py-4 px-4 text-neutral-600 dark:text-neutral-400">
                              {getScopeText(a)}
                            </td>

                            <td className="py-4 px-4 text-neutral-500 dark:text-neutral-400 text-xs">
                              {a.publishDate
                                ? new Date(a.publishDate).toLocaleDateString()
                                : "N/A"}
                            </td>

                            <td className="py-4 px-4">{getStatusBadge(a.status)}</td>

                            <td className="py-4 px-5 text-right">
                              <div className="flex items-center justify-end gap-1.5 text-neutral-400">
                                <button
                                  type="button"
                                  onClick={(e) => handleOpenEdit(a, e)}
                                  title="Edit"
                                  className="p-1.5 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-[#B91C1C] transition-colors cursor-pointer"
                                >
                                  <Pencil size={14} />
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => handleOpenDelete(rowId, e)}
                                  title="Delete"
                                  className="p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-950/50 hover:text-red-600 transition-colors cursor-pointer"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              <div className="px-5 py-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-500">
                <span>
                  Showing <strong className="text-neutral-700 dark:text-neutral-300">{filteredAnnouncements.length}</strong> of <strong className="text-neutral-700 dark:text-neutral-300">{announcements.length}</strong> announcements
                </span>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* DETAIL MODAL */}
      {isDetailModalOpen && selectedAnnouncement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-[#151921] w-full max-w-lg rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-2.5">
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                  {selectedAnnouncement.title}
                </h3>
                {selectedAnnouncement.isPinned && (
                  <span className="text-[10px] px-2 py-0.5 bg-red-50 dark:bg-red-950/50 text-[#B91C1C] rounded-md font-medium">
                    Pinned
                  </span>
                )}
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 rounded-lg cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-[#0E1117] border border-neutral-200/60 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400">
                <div>
                  <span className="font-semibold text-neutral-700 dark:text-neutral-300">Audience:</span>{" "}
                  <span className="capitalize">{selectedAnnouncement.targetAudience}</span>
                </div>
                <div>
                  <span className="font-semibold text-neutral-700 dark:text-neutral-300">Scope / Batch:</span>{" "}
                  <span>{getScopeText(selectedAnnouncement)}</span>
                </div>
                <div>
                  <span className="font-semibold text-neutral-700 dark:text-neutral-300">Priority:</span>{" "}
                  <span className="capitalize">{selectedAnnouncement.priority}</span>
                </div>
                <div>
                  <span className="font-semibold text-neutral-700 dark:text-neutral-300">Status:</span>{" "}
                  <span className="capitalize">{selectedAnnouncement.status}</span>
                </div>
                <div>
                  <span className="font-semibold text-neutral-700 dark:text-neutral-300">Published:</span>{" "}
                  <span>{selectedAnnouncement.publishDate ? new Date(selectedAnnouncement.publishDate).toLocaleDateString() : "N/A"}</span>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">Content</h4>
                <p className="text-neutral-800 dark:text-neutral-200 whitespace-pre-wrap leading-relaxed bg-neutral-50 dark:bg-[#0E1117] p-4 rounded-xl border border-neutral-200/60 dark:border-neutral-800">
                  {selectedAnnouncement.content}
                </p>
              </div>
            </div>

            <div className="px-6 py-3.5 bg-neutral-50 dark:bg-neutral-900/50 border-t border-neutral-100 dark:border-neutral-800 flex justify-end">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 font-semibold cursor-pointer text-xs transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-[#151921] w-full max-w-lg rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                {editingAnnouncement ? "Edit Announcement" : "Create New Announcement"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 rounded-lg cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
              {errorMsg && (
                <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-300 rounded-lg flex items-center gap-2">
                  <AlertCircle size={14} />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  maxLength={150}
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter announcement title..."
                  className="w-full px-3.5 py-2 rounded-lg bg-neutral-50 dark:bg-[#0E1117] border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-[#B91C1C]"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Content *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write the announcement details here..."
                  className="w-full px-3.5 py-2 rounded-lg bg-neutral-50 dark:bg-[#0E1117] border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-[#B91C1C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Target Audience *
                  </label>
                  <select
                    value={formData.targetAudience}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        targetAudience: e.target.value,
                        batch: "",
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-neutral-50 dark:bg-[#0E1117] border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-[#B91C1C] cursor-pointer"
                  >
                    <option value="public">Public</option>
                    <option value="member">Member</option>
                    <option value="student">Student</option>
                    <option value="mentor">Mentor</option>
                    {/*
                      "Mentor Group" is intentionally NOT offered as a creatable
                      option here — mentor-group announcements are created by
                      mentors themselves, not by admins from this form.
                      We still render it if an existing announcement being
                      edited already has this audience, so the select shows
                      the correct value and editing (title/content/status/etc.)
                      keeps working without silently changing its audience.
                    */}
                    {formData.targetAudience === "mentor-group" && (
                      <option value="mentor-group">Mentor Group</option>
                    )}
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Status *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-50 dark:bg-[#0E1117] border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-[#B91C1C] cursor-pointer"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>

              {["student", "mentor", "admin", "member", "mentor-group"].includes(formData.targetAudience) && (
                <div>
                  <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Batch / Group Scope
                  </label>
                  <select
                    value={formData.batch}
                    onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-50 dark:bg-[#0E1117] border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-[#B91C1C] cursor-pointer"
                  >
                    <option value="">All {formData.targetAudience}s (Across all batches)</option>
                    {batches.map((b) => {
                      const batchId = b._id || b.id;
                      const batchName = b.name || `Batch (${batchId.slice(-6)})`;
                      return (
                        <option key={batchId} value={batchId}>
                          {batchName}
                        </option>
                      );
                    })}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-50 dark:bg-[#0E1117] border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-[#B91C1C] cursor-pointer"
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isPinned}
                      onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                      className="rounded border-neutral-300 text-[#B91C1C] focus:ring-[#B91C1C] cursor-pointer"
                    />
                    <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                      Pin Announcement
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg bg-[#B91C1C] hover:bg-[#991B1B] text-white font-semibold cursor-pointer flex items-center gap-1.5 disabled:opacity-50 transition-all shadow-sm"
                >
                  {submitting && <Loader2 size={14} className="animate-spin" />}
                  <span>{editingAnnouncement ? "Save Changes" : "Save Announcement"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-[#151921] w-full max-w-sm rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden p-6 text-center space-y-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-red-50 dark:bg-red-950/60 text-[#B91C1C] flex items-center justify-center border border-red-100 dark:border-red-900/30">
              <AlertTriangle size={22} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                Delete Announcement?
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                This action cannot be undone. This will permanently remove the announcement from the system.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 font-semibold cursor-pointer text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 rounded-lg bg-[#B91C1C] hover:bg-[#991B1B] text-white font-semibold cursor-pointer text-xs flex items-center justify-center gap-1.5 disabled:opacity-50 transition-all"
              >
                {deleting && <Loader2 size={13} className="animate-spin" />}
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}