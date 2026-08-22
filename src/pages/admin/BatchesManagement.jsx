import React, { useState, useEffect, useRef } from "react";
import AdminSidebar from "../../components/layout/AdminSidebar";
import { getBatches } from "../../services/batchService";
import {
  Plus,
  Bell,
  User,
  X,
  Loader2,
  Moon,
  Sun,
  LogOut,
  Check,
} from "lucide-react";

export default function BatchesManagement({
  isDarkMode,
  onToggleTheme,
  onNavigateAdminView,
  onLogout,
}) {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBatch, setSelectedBatch] = useState(null);

  // Profile Dropdown
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

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
    async function loadData() {
      setLoading(true);
      const data = await getBatches();
      setBatches(data);
      if (data && data.length > 0) {
        setSelectedBatch(data[0]);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const totalBatches = batches.length > 0 ? 12 : 0;
  const activeBatchesCount =
    batches.filter((b) => b.status === "Active").length > 0 ? 8 : 0;
  const totalStudents = 1248;
  const totalMentors = 32;

  const getStatusBadge = (status) => {
    switch (status) {
      case "Active":
        return (
          <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-medium bg-[#E8F8F0] text-[#10B981] dark:bg-emerald-950/40 dark:text-emerald-300">
            Active
          </span>
        );
      case "Upcoming":
        return (
          <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-medium bg-[#FEF6E7] text-[#D97706] dark:bg-amber-950/40 dark:text-amber-300">
            Upcoming
          </span>
        );
      case "Completed":
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
      {/* ================= SIDEBAR ================= */}
      <AdminSidebar
        currentView="dashboard-batches"
        onNavigateAdminView={onNavigateAdminView}
      />

      {/* ================= MAIN CONTENT ================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#FAFBFC] dark:bg-[#0E1117]">
        {/* Top Navbar Header */}
        <header className="h-14 bg-white dark:bg-[#151921] border-b border-neutral-200/80 dark:border-neutral-800/80 px-8 flex items-center justify-end gap-4 shrink-0">
          <button className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors cursor-pointer p-1.5">
            <Bell size={16} />
          </button>

          {/* Profile Dropdown Container */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="w-7 h-7 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:opacity-80 transition-opacity cursor-pointer overflow-hidden"
            >
              <User size={14} />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 top-10 w-52 rounded-xl bg-white dark:bg-[#1A1F29] border border-neutral-200 dark:border-neutral-800 shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-2 py-1.5 border-b border-neutral-100 dark:border-neutral-800 mb-1.5">
                  <p className="font-semibold text-xs text-neutral-900 dark:text-neutral-100">
                    Miftahudin Mohammed
                  </p>
                  <p className="text-[10px] text-neutral-400">Admin</p>
                </div>

                <div className="space-y-0.5">
                  <button className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer text-neutral-700 dark:text-neutral-300">
                    <User size={13} className="text-neutral-400" />
                    <span>Profile</span>
                  </button>

                  <button
                    onClick={() => onToggleTheme && onToggleTheme(!isDarkMode)}
                    className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer text-neutral-700 dark:text-neutral-300"
                  >
                    <div className="flex items-center gap-2">
                      {isDarkMode ? (
                        <Sun size={13} className="text-neutral-400" />
                      ) : (
                        <Moon size={13} className="text-neutral-400" />
                      )}
                      <span>Dark Mode</span>
                    </div>
                    {isDarkMode && <Check size={12} className="text-primary" />}
                  </button>

                  <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-medium text-primary hover:bg-red-500/10 transition-colors cursor-pointer"
                  >
                    <LogOut size={13} className="text-primary" />
                    <span>Log out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto px-8 py-6 space-y-5">
          {/* Header Title + Action Button */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
                Batches
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Create and manage bootcamp batches.
              </p>
            </div>

            <button className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-md bg-[#B91C1C] hover:bg-[#991B1B] text-white text-xs font-medium transition-colors cursor-pointer shadow-2xs">
              <Plus size={13} />
              <span>Create Batch</span>
            </button>
          </div>

          {/* 4 Overview Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                TOTAL BATCHES
              </span>
              <div className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
                {totalBatches}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                ACTIVE BATCHES
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black tracking-tight text-[#B91C1C]">
                  {activeBatchesCount}
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
                {totalStudents.toLocaleString()}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                TOTAL MENTORS
              </span>
              <div className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
                {totalMentors}
              </div>
            </div>
          </div>

          {/* Dynamic Grid: Expands to 12 cols when Drawer is closed */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start transition-all duration-300">
            {/* Table Area */}
            <div
              className={`space-y-3 transition-all duration-300 ${
                selectedBatch ? "lg:col-span-8" : "lg:col-span-12"
              }`}
            >
              <div className="bg-white dark:bg-[#151921] rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 overflow-hidden shadow-2xs">
                {loading ? (
                  <div className="flex items-center justify-center py-16 gap-2 text-xs text-neutral-500">
                    <Loader2
                      className="animate-spin text-[#B91C1C]"
                      size={16}
                    />
                    <span>Loading batches...</span>
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
                          const isSelected = selectedBatch?.id === b.id;
                          return (
                            <tr
                              key={b.id}
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
                                  {b.currentStudents}
                                </span>{" "}
                                / {b.capacity}
                              </td>

                              <td className="py-4 px-5 text-neutral-600 dark:text-neutral-400">
                                {b.timeline}
                              </td>

                              <td className="py-4 px-4 text-right">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedBatch(b);
                                  }}
                                  className="text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:text-[#B91C1C] dark:hover:text-primary transition-colors cursor-pointer text-right inline-block leading-tight"
                                >
                                  View
                                  <br />
                                  Details
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
                {/* Header */}
                <div className="flex items-start justify-between pb-1">
                  <div>
                    <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
                      {selectedBatch.name}
                    </h3>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      {selectedBatch.track}
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

                {/* Status Badge */}
                <div>{getStatusBadge(selectedBatch.status)}</div>

                {/* Dates Info */}
                <div className="grid grid-cols-2 gap-4 text-xs pt-1">
                  <div>
                    <span className="text-[10px] text-neutral-400 block mb-0.5">
                      Start Date
                    </span>
                    <span className="font-medium text-neutral-800 dark:text-neutral-200 text-[11px]">
                      {selectedBatch.startDate}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 block mb-0.5">
                      End Date
                    </span>
                    <span className="font-medium text-neutral-800 dark:text-neutral-200 text-[11px]">
                      {selectedBatch.endDate}
                    </span>
                  </div>
                </div>

                {/* Progress Summary Bar */}
                <div className="space-y-1.5 pt-2">
                  <span className="text-xs font-bold text-neutral-900 dark:text-white block">
                    Progress Summary
                  </span>
                  <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-[#B91C1C] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${selectedBatch.progress}%` }}
                    />
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="flex items-center gap-3 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                  <button className="flex-1 py-2 px-3 rounded-md border border-neutral-200 dark:border-neutral-700 text-xs font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer text-neutral-700 dark:text-neutral-300 text-center whitespace-nowrap">
                    Edit Batch
                  </button>
                  <button className="flex-1 py-2 px-5 rounded-md bg-[#B91C1C] hover:bg-[#991B1B] text-white text-xs font-medium transition-colors cursor-pointer shadow-2xs text-center whitespace-nowrap">
                    Manage Students
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
