import React, { useState, useMemo, useEffect, useRef } from "react";

import API from "../../services/api";
<<<<<<< Updated upstream

=======
import { getProgressOverview } from "../../services/progressService";
>>>>>>> Stashed changes
import {
  Users,
  Plus,
  Search,
  ChevronDown,
  CheckCircle2,
  X,
  Pencil,
  Trash2,
  Loader2,
  GraduationCap,
  User,
  Mail,
  Phone,
  Calendar,
  ShieldCheck,
} from "lucide-react";

const STATUS_OPTIONS = ["active", "graduated", "dropped", "suspended"];

const STATUS_STYLES = {
  active:
    "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/40",
  graduated:
    "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/40",
  dropped:
    "bg-neutral-100 dark:bg-neutral-800/60 text-neutral-600 dark:text-neutral-300 border border-neutral-200/50 dark:border-neutral-700/40",
  suspended:
    "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200/50 dark:border-red-800/40",
};

export default function StudentsDashboard() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [universityFilter, setUniversityFilter] = useState("ALL");
  const [genderFilter, setGenderFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [batchFilter, setBatchFilter] = useState("ALL");

  const [selectedStudent, setSelectedStudent] = useState(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const [formLoading, setFormLoading] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [formData, setFormData] = useState({
    user: "",
    assignedMentor: "",
    status: "active",
    joinedAt: new Date().toISOString().slice(0, 10),
  });

  // ==================================================
  // REAL PROGRESS / ATTENDANCE METRICS
  // ==================================================

  const [progressMap, setProgressMap] = useState({}); // memberId -> admin-only progress %
  const [attendanceMap, setAttendanceMap] = useState({}); // memberId -> { percentage, totalSessions }

  // ==================================================
  // USER SEARCH DROPDOWN
  // ==================================================

  const [userSearch, setUserSearch] = useState("");
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const userDropdownRef = useRef(null);

  // ==================================================
  // DROPDOWN OPTIONS
  // ==================================================

  const [userOptions, setUserOptions] = useState([]);
  const [userOptionsLoading, setUserOptionsLoading] = useState(false);

  const [mentorOptions, setMentorOptions] = useState([]);
  const [mentorOptionsLoading, setMentorOptionsLoading] = useState(false);

  // ==================================================
  // LOAD PROGRESS (admin-released only)
  // ==================================================
  // Reuses the same getProgressOverview() service and the same "skip
  // items released by a mentor" logic as calculateStudentTotal() in
  // ProgressManagement.jsx, which already displays this correctly.
  // Each item in student.progressMap carries item.releasedBy ("admin"
  // or "mentor"), so we just score the admin ones the same way the
  // matrix view does: Completed=100, In Progress/Needs Help=50, else 0.

  const loadProgressMap = async () => {
    try {
      const overview = await getProgressOverview();
      const list = overview?.students || [];

      const map = {};

      list.forEach((student) => {
        const topicsMap = student.progressMap || {};

        let totalScore = 0;
        let count = 0;

        Object.keys(topicsMap).forEach((topicKey) => {
          const items = Array.isArray(topicsMap[topicKey])
            ? topicsMap[topicKey]
            : [topicsMap[topicKey]];

          items.forEach((item) => {
            // Admin-only: skip anything a mentor released
            if (item.releasedBy === "mentor") return;

            count++;

            const status = item.status || "Not Started";

            if (status === "Completed") {
              totalScore += 100;
            } else if (status === "In Progress" || status === "Needs Help") {
              totalScore += 50;
            }
          });
        });

        // student.id === Member._id, same key space as StudentsDashboard's student._id
        map[student.id] = count > 0 ? Math.round(totalScore / count) : 0;
      });

      setProgressMap(map);
    } catch (error) {
      console.error("Failed to load progress overview:", error);
      setProgressMap({});
    }
  };

  // ==================================================
  // LOAD ATTENDANCE (computed client-side per batch)
  // ==================================================

  const loadAttendanceMap = async (studentsList) => {
    try {
      const batchIds = Array.from(
        new Set(
          studentsList
            .map((student) => {
              const batch = student?.user?.batch ?? student?.batch;
              return batch && typeof batch === "object" ? batch._id : null;
            })
            .filter(Boolean),
        ),
      );

      if (batchIds.length === 0) {
        setAttendanceMap({});
        return;
      }

      const responses = await Promise.all(
        batchIds.map((batchId) =>
          API.get("/attendance", {
            params: { batchId, includeAllSessionTypes: "true" },
          }).catch((error) => {
            console.error(
              `Failed to load attendance for batch ${batchId}:`,
              error,
            );
            return null;
          }),
        ),
      );

      const allRecords = responses.flatMap((response) => {
        if (!response) return [];

        const records =
          response.data?.data?.attendance ||
          response.data?.attendance ||
          response.data?.data ||
          [];

        return Array.isArray(records) ? records : [];
      });

      // Scoring: present=1, late=0.5, excused=0.25, absent=0. All four
      // statuses count toward the session denominator. A student with
      // no gradeable sessions defaults to 100%. Matches
      // getBatchAttendanceStats() in attendance.service.js.

      const grouped = {};

      allRecords.forEach((record) => {
        const memberId =
          typeof record.member === "object"
            ? record.member?._id
            : record.member;

        if (!memberId) return;

        if (!grouped[memberId]) {
          grouped[memberId] = { score: 0, validSessions: 0 };
        }

        if (record.status === "present") {
          grouped[memberId].score += 1;
          grouped[memberId].validSessions += 1;
        } else if (record.status === "late") {
          grouped[memberId].score += 0.5;
          grouped[memberId].validSessions += 1;
        } else if (record.status === "excused") {
          grouped[memberId].score += 0.25;
          grouped[memberId].validSessions += 1;
        } else if (record.status === "absent") {
          grouped[memberId].validSessions += 1;
        }
      });

      const map = {};

      Object.keys(grouped).forEach((memberId) => {
        const { score, validSessions } = grouped[memberId];

        map[memberId] = {
          percentage:
            validSessions === 0
              ? 100
              : Math.round((score / validSessions) * 100),
          totalSessions: validSessions,
        };
      });

      setAttendanceMap(map);
    } catch (error) {
      console.error("Failed to load attendance map:", error);
      setAttendanceMap({});
    }
  };

  // ==================================================
  // LOAD STUDENTS
  // ==================================================

  const loadStudents = async () => {
    try {
      setLoading(true);

      const response = await API.get("/members/students");

      const data =
        response.data?.data?.students ||
        response.data?.students ||
        response.data?.data ||
        [];

      const list = Array.isArray(data) ? data : [];
      setStudents(list);

      await Promise.all([loadProgressMap(), loadAttendanceMap(list)]);
    } catch (error) {
      console.error("Failed to load students:", error);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  // ==================================================
  // LOAD DROPDOWN OPTIONS
  // ==================================================

  useEffect(() => {
    if (!isFormOpen) return;

    // -----------------------------
    // LOAD USERS
    // -----------------------------

    if (!editingStudent) {
      const loadUsers = async () => {
        try {
          setUserOptionsLoading(true);

          const response = await API.get("/users");

          const data =
            response.data?.data?.users ||
            response.data?.users ||
            response.data?.data ||
            [];

          setUserOptions(Array.isArray(data) ? data : []);
        } catch (error) {
          console.error("Failed to load users:", error);
          setUserOptions([]);
        } finally {
          setUserOptionsLoading(false);
        }
      };

      loadUsers();
    }

    // -----------------------------
    // LOAD MENTORS
    // -----------------------------

    const loadMentors = async () => {
      try {
        setMentorOptionsLoading(true);

        const response = await API.get("/members/staff");

        const data =
          response.data?.data?.staff ||
          response.data?.staff ||
          response.data?.data ||
          [];

        const mentors = (Array.isArray(data) ? data : []).filter(
          (member) => member.role === "mentor",
        );

        setMentorOptions(mentors);
      } catch (error) {
        console.error("Failed to load mentors:", error);
        setMentorOptions([]);
      } finally {
        setMentorOptionsLoading(false);
      }
    };

    loadMentors();
  }, [isFormOpen, editingStudent]);

  // ==================================================
  // RESET USER SEARCH WHEN MODAL OPENS
  // ==================================================

  useEffect(() => {
    if (isFormOpen) {
      setUserSearch("");
      setIsUserDropdownOpen(false);
    }
  }, [isFormOpen]);

  // ==================================================
  // CLOSE USER DROPDOWN WHEN CLICKING OUTSIDE
  // ==================================================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target)
      ) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ==================================================
  // FILTER USERS FOR SEARCH DROPDOWN
  // ==================================================

  const filteredUserOptions = useMemo(() => {
    const search = userSearch.toLowerCase().trim();

    if (!search) {
      return userOptions;
    }

    return userOptions.filter((user) => {
      const name = (user.fullName || "").toLowerCase();
      const email = (user.email || "").toLowerCase();

      return name.includes(search) || email.includes(search);
    });
  }, [userOptions, userSearch]);

  // ==================================================
  // SELECTED USER
  // ==================================================

  const selectedUser = useMemo(() => {
    return userOptions.find((user) => user._id === formData.user) || null;
  }, [userOptions, formData.user]);

  // ==================================================
  // BATCH HELPER
  // ==================================================
  // Batch lives on the User document (user.batch), not on the
  // Member/Student record. GET /members/students populates
  // student.user.batch as a full { _id, name, ... } object, so we
  // read from there first and fall back to student.batch just in
  // case a caller ever passes a differently-shaped record in.

  const getBatchName = (student) => {
    const batch = student?.user?.batch ?? student?.batch;

    if (!batch) return null;

    return typeof batch === "object" ? batch.name : null;
  };

  // ==================================================
  // UNIQUE UNIVERSITIES / GENDERS / BATCHES
  // ==================================================

  const availableUniversities = useMemo(() => {
    const universities = students
      .map((student) => student?.user?.university)
      .filter(Boolean);

    return Array.from(new Set(universities)).sort();
  }, [students]);

  const availableGenders = useMemo(() => {
    const genders = students
      .map((student) => student?.user?.gender)
      .filter(Boolean);

    return Array.from(new Set(genders)).sort();
  }, [students]);

  const availableBatches = useMemo(() => {
    const batches = students.map((student) => getBatchName(student)).filter(Boolean);

    return Array.from(new Set(batches)).sort();
  }, [students]);

  // ==================================================
  // FILTER STUDENTS
  // ==================================================

  const filteredStudents = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    return students.filter((student) => {
      const user = student?.user || {};

      const name = (user.fullName || "").toLowerCase();
      const email = (user.email || "").toLowerCase();
      const phone = (user.phone || "").toLowerCase();
      const university = (user.university || "").toLowerCase();
      const memberId = (student.memberId || "").toLowerCase();
      const batchName = (getBatchName(student) || "").toLowerCase();

      const matchesSearch =
        !search ||
        name.includes(search) ||
        email.includes(search) ||
        phone.includes(search) ||
        university.includes(search) ||
        memberId.includes(search);

      const matchesUniversity =
        universityFilter === "ALL" ||
        (user.university || "").toLowerCase() ===
          universityFilter.toLowerCase();

      const matchesGender =
        genderFilter === "ALL" ||
        (user.gender || "").toLowerCase() === genderFilter.toLowerCase();

      const matchesStatus =
        statusFilter === "ALL" ||
        (student.status || "").toLowerCase() === statusFilter.toLowerCase();

      const matchesBatch =
        batchFilter === "ALL" || batchName === batchFilter.toLowerCase();

      return (
        matchesSearch &&
        matchesUniversity &&
        matchesGender &&
        matchesStatus &&
        matchesBatch
      );
    });
  }, [
    students,
    searchTerm,
    universityFilter,
    genderFilter,
    statusFilter,
    batchFilter,
  ]);

  // ==================================================
  // STATS
  // ==================================================

  const totalStudents = students.length;

  const activeStudents = students.filter(
    (student) => student.status === "active",
  ).length;

  const graduatedStudents = students.filter(
    (student) => student.status === "graduated",
  ).length;

  const suspendedStudents = students.filter(
    (student) => student.status === "suspended",
  ).length;

  // ==================================================
  // ADD STUDENT
  // ==================================================

  const openAddForm = () => {
    setEditingStudent(null);

    setFormData({
      user: "",
      assignedMentor: "",
      status: "active",
      joinedAt: new Date().toISOString().slice(0, 10),
    });

    setUserSearch("");
    setIsUserDropdownOpen(false);

    setIsFormOpen(true);
  };

  // ==================================================
  // EDIT STUDENT
  // ==================================================

  const openEditForm = (student) => {
    setEditingStudent(student);

    setFormData({
      user: student.user?._id || student.user || "",

      assignedMentor:
        student.assignedMentor?._id || student.assignedMentor || "",

      status: student.status || "active",

      joinedAt: student.joinedAt
        ? new Date(student.joinedAt).toISOString().slice(0, 10)
        : new Date().toISOString().slice(0, 10),
    });

    setUserSearch("");
    setIsUserDropdownOpen(false);

    setIsFormOpen(true);
  };

  // ==================================================
  // CLOSE FORM
  // ==================================================

  const closeForm = () => {
    if (formLoading) return;

    setIsFormOpen(false);
    setEditingStudent(null);

    setUserSearch("");
    setIsUserDropdownOpen(false);

    setFormData({
      user: "",
      assignedMentor: "",
      status: "active",
      joinedAt: new Date().toISOString().slice(0, 10),
    });
  };

  // ==================================================
  // SELECT USER
  // ==================================================

  const handleSelectUser = (user) => {
    setFormData((prev) => ({
      ...prev,
      user: user._id,
    }));

    setUserSearch("");
    setIsUserDropdownOpen(false);
  };

  // ==================================================
  // SUBMIT FORM
  // ==================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!editingStudent && !formData.user) return;

    if (!formData.assignedMentor) return;

    try {
      setFormLoading(true);

      // -----------------------------
      // EDIT STUDENT
      // -----------------------------

      if (editingStudent) {
        const payload = {
          status: formData.status,
          joinedAt: formData.joinedAt,
          assignedMentor: formData.assignedMentor,
        };

        const response = await API.patch(
          `/members/${editingStudent._id}`,
          payload,
        );

        const updated =
          response.data?.data?.member ||
          response.data?.member ||
          response.data?.data;

        if (updated) {
          setStudents((prev) =>
            prev.map((student) =>
              student._id === editingStudent._id ? updated : student,
            ),
          );

          if (selectedStudent?._id === editingStudent._id) {
            setSelectedStudent(updated);
          }
        } else {
          await loadStudents();
        }
      }

      // -----------------------------
      // ADD / APPROVE STUDENT
      // -----------------------------

      else {
        const response = await API.post(
          `/members/approve/${formData.user}`,
          {
            role: "student",
            status: formData.status,
            joinedAt: formData.joinedAt,
            assignedMentor: formData.assignedMentor,
          },
        );

        const created =
          response.data?.data?.member ||
          response.data?.member ||
          response.data?.data;

        if (created) {
          setStudents((prev) => [...prev, created]);
        } else {
          await loadStudents();
        }
      }

      closeForm();
    } catch (error) {
      console.error("Failed to save student:", error);
    } finally {
      setFormLoading(false);
    }
  };

  // ==================================================
  // DELETE STUDENT
  // ==================================================

  const handleDeleteStudent = async () => {
    if (!deleteTarget) return;

    try {
      setDeleteLoading(true);

      await API.delete(`/members/${deleteTarget._id}`);

      setStudents((prev) =>
        prev.filter((student) => student._id !== deleteTarget._id),
      );

      if (selectedStudent?._id === deleteTarget._id) {
        setSelectedStudent(null);
      }

      setDeleteTarget(null);
    } catch (error) {
      console.error("Failed to delete student:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <div className="flex h-screen w-full font-sans overflow-hidden bg-[#FAFBFC] dark:bg-[#0E1117] text-neutral-900 dark:text-neutral-100 transition-colors">
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#FAFBFC] dark:bg-[#0E1117]">
        <main className="flex-1 overflow-y-auto px-8 py-6 space-y-5">

          {/* HEADER */}

          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
                Students
              </h2>

              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Manage and review community students.
              </p>
            </div>

            <button
              onClick={openAddForm}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#B91C1C] hover:bg-[#991B1B] text-white text-xs font-medium transition-colors cursor-pointer shadow-2xs"
            >
              <Plus size={14} />
              <span>Add Student</span>
            </button>
          </div>

          {/* STATS */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">

            <div className="p-4 rounded-xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  TOTAL STUDENTS
                </span>

                <Users size={16} className="text-neutral-400" />
              </div>

              <div className="text-2xl font-black tracking-tight mt-3">
                {totalStudents}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  ACTIVE STUDENTS
                </span>

                <CheckCircle2 size={16} className="text-neutral-400" />
              </div>

              <div className="text-2xl font-black tracking-tight mt-3">
                {activeStudents}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  GRADUATED
                </span>

                <GraduationCap size={16} className="text-neutral-400" />
              </div>

              <div className="text-2xl font-black tracking-tight mt-3">
                {graduatedStudents}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  SUSPENDED
                </span>

                <ShieldCheck size={16} className="text-neutral-400" />
              </div>

              <div className="text-2xl font-black tracking-tight mt-3">
                {suspendedStudents}
              </div>
            </div>
          </div>

          {/* MAIN AREA */}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

            {/* TABLE */}

            <div
              className={`space-y-3 ${
                selectedStudent ? "lg:col-span-8" : "lg:col-span-12"
              }`}
            >

              {/* FILTERS */}

              <div className="flex flex-wrap items-center gap-2.5">

                {/* SEARCH */}

                <div className="flex-1 min-w-[200px] relative">
                  <Search
                    size={13}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                  />

                  <input
                    type="text"
                    placeholder="Search by name, email, phone or member ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 rounded-md text-xs bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 text-neutral-800 dark:text-neutral-200 placeholder:text-neutral-400 focus:outline-none focus:border-[#B91C1C]"
                  />
                </div>

                {/* UNIVERSITY */}

                <div className="relative">
                  <select
                    value={universityFilter}
                    onChange={(e) => setUniversityFilter(e.target.value)}
                    className="appearance-none pl-3 pr-7 py-1.5 rounded-md text-xs bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 text-neutral-600 dark:text-neutral-300 focus:outline-none focus:border-[#B91C1C] cursor-pointer"
                  >
                    <option value="ALL">Filter by University</option>

                    {availableUniversities.map((university) => (
                      <option key={university} value={university}>
                        {university}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    size={12}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
                  />
                </div>

                {/* GENDER */}

                <div className="relative">
                  <select
                    value={genderFilter}
                    onChange={(e) => setGenderFilter(e.target.value)}
                    className="appearance-none pl-3 pr-7 py-1.5 rounded-md text-xs bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 text-neutral-600 dark:text-neutral-300 focus:outline-none focus:border-[#B91C1C] cursor-pointer capitalize"
                  >
                    <option value="ALL">Filter by Gender</option>

                    {availableGenders.map((gender) => (
                      <option
                        key={gender}
                        value={gender}
                        className="capitalize"
                      >
                        {gender}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    size={12}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
                  />
                </div>

                {/* BATCH */}

                <div className="relative">
                  <select
                    value={batchFilter}
                    onChange={(e) => setBatchFilter(e.target.value)}
                    className="appearance-none pl-3 pr-7 py-1.5 rounded-md text-xs bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 text-neutral-600 dark:text-neutral-300 focus:outline-none focus:border-[#B91C1C] cursor-pointer"
                  >
                    <option value="ALL">Filter by Batch</option>

                    {availableBatches.map((batch) => (
                      <option key={batch} value={batch}>
                        {batch}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    size={12}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
                  />
                </div>

                {/* STATUS */}

                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="appearance-none pl-3 pr-7 py-1.5 rounded-md text-xs bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 text-neutral-600 dark:text-neutral-300 focus:outline-none focus:border-[#B91C1C] cursor-pointer capitalize"
                  >
                    <option value="ALL">Filter by Status</option>

                    {STATUS_OPTIONS.map((status) => (
                      <option
                        key={status}
                        value={status}
                        className="capitalize"
                      >
                        {status}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    size={12}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
                  />
                </div>
              </div>

              {/* TABLE */}

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
                              colSpan={7}
                              className="text-center py-10 text-neutral-400 text-xs"
                            >
                              No students found.
                            </td>
                          </tr>
                        ) : (
                          filteredStudents.map((student) => {
                            const user = student.user || {};

                            const initials = (user.fullName || "U")
                              .split(" ")
                              .map((word) => word[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase();

                            const batchName = getBatchName(student);

                            const attendanceInfo = attendanceMap[student._id];
                            const progressValue = progressMap[student._id];

                            return (
                              <tr
                                key={student._id}
                                onClick={() => setSelectedStudent(student)}
                                className={`hover:bg-neutral-50/70 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer ${
                                  selectedStudent?._id === student._id
                                    ? "bg-[#FEF2F2]/50 dark:bg-primary/10"
                                    : ""
                                }`}
                              >

                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-2.5">

                                    <div className="w-7 h-7 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center font-bold text-[10px] shrink-0 text-neutral-500 dark:text-neutral-400">
                                      {initials}
                                    </div>

                                    <div className="flex flex-col">
                                      <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                                        {user.fullName || "Unknown"}
                                      </span>

                                      <span className="text-[10px] text-neutral-400">
                                        {student.memberId || "Pending ID"}
                                      </span>
                                    </div>
                                  </div>
                                </td>

                                <td className="py-3 px-4 text-neutral-600 dark:text-neutral-300">
                                  {user.email || "N/A"}
                                </td>

                                <td className="py-3 px-4 text-neutral-600 dark:text-neutral-300">
                                  {batchName || "N/A"}
                                </td>

<<<<<<< Updated upstream
                                <td className="py-3 px-4 text-neutral-400">
                                  N/A
                                </td>

                                <td className="py-3 px-4 text-neutral-400">
                                  N/A
=======
                                <td className="py-4 px-5">
                                  {attendanceInfo ? (
                                    <div className="flex items-center gap-2">
                                      <div className="w-14 h-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                                        <div
                                          className={`h-full rounded-full ${
                                            attendanceInfo.percentage >= 75
                                              ? "bg-emerald-500"
                                              : attendanceInfo.percentage >=
                                                  50
                                                ? "bg-amber-500"
                                                : "bg-red-500"
                                          }`}
                                          style={{
                                            width: `${Math.min(
                                              attendanceInfo.percentage,
                                              100,
                                            )}%`,
                                          }}
                                        />
                                      </div>
                                      <span className="text-neutral-600 dark:text-neutral-300 text-[11px] font-medium tabular-nums">
                                        {attendanceInfo.percentage}%
                                      </span>
                                    </div>
                                  ) : (
                                    <span className="text-neutral-400">
                                      N/A
                                    </span>
                                  )}
                                </td>

                                <td className="py-4 px-5">
                                  {typeof progressValue === "number" ? (
                                    <div className="flex items-center gap-2">
                                      <div className="w-14 h-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                                        <div
                                          className={`h-full rounded-full ${
                                            progressValue >= 75
                                              ? "bg-emerald-500"
                                              : progressValue >= 50
                                                ? "bg-amber-500"
                                                : "bg-red-500"
                                          }`}
                                          style={{
                                            width: `${Math.min(
                                              progressValue,
                                              100,
                                            )}%`,
                                          }}
                                        />
                                      </div>
                                      <span className="text-neutral-600 dark:text-neutral-300 text-[11px] font-medium tabular-nums">
                                        {progressValue}%
                                      </span>
                                    </div>
                                  ) : (
                                    <span className="text-neutral-400">
                                      N/A
                                    </span>
                                  )}
>>>>>>> Stashed changes
                                </td>

                                <td className="py-3 px-4 text-neutral-600 dark:text-neutral-300">
                                  {user.university || "N/A"}
                                </td>

                                <td className="py-3 px-4 text-right">
                                  <div className="flex items-center justify-end gap-2 text-neutral-400">

                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        openEditForm(student);
                                      }}
                                      title="Edit"
                                      className="p-1 hover:text-[#B91C1C] transition-colors cursor-pointer"
                                    >
                                      <Pencil size={13} />
                                    </button>

                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setDeleteTarget(student);
                                      }}
                                      title="Delete"
                                      className="p-1 hover:text-[#B91C1C] transition-colors cursor-pointer"
                                    >
                                      <Trash2 size={13} />
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
                )}

                {/* FOOTER */}

                <div className="px-4 py-2.5 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400">
                  <span>
                    Showing {filteredStudents.length} of {totalStudents}{" "}
                    students
                  </span>
                </div>
              </div>
            </div>

            {/* DETAILS */}

            {selectedStudent && (
              <div className="lg:col-span-4 bg-white dark:bg-[#151921] rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 p-5 shadow-2xs relative space-y-4 animate-in fade-in zoom-in-95 duration-200">

                <button
                  onClick={() => setSelectedStudent(null)}
                  className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 cursor-pointer"
                  title="Close Details"
                >
                  <X size={15} />
                </button>

                {(() => {
                  const user = selectedStudent.user || {};

                  const initials = (user.fullName || "U")
                    .split(" ")
                    .map((word) => word[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase();

                  return (
                    <>
                      {/* PROFILE */}

                      <div className="flex flex-col items-center text-center space-y-1.5 pt-2">

                        <div className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-neutral-500 font-bold">
                          {initials}
                        </div>

                        <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
                          {user.fullName || "Unknown"}
                        </h3>

                        <span className="text-[10px] text-neutral-400">
                          {selectedStudent.memberId || "No Member ID"}
                        </span>

                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold capitalize ${
                            STATUS_STYLES[selectedStudent.status] || ""
                          }`}
                        >
                          {selectedStudent.status || "N/A"}
                        </span>
                      </div>

                      {/* CONTACT */}

                      <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">

                        <span className="text-[9px] font-mono font-bold tracking-wider text-neutral-400 uppercase block mb-1">
                          CONTACT INFORMATION
                        </span>

                        <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300 text-[11px]">
                          <Mail
                            size={12}
                            className="text-neutral-400 shrink-0"
                          />

                          <span>{user.email || "N/A"}</span>
                        </div>

                        <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300 text-[11px]">
                          <Phone
                            size={12}
                            className="text-neutral-400 shrink-0"
                          />

                          <span>{user.phone || "N/A"}</span>
                        </div>
                      </div>

                      {/* PROFILE DETAILS */}

                      <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">

                        <span className="text-[9px] font-mono font-bold tracking-wider text-neutral-400 uppercase block">
                          PROFILE DETAILS
                        </span>

                        <div className="grid grid-cols-2 gap-2">

                          <div className="p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/40">
                            <span className="text-[9px] text-neutral-400 block mb-0.5">
                              University
                            </span>

                            <span className="text-[11px] font-medium">
                              {user.university || "N/A"}
                            </span>
                          </div>

                          <div className="p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/40">
                            <span className="text-[9px] text-neutral-400 block mb-0.5">
                              Gender
                            </span>

                            <span className="text-[11px] font-medium capitalize">
                              {user.gender || "N/A"}
                            </span>
                          </div>

                          <div className="p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/40">
                            <span className="text-[9px] text-neutral-400 block mb-0.5">
                              Member ID
                            </span>

                            <span className="text-[11px] font-medium">
                              {selectedStudent.memberId || "N/A"}
                            </span>
                          </div>

                          <div className="p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/40">
                            <span className="text-[9px] text-neutral-400 block mb-0.5">
                              Status
                            </span>

                            <span className="text-[11px] font-medium capitalize">
                              {selectedStudent.status || "N/A"}
                            </span>
                          </div>

                        </div>
                      </div>

                      {/* PERFORMANCE */}

                      <div className="space-y-2.5 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                        <span className="text-[9px] font-mono font-bold tracking-wider text-neutral-400 uppercase block">
                          PERFORMANCE
                        </span>

                        <div className="grid grid-cols-2 gap-2.5">
                          <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800">
                            <span className="text-[9px] text-neutral-400 block mb-0.5">
                              Admin Progress
                            </span>

                            <span className="text-[11px] font-medium text-neutral-800 dark:text-neutral-200">
                              {typeof progressMap[selectedStudent._id] ===
                              "number"
                                ? `${progressMap[selectedStudent._id]}%`
                                : "N/A"}
                            </span>
                          </div>

                          <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800">
                            <span className="text-[9px] text-neutral-400 block mb-0.5">
                              Attendance
                            </span>

                            <span className="text-[11px] font-medium text-neutral-800 dark:text-neutral-200">
                              {attendanceMap[selectedStudent._id]
                                ? `${
                                    attendanceMap[selectedStudent._id]
                                      .percentage
                                  }% (${
                                    attendanceMap[selectedStudent._id]
                                      .totalSessions
                                  } sessions)`
                                : "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* MEMBERSHIP */}

                      <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">

                        <span className="text-[9px] font-mono font-bold tracking-wider text-neutral-400 uppercase block">
                          MEMBERSHIP
                        </span>

                        <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300 text-[11px]">

                          <Calendar
                            size={12}
                            className="text-neutral-400"
                          />

                          <span>
                            Joined:{" "}
                            {selectedStudent.joinedAt
                              ? new Date(
                                  selectedStudent.joinedAt,
                                ).toLocaleDateString()
                              : "N/A"}
                          </span>
                        </div>
                      </div>

                      {/* BATCH */}

                      <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">

                        <span className="text-[9px] font-mono font-bold tracking-wider text-neutral-400 uppercase block">
                          BATCH
                        </span>

                        <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300 text-[11px]">

                          <GraduationCap
                            size={12}
                            className="text-neutral-400"
                          />

                          <span>
                            {getBatchName(selectedStudent) ||
                              "No batch assigned"}
                          </span>
                        </div>
                      </div>

                      {/* MENTOR */}

                      <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">

                        <span className="text-[9px] font-mono font-bold tracking-wider text-neutral-400 uppercase block">
                          ASSIGNED MENTOR
                        </span>

                        <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300 text-[11px]">

                          <User
                            size={12}
                            className="text-neutral-400"
                          />

                          <span>
                            {selectedStudent.assignedMentor
                              ? typeof selectedStudent.assignedMentor ===
                                "object"
                                ? selectedStudent.assignedMentor.fullName ||
                                  "Assigned Mentor"
                                : "Assigned Mentor"
                              : "No mentor assigned"}
                          </span>
                        </div>
                      </div>

                      {/* APPROVED BY */}

                      <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">

                        <span className="text-[9px] font-mono font-bold tracking-wider text-neutral-400 uppercase block">
                          APPROVED BY
                        </span>

                        <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300 text-[11px]">

                          <ShieldCheck
                            size={12}
                            className="text-neutral-400"
                          />

                          <span>
                            {selectedStudent.approvedBy
                              ? typeof selectedStudent.approvedBy === "object"
                                ? selectedStudent.approvedBy.fullName ||
                                  "Administrator"
                                : "Administrator"
                              : "N/A"}
                          </span>
                        </div>
                      </div>

                      {/* ACTIONS */}

                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">

                        <button
                          onClick={() => openEditForm(selectedStudent)}
                          className="py-1.5 rounded-md border border-neutral-200 dark:border-neutral-700 text-xs font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => setDeleteTarget(selectedStudent)}
                          className="py-1.5 rounded-md border border-red-200 dark:border-red-900/50 text-[#B91C1C] text-xs font-medium hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                        >
                          Delete
                        </button>

                      </div>
                    </>
                  );
                })()}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ==================================================
          ADD / EDIT STUDENT MODAL
          ================================================== */}

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">

          <div className="w-full max-w-md bg-white dark:bg-[#151921] rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-xl">

            {/* HEADER */}

            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 dark:border-neutral-800">

              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                  {editingStudent ? "Edit Student" : "Add Student"}
                </h3>

                <p className="text-[11px] text-neutral-400 mt-0.5">
                  {editingStudent
                    ? "Update student membership information."
                    : "Approve a user as a student."}
                </p>
              </div>

              <button
                onClick={closeForm}
                className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* FORM */}

            <form onSubmit={handleSubmit} className="p-5 space-y-4">

              {/* ==================================================
                  USER SEARCH
                  ================================================== */}

              {!editingStudent && (
                <div
                  className="space-y-1.5 relative"
                  ref={userDropdownRef}
                >
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    Student
                  </label>

                  {/* SEARCH INPUT */}

                  <div className="relative">

                    <Search
                      size={13}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
                    />

                    <input
                      type="text"
                      value={
                        selectedUser
                          ? selectedUser.fullName
                          : userSearch
                      }
                      onChange={(e) => {
                        setUserSearch(e.target.value);

                        setFormData((prev) => ({
                          ...prev,
                          user: "",
                        }));

                        setIsUserDropdownOpen(true);
                      }}
                      onFocus={() => {
                        setIsUserDropdownOpen(true);
                      }}
                      placeholder={
                        userOptionsLoading
                          ? "Loading users..."
                          : "Search student by name or email..."
                      }
                      disabled={userOptionsLoading}
                      className="w-full pl-8 pr-9 py-2 rounded-md text-xs bg-white dark:bg-[#0E1117] border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 placeholder:text-neutral-400 focus:outline-none focus:border-[#B91C1C]"
                    />

                    <ChevronDown
                      size={13}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none transition-transform ${
                        isUserDropdownOpen ? "rotate-180" : ""
                      }`}
                    />

                  </div>

                  {/* SEARCH DROPDOWN */}

                  {isUserDropdownOpen && !userOptionsLoading && (
                    <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-white dark:bg-[#151921] border border-neutral-200 dark:border-neutral-800 rounded-md shadow-lg overflow-hidden">

                      <div className="max-h-52 overflow-y-auto">

                        {filteredUserOptions.length === 0 ? (
                          <div className="px-3 py-3 text-center text-[11px] text-neutral-400">
                            No users found.
                          </div>
                        ) : (
                          filteredUserOptions.map((option) => {

                            const initials = (option.fullName || "U")
                              .split(" ")
                              .map((word) => word[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase();

                            const isSelected =
                              formData.user === option._id;

                            return (
                              <button
                                key={option._id}
                                type="button"
                                onClick={() => handleSelectUser(option)}
                                className={`w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors ${
                                  isSelected
                                    ? "bg-[#FEF2F2] dark:bg-red-950/30"
                                    : "hover:bg-neutral-50 dark:hover:bg-neutral-800/60"
                                }`}
                              >

                                {/* AVATAR */}

                                <div className="w-7 h-7 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center font-bold text-[9px] shrink-0 text-neutral-500 dark:text-neutral-400">
                                  {initials}
                                </div>

                                {/* USER INFO */}

                                <div className="min-w-0 flex-1">

                                  <div className="text-xs font-medium text-neutral-800 dark:text-neutral-200 truncate">
                                    {option.fullName || "Unknown"}
                                  </div>

                                  {option.email && (
                                    <div className="text-[10px] text-neutral-400 truncate">
                                      {option.email}
                                    </div>
                                  )}

                                </div>

                                {/* SELECTED INDICATOR */}

                                {isSelected && (
                                  <CheckCircle2
                                    size={14}
                                    className="text-[#B91C1C] shrink-0"
                                  />
                                )}

                              </button>
                            );
                          })
                        )}

                      </div>
                    </div>
                  )}

                  {/* SELECTED USER DETAILS */}

                  {selectedUser && (
                    <div className="flex items-center justify-between mt-1.5 px-2.5 py-1.5 rounded-md bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800">

                      <div className="flex items-center gap-2 min-w-0">

                        <User
                          size={12}
                          className="text-neutral-400 shrink-0"
                        />

                        <span className="text-[10px] text-neutral-500 dark:text-neutral-300 truncate">
                          Selected: {selectedUser.fullName}
                        </span>

                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            user: "",
                          }));

                          setUserSearch("");
                          setIsUserDropdownOpen(true);
                        }}
                        className="text-neutral-400 hover:text-[#B91C1C] cursor-pointer"
                        title="Change student"
                      >
                        <X size={12} />
                      </button>

                    </div>
                  )}

                  <p className="text-[10px] text-neutral-400">
                    Search and select the user you want to approve as a
                    student.
                  </p>
                </div>
              )}

              {/* MEMBER ID */}

              {editingStudent && (
                <div className="space-y-1.5">

                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    Member ID
                  </label>

                  <input
                    type="text"
                    value={editingStudent.memberId || "Auto-generated"}
                    disabled
                    readOnly
                    className="w-full px-3 py-2 rounded-md text-xs bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 text-neutral-500 cursor-not-allowed"
                  />

                </div>
              )}

              {/* ASSIGNED MENTOR */}

              <div className="space-y-1.5">

                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  Assigned Mentor{" "}
                  <span className="text-[#B91C1C]">*</span>
                </label>

                <div className="relative">

                  <select
                    value={formData.assignedMentor}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        assignedMentor: e.target.value,
                      }))
                    }
                    required
                    disabled={mentorOptionsLoading}
                    className="w-full appearance-none px-3 py-2 pr-8 rounded-md text-xs bg-white dark:bg-[#0E1117] border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:border-[#B91C1C]"
                  >
                    <option value="">
                      {mentorOptionsLoading
                        ? "Loading mentors..."
                        : "Select a mentor..."}
                    </option>

                    {mentorOptions.map((mentor) => (
                      <option
                        key={mentor._id}
                        value={mentor.user?._id || mentor._id}
                      >
                        {mentor.user?.fullName ||
                          mentor.fullName ||
                          "Mentor"}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    size={12}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
                  />

                </div>
              </div>

              {/* STATUS */}

              <div className="space-y-1.5">

                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  Status
                </label>

                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      status: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 rounded-md text-xs bg-white dark:bg-[#0E1117] border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:border-[#B91C1C] capitalize"
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option
                      key={status}
                      value={status}
                      className="capitalize"
                    >
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              {/* JOINED */}

              <div className="space-y-1.5">

                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  Joined At
                </label>

                <input
                  type="date"
                  value={formData.joinedAt}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      joinedAt: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 rounded-md text-xs bg-white dark:bg-[#0E1117] border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:border-[#B91C1C]"
                />
              </div>

              {/* BUTTONS */}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100 dark:border-neutral-800">

                <button
                  type="button"
                  onClick={closeForm}
                  disabled={formLoading}
                  className="px-3.5 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-700 text-xs font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    formLoading ||
                    (!editingStudent && !formData.user) ||
                    !formData.assignedMentor
                  }
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#B91C1C] hover:bg-[#991B1B] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-medium transition-colors cursor-pointer"
                >
                  {formLoading && (
                    <Loader2
                      size={13}
                      className="animate-spin"
                    />
                  )}

                  {editingStudent
                    ? "Update Student"
                    : "Add Student"}
                </button>

              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================
          DELETE CONFIRMATION
          ================================================== */}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">

          <div className="w-full max-w-sm bg-white dark:bg-[#151921] rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-xl p-5">

            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
              Delete Student
            </h3>

            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 leading-relaxed">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                {deleteTarget.user?.fullName || "this student"}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-2 mt-5">

              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleteLoading}
                className="px-3.5 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-700 text-xs font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteStudent}
                disabled={deleteLoading}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#B91C1C] hover:bg-[#991B1B] disabled:opacity-50 text-white text-xs font-medium transition-colors cursor-pointer"
              >
                {deleteLoading && (
                  <Loader2
                    size={13}
                    className="animate-spin"
                  />
                )}

                Delete
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}