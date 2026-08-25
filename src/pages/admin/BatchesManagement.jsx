import React, { useState, useEffect } from "react";
import {
  getBatches,
  getBatchStats,
  createBatch,
  updateBatch,
} from "../../services/batchService";
import { Plus, X, Loader2 } from "lucide-react";

export default function BatchesManagement() {
  const [batches, setBatches] = useState([]);
  const [stats, setStats] = useState({
    totalBatches: 0,
    activeBatches: 0,
    totalStudents: 0,
    totalMentors: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedBatch, setSelectedBatch] = useState(null);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "upcoming",
  });

  const loadDashboardData = async () => {
    setLoading(true);
    const [fetchedBatches, fetchedStats] = await Promise.all([
      getBatches(),
      getBatchStats(),
    ]);

    setBatches(fetchedBatches || []);
    setStats(
      fetchedStats || {
        totalBatches: 0,
        activeBatches: 0,
        totalStudents: 0,
        totalMentors: 0,
      }
    );

    if (fetchedBatches && fetchedBatches.length > 0) {
      setSelectedBatch((prev) => {
        if (!prev) return fetchedBatches[0];
        const prevId = prev._id || prev.id;
        return (
          fetchedBatches.find((b) => (b._id || b.id) === prevId) ||
          fetchedBatches[0]
        );
      });
    } else {
      setSelectedBatch(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleOpenCreateModal = () => {
    setIsEditing(false);
    setFormData({
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      status: "upcoming",
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (batch) => {
    setIsEditing(true);

    const toInputDate = (dateStr) => {
      if (!dateStr) return "";
      const d = new Date(dateStr);
      return !isNaN(d.getTime()) ? d.toISOString().split("T")[0] : "";
    };

    let normalizedStatus = "upcoming";
    if (batch.status) {
      const s = batch.status.toLowerCase();
      if (s === "active" || s === "ongoing") normalizedStatus = "ongoing";
      else if (s === "completed") normalizedStatus = "completed";
      else normalizedStatus = "upcoming";
    }

    setFormData({
      name: batch.name || "",
      description: batch.description || "",
      startDate: toInputDate(batch.startDate),
      endDate: toInputDate(batch.endDate),
      status: normalizedStatus,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (isEditing && selectedBatch) {
        const batchId = selectedBatch._id || selectedBatch.id;
        await updateBatch(batchId, formData);
      } else {
        await createBatch(formData);
      }
      setIsModalOpen(false);
      await loadDashboardData();
    } catch (err) {
      console.error("Batch save error:", err);
      alert("Failed to save batch. Please check your network or inputs.");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    const s = status ? status.toLowerCase() : "";
    switch (s) {
      case "active":
      case "ongoing":
        return (
          <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-medium bg-[#E8F8F0] text-[#10B981] dark:bg-emerald-950/40 dark:text-emerald-300">
            Active
          </span>
        );
      case "upcoming":
        return (
          <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-medium bg-[#FEF6E7] text-[#D97706] dark:bg-amber-950/40 dark:text-amber-300">
            Upcoming
          </span>
        );
      case "completed":
        return (
          <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-medium bg-[#F1F5F9] text-[#64748B] dark:bg-neutral-800 dark:text-neutral-300">
            Completed
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen w-full font-sans overflow-hidden bg-[#FAFBFC] dark:bg-[#0E1117] text-neutral-900 dark:text-neutral-100 transition-colors">
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#FAFBFC] dark:bg-[#0E1117]">
        <main className="flex-1 overflow-y-auto px-8 py-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
                Batches
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Create and manage bootcamp batches.
              </p>
            </div>

            <button
              onClick={handleOpenCreateModal}
              className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-md bg-[#B91C1C] hover:bg-[#991B1B] text-white text-xs font-medium transition-colors cursor-pointer shadow-2xs"
            >
              <Plus size={13} />
              <span>Create Batch</span>
            </button>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                TOTAL BATCHES
              </span>
              <div className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
                {stats.totalBatches}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                ACTIVE BATCHES
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black tracking-tight text-[#B91C1C]">
                  {stats.activeBatches}
                </span>
                <span className="text-xs text-neutral-400 font-normal">
                  Currently running
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                TOTAL STUDENTS
              </span>
              <div className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
                {stats.totalStudents ? stats.totalStudents.toLocaleString() : 0}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                TOTAL MENTORS
              </span>
              <div className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
                {stats.totalMentors ? stats.totalMentors.toLocaleString() : 0}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start transition-all duration-300">
            <div
              className={`space-y-3 transition-all duration-300 ${
                selectedBatch ? "lg:col-span-8" : "lg:col-span-12"
              }`}
            >
              <div className="bg-white dark:bg-[#151921] rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 overflow-hidden shadow-2xs">
                {loading ? (
                  <div className="flex items-center justify-center py-16 gap-2 text-xs text-neutral-500">
                    <Loader2 className="animate-spin text-[#B91C1C]" size={16} />
                    <span>Loading batches...</span>
                  </div>
                ) : batches.length === 0 ? (
                  <div className="flex items-center justify-center py-16 text-xs text-neutral-500">
                    No batches found. Click "Create Batch" to start one.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                          <th className="py-3 px-5">BATCH NAME</th>
                          <th className="py-3 px-4">STATUS</th>
                          <th className="py-3 px-4">STUDENTS</th>
                          <th className="py-3 px-5">TIMELINE</th>
                          <th className="py-3 px-4 text-right">ACTION</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
                        {batches.map((b) => {
                          const batchId = b._id || b.id;
                          const selectedId = selectedBatch?._id || selectedBatch?.id;
                          const isSelected = selectedId === batchId;

                          return (
                            <tr
                              key={batchId}
                              onClick={() => setSelectedBatch(b)}
                              className={`hover:bg-neutral-50/70 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer ${
                                isSelected
                                  ? "bg-[#FEF2F2]/50 dark:bg-primary/10"
                                  : ""
                              }`}
                            >
                              <td className="py-4 px-5 font-semibold text-neutral-900 dark:text-neutral-100">
                                {b.name}
                              </td>
                              <td className="py-4 px-4">
                                {getStatusBadge(b.status)}
                              </td>
                              <td className="py-4 px-4 font-medium text-neutral-700 dark:text-neutral-300">
                                <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                                  {b.currentStudents || b.studentCount || 0}
                                </span>{" "}
                                / {b.capacity || "—"}
                              </td>
                              <td className="py-4 px-5 text-neutral-600 dark:text-neutral-400">
                                {b.timeline || "N/A"}
                              </td>
                              <td className="py-4 px-4 text-right">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedBatch(b);
                                  }}
                                  className="text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:text-[#B91C1C] dark:hover:text-primary transition-colors cursor-pointer inline-block leading-tight"
                                >
                                  View Details
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Right Drawer Card (Batch Details) */}
            {selectedBatch && (
              <div className="lg:col-span-4 bg-white dark:bg-[#151921] rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 p-5 shadow-2xs relative space-y-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-start justify-between pb-1">
                  <div>
                    <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
                      {selectedBatch.name}
                    </h3>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      {selectedBatch.track || selectedBatch.description}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedBatch(null)}
                    className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 cursor-pointer p-0.5"
                    title="Close Details"
                  >
                    <X size={15} />
                  </button>
                </div>

                <div>{getStatusBadge(selectedBatch.status)}</div>

                <div className="grid grid-cols-2 gap-4 text-xs pt-1">
                  <div>
                    <span className="text-[10px] text-neutral-400 block mb-0.5">
                      Start Date
                    </span>
                    <span className="font-medium text-neutral-800 dark:text-neutral-200 text-[11px]">
                      {selectedBatch.startDate ? new Date(selectedBatch.startDate).toLocaleDateString() : "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 block mb-0.5">
                      End Date
                    </span>
                    <span className="font-medium text-neutral-800 dark:text-neutral-200 text-[11px]">
                      {selectedBatch.endDate ? new Date(selectedBatch.endDate).toLocaleDateString() : "N/A"}
                    </span>
                  </div>
                </div>

                {/* Primary Red Edit Button */}
                <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800">
                  <button
                    onClick={() => handleOpenEditModal(selectedBatch)}
                    className="w-full py-2 px-3 rounded-md bg-[#B91C1C] hover:bg-[#991B1B] text-white text-xs font-medium transition-colors cursor-pointer text-center shadow-2xs"
                  >
                    Edit Batch
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Create / Edit Batch Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-[#151921] rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
                {isEditing ? "Edit Batch" : "Create Batch"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-neutral-600 dark:text-neutral-300 font-medium mb-1">
                  Batch Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Batch 2026-A"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-md border border-neutral-200 dark:border-neutral-700 bg-transparent text-neutral-900 dark:text-white focus:outline-none focus:border-[#B91C1C]"
                />
              </div>

              <div>
                <label className="block text-neutral-600 dark:text-neutral-300 font-medium mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Web Development Bootcamp"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-md border border-neutral-200 dark:border-neutral-700 bg-transparent text-neutral-900 dark:text-white focus:outline-none focus:border-[#B91C1C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-600 dark:text-neutral-300 font-medium mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-md border border-neutral-200 dark:border-neutral-700 bg-transparent text-neutral-900 dark:text-white focus:outline-none focus:border-[#B91C1C]"
                  />
                </div>
                <div>
                  <label className="block text-neutral-600 dark:text-neutral-300 font-medium mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-md border border-neutral-200 dark:border-neutral-700 bg-transparent text-neutral-900 dark:text-white focus:outline-none focus:border-[#B91C1C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-600 dark:text-neutral-300 font-medium mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#151921] text-neutral-900 dark:text-white focus:outline-none focus:border-[#B91C1C]"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing (Active)</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-md border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#B91C1C] hover:bg-[#991B1B] text-white font-medium transition-colors shadow-2xs disabled:opacity-50"
                >
                  {submitting && (
                    <Loader2 className="animate-spin" size={13} />
                  )}
                  <span>{isEditing ? "Save Changes" : "Create Batch"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}