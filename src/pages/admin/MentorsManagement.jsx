import React, { useState, useEffect, useRef } from "react";
import AdminSidebar from "../../components/layout/AdminSidebar";
import { getMentors } from "../../services/mentorService";
import {
  Plus,
  Search,
  ChevronDown,
  Bell,
  User,
  X,
  Mail,
  Phone,
  MapPin,
  Loader2,
  Moon,
  Sun,
  LogOut,
  Check,
  Pencil,
  Trash2,
} from "lucide-react";

export default function MentorsManagement({
  isDarkMode,
  onToggleTheme,
  onNavigateAdminView,
  onLogout,
}) {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [universityFilter, setUniversityFilter] = useState("ALL");
  const [batchFilter, setBatchFilter] = useState("ALL");
  const [selectedMentor, setSelectedMentor] = useState(null);

  const [availableBatches, setAvailableBatches] = useState([
    "1st",
    "2nd",
    "3rd",
    "4th",
  ]);
  const [availableUniversities, setAvailableUniversities] = useState([
    "ASTU",
    "AAU",
    "JU",
    "HU",
  ]);

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
      const data = await getMentors();
      setMentors(data);
      if (data && data.length > 0) {
        const batches = [...new Set(data.map((m) => m.batch))].filter(Boolean);
        const universities = [...new Set(data.map((m) => m.university))].filter(
          Boolean,
        );
        if (batches.length > 0) setAvailableBatches(batches);
        if (universities.length > 0) setAvailableUniversities(universities);
      }
      setLoading(false);
    }

    loadData();
  }, []);

  const handleDeleteMentor = (id) => {
    setMentors((prev) => prev.filter((m) => (m.id || m._id) !== id));
    if ((selectedMentor?.id || selectedMentor?._id) === id) {
      setSelectedMentor(null);
    }
  };

  const totalMentors = mentors.length;
  const activeMentors = mentors.filter(
    (m) =>
      m.status === "Active" ||
      (m.assignedStudents && m.assignedStudents.length > 0),
  ).length;
  const assignedMentors = mentors.filter(
    (m) => m.assignedStudents && m.assignedStudents.length > 0,
  ).length;
  const unassignedMentors = totalMentors - assignedMentors;

  const filteredMentors = mentors.filter((m) => {
    const matchesSearch =
      (m.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.email || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUniv =
      universityFilter === "ALL" ||
      (m.university || "").toLowerCase() === universityFilter.toLowerCase();
    const matchesBatch =
      batchFilter === "ALL" ||
      (m.batch || "").toLowerCase() === batchFilter.toLowerCase();
    return matchesSearch && matchesUniv && matchesBatch;
  });

  return (
    <div className="flex h-screen w-full font-sans overflow-hidden bg-[#FAFBFC] dark:bg-[#0E1117] text-neutral-900 dark:text-neutral-100 transition-colors">

      {/* ================= MAIN VIEW ================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#FAFBFC] dark:bg-[#0E1117]">
        {/* Content Body */}
        <main className="flex-1 overflow-y-auto px-8 py-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
                Mentors
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Manage mentors and their assigned student groups.
              </p>
            </div>

            <button className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-md bg-[#B91C1C] hover:bg-[#991B1B] text-white text-xs font-medium transition-colors cursor-pointer shadow-2xs">
              <Plus size={13} />
              <span>Add Mentor</span>
            </button>
          </div>

          {/* 4 Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                TOTAL MENTORS
              </span>
              <div className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
                {totalMentors}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                ACTIVE MENTORS
              </span>
              <div className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
                {activeMentors}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                ASSIGNED MENTORS
              </span>
              <div className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
                {assignedMentors}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                UNASSIGNED MENTORS
              </span>
              <div className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
                {unassignedMentors}
              </div>
            </div>
          </div>

          {/* Dynamic Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start transition-all duration-300">
            {/* Table Area */}
            <div
              className={`space-y-3 transition-all duration-300 ${
                selectedMentor ? "lg:col-span-8" : "lg:col-span-12"
              }`}
            >
              {/* Search + Filters */}
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="flex-1 min-w-[200px] relative">
                  <Search
                    size={13}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                  />
                  <input
                    type="text"
                    placeholder="Search mentors by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 rounded-md text-xs bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 text-neutral-800 dark:text-neutral-200 placeholder:text-neutral-400 focus:outline-none focus:border-[#B91C1C]"
                  />
                </div>

                <div className="relative">
                  <select
                    value={universityFilter}
                    onChange={(e) => setUniversityFilter(e.target.value)}
                    className="appearance-none pl-3 pr-7 py-1.5 rounded-md text-xs bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 text-neutral-600 dark:text-neutral-300 focus:outline-none focus:border-[#B91C1C] cursor-pointer"
                  >
                    <option value="ALL">Filter by University</option>
                    {availableUniversities.map((univ) => (
                      <option key={univ} value={univ}>
                        {univ}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={12}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
                  />
                </div>

                <div className="relative">
                  <select
                    value={batchFilter}
                    onChange={(e) => setBatchFilter(e.target.value)}
                    className="appearance-none pl-3 pr-7 py-1.5 rounded-md text-xs bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 text-neutral-600 dark:text-neutral-300 focus:outline-none focus:border-[#B91C1C] cursor-pointer"
                  >
                    <option value="ALL">Filter by Batch</option>
                    {availableBatches.map((b) => (
                      <option key={b} value={b}>
                        {b} Batch
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={12}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
                  />
                </div>
              </div>

              {/* Table */}
              <div className="bg-white dark:bg-[#151921] rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 overflow-hidden shadow-2xs">
                {loading ? (
                  <div className="flex items-center justify-center py-16 gap-2 text-xs text-neutral-500">
                    <Loader2
                      className="animate-spin text-[#B91C1C]"
                      size={16}
                    />
                    <span>Loading mentors...</span>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                          <th className="py-2.5 px-4">MENTOR</th>
                          <th className="py-2.5 px-4">EMAIL</th>
                          <th className="py-2.5 px-4">BATCH</th>
                          <th className="py-2.5 px-4">STUDENTS</th>
                          <th className="py-2.5 px-4">UNIVERSITY</th>
                          <th className="py-2.5 px-4 text-right">ACTION</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
                        {filteredMentors.length === 0 ? (
                          <tr>
                            <td
                              colSpan={6}
                              className="text-center py-10 text-neutral-400 text-xs"
                            >
                              No mentors found.
                            </td>
                          </tr>
                        ) : (
                          filteredMentors.map((m) => (
                            <tr
                              key={m.id || m._id}
                              onClick={() => setSelectedMentor(m)}
                              className={`hover:bg-neutral-50/70 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer ${
                                (selectedMentor?.id || selectedMentor?._id) ===
                                (m.id || m._id)
                                  ? "bg-[#FEF2F2]/50 dark:bg-primary/10"
                                  : ""
                              }`}
                            >
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-7 h-7 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-neutral-500 font-bold text-[10px] shrink-0">
                                    <User size={12} />
                                  </div>
                                  <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                                    {m.name}
                                  </span>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-neutral-500 dark:text-neutral-400 text-xs">
                                {m.email}
                              </td>
                              <td className="py-3 px-4 font-medium text-neutral-700 dark:text-neutral-300">
                                {m.batch}
                              </td>
                              <td className="py-3 px-4 font-medium text-neutral-700 dark:text-neutral-300">
                                {m.studentsCount ||
                                  `${(m.assignedStudents || []).length}/6`}
                              </td>
                              <td className="py-3 px-4">
                                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/40">
                                  {m.university}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-right">
                                <div className="flex items-center justify-end gap-2 text-neutral-400">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedMentor(m);
                                    }}
                                    title="Edit"
                                    className="p-1 hover:text-primary transition-colors cursor-pointer"
                                  >
                                    <Pencil size={13} />
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteMentor(m.id || m._id);
                                    }}
                                    title="Delete"
                                    className="p-1 hover:text-primary transition-colors cursor-pointer"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}

                <div className="px-4 py-2.5 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400">
                  <span>
                    Showing {filteredMentors.length} of {totalMentors} mentors
                  </span>
                </div>
              </div>
            </div>

            {/* Right Details Card */}
            {selectedMentor && (
              <div className="lg:col-span-4 bg-white dark:bg-[#151921] rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 p-5 shadow-2xs relative space-y-4 animate-in fade-in zoom-in-95 duration-200">
                <button
                  onClick={() => setSelectedMentor(null)}
                  className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 cursor-pointer"
                  title="Close Details"
                >
                  <X size={15} />
                </button>

                <div className="flex flex-col items-center text-center space-y-1.5 pt-2">
                  <div className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-neutral-500">
                    <User size={22} />
                  </div>
                  <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
                    {selectedMentor.name}
                  </h3>
                  <p className="text-[11px] text-neutral-400">
                    {selectedMentor.role || "Mentor"}
                  </p>
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/40">
                    {selectedMentor.university}
                  </span>
                </div>

                <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-800 text-xs">
                  <span className="text-[9px] font-mono font-bold tracking-wider text-neutral-400 uppercase block mb-1">
                    CONTACT INFORMATION
                  </span>
                  <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300 text-[11px]">
                    <Mail size={12} className="text-neutral-400 shrink-0" />
                    <span>{selectedMentor.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300 text-[11px]">
                    <Phone size={12} className="text-neutral-400 shrink-0" />
                    <span>{selectedMentor.phone || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300 text-[11px]">
                    <MapPin size={12} className="text-neutral-400 shrink-0" />
                    <span>
                      {selectedMentor.location || selectedMentor.university}
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                  <span className="text-[9px] font-mono font-bold tracking-wider text-neutral-400 uppercase block">
                    CURRENT ASSIGNMENT
                  </span>

                  <div className="p-2.5 rounded-lg border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40 flex items-center justify-between text-xs font-semibold">
                    <span>{selectedMentor.batch} Batch</span>
                    <span className="text-neutral-400 text-[11px] font-normal">
                      {(selectedMentor.assignedStudents || []).length}/6
                      Capacity
                    </span>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] text-neutral-400 block">
                      Assigned Students (
                      {(selectedMentor.assignedStudents || []).length})
                    </span>

                    <div className="space-y-1.5 max-h-36 overflow-y-auto">
                      {(selectedMentor.assignedStudents || []).length === 0 ? (
                        <p className="text-[11px] text-neutral-400 italic">
                          No students assigned yet.
                        </p>
                      ) : (
                        selectedMentor.assignedStudents.map((st, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 text-xs text-neutral-700 dark:text-neutral-300"
                          >
                            <span
                              className={`w-5 h-5 rounded flex items-center justify-center text-[9px] font-bold ${st.color || "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"}`}
                            >
                              {st.initials ||
                                st.name?.slice(0, 2).toUpperCase()}
                            </span>
                            <span className="text-[11px] font-medium">
                              {st.name}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                  <button className="py-1.5 rounded-md border border-neutral-200 dark:border-neutral-700 text-xs font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer">
                    Edit Mentor
                  </button>
                  <button className="py-1.5 rounded-md border border-red-200 dark:border-red-900/50 text-[#B91C1C] text-xs font-medium hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer">
                    Unassign
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
