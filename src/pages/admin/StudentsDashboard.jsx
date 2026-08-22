import React, { useState, useRef, useEffect } from "react";
import AdminSidebar from "../../components/layout/AdminSidebar";
import { getStudents } from "../../services/studentService";
import {
  Users,
  Plus,
  Search,
  ChevronDown,
  SlidersHorizontal,
  Bell,
  User,
  Moon,
  Sun,
  LogOut,
  Clock,
  CheckCircle2,
  Check,
  Layers,
  X,
  Pencil,
  Trash2,
  Loader2,
} from "lucide-react";

export default function StudentsDashboard({
  isDarkMode,
  onToggleTheme,
  onLogout,
  onNavigateAdminView,
}) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [batchFilter, setBatchFilter] = useState("ALL");
  const [universityFilter, setUniversityFilter] = useState("ALL");
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [availableBatches, setAvailableBatches] = useState([
    "1st",
    "2nd",
    "3rd",
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
      const data = await getStudents();
      setStudents(data);

      if (data && data.length > 0) {
        const batches = [...new Set(data.map((s) => s.batch))].filter(Boolean);
        const universities = [...new Set(data.map((s) => s.university))].filter(
          Boolean,
        );
        if (batches.length > 0) setAvailableBatches(batches);
        if (universities.length > 0) setAvailableUniversities(universities);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const handleDeleteStudent = (id) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
    if (selectedStudent?.id === id) {
      setSelectedStudent(null);
    }
  };

  const totalStudents = students.length;
  const activeStudents = students.filter((s) => s.status === "Active").length;
  const pendingStudents = students.filter((s) => s.status === "Pending").length;

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      (student.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.email || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUniv =
      universityFilter === "ALL" ||
      (student.university || "").toLowerCase() ===
        universityFilter.toLowerCase();
    const matchesBatch =
      batchFilter === "ALL" ||
      (student.batch || "").toLowerCase() === batchFilter.toLowerCase();
    return matchesSearch && matchesUniv && matchesBatch;
  });

  return (
    <div className="flex h-screen w-full font-sans overflow-hidden bg-[#FAFBFC] dark:bg-[#0E1117] text-neutral-900 dark:text-neutral-100 transition-colors">
      <AdminSidebar
        currentView="dashboard-students"
        onNavigateAdminView={onNavigateAdminView}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#FAFBFC] dark:bg-[#0E1117]">
        <header className="h-14 bg-white dark:bg-[#151921] border-b border-neutral-200/80 dark:border-neutral-800/80 px-8 flex items-center justify-between shrink-0">
          <div className="text-xs sm:text-sm font-semibold tracking-tight text-neutral-800 dark:text-neutral-200">
            Students
          </div>

          <div className="flex items-center gap-3">
            <button className="relative p-1.5 rounded-full text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors cursor-pointer">
              <Bell size={17} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary ring-2 ring-white dark:ring-[#151921]" />
            </button>

            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-7 h-7 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:opacity-80 transition-opacity cursor-pointer overflow-hidden"
              >
                <User size={15} />
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
                      onClick={() =>
                        onToggleTheme && onToggleTheme(!isDarkMode)
                      }
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
                      {isDarkMode && (
                        <Check size={12} className="text-primary" />
                      )}
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
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-8 py-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
                Students
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Manage and review community students.
              </p>
            </div>

            <button className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#B91C1C] hover:bg-[#991B1B] text-white text-xs font-medium transition-colors cursor-pointer shadow-2xs">
              <Plus size={14} />
              <span>Add Student</span>
            </button>
          </div>

          {/* 4 Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  TOTAL STUDENTS
                </span>
                <Users size={16} className="text-neutral-400" />
              </div>
              <div className="text-2xl font-black tracking-tight mt-3 text-neutral-900 dark:text-white">
                {totalStudents}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  ACTIVE STUDENTS
                </span>
                <CheckCircle2 size={16} className="text-neutral-400" />
              </div>
              <div className="text-2xl font-black tracking-tight mt-3 text-neutral-900 dark:text-white">
                {activeStudents}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  PENDING APPLICATIONS
                </span>
                <Clock size={16} className="text-neutral-400" />
              </div>
              <div className="text-2xl font-black tracking-tight mt-3 text-neutral-900 dark:text-white">
                {pendingStudents}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  CURRENT BATCH
                </span>
                <Layers size={16} className="text-neutral-400" />
              </div>
              <div className="text-2xl font-black tracking-tight mt-3 text-neutral-900 dark:text-white">
                3rd
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start transition-all duration-300">
            {/* Table Area */}
            <div
              className={`space-y-3 transition-all duration-300 ${
                selectedStudent ? "lg:col-span-8" : "lg:col-span-12"
              }`}
            >
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="flex-1 min-w-[200px] relative">
                  <Search
                    size={13}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                  />
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 rounded-md text-xs bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 text-neutral-800 dark:text-neutral-200 placeholder:text-neutral-400 focus:outline-none focus:border-[#B91C1C]"
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

                <div className="relative">
                  <select
                    value={universityFilter}
                    onChange={(e) => setUniversityFilter(e.target.value)}
                    className="appearance-none pl-3 pr-7 py-1.5 rounded-md text-xs bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 text-neutral-600 dark:text-neutral-300 focus:outline-none focus:border-[#B91C1C] cursor-pointer"
                  >
                    <option value="ALL">Filter by University</option>
                    {availableUniversities.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={12}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
                  />
                </div>

                <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer text-neutral-600 dark:text-neutral-300">
                  <SlidersHorizontal size={13} className="text-neutral-400" />
                  <span>More Filters</span>
                </button>
              </div>

              <div className="bg-white dark:bg-[#151921] rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 overflow-hidden shadow-2xs">
                {loading ? (
                  <div className="flex items-center justify-center py-16 gap-2 text-xs text-neutral-500">
                    <Loader2
                      className="animate-spin text-[#B91C1C]"
                      size={16}
                    />
                    <span>Loading students...</span>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                          <th className="py-2.5 px-4">STUDENT</th>
                          <th className="py-2.5 px-4">EMAIL</th>
                          <th className="py-2.5 px-4">BATCH</th>
                          <th className="py-2.5 px-4">ATTENDANCE</th>
                          <th className="py-2.5 px-4">PROGRESS</th>
                          <th className="py-2.5 px-4">UNIVERSITY</th>
                          <th className="py-2.5 px-4 text-right">ACTION</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
                        {filteredStudents.length === 0 ? (
                          <tr>
                            <td
                              colSpan={6}
                              className="text-center py-10 text-neutral-400 text-xs"
                            >
                              No students found.
                            </td>
                          </tr>
                        ) : (
                          filteredStudents.map((student) => (
                            <tr
                              key={student.id}
                              onClick={() => setSelectedStudent(student)}
                              className={`hover:bg-neutral-50/70 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer ${
                                selectedStudent?.id === student.id
                                  ? "bg-[#FEF2F2]/50 dark:bg-primary/10"
                                  : ""
                              }`}
                            >
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-7 h-7 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center font-bold text-[10px] shrink-0 text-neutral-500 dark:text-neutral-400">
                                    {student.initials}
                                  </div>
                                  <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                                    {student.name}
                                  </span>
                                </div>
                              </td>

                              <td className="py-3 px-4 text-neutral-500 dark:text-neutral-400 text-xs">
                                {student.email}
                              </td>

                              <td className="py-3 px-4 font-medium text-neutral-700 dark:text-neutral-300">
                                {student.batch}
                              </td>

                              <td className="py-3 px-4 font-medium text-neutral-700 dark:text-neutral-300">
                                {student.attendance}
                              </td>

                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2">
                                  <div className="w-14 bg-neutral-100 dark:bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                                    <div
                                      className="bg-primary h-1.5 rounded-full"
                                      style={{ width: `${student.progress}%` }}
                                    />
                                  </div>
                                  <span className="text-[11px] text-neutral-400">
                                    {student.progress}%
                                  </span>
                                </div>
                              </td>

                              <td className="py-3 px-4">
                                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/40">
                                  {student.university}
                                </span>
                              </td>

                              <td className="py-3 px-4 text-right">
                                <div className="flex items-center justify-end gap-2 text-neutral-400">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedStudent(student);
                                    }}
                                    title="Edit"
                                    className="p-1 hover:text-primary transition-colors cursor-pointer"
                                  >
                                    <Pencil size={13} />
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteStudent(student.id);
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
                    Showing {filteredStudents.length} of {totalStudents}{" "}
                    students
                  </span>
                  <div className="flex items-center gap-3">
                    <button className="hover:text-neutral-700 dark:hover:text-neutral-200 cursor-pointer">
                      Previous
                    </button>
                    <button className="hover:text-neutral-700 dark:hover:text-neutral-200 cursor-pointer font-semibold text-neutral-700 dark:text-neutral-200">
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Student Details Drawer Card */}
            {selectedStudent && (
              <div className="lg:col-span-4 bg-white dark:bg-[#151921] rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 p-5 shadow-2xs relative space-y-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
                  <span className="text-xs font-bold text-neutral-900 dark:text-white">
                    Student Details
                  </span>
                  <button
                    onClick={() => setSelectedStudent(null)}
                    className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 cursor-pointer"
                    title="Close Details"
                  >
                    <X size={15} />
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center font-bold text-xs text-neutral-600 dark:text-neutral-300">
                    {selectedStudent.initials}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-neutral-900 dark:text-white leading-tight">
                      {selectedStudent.name}
                    </h3>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      ID: {selectedStudent.studentId}
                    </p>
                    <span className="inline-block px-2 py-0.2 rounded text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/40 mt-1">
                      {selectedStudent.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 pt-1 text-xs">
                  <div>
                    <span className="text-[9px] font-mono font-bold tracking-wider text-neutral-400 uppercase block mb-0.5">
                      EMAIL
                    </span>
                    <span className="text-[11px] text-neutral-700 dark:text-neutral-300">
                      {selectedStudent.email}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] font-mono font-bold tracking-wider text-neutral-400 uppercase block mb-0.5">
                      PHONE
                    </span>
                    <span className="text-[11px] text-neutral-700 dark:text-neutral-300">
                      {selectedStudent.phone}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] font-mono font-bold tracking-wider text-neutral-400 uppercase block mb-0.5">
                      BATCH
                    </span>
                    <span className="text-[11px] text-neutral-700 dark:text-neutral-300">
                      {selectedStudent.batchName}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                  <span className="text-[9px] font-mono font-bold tracking-wider text-neutral-400 uppercase block">
                    ACADEMIC PERFORMANCE
                  </span>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-neutral-500">Course Progress</span>
                      <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                        {selectedStudent.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-primary h-1.5 rounded-full"
                        style={{ width: `${selectedStudent.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-neutral-500">Attendance Rate</span>
                      <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                        {selectedStudent.attendance}
                      </span>
                    </div>
                    <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-emerald-500 h-1.5 rounded-full"
                        style={{
                          width:
                            selectedStudent.attendance === "-"
                              ? "0%"
                              : selectedStudent.attendance,
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                  <span className="text-[9px] font-mono font-bold tracking-wider text-neutral-400 uppercase block">
                    RECENT ACTIVITY
                  </span>

                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {(selectedStudent.recentActivity || []).map((act, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1 shrink-0" />
                        <div>
                          <p className="text-[11px] font-medium text-neutral-800 dark:text-neutral-200 leading-tight">
                            {act.title}
                          </p>
                          <span className="text-[10px] text-neutral-400">
                            {act.time}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                  <button className="flex-1 py-1.5 rounded-md bg-[#B91C1C] hover:bg-[#991B1B] text-white text-xs font-medium transition-colors cursor-pointer shadow-2xs">
                    Edit Student
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
