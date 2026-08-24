import React, { useState, useEffect, useCallback } from "react";
import { getAllUsers, deleteUserApi } from "../../services/userService";
import { getBatches } from "../../services/batchService";
import {
  Search,
  ChevronDown,
  X,
  Trash2,
  RefreshCw,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
} from "lucide-react";

export default function AllUsersManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [universityFilter, setUniversityFilter] = useState("ALL");
  const [genderFilter, setGenderFilter] = useState("ALL");
  const [batchFilter, setBatchFilter] = useState("ALL");

  // Selected user
  const [selectedUser, setSelectedUser] = useState(null);
  const [detailStep, setDetailStep] = useState(1);

  // Dynamic batches
  const [availableBatches, setAvailableBatches] = useState([]);
  const [batchesLoading, setBatchesLoading] = useState(true);

  // Delete confirmation
  const [deleteUser, setDeleteUser] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const availableUniversities = ["ASTU", "AAU", "JU", "HU"];

  /*
   * ---------------------------------------------------------
   * FETCH BATCHES
   * ---------------------------------------------------------
   */

  const fetchBatches = useCallback(async () => {
    setBatchesLoading(true);

    try {
      const data = await getBatches();
      setAvailableBatches(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch batches:", error);
      setAvailableBatches([]);
    } finally {
      setBatchesLoading(false);
    }
  }, []);

  /*
   * ---------------------------------------------------------
   * FETCH USERS
   * ---------------------------------------------------------
   */

  const fetchUsers = useCallback(async () => {
    setLoading(true);

    try {
      const rawData = await getAllUsers({
        search: searchTerm.trim(),
        role: roleFilter,
        university: universityFilter,
        gender: genderFilter,
        batch: batchFilter,
      });

      const formatted = rawData.map((u) => {
        const initials = u.fullName
          ? u.fullName
              .split(" ")
              .map((name) => name[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)
          : "U";

        const batchName = u.batch?.name || u.batch || "N/A";

        return {
          id: u._id,
          userId:
            u.universityId ||
            u._id?.slice(-6).toUpperCase() ||
            "N/A",
          name: u.fullName || "Unnamed User",
          email: u.email || "N/A",
          phone: u.phone || "N/A",
          initials,
          gender: u.gender
            ? u.gender.charAt(0).toUpperCase() + u.gender.slice(1)
            : "N/A",
          university: u.university || "N/A",
          universityId: u.universityId || "N/A",
          telegramUsername: u.telegramUsername || "N/A",
          batch: batchName,
          batchId: u.batch?._id || u.batch || null,
          year: u.year || "N/A",
          department: u.department || "N/A",
          role: u.role ? u.role.toLowerCase() : "user",
          applicationType: u.applicationType || "student",
          github: u.github || "",
          codeforces: u.codeforces || "",
          leetcode: u.leetcode || "",
          dailyAvailableHours: u.dailyAvailableHours ?? "N/A",
          availabilityDescription: u.availabilityDescription || "N/A",
          motivation: u.motivation || "N/A",
          experience: u.experience || "N/A",
          expertise: u.expertise || "N/A",
          registeredDate: u.createdAt
            ? new Date(u.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "N/A",
          updatedDate: u.updatedAt
            ? new Date(u.updatedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "N/A",
          rawUser: u,
        };
      });

      setUsers(formatted);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, roleFilter, universityFilter, genderFilter, batchFilter]);

  /*
   * ---------------------------------------------------------
   * INITIAL LOAD & DEBOUNCE SEARCH
   * ---------------------------------------------------------
   */

  useEffect(() => {
    fetchBatches();
  }, [fetchBatches]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 300);

    return () => clearTimeout(timer);
  }, [fetchUsers]);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setDetailStep(1);
  };

  const handleDeleteUser = (user) => {
    setDeleteUser(user);
  };

  const confirmDeleteUser = async () => {
    if (!deleteUser) return;

    setDeleteLoading(true);

    try {
      await deleteUserApi(deleteUser.id);
      setUsers((previousUsers) =>
        previousUsers.filter((user) => user.id !== deleteUser.id)
      );

      if (selectedUser?.id === deleteUser.id) {
        setSelectedUser(null);
      }

      setDeleteUser(null);
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const getStatusBadge = (role) => {
    switch (role) {
      case "student":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/40">
            Student
          </span>
        );
      case "mentor":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/40">
            Mentor
          </span>
        );
      case "admin":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200/50 dark:border-purple-800/40">
            Admin
          </span>
        );
      case "user":
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/50 dark:border-amber-800/40">
            User
          </span>
        );
    }
  };

  const totalUsersCount = users.length;
  const membersCount = users.filter((user) =>
    ["student", "mentor", "admin"].includes(user.role)
  ).length;
  const standardUsersCount = users.filter((user) => user.role === "user").length;

  const getStepTitle = () => {
    switch (detailStep) {
      case 1:
        return "1. Basic & Contact Info";
      case 2:
        return "2. Academic & Links";
      case 3:
        return "3. Application Details";
      default:
        return "";
    }
  };

  return (
    <>
      <div className="flex h-screen w-full font-sans overflow-hidden bg-[#FAFBFC] dark:bg-[#0E1117] text-neutral-900 dark:text-neutral-100 transition-colors">
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <main className="flex-1 overflow-y-auto px-8 py-6 space-y-5">
            {/* HEADER */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
                  All Users Management
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Manage all registered accounts, applicants, mentors, students, and administrators.
                </p>
              </div>

              <button
                onClick={fetchUsers}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/80 transition-colors cursor-pointer"
              >
                <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
                Refresh
              </button>
            </div>

            {/* METRICS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="p-4 rounded-xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-2xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                  TOTAL ACCOUNTS
                </span>
                <div className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
                  {totalUsersCount}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-2xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                  ACTIVE MEMBERS
                </span>
                <div className="text-2xl font-black tracking-tight text-emerald-600 dark:text-emerald-400">
                  {membersCount}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-2xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                  UNAPPROVED USERS
                </span>
                <div className="text-2xl font-black tracking-tight text-amber-600 dark:text-amber-400">
                  {standardUsersCount}
                </div>
              </div>
            </div>

            {/* FILTERS + TABLE */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              <div
                className={`space-y-3 ${
                  selectedUser ? "lg:col-span-7 xl:col-span-7" : "lg:col-span-12"
                }`}
              >
                {/* FILTER BAR */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="flex-1 min-w-[180px] relative">
                    <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="text"
                      placeholder="Search by name or email..."
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 rounded-md text-xs bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:border-[#B91C1C]"
                    />
                  </div>

                  {/* ROLE FILTER */}
                  <div className="relative">
                    <select
                      value={roleFilter}
                      onChange={(event) => setRoleFilter(event.target.value)}
                      className="appearance-none pl-3 pr-7 py-1.5 rounded-md text-xs bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 text-neutral-600 dark:text-neutral-300 focus:outline-none cursor-pointer font-medium"
                    >
                      <option value="ALL">All Roles</option>
                      <option value="ALLmembers">All Members</option>
                      <option value="user">User</option>
                      <option value="student">Student</option>
                      <option value="mentor">Mentor</option>
                      <option value="admin">Admin</option>
                    </select>
                    <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                  </div>

                  {/* UNIVERSITY FILTER */}
                  <div className="relative">
                    <select
                      value={universityFilter}
                      onChange={(event) => setUniversityFilter(event.target.value)}
                      className="appearance-none pl-3 pr-7 py-1.5 rounded-md text-xs bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 text-neutral-600 dark:text-neutral-300 focus:outline-none cursor-pointer font-medium"
                    >
                      <option value="ALL">All Universities</option>
                      {availableUniversities.map((uni) => (
                        <option key={uni} value={uni}>{uni}</option>
                      ))}
                    </select>
                    <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                  </div>

                  {/* BATCH FILTER */}
                  <div className="relative">
                    <select
                      value={batchFilter}
                      onChange={(event) => setBatchFilter(event.target.value)}
                      disabled={batchesLoading}
                      className="appearance-none pl-3 pr-7 py-1.5 rounded-md text-xs bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 text-neutral-600 dark:text-neutral-300 focus:outline-none cursor-pointer font-medium disabled:opacity-60"
                    >
                      <option value="ALL">{batchesLoading ? "Loading..." : "All Batches"}</option>
                      {availableBatches.map((batch) => (
                        <option key={batch._id} value={batch._id}>{batch.name}</option>
                      ))}
                    </select>
                    <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                  </div>

                  {/* GENDER FILTER */}
                  <div className="relative">
                    <select
                      value={genderFilter}
                      onChange={(event) => setGenderFilter(event.target.value)}
                      className="appearance-none pl-3 pr-7 py-1.5 rounded-md text-xs bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 text-neutral-600 dark:text-neutral-300 focus:outline-none cursor-pointer font-medium"
                    >
                      <option value="ALL">All Genders</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                    <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                  </div>
                </div>

                {/* TABLE */}
                <div className="bg-white dark:bg-[#151921] rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 overflow-hidden shadow-2xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                          <th className="py-2.5 px-4">APPLICANT</th>
                          <th className="py-2.5 px-4">TYPE</th>
                          <th className="py-2.5 px-4">UNIVERSITY</th>
                          <th className="py-2.5 px-4">BATCH</th>
                          <th className="py-2.5 px-4">ROLE</th>
                          <th className="py-2.5 px-4 text-right">ACTION</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
                        {loading ? (
                          <tr>
                            <td colSpan={6} className="py-8 text-center text-neutral-400">
                              Loading accounts...
                            </td>
                          </tr>
                        ) : users.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="py-8 text-center text-neutral-400">
                              No records found matching filters.
                            </td>
                          </tr>
                        ) : (
                          users.map((user) => (
                            <tr
                              key={user.id}
                              onClick={() => handleSelectUser(user)}
                              className={`hover:bg-neutral-50/70 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer ${
                                selectedUser?.id === user.id ? "bg-[#FEF2F2]/50 dark:bg-red-950/20" : ""
                              }`}
                            >
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-7 h-7 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center font-bold text-[10px] shrink-0 text-neutral-500 dark:text-neutral-400">
                                    {user.initials}
                                  </div>
                                  <div>
                                    <div className="font-semibold text-neutral-900 dark:text-neutral-100 leading-tight">
                                      {user.name}
                                    </div>
                                    <div className="text-[10px] text-neutral-400">{user.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <span className="inline-block capitalize px-2 py-0.5 rounded text-[10px] font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                                  {user.applicationType}
                                </span>
                              </td>
                              <td className="py-3 px-4 font-medium text-neutral-700 dark:text-neutral-300">
                                {user.university}
                                <span className="text-[10px] text-neutral-400"> ({user.universityId})</span>
                              </td>
                              <td className="py-3 px-4 font-medium text-neutral-600 dark:text-neutral-400">
                                {user.batch}
                              </td>
                              <td className="py-3 px-4">
                                {getStatusBadge(user.role)}
                              </td>
                              <td className="py-3 px-4 text-right">
                                <button
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    handleDeleteUser(user);
                                  }}
                                  title="Delete user"
                                  className="p-1.5 text-neutral-400 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="px-4 py-2.5 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400">
                    <span>Showing {users.length} user records</span>
                  </div>
                </div>
              </div>

              {/* USER INSPECTOR */}
              {selectedUser && (
                <div className="lg:col-span-5 xl:col-span-5 bg-white dark:bg-[#151921] rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 p-5 shadow-2xs relative space-y-4">
                  <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-neutral-900 dark:text-white">
                        User Details
                      </span>
                      {getStatusBadge(selectedUser.role)}
                    </div>
                    <button
                      onClick={() => setSelectedUser(null)}
                      className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 cursor-pointer"
                    >
                      <X size={15} />
                    </button>
                  </div>

                  {/* PROFILE */}
                  <div className="flex items-center gap-3 p-2.5 bg-neutral-50 dark:bg-neutral-800/40 rounded-lg border border-neutral-100 dark:border-neutral-800">
                    <div className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center font-bold text-xs text-neutral-700 dark:text-neutral-200 shrink-0">
                      {selectedUser.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-sm text-neutral-900 dark:text-white truncate">
                        {selectedUser.name}
                      </h3>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                        {selectedUser.email}
                      </p>
                    </div>
                  </div>

                  {/* STEP HEADER */}
                  <div className="space-y-1.5 pt-1 border-b border-neutral-100 dark:border-neutral-800 pb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                        {getStepTitle()}
                      </span>
                      <span className="text-[10px] font-bold text-neutral-400">
                        Step {detailStep} of 3
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[1, 2, 3].map((step) => (
                        <button
                          key={step}
                          onClick={() => setDetailStep(step)}
                          className={`h-1.5 rounded-full transition-all cursor-pointer ${
                            detailStep === step
                              ? "bg-[#B91C1C]"
                              : detailStep > step
                              ? "bg-neutral-400 dark:bg-neutral-600"
                              : "bg-neutral-200 dark:bg-neutral-800"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* STEP 1: Basic & Contact Info */}
                  {detailStep === 1 && (
                    <div className="space-y-3 min-h-[230px]">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-0.5">FULL NAME</span>
                          <span className="text-xs text-neutral-800 dark:text-neutral-200 font-medium">{selectedUser.name}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-0.5">GENDER</span>
                          <span className="text-xs text-neutral-800 dark:text-neutral-200 font-medium">{selectedUser.gender}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-0.5">EMAIL ADDRESS</span>
                          <span className="text-xs text-neutral-800 dark:text-neutral-200 font-medium break-all">{selectedUser.email}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-0.5">PHONE</span>
                          <span className="text-xs text-neutral-800 dark:text-neutral-200 font-medium">{selectedUser.phone}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-0.5">TELEGRAM</span>
                          <span className="text-xs text-neutral-800 dark:text-neutral-200 font-medium">{selectedUser.telegramUsername}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-0.5">APPLICATION TYPE</span>
                          <span className="text-xs capitalize font-semibold text-emerald-600 dark:text-emerald-400">{selectedUser.applicationType}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: Academic & Links */}
                  {detailStep === 2 && (
                    <div className="space-y-3 min-h-[230px]">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-0.5">UNIVERSITY</span>
                          <span className="text-xs text-neutral-800 dark:text-neutral-200 font-medium">{selectedUser.university}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-0.5">UNIVERSITY ID</span>
                          <span className="text-xs text-neutral-800 dark:text-neutral-200 font-medium">{selectedUser.universityId}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-0.5">DEPARTMENT</span>
                          <span className="text-xs text-neutral-800 dark:text-neutral-200 font-medium">{selectedUser.department}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-0.5">YEAR</span>
                          <span className="text-xs text-neutral-800 dark:text-neutral-200 font-medium">{selectedUser.year}</span>
                        </div>
                      </div>
                      <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">PROFILES & LINKS</span>
                        <div className="flex flex-wrap gap-2">
                          {selectedUser.github && (
                            <a href={selectedUser.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 px-2 py-1 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-[11px]">
                              GitHub <ExternalLink size={10} />
                            </a>
                          )}
                          {selectedUser.codeforces && (
                            <a href={selectedUser.codeforces} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 px-2 py-1 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-[11px]">
                              Codeforces <ExternalLink size={10} />
                            </a>
                          )}
                          {selectedUser.leetcode && (
                            <a href={selectedUser.leetcode} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 px-2 py-1 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-[11px]">
                              LeetCode <ExternalLink size={10} />
                            </a>
                          )}
                          {!selectedUser.github && !selectedUser.codeforces && !selectedUser.leetcode && (
                            <span className="text-xs text-neutral-400 italic">No external links provided.</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: Application Details */}
                  {detailStep === 3 && (
                    <div className="space-y-3 min-h-[230px]">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-0.5">DAILY HOURS</span>
                          <span className="text-xs text-neutral-800 dark:text-neutral-200 font-medium">{selectedUser.dailyAvailableHours} hrs</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-0.5">BATCH</span>
                          <span className="text-xs text-neutral-800 dark:text-neutral-200 font-medium">{selectedUser.batch}</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-0.5">EXPERIENCE / EXPERTISE</span>
                        <p className="text-xs text-neutral-700 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-800/40 p-2 rounded border border-neutral-100 dark:border-neutral-800">
                          {selectedUser.experience !== "N/A" ? selectedUser.experience : selectedUser.expertise}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-0.5">MOTIVATION</span>
                        <p className="text-xs text-neutral-700 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-800/40 p-2 rounded border border-neutral-100 dark:border-neutral-800 line-clamp-3">
                          {selectedUser.motivation}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* STEP NAVIGATION BUTTONS */}
                  <div className="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-neutral-800">
                    <button
                      onClick={() => setDetailStep((prev) => Math.max(prev - 1, 1))}
                      disabled={detailStep === 1}
                      className="flex items-center gap-1 px-3 py-1.5 rounded text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                    >
                      <ChevronLeft size={13} /> Prev
                    </button>
                    <button
                      onClick={() => setDetailStep((prev) => Math.min(prev + 1, 3))}
                      disabled={detailStep === 3}
                      className="flex items-center gap-1 px-3 py-1.5 rounded text-xs font-medium bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                    >
                      Next <ChevronRight size={13} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {deleteUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-[#151921] rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 max-w-sm w-full space-y-4 shadow-xl">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Confirm Deletion</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Are you sure you want to delete <span className="font-semibold text-neutral-800 dark:text-neutral-200">{deleteUser.name}</span>? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setDeleteUser(null)}
                disabled={deleteLoading}
                className="px-3 py-1.5 rounded text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteUser}
                disabled={deleteLoading}
                className="px-3 py-1.5 rounded text-xs font-medium bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 cursor-pointer"
              >
                {deleteLoading ? "Deleting..." : "Delete User"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}