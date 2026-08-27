import React, { useState, useEffect, useRef } from "react";
import AdminSidebar from "../../components/layout/AdminSidebar";
import { assignmentService } from "../../services/assignmentService";
import API from "../../services/api";
import {
  Search,
  ChevronDown,
  Bell,
  User,
  Moon,
  Sun,
  LogOut,
  Check,
  X,
  Plus,
  Loader2,
  Paperclip,
  Pencil,
  Trash2,
  ExternalLink,
  AlertCircle,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AssignmentsManagement({
  isDarkMode,
  onToggleTheme,
  onNavigateAdminView,
  onLogout,
}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [batchFilter, setBatchFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const [batches, setBatches] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    batch: "",
    deadline: "",
    scope: "global",
    maxScore: 100,
    resourceLink: "",
  });

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    async function fetchBatches() {
      try {
        const response = await API.get("/batches");
        const resData = response.data;
        let fetchedBatches = [];

        if (Array.isArray(resData)) {
          fetchedBatches = resData;
        } else if (Array.isArray(resData?.data)) {
          fetchedBatches = resData.data;
        } else if (Array.isArray(resData?.data?.batches)) {
          fetchedBatches = resData.data.batches;
        } else if (Array.isArray(resData?.batches)) {
          fetchedBatches = resData.batches;
        }

        if (fetchedBatches.length > 0) {
          setBatches(fetchedBatches);
        }
      } catch (err) {}
    }
    fetchBatches();
  }, []);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const overview = await assignmentService.getAssignmentsOverview();
        setData(overview);
        if (overview?.assignments?.length > 0) {
          setSelectedAssignment(overview.assignments[0]);
        }
      } catch (error) {}
      setLoading(false);
    }
    loadData();
  }, []);

  const formatForDateTimeInput = (isoString) => {
    if (!isoString) return "";
    const d = new Date(isoString);
    const pad = (n) => n.toString().padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const handleOpenCreate = () => {
    setIsEditMode(false);
    setEditId(null);
    setFormData({
      title: "",
      description: "",
      batch: "",
      deadline: "",
      scope: "global",
      maxScore: 100,
      resourceLink: "",
    });
    setSelectedFile(null);
    setErrorMessage("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (a) => {
    setIsEditMode(true);
    setEditId(a.id);
    setFormData({
      title: a.title,
      description: a.description,
      batch: a.rawBatchId || "",
      deadline: formatForDateTimeInput(a.rawDeadline),
      scope: a.scope || "global",
      maxScore: a.rawMaxScore || 100,
      resourceLink: a.resourceLink || "",
    });
    setSelectedFile(null);
    setErrorMessage("");
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.batch || !formData.deadline) {
      setErrorMessage(
        "Please fill in all required fields (Title, Batch, Deadline)",
      );
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("description", formData.description);
      payload.append("batch", formData.batch);
      payload.append("deadline", formData.deadline);
      payload.append("scope", formData.scope);
      payload.append("maxScore", formData.maxScore);
      payload.append("resourceLink", formData.resourceLink);

      if (selectedFile) {
        payload.append("file", selectedFile);
      }

      if (isEditMode) {
        await assignmentService.updateAssignment(editId, payload);
      } else {
        await assignmentService.createAssignment(payload);
      }

      setIsModalOpen(false);
      const overview = await assignmentService.getAssignmentsOverview();
      setData(overview);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "Failed to process assignment. Check file size (Max 2MB).",
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
      const updated = data.assignments.filter((a) => a.id !== deleteTargetId);
      setData({ ...data, assignments: updated });
      if (selectedAssignment?.id === deleteTargetId) {
        setSelectedAssignment(null);
      }
      setDeleteModalOpen(false);
      setDeleteTargetId(null);
    } catch (error) {
      console.error("Failed to delete assignment");
    } finally {
      setIsDeleting(false);
    }
  };

  const assignmentsList = data?.assignments || [];
  const availableBatches = batches.map((b) => b.name || b.title);
  const availableStatuses = ["Active", "Closed", "Past Due"];

  const filteredAssignments = assignmentsList.filter((a) => {
    const query = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !query ||
      (a.title || "").toLowerCase().includes(query) ||
      (a.batchName || "").toLowerCase().includes(query);
    const matchesBatch =
      batchFilter === "ALL" ||
      (a.batchName || "").toLowerCase() === batchFilter.toLowerCase();
    const matchesStatus =
      statusFilter === "ALL" ||
      (a.status || "").toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesBatch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "Active":
        return (
          <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-900/40">
            Active
          </span>
        );
      case "Closed":
        return (
          <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200/60 dark:border-rose-900/40">
            Closed
          </span>
        );
      case "Past Due":
        return (
          <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-semibold bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200/60 dark:border-sky-900/40">
            Past Due
          </span>
        );
      default:
        return (
          <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200/50 dark:border-neutral-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="w-full font-sans bg-[#FAFBFC] dark:bg-[#0E1117] text-neutral-900 dark:text-neutral-100 transition-colors">
      <div className="flex-1 flex flex-col min-w-0">
        <main className="px-8 py-6 space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-24 gap-2 text-xs text-neutral-500">
              <Loader2 className="animate-spin text-[#B91C1C]" size={18} />
              <span>Loading assignments data...</span>
            </div>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
                    Assignments
                  </h2>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    Manage assignments and monitor their progress.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleOpenCreate}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#B91C1C] hover:bg-[#991B1B] text-white text-xs font-medium transition-all duration-300 cursor-pointer shadow-md shadow-red-500/10 hover:-translate-y-0.5 border-none outline-none"
                  >
                    <Plus size={14} />
                    <span>Create Assignment</span>
                  </button>

                  <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogContent className="sm:max-w-125 bg-white dark:bg-[#151921] border-neutral-200 dark:border-neutral-800">
                      <DialogHeader>
                        <DialogTitle className="text-neutral-900 dark:text-white">
                          {isEditMode
                            ? "Edit Assignment"
                            : "Create New Assignment"}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        {errorMessage && (
                          <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-lg flex items-center gap-2 text-xs text-red-700 dark:text-red-300">
                            <AlertCircle size={15} className="shrink-0" />
                            <span>{errorMessage}</span>
                          </div>
                        )}

                        <div className="grid gap-2">
                          <Label
                            htmlFor="title"
                            className="text-neutral-900 dark:text-neutral-200"
                          >
                            Assignment Title *
                          </Label>
                          <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                title: e.target.value,
                              })
                            }
                            placeholder="e.g., Build a REST API"
                            className="dark:bg-[#0E1117] dark:border-neutral-700 dark:text-white"
                          />
                        </div>

                        <div className="grid gap-2">
                          <Label
                            htmlFor="desc"
                            className="text-neutral-900 dark:text-neutral-200"
                          >
                            Description
                          </Label>
                          <textarea
                            id="desc"
                            value={formData.description}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                description: e.target.value,
                              })
                            }
                            className="flex min-h-20 w-full rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm shadow-sm dark:border-neutral-700 dark:bg-[#0E1117] dark:text-white"
                            placeholder="Provide details..."
                          />
                        </div>

                        <div className="grid gap-2">
                          <Label
                            htmlFor="file"
                            className="text-neutral-900 dark:text-neutral-200"
                          >
                            Attachment (PDF - Max 2MB)
                          </Label>
                          <Input
                            id="file"
                            type="file"
                            accept=".pdf"
                            onChange={(e) => setSelectedFile(e.target.files[0])}
                            className="dark:bg-[#0E1117] dark:border-neutral-700 dark:text-white cursor-pointer file:text-neutral-900 dark:file:text-white file:font-medium file:border-0 file:bg-transparent"
                          />
                        </div>

                        <div className="grid gap-2">
                          <Label
                            htmlFor="resourceLink"
                            className="text-neutral-900 dark:text-neutral-200"
                          >
                            Resource Link (Optional)
                          </Label>
                          <Input
                            id="resourceLink"
                            type="url"
                            value={formData.resourceLink}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                resourceLink: e.target.value,
                              })
                            }
                            placeholder="e.g., https://github.com/..."
                            className="dark:bg-[#0E1117] dark:border-neutral-700 dark:text-white"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label className="text-neutral-900 dark:text-neutral-200">
                              Target Batch *
                            </Label>
                            <select
                              value={formData.batch}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  batch: e.target.value,
                                })
                              }
                              disabled={isEditMode}
                              className={`flex h-9 w-full rounded-md border border-neutral-200 bg-transparent px-3 py-1 text-sm shadow-sm dark:border-neutral-700 dark:bg-[#0E1117] dark:text-white ${isEditMode ? "opacity-50 cursor-not-allowed" : ""}`}
                            >
                              <option value="">Select Batch</option>
                              {batches.map((b) => (
                                <option
                                  key={b._id || b.id}
                                  value={b._id || b.id}
                                >
                                  {b.name || b.title}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="grid gap-2">
                            <Label className="text-neutral-900 dark:text-neutral-200">
                              Deadline (Date & Time) *
                            </Label>
                            <Input
                              type="datetime-local"
                              value={formData.deadline}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  deadline: e.target.value,
                                })
                              }
                              className="dark:bg-[#0E1117] dark:border-neutral-700 dark:text-white"
                            />
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setIsModalOpen(false)}
                          className="dark:border-neutral-700 dark:text-white"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleSubmit}
                          disabled={isSubmitting}
                          className="bg-[#B91C1C] hover:bg-[#991B1B] text-white"
                        >
                          {isSubmitting ? (
                            <Loader2 className="animate-spin mr-2" size={14} />
                          ) : null}
                          {isSubmitting
                            ? "Saving..."
                            : isEditMode
                              ? "Save Changes"
                              : "Publish Assignment"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-md shadow-neutral-200/50 dark:shadow-none transition-all duration-300 hover:border-[#B91C1C]/50 hover:-translate-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                    TOTAL ASSIGNMENTS
                  </span>
                  <div className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
                    {data?.metrics?.totalAssignments || 0}
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-md shadow-neutral-200/50 dark:shadow-none transition-all duration-300 hover:border-[#B91C1C]/50 hover:-translate-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-1">
                    ACTIVE
                  </span>
                  <div className="text-2xl font-black tracking-tight text-emerald-600 dark:text-emerald-400">
                    {data?.metrics?.active || 0}
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-md shadow-neutral-200/50 dark:shadow-none transition-all duration-300 hover:border-[#B91C1C]/50 hover:-translate-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                    PENDING REVIEW
                  </span>
                  <div className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
                    {data?.metrics?.pendingReview || 0}
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-md shadow-neutral-200/50 dark:shadow-none transition-all duration-300 hover:border-[#B91C1C]/50 hover:-translate-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 block mb-1">
                    PAST DUE
                  </span>
                  <div className="text-2xl font-black tracking-tight text-sky-600 dark:text-sky-400">
                    {data?.metrics?.pastDue || 0}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white dark:bg-[#151921] rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-md shadow-neutral-200/50 dark:shadow-none transition-all duration-300 hover:border-[#B91C1C]/40">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex-1 min-w-50 relative">
                    <Search
                      size={13}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
                    />
                    <input
                      type="text"
                      placeholder="Search assignments..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2 rounded-xl text-xs bg-neutral-50/50 dark:bg-[#0E1117] border border-neutral-200/80 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 placeholder:text-neutral-400 focus:outline-none focus:border-[#B91C1C] transition-colors shadow-xs"
                    />
                  </div>

                  <div className="relative">
                    <select
                      value={batchFilter}
                      onChange={(e) => setBatchFilter(e.target.value)}
                      className="appearance-none pl-3.5 pr-8 py-2 rounded-xl text-xs bg-white dark:bg-[#0E1117] border border-neutral-200/80 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 focus:outline-none focus:border-[#B91C1C] cursor-pointer shadow-xs font-medium"
                    >
                      <option value="ALL">All Batches</option>
                      {availableBatches.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={12}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
                    />
                  </div>

                  <div className="relative">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="appearance-none pl-3.5 pr-8 py-2 rounded-xl text-xs bg-white dark:bg-[#0E1117] border border-neutral-200/80 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 focus:outline-none focus:border-[#B91C1C] cursor-pointer shadow-xs font-medium"
                    >
                      <option value="ALL">All Statuses</option>
                      {availableStatuses.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={12}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div
                  className={`space-y-4 transition-all duration-300 ${
                    selectedAssignment ? "lg:col-span-8" : "lg:col-span-12"
                  }`}
                >
                  <div className="bg-white dark:bg-[#151921] rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 overflow-hidden shadow-md shadow-neutral-200/50 dark:shadow-none transition-all duration-300">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                            <th className="py-3.5 px-5">ASSIGNMENT</th>
                            <th className="py-3.5 px-5">BATCH</th>
                            <th className="py-3.5 px-5">DEADLINE</th>
                            <th className="py-3.5 px-5">SUBMISSIONS</th>
                            <th className="py-3.5 px-5">STATUS</th>
                            <th className="py-3.5 px-5 text-right">ACTION</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
                          {filteredAssignments.length === 0 ? (
                            <tr>
                              <td
                                colSpan={6}
                                className="text-center py-12 text-neutral-400 text-xs"
                              >
                                No assignments found.
                              </td>
                            </tr>
                          ) : (
                            filteredAssignments.map((a) => (
                              <tr
                                key={a.id}
                                onClick={() => setSelectedAssignment(a)}
                                className={`hover:bg-neutral-50/70 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer ${
                                  selectedAssignment?.id === a.id
                                    ? "bg-neutral-100/70 dark:bg-neutral-800/60"
                                    : ""
                                }`}
                              >
                                <td className="py-4 px-5 font-semibold text-neutral-900 dark:text-white">
                                  {a.title}
                                </td>

                                <td className="py-4 px-5 text-neutral-600 dark:text-neutral-300">
                                  <div className="text-[11px] font-medium">
                                    {a.batchName}
                                  </div>
                                </td>

                                <td className="py-4 px-5 text-xs text-neutral-500 dark:text-neutral-400">
                                  {a.deadline}
                                </td>

                                <td className="py-4 px-5 font-medium text-neutral-700 dark:text-neutral-300">
                                  {a.submissionsCount}/{a.totalStudents}
                                </td>

                                <td className="py-4 px-5">
                                  {getStatusBadge(a.status)}
                                </td>

                                <td className="py-4 px-5 text-right">
                                  <div className="flex items-center justify-end gap-2 text-neutral-400">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleOpenEdit(a);
                                      }}
                                      title="Edit"
                                      className="p-1.5 rounded-lg hover:text-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 dark:hover:text-neutral-100 transition-colors cursor-pointer"
                                    >
                                      <Pencil size={14} />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        promptDelete(a.id);
                                      }}
                                      title="Delete"
                                      className="p-1.5 rounded-lg hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {selectedAssignment && (
                  <div className="lg:col-span-4 bg-white dark:bg-[#151921] rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 p-6 shadow-md shadow-neutral-200/50 dark:shadow-none relative space-y-4 animate-in fade-in zoom-in-95 duration-200 transition-all">
                    <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
                      <span className="text-xs font-bold text-neutral-900 dark:text-white">
                        Assignment Details
                      </span>
                      <button
                        type="button"
                        onClick={() => setSelectedAssignment(null)}
                        className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 cursor-pointer p-1"
                        title="Close Details"
                      >
                        <X size={15} />
                      </button>
                    </div>

                    <div>
                      {getStatusBadge(selectedAssignment.status)}
                      <h3 className="font-bold text-sm text-neutral-900 dark:text-white mt-2 leading-tight">
                        {selectedAssignment.title}
                      </h3>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                        {selectedAssignment.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-neutral-100 dark:border-neutral-800 text-xs">
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 block mb-0.5">
                          BATCH
                        </span>
                        <span className="text-[11px] font-medium text-neutral-800 dark:text-neutral-200">
                          {selectedAssignment.batchName}
                        </span>
                      </div>

                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 block mb-0.5">
                          TYPE
                        </span>
                        <span className="text-[11px] font-medium text-neutral-800 dark:text-neutral-200">
                          {selectedAssignment.type}
                        </span>
                      </div>

                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 block mb-0.5">
                          DEADLINE
                        </span>
                        <span className="text-[11px] font-medium text-neutral-800 dark:text-neutral-200">
                          {selectedAssignment.deadlineFull}
                        </span>
                      </div>

                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 block mb-0.5">
                          MAX SCORE
                        </span>
                        <span className="text-[11px] font-medium text-neutral-800 dark:text-neutral-200">
                          {selectedAssignment.maxScore}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                        RESOURCES
                      </span>
                      {selectedAssignment.resourceLink && (
                        <a
                          href={selectedAssignment.resourceLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-[11px] font-medium text-sky-600 dark:text-sky-400 hover:underline cursor-pointer mb-1"
                        >
                          <ExternalLink size={13} />
                          <span>External Resource Link</span>
                        </a>
                      )}
                      <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-sky-600 dark:text-sky-400 hover:underline cursor-pointer">
                        <Paperclip size={13} />
                        <span>{selectedAssignment.resourceName}</span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl border border-neutral-200/70 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-800/30 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-500 block mb-0.5">
                          SUBMISSIONS
                        </span>
                        <span className="font-bold text-neutral-900 dark:text-white text-xs">
                          {selectedAssignment.submissionsCount} /{" "}
                          {selectedAssignment.totalStudents}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-500 block mb-0.5">
                          PENDING REVIEW
                        </span>
                        <span className="font-black text-neutral-800 dark:text-neutral-200 text-sm">
                          {selectedAssignment.pendingReview}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>

      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#151921] border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
              Delete Assignment
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Are you sure you want to delete this assignment? This will
              permanently remove it and all related student submissions.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setDeleteModalOpen(false)}
                className="dark:border-neutral-700 dark:text-white text-xs h-8"
              >
                Cancel
              </Button>
              <Button
                disabled={isDeleting}
                onClick={confirmDelete}
                className="bg-rose-600 hover:bg-rose-700 text-white text-xs h-8"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
