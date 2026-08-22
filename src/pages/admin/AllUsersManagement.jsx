import React, { useState, useEffect, useRef } from "react";
import AdminSidebar from "../../components/layout/AdminSidebar";
import {
  Users,
  Search,
  ChevronDown,
  Bell,
  User,
  X,
  Mail,
  Phone,
  Moon,
  Sun,
  LogOut,
  Check,
  Pencil,
  Trash2,
  ShieldCheck,
  UserX,
} from "lucide-react";

const INITIAL_USERS = [
  {
    id: "1",
    userId: "USR-2026-101",
    name: "Abdurahman Ahmed",
    email: "abdurahman.a@astu.edu.et",
    phone: "+251 911 234 567",
    initials: "AA",
    gender: "Male",
    university: "ASTU",
    status: "Approved",
    registeredDate: "Aug 10, 2026",
    role: "Applicant (Student)",
  },
  {
    id: "2",
    userId: "USR-2026-102",
    name: "Sumeyya Nuru",
    email: "sumeyya.n@astu.edu.et",
    phone: "+251 922 345 678",
    initials: "SN",
    gender: "Female",
    university: "ASTU",
    status: "Approved",
    registeredDate: "Aug 11, 2026",
    role: "Applicant (Student)",
  },
  {
    id: "3",
    userId: "USR-2026-103",
    name: "Bilal Jemal",
    email: "bilal.j@aau.edu.et",
    phone: "+251 933 456 789",
    initials: "BJ",
    gender: "Male",
    university: "AAU",
    status: "Pending",
    registeredDate: "Aug 15, 2026",
    role: "Applicant (Student)",
  },
  {
    id: "4",
    userId: "USR-2026-104",
    name: "Fatima Zahra",
    email: "fatima.z@hu.edu.et",
    phone: "+251 955 678 901",
    initials: "FZ",
    gender: "Female",
    university: "HU",
    status: "Approved",
    registeredDate: "Aug 12, 2026",
    role: "Applicant (Mentor)",
  },
  {
    id: "5",
    userId: "USR-2026-105",
    name: "Hamza Khalid",
    email: "hamza.k@ju.edu.et",
    phone: "+251 944 567 890",
    initials: "HK",
    gender: "Male",
    university: "JU",
    status: "Pending",
    registeredDate: "Aug 16, 2026",
    role: "Applicant (Student)",
  },
  {
    id: "6",
    userId: "USR-2026-106",
    name: "Hanan Seid",
    email: "hanan.s@astu.edu.et",
    phone: "+251 966 789 012",
    initials: "HS",
    gender: "Female",
    university: "ASTU",
    status: "Rejected",
    registeredDate: "Aug 05, 2026",
    role: "Applicant (Student)",
  },
];

export default function AllUsersManagement({
  isDarkMode,
  onToggleTheme,
  onNavigateAdminView,
  onLogout,
}) {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [universityFilter, setUniversityFilter] = useState("ALL");
  const [genderFilter, setGenderFilter] = useState("ALL");
  const [selectedUser, setSelectedUser] = useState(null);

  const [availableUniversities] = useState(["ASTU", "AAU", "JU", "HU"]);

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

  const handleDeleteUser = (id) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    if (selectedUser?.id === id) setSelectedUser(null);
  };

  const handleUpdateStatus = (id, newStatus) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: newStatus } : u)),
    );
    if (selectedUser?.id === id) {
      setSelectedUser((prev) => ({ ...prev, status: newStatus }));
    }
  };

  const totalUsers = users.length;
  const approvedUsers = users.filter((u) => u.status === "Approved").length;
  const pendingUsers = users.filter((u) => u.status === "Pending").length;
  const rejectedUsers = users.filter((u) => u.status === "Rejected").length;

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      (u.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" ||
      u.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesUniv =
      universityFilter === "ALL" ||
      (u.university || "").toLowerCase() === universityFilter.toLowerCase();
    const matchesGender =
      genderFilter === "ALL" ||
      (u.gender || "").toLowerCase() === genderFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesUniv && matchesGender;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "Approved":
        return (
          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/40">
            Approved
          </span>
        );
      case "Pending":
        return (
          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/50 dark:border-amber-800/40">
            Pending
          </span>
        );
      case "Rejected":
        return (
          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200/50 dark:border-rose-800/40">
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen w-full font-sans overflow-hidden bg-[#FAFBFC] dark:bg-[#0E1117] text-neutral-900 dark:text-neutral-100 transition-colors">
      <AdminSidebar
        currentView="dashboard-users"
        onNavigateAdminView={onNavigateAdminView}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#FAFBFC] dark:bg-[#0E1117]">
        <header className="h-14 bg-white dark:bg-[#151921] border-b border-neutral-200/80 dark:border-neutral-800/80 px-8 flex items-center justify-between shrink-0">
          <div className="text-xs sm:text-sm font-semibold tracking-tight text-neutral-800 dark:text-neutral-200">
            All Users
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
          <div>
            <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
              All Users
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Review and approve registered applicants across universities.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                TOTAL USERS
              </span>
              <div className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
                {totalUsers}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                APPROVED USERS
              </span>
              <div className="text-2xl font-black tracking-tight text-emerald-600 dark:text-emerald-400">
                {approvedUsers}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                PENDING APPROVAL
              </span>
              <div className="text-2xl font-black tracking-tight text-amber-600 dark:text-amber-400">
                {pendingUsers}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                REJECTED USERS
              </span>
              <div className="text-2xl font-black tracking-tight text-rose-600 dark:text-rose-400">
                {rejectedUsers}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start transition-all duration-300">
            <div
              className={`space-y-3 transition-all duration-300 ${
                selectedUser ? "lg:col-span-8" : "lg:col-span-12"
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
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="appearance-none pl-3 pr-7 py-1.5 rounded-md text-xs bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 text-neutral-600 dark:text-neutral-300 focus:outline-none focus:border-[#B91C1C] cursor-pointer"
                  >
                    <option value="ALL">All Status</option>
                    <option value="Approved">Approved</option>
                    <option value="Pending">Pending</option>
                    <option value="Rejected">Rejected</option>
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
                    <option value="ALL">All Universities</option>
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

                <div className="relative">
                  <select
                    value={genderFilter}
                    onChange={(e) => setGenderFilter(e.target.value)}
                    className="appearance-none pl-3 pr-7 py-1.5 rounded-md text-xs bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 text-neutral-600 dark:text-neutral-300 focus:outline-none focus:border-[#B91C1C] cursor-pointer"
                  >
                    <option value="ALL">All Genders</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  <ChevronDown
                    size={12}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
                  />
                </div>
              </div>

              <div className="bg-white dark:bg-[#151921] rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                        <th className="py-2.5 px-4">NAME</th>
                        <th className="py-2.5 px-4">EMAIL</th>
                        <th className="py-2.5 px-4">GENDER</th>
                        <th className="py-2.5 px-4">UNIVERSITY</th>
                        <th className="py-2.5 px-4">STATUS</th>
                        <th className="py-2.5 px-4 text-right">ACTION</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
                      {filteredUsers.map((u) => (
                        <tr
                          key={u.id}
                          onClick={() => setSelectedUser(u)}
                          className={`hover:bg-neutral-50/70 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer ${
                            selectedUser?.id === u.id
                              ? "bg-[#FEF2F2]/50 dark:bg-primary/10"
                              : ""
                          }`}
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center font-bold text-[10px] shrink-0 text-neutral-500 dark:text-neutral-400">
                                {u.initials}
                              </div>
                              <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                                {u.name}
                              </span>
                            </div>
                          </td>

                          <td className="py-3 px-4 text-neutral-500 dark:text-neutral-400 text-xs">
                            {u.email}
                          </td>

                          <td className="py-3 px-4 font-medium text-neutral-700 dark:text-neutral-300">
                            {u.gender}
                          </td>

                          <td className="py-3 px-4">
                            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200/50 dark:border-neutral-700">
                              {u.university}
                            </span>
                          </td>

                          <td className="py-3 px-4">
                            {getStatusBadge(u.status)}
                          </td>

                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2 text-neutral-400">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedUser(u);
                                }}
                                title="Edit"
                                className="p-1 hover:text-primary transition-colors cursor-pointer"
                              >
                                <Pencil size={13} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteUser(u.id);
                                }}
                                title="Delete"
                                className="p-1 hover:text-primary transition-colors cursor-pointer"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="px-4 py-2.5 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400">
                  <span>
                    Showing {filteredUsers.length} of {totalUsers} users
                  </span>
                </div>
              </div>
            </div>

            {selectedUser && (
              <div className="lg:col-span-4 bg-white dark:bg-[#151921] rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 p-5 shadow-2xs relative space-y-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
                  <span className="text-xs font-bold text-neutral-900 dark:text-white">
                    User Details
                  </span>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 cursor-pointer"
                    title="Close Details"
                  >
                    <X size={15} />
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center font-bold text-xs text-neutral-600 dark:text-neutral-300">
                    {selectedUser.initials}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-neutral-900 dark:text-white leading-tight">
                      {selectedUser.name}
                    </h3>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      ID: {selectedUser.userId}
                    </p>
                    <div className="mt-1">
                      {getStatusBadge(selectedUser.status)}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-1 text-xs">
                  <div>
                    <span className="text-[9px] font-mono font-bold tracking-wider text-neutral-400 uppercase block mb-0.5">
                      ROLE
                    </span>
                    <span className="text-[11px] text-neutral-700 dark:text-neutral-300 font-medium">
                      {selectedUser.role}
                    </span>
                  </div>

                  <div>
                    <span className="text-[9px] font-mono font-bold tracking-wider text-neutral-400 uppercase block mb-0.5">
                      EMAIL
                    </span>
                    <span className="text-[11px] text-neutral-700 dark:text-neutral-300">
                      {selectedUser.email}
                    </span>
                  </div>

                  <div>
                    <span className="text-[9px] font-mono font-bold tracking-wider text-neutral-400 uppercase block mb-0.5">
                      PHONE
                    </span>
                    <span className="text-[11px] text-neutral-700 dark:text-neutral-300">
                      {selectedUser.phone}
                    </span>
                  </div>

                  <div>
                    <span className="text-[9px] font-mono font-bold tracking-wider text-neutral-400 uppercase block mb-0.5">
                      GENDER
                    </span>
                    <span className="text-[11px] text-neutral-700 dark:text-neutral-300">
                      {selectedUser.gender}
                    </span>
                  </div>

                  <div>
                    <span className="text-[9px] font-mono font-bold tracking-wider text-neutral-400 uppercase block mb-0.5">
                      UNIVERSITY
                    </span>
                    <span className="text-[11px] text-neutral-700 dark:text-neutral-300">
                      {selectedUser.university}
                    </span>
                  </div>

                  <div>
                    <span className="text-[9px] font-mono font-bold tracking-wider text-neutral-400 uppercase block mb-0.5">
                      REGISTRATION DATE
                    </span>
                    <span className="text-[11px] text-neutral-700 dark:text-neutral-300">
                      {selectedUser.registeredDate}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                  <button
                    onClick={() =>
                      handleUpdateStatus(selectedUser.id, "Approved")
                    }
                    disabled={selectedUser.status === "Approved"}
                    className={`py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                      selectedUser.status === "Approved"
                        ? "bg-emerald-100 text-emerald-700 opacity-60 cursor-not-allowed"
                        : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs"
                    }`}
                  >
                    <ShieldCheck size={14} />
                    <span>Approve</span>
                  </button>

                  <button
                    onClick={() =>
                      handleUpdateStatus(selectedUser.id, "Rejected")
                    }
                    disabled={selectedUser.status === "Rejected"}
                    className={`py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                      selectedUser.status === "Rejected"
                        ? "bg-rose-100 text-rose-700 opacity-60 cursor-not-allowed"
                        : "border border-rose-200 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                    }`}
                  >
                    <UserX size={14} />
                    <span>Reject</span>
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
