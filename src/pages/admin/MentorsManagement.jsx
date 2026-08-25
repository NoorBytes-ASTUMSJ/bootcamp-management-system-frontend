
import React, { useEffect, useMemo, useState } from "react";
import API from "../../services/api";
import {
  Plus,
  Search,
  ChevronDown,
  X,
  Mail,
  Phone,
  User,
  Pencil,
  Trash2,
  Loader2,
  AlertTriangle,
  Hash,
  Calendar,
} from "lucide-react";

const ROLE_OPTIONS = ["mentor", "admin"];

const ROLE_STYLES = {
  mentor:
    "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/40",
  admin:
    "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200/50 dark:border-purple-800/40",
};

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

export default function MentorsManagement() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [universityFilter, setUniversityFilter] = useState("ALL");

  const [selectedStaff, setSelectedStaff] = useState(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);

  const [formLoading, setFormLoading] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [candidateUsers, setCandidateUsers] = useState([]);
  const [candidatesLoading, setCandidatesLoading] = useState(false);

  const [userSearch, setUserSearch] = useState("");
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const emptyForm = {
    user: "",
    role: "mentor",
    status: "active",
    joinedAt: new Date().toISOString().slice(0, 10),
  };

  const [formData, setFormData] = useState(emptyForm);
  const [selectedUserLabel, setSelectedUserLabel] = useState(null);

  const loadStaff = async () => {
    try {
      setLoading(true);

      const params = {};

      if (roleFilter !== "ALL") {
        params.role = roleFilter;
      }

      if (universityFilter !== "ALL") {
        params.university = universityFilter;
      }

      const response = await API.get("/members/staff", { params });

      const data =
        response.data?.data?.staff || response.data?.staff || [];

      setStaff(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load staff:", error);
      setStaff([]);
    } finally {
      setLoading(false);
    }
  };

  const loadCandidateUsers = async () => {
    try {
      setCandidatesLoading(true);

      const response = await API.get("/users", {
        params: {
          applicationType: "mentor",
        },
      });

      const data =
        response.data?.data?.users || response.data?.users || [];

      setCandidateUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load mentor candidates:", error);
      setCandidateUsers([]);
    } finally {
      setCandidatesLoading(false);
    }
  };

  useEffect(() => {
    loadStaff();
  }, [roleFilter, universityFilter]);

  const uniqueUniversities = useMemo(() => {
    const universities = staff
      .map((person) => person.university)
      .filter((uni) => Boolean(uni));

    return Array.from(new Set(universities)).sort();
  }, [staff]);

  const filteredStaff = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    return staff.filter((person) => {
      const name = (person.fullName || "").toLowerCase();
      const email = (person.email || "").toLowerCase();
      const phone = (person.phone || "").toLowerCase();
      const university = (person.university || "").toLowerCase();

      const matchesSearch =
        !search ||
        name.includes(search) ||
        email.includes(search) ||
        phone.includes(search) ||
        university.includes(search);

      const matchesUniversity =
        universityFilter === "ALL" ||
        (person.university || "").toLowerCase() ===
          universityFilter.toLowerCase();

      return matchesSearch && matchesUniversity;
    });
  }, [staff, searchTerm, universityFilter]);

  const filteredCandidateUsers = useMemo(() => {
    const search = userSearch.toLowerCase().trim();

    return candidateUsers.filter((user) => {
      const name = (user.fullName || "").toLowerCase();
      const email = (user.email || "").toLowerCase();

      return !search || name.includes(search) || email.includes(search);
    });
  }, [candidateUsers, userSearch]);

  const totalStaff = staff.length;

  const totalMentors = staff.filter(
    (person) => person.role === "mentor",
  ).length;

  const totalAdmins = staff.filter(
    (person) => person.role === "admin",
  ).length;

  const openAddForm = () => {
    setEditingStaff(null);
    setFormData(emptyForm);
    setSelectedUserLabel(null);
    setUserSearch("");
    setUserDropdownOpen(false);
    setIsFormOpen(true);
    loadCandidateUsers();
  };

  const openEditForm = (person) => {
    setEditingStaff(person);

    setFormData({
      user: person._id || "",
      role: person.role || "mentor",
      status: person.status || "active",
      joinedAt: person.joinedAt
        ? new Date(person.joinedAt).toISOString().slice(0, 10)
        : new Date().toISOString().slice(0, 10),
    });

    setSelectedUserLabel({
      fullName: person.fullName,
      email: person.email,
    });

    setUserSearch("");
    setUserDropdownOpen(false);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    if (formLoading) return;

    setIsFormOpen(false);
    setEditingStaff(null);
    setUserDropdownOpen(false);
    setSelectedUserLabel(null);
    setFormData(emptyForm);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const pickUser = (user) => {
    setFormData((prev) => ({
      ...prev,
      user: user._id,
    }));

    setSelectedUserLabel({
      fullName: user.fullName,
      email: user.email,
    });

    setUserDropdownOpen(false);
    setUserSearch("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!editingStaff && !formData.user) {
      return;
    }

    try {
      setFormLoading(true);

      if (editingStaff) {
        const payload = {
          role: formData.role,
          status: formData.status,
          joinedAt: formData.joinedAt,
        };

        const response = await API.patch(
          `/members/${editingStaff._id}`,
          payload,
        );

        const updated =
          response.data?.data?.member ||
          response.data?.member ||
          response.data?.data;

        if (updated) {
          setStaff((prev) =>
            prev.map((person) =>
              person._id === editingStaff._id ? updated : person,
            ),
          );

          if (selectedStaff?._id === editingStaff._id) {
            setSelectedStaff(updated);
          }
        } else {
          await loadStaff();
        }
      } else {
        const response = await API.post(
          `/members/approve/${formData.user}`,
          {
            role: formData.role,
            status: formData.status,
            joinedAt: formData.joinedAt,
          },
        );

        const created =
          response.data?.data?.member ||
          response.data?.member ||
          response.data?.data;

        if (created) {
          setStaff((prev) => [...prev, created]);
        } else {
          await loadStaff();
        }
      }

      closeForm();
    } catch (error) {
      console.error("Failed to save mentor:", error);
    } finally {
      setFormLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeleteLoading(true);

      await API.delete(`/members/${deleteTarget._id}`);

      setStaff((prev) =>
        prev.filter((p) => p._id !== deleteTarget._id),
      );

      if (selectedStaff?._id === deleteTarget._id) {
        setSelectedStaff(null);
      }

      setDeleteTarget(null);
    } catch (error) {
      console.error("Failed to delete staff member:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full font-sans overflow-hidden bg-[#FAFBFC] dark:bg-[#0E1117] text-neutral-900 dark:text-neutral-100 transition-colors">
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#FAFBFC] dark:bg-[#0E1117]">
        <main className="flex-1 overflow-y-auto px-8 py-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
                Mentors
              </h2>

              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Manage mentors and administrators.
              </p>
            </div>

            <button
              onClick={openAddForm}
              className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-md bg-[#B91C1C] hover:bg-[#991B1B] text-white text-xs font-medium transition-colors cursor-pointer shadow-2xs"
            >
              <Plus size={13} />
              <span>Add Mentor</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="p-4 rounded-xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                TOTAL STAFF
              </span>

              <div className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
                {totalStaff}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                MENTORS
              </span>

              <div className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
                {totalMentors}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                ADMINS
              </span>

              <div className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
                {totalAdmins}
              </div>
            </div>
          </div>

          <div
            className={`grid grid-cols-1 lg:grid-cols-12 gap-5 items-start ${
              selectedStaff ? "transition-all duration-300" : ""
            }`}
          >
            <div
              className={`space-y-3 ${
                selectedStaff ? "lg:col-span-8" : "lg:col-span-12"
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
                    placeholder="Search by name, email, phone or university..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 rounded-md text-xs bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 text-neutral-800 dark:text-neutral-200 placeholder:text-neutral-400 focus:outline-none focus:border-[#B91C1C]"
                  />
                </div>

                <div className="relative">
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="appearance-none pl-3 pr-7 py-1.5 rounded-md text-xs bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 text-neutral-600 dark:text-neutral-300 focus:outline-none focus:border-[#B91C1C] cursor-pointer capitalize"
                  >
                    <option value="ALL">Filter by Role</option>

                    {ROLE_OPTIONS.map((role) => (
                      <option
                        key={role}
                        value={role}
                        className="capitalize"
                      >
                        {role}
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
                    onChange={(e) =>
                      setUniversityFilter(e.target.value)
                    }
                    className="appearance-none pl-3 pr-7 py-1.5 rounded-md text-xs bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 text-neutral-600 dark:text-neutral-300 focus:outline-none focus:border-[#B91C1C] cursor-pointer"
                  >
                    <option value="ALL">
                      Filter by University
                    </option>

                    {uniqueUniversities.map((uni) => (
                      <option key={uni} value={uni}>
                        {uni}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    size={12}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
                  />
                </div>
              </div>

              <div className="bg-white dark:bg-[#151921] rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 overflow-hidden shadow-2xs">
                {loading ? (
                  <div className="flex items-center justify-center py-16 gap-2 text-xs text-neutral-500">
                    <Loader2
                      className="animate-spin text-[#B91C1C]"
                      size={16}
                    />

                    <span>Loading staff...</span>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                          <th className="py-2.5 px-4">NAME</th>
                          <th className="py-2.5 px-4">EMAIL</th>
                          <th className="py-2.5 px-4">ROLE BADGE</th>
                          <th className="py-2.5 px-4">UNIVERSITY</th>
                          <th className="py-2.5 px-4">GENDER</th>
                          <th className="py-2.5 px-4 text-right">
                            ACTIONS
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
                        {filteredStaff.length === 0 ? (
                          <tr>
                            <td
                              colSpan={6}
                              className="text-center py-10 text-neutral-400 text-xs"
                            >
                              No staff found.
                            </td>
                          </tr>
                        ) : (
                          filteredStaff.map((person) => (
                            <tr
                              key={person._id}
                              onClick={() =>
                                setSelectedStaff(person)
                              }
                              className={`hover:bg-neutral-50/70 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer ${
                                selectedStaff?._id === person._id
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
                                    {person.fullName || "Unknown"}
                                  </span>
                                </div>
                              </td>

                              <td className="py-3 px-4 text-neutral-500 dark:text-neutral-400">
                                {person.email || "N/A"}
                              </td>

                              <td className="py-3 px-4">
                                <span
                                  className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold capitalize ${
                                    ROLE_STYLES[person.role] || ""
                                  }`}
                                >
                                  {person.role}
                                </span>
                              </td>

                              <td className="py-3 px-4 text-neutral-600 dark:text-neutral-300">
                                {person.university || "N/A"}
                              </td>

                              <td className="py-3 px-4 text-neutral-600 dark:text-neutral-300 capitalize">
                                {person.gender || "N/A"}
                              </td>

                              <td className="py-3 px-4 text-right">
                                <div className="flex items-center justify-end gap-2 text-neutral-400">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openEditForm(person);
                                    }}
                                    title="Edit"
                                    className="p-1 hover:text-[#B91C1C] transition-colors cursor-pointer"
                                  >
                                    <Pencil size={13} />
                                  </button>

                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setDeleteTarget(person);
                                    }}
                                    title="Delete"
                                    className="p-1 hover:text-[#B91C1C] transition-colors cursor-pointer"
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
                    Showing {filteredStaff.length} of {totalStaff} staff
                  </span>
                </div>
              </div>
            </div>

            {selectedStaff && (
              <div className="lg:col-span-4 bg-white dark:bg-[#151921] rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 p-5 shadow-2xs relative space-y-4 animate-in fade-in zoom-in-95 duration-200">
                <button
                  onClick={() => setSelectedStaff(null)}
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
                    {selectedStaff.fullName || "Unknown"}
                  </h3>

                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold capitalize ${
                      ROLE_STYLES[selectedStaff.role] || ""
                    }`}
                  >
                    {selectedStaff.role}
                  </span>
                </div>

                <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-800 text-xs">
                  <span className="text-[9px] font-mono font-bold tracking-wider text-neutral-400 uppercase block mb-1">
                    CONTACT INFORMATION
                  </span>

                  <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300 text-[11px]">
                    <Mail
                      size={12}
                      className="text-neutral-400 shrink-0"
                    />
                    <span>{selectedStaff.email}</span>
                  </div>

                  <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300 text-[11px]">
                    <Phone
                      size={12}
                      className="text-neutral-400 shrink-0"
                    />
                    <span>
                      {selectedStaff.phone || "N/A"}
                    </span>
                  </div>
                </div>

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
                        {selectedStaff.university || "N/A"}
                      </span>
                    </div>

                    <div className="p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/40">
                      <span className="text-[9px] text-neutral-400 block mb-0.5">
                        Gender
                      </span>

                      <span className="text-[11px] font-medium capitalize">
                        {selectedStaff.gender || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                  <button
                    onClick={() => openEditForm(selectedStaff)}
                    className="py-1.5 rounded-md border border-neutral-200 dark:border-neutral-700 text-xs font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => setDeleteTarget(selectedStaff)}
                    className="py-1.5 rounded-md border border-red-200 dark:border-red-900/50 text-[#B91C1C] text-xs font-medium hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white dark:bg-[#151921] rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200 dark:border-neutral-800">
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                  {editingStaff ? "Edit Mentor" : "Add Mentor"}
                </h3>

                <p className="text-[11px] text-neutral-400 mt-0.5">
                  {editingStaff
                    ? "Update this member's role and membership information."
                    : "Create a mentor membership from a registered mentor applicant."}
                </p>
              </div>

              <button
                onClick={closeForm}
                className="text-neutral-400 hover:text-neutral-700 dark:hover:text-white cursor-pointer"
              >
                <X size={17} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-5 space-y-5"
            >
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  Mentor User
                </label>

                {editingStaff ? (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-md text-xs bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300">
                    <User
                      size={13}
                      className="text-neutral-400 shrink-0"
                    />

                    <div className="flex flex-col">
                      <span className="font-medium">
                        {selectedUserLabel?.fullName ||
                          "Unknown user"}
                      </span>

                      <span className="text-[10px] text-neutral-400">
                        {selectedUserLabel?.email}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <div
                      onClick={() =>
                        setUserDropdownOpen((open) => !open)
                      }
                      className="flex items-center gap-2 px-3 py-2 rounded-md text-xs bg-white dark:bg-[#0E1117] border border-neutral-200 dark:border-neutral-700 cursor-pointer"
                    >
                      <Search
                        size={13}
                        className="text-neutral-400 shrink-0"
                      />

                      {selectedUserLabel ? (
                        <span className="flex-1 truncate">
                          {selectedUserLabel.fullName}{" "}
                          <span className="text-neutral-400">
                            ({selectedUserLabel.email})
                          </span>
                        </span>
                      ) : (
                        <span className="flex-1 text-neutral-400">
                          Select mentor applicant...
                        </span>
                      )}

                      <ChevronDown
                        size={12}
                        className="text-neutral-400 shrink-0"
                      />
                    </div>

                    {userDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-white dark:bg-[#151921] border border-neutral-200 dark:border-neutral-700 rounded-md shadow-lg z-20 p-1 space-y-1">
                        <div className="p-1">
                          <input
                            type="text"
                            placeholder="Search mentor applicants..."
                            value={userSearch}
                            onChange={(e) =>
                              setUserSearch(e.target.value)
                            }
                            onClick={(e) =>
                              e.stopPropagation()
                            }
                            className="w-full px-2 py-1 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded focus:outline-none"
                          />
                        </div>

                        {candidatesLoading ? (
                          <div className="py-4 text-center text-xs text-neutral-400">
                            Loading mentor applicants...
                          </div>
                        ) : filteredCandidateUsers.length === 0 ? (
                          <div className="py-4 text-center text-xs text-neutral-400">
                            No mentor applicants found.
                          </div>
                        ) : (
                          filteredCandidateUsers.map((user) => (
                            <div
                              key={user._id}
                              onClick={() => pickUser(user)}
                              className="px-2 py-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded cursor-pointer text-xs"
                            >
                              <div className="font-medium">
                                {user.fullName}
                              </div>

                              <div className="text-[10px] text-neutral-400">
                                {user.email}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    Role
                  </label>

                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-md text-xs bg-white dark:bg-[#0E1117] border border-neutral-200 dark:border-neutral-700 capitalize"
                  >
                    {ROLE_OPTIONS.map((role) => (
                      <option
                        key={role}
                        value={role}
                        className="capitalize"
                      >
                        {role}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    Status
                  </label>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-md text-xs bg-white dark:bg-[#0E1117] border border-neutral-200 dark:border-neutral-700 capitalize"
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
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  Joined At
                </label>

                <input
                  type="date"
                  name="joinedAt"
                  value={formData.joinedAt}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-md text-xs bg-white dark:bg-[#0E1117] border border-neutral-200 dark:border-neutral-700"
                />
              </div>

              <div className="w-full px-3 py-2 rounded-md bg-neutral-100 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 text-[11px] text-neutral-400">
                Member ID is generated automatically by the
                backend when the mentor is added.
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={formLoading}
                  className="px-4 py-1.5 rounded-md text-xs font-medium border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={formLoading}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-md text-xs font-medium bg-[#B91C1C] hover:bg-[#991B1B] text-white cursor-pointer"
                >
                  {formLoading && (
                    <Loader2
                      size={13}
                      className="animate-spin"
                    />
                  )}

                  <span>
                    {editingStaff ? "Save Changes" : "Add Mentor"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="w-full max-w-sm bg-white dark:bg-[#151921] rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-xl p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/50 text-[#B91C1C] flex items-center justify-center shrink-0">
                <AlertTriangle size={18} />
              </div>

              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                  Remove Staff Member
                </h3>

                <p className="text-[11px] text-neutral-400">
                  Are you sure you want to remove{" "}
                  {deleteTarget.fullName}?
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={deleteLoading}
                className="px-3 py-1.5 rounded-md text-xs font-medium border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleteLoading}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium bg-[#B91C1C] hover:bg-[#991B1B] text-white cursor-pointer"
              >
                {deleteLoading && (
                  <Loader2
                    size={12}
                    className="animate-spin"
                  />
                )}

                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

