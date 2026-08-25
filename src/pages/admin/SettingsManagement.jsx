import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  getUserProfile,
  updateUserProfile,
  changeUserPassword,
} from "../../services/profileService";
import {
  updateRegistrationStatus,
  subscribeToRegistrationStatus,
  subscribeToEditRequests,
  updateRequestStatus,
} from "../../services/firebase";
import {
  User,
  LogOut,
  Check,
  Camera,
  Mail,
  UserCheck,
  CheckCircle2,
  Calendar,
  Clock,
  BadgeCheck,
  Eye,
  EyeOff,
  Loader2,
  Power,
  GraduationCap,
  Briefcase,
  Inbox,
  XCircle,
} from "lucide-react";

export default function AdminSettings({ onLogout }) {
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");

  const [isStudentRegOpen, setIsStudentRegOpen] = useState(true);
  const [isMentorRegOpen, setIsMentorRegOpen] = useState(true);
  const [regMsg, setRegMsg] = useState("");
  const [editRequests, setEditRequests] = useState([]);

  useEffect(() => {
    const unsubReg = subscribeToRegistrationStatus((data) => {
      if (data.isStudentRegOpen !== undefined)
        setIsStudentRegOpen(data.isStudentRegOpen);
      if (data.isMentorRegOpen !== undefined)
        setIsMentorRegOpen(data.isMentorRegOpen);
    });

    const unsubReq = subscribeToEditRequests((requests) => {
      setEditRequests(requests);
    });

    return () => {
      unsubReg();
      unsubReq();
    };
  }, []);

  const toggleStudentReg = async () => {
    const nextState = !isStudentRegOpen;
    setIsStudentRegOpen(nextState);
    await updateRegistrationStatus("isStudentRegOpen", nextState);
    setRegMsg("Student registration status synced globally!");
    setTimeout(() => setRegMsg(""), 2500);
  };

  const toggleMentorReg = async () => {
    const nextState = !isMentorRegOpen;
    setIsMentorRegOpen(nextState);
    await updateRegistrationStatus("isMentorRegOpen", nextState);
    setRegMsg("Mentor registration status synced globally!");
    setTimeout(() => setRegMsg(""), 2500);
  };

  const handleRequestAction = async (requestId, status) => {
    await updateRequestStatus(requestId, status);
  };

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "Male",
    academicYear: "3rd Year",
    department: "Computer Science and Engineering",
    bio: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState({ type: "", text: "" });
  const [savingPassword, setSavingPassword] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await getUserProfile();
      setProfile(data);
      setFormData({
        fullName: data?.fullName || authUser?.fullName || "",
        email: data?.email || authUser?.email || "",
        phone: data?.phone || "",
        gender: data?.gender || "Male",
        academicYear: data?.academicYear || data?.year || "3rd Year",
        department: data?.department || "Computer Science and Engineering",
        bio: data?.bio || "",
      });
      setLoading(false);
    }
    loadData();
  }, [authUser]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg("");
    await updateUserProfile(formData);
    setProfile((prev) => ({ ...prev, ...formData }));
    setSavingProfile(false);
    setProfileMsg("Profile updated successfully!");
    setTimeout(() => setProfileMsg(""), 3000);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    setPasswordMsg({ type: "", text: "" });

    if (passwordData.newPassword.length < 8) {
      setPasswordMsg({
        type: "error",
        text: "New password must be at least 8 characters long.",
      });
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMsg({ type: "error", text: "New passwords do not match." });
      return;
    }

    setSavingPassword(true);
    await changeUserPassword(passwordData);
    setSavingPassword(false);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordMsg({ type: "success", text: "Password changed successfully!" });
    setTimeout(() => setPasswordMsg({ type: "", text: "" }), 3000);
  };

  const hasMinLen = passwordData.newPassword.length >= 8;
  const hasCase =
    /[a-z]/.test(passwordData.newPassword) &&
    /[A-Z]/.test(passwordData.newPassword);
  const hasNumber = /[0-9]/.test(passwordData.newPassword);
  const hasSpecial = /[^A-Za-z0-9]/.test(passwordData.newPassword);

  return (
    <div className="w-full font-sans bg-[#FAFBFC] dark:bg-[#0E1117] text-neutral-900 dark:text-neutral-100 transition-colors">
      <div className="flex-1 flex flex-col min-w-0">
        <main className="px-8 py-6 space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-24 gap-2 text-xs text-neutral-500">
              <Loader2 className="animate-spin text-[#B91C1C]" size={18} />
              <span>Loading admin settings...</span>
            </div>
          ) : (
            <>
              {/* Header Title */}
              <div>
                <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
                  Admin Settings & Controls
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Manage system intake controls, profile requests, and admin
                  profile.
                </p>
              </div>

              {/* ================= 1. REGISTRATION WINDOW CONTROLS ================= */}
              <div className="p-6 rounded-2xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-md shadow-neutral-200/50 dark:shadow-none space-y-4 transition-all duration-300 hover:border-[#B91C1C]/50 hover:-translate-y-0.5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-neutral-900 dark:text-white flex items-center gap-2">
                      <Power size={15} className="text-[#B91C1C]" />
                      <span>Registration Window Controls</span>
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                      Enable or disable cohort intake globally across all
                      devices.
                    </p>
                  </div>
                  {regMsg && (
                    <span className="text-xs text-emerald-600 font-semibold animate-in fade-in">
                      {regMsg}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div className="p-4 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-800/20 flex items-center justify-between gap-3 transition-all hover:border-neutral-300 dark:hover:border-neutral-700">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                        <GraduationCap size={18} />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-neutral-900 dark:text-white block">
                          Student Registration
                        </span>
                        <span
                          className={`text-[11px] font-medium ${
                            isStudentRegOpen
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-[#DC2626]"
                          }`}
                        >
                          {isStudentRegOpen
                            ? "● Intake Open"
                            : "○ Intake Closed"}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={toggleStudentReg}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none ${
                        isStudentRegOpen
                          ? "bg-[#B91C1C]"
                          : "bg-neutral-300 dark:bg-neutral-700"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                          isStudentRegOpen ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="p-4 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-800/20 flex items-center justify-between gap-3 transition-all hover:border-neutral-300 dark:hover:border-neutral-700">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                        <Briefcase size={18} />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-neutral-900 dark:text-white block">
                          Mentor Registration
                        </span>
                        <span
                          className={`text-[11px] font-medium ${
                            isMentorRegOpen
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-[#DC2626]"
                          }`}
                        >
                          {isMentorRegOpen
                            ? "● Intake Open"
                            : "○ Intake Closed"}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={toggleMentorReg}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none ${
                        isMentorRegOpen
                          ? "bg-[#B91C1C]"
                          : "bg-neutral-300 dark:bg-neutral-700"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                          isMentorRegOpen ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* ================= 2. PENDING PROFILE EDIT REQUESTS ================= */}
              <div className="p-6 rounded-2xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-md shadow-neutral-200/50 dark:shadow-none space-y-4 transition-all duration-300 hover:border-[#B91C1C]/50 hover:-translate-y-0.5">
                <div>
                  <h3 className="font-bold text-sm text-neutral-900 dark:text-white flex items-center gap-2">
                    <Inbox size={15} className="text-[#B91C1C]" />
                    <span>
                      Pending Profile Edit Requests (
                      {
                        editRequests.filter((r) => r.status === "Pending")
                          .length
                      }
                      )
                    </span>
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    Review submitted information changes from students and
                    mentors.
                  </p>
                </div>

                {editRequests.length === 0 ? (
                  <div className="py-8 text-center text-xs text-neutral-400 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl">
                    No correction requests submitted yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {editRequests.map((req) => (
                      <div
                        key={req.id}
                        className="p-4 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-800/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all hover:border-neutral-300 dark:hover:border-neutral-700"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-neutral-900 dark:text-white">
                              {req.currentName}
                            </span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300">
                              ID: {req.studentId}
                            </span>
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-lg ${
                                req.status === "Pending"
                                  ? "bg-amber-500/10 text-amber-600"
                                  : req.status === "Approved"
                                    ? "bg-emerald-500/10 text-emerald-600"
                                    : "bg-red-500/10 text-red-600"
                              }`}
                            >
                              {req.status}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-700 dark:text-neutral-300">
                            Requested Change:{" "}
                            <span className="font-semibold text-primary">
                              {req.requestedField}
                            </span>{" "}
                            ➔{" "}
                            <span className="font-bold underline">
                              {req.requestedValue}
                            </span>
                          </p>
                          <p className="text-[11px] text-neutral-500 italic">
                            Reason: "{req.reason}"
                          </p>
                        </div>

                        {req.status === "Pending" && (
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() =>
                                handleRequestAction(req.id, "Approved")
                              }
                              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                            >
                              <CheckCircle2 size={13} />
                              <span>Approve</span>
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                handleRequestAction(req.id, "Rejected")
                              }
                              className="px-3.5 py-1.5 rounded-xl border border-red-200 dark:border-red-900 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                            >
                              <XCircle size={13} />
                              <span>Reject</span>
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ================= 3. ADMIN PROFILE INFORMATION ================= */}
              <div className="p-6 rounded-2xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-md shadow-neutral-200/50 dark:shadow-none space-y-5 transition-all duration-300 hover:border-[#B91C1C]/50 hover:-translate-y-0.5">
                <div>
                  <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
                    Admin Profile Information
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    Update your administrative account details.
                  </p>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-5">
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="flex flex-col items-center gap-2.5 w-full md:w-44 shrink-0">
                      <div className="relative w-24 h-24 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center overflow-hidden">
                        <User
                          size={46}
                          className="text-neutral-400 dark:text-neutral-500"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="absolute bottom-1 right-1 p-1.5 rounded-full bg-[#B91C1C] hover:bg-[#991B1B] text-white transition-colors shadow-xs cursor-pointer"
                          title="Upload avatar"
                        >
                          <Camera size={13} />
                        </button>
                      </div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>

                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                      <div>
                        <label className="text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleProfileChange}
                          required
                          className="w-full px-3.5 py-2 rounded-xl text-xs bg-neutral-50/50 dark:bg-[#0E1117] border border-neutral-200/80 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:border-[#B91C1C] transition-colors shadow-xs"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          disabled
                          className="w-full px-3.5 py-2 rounded-xl text-xs bg-neutral-100/70 dark:bg-neutral-800/50 border border-neutral-200/60 dark:border-neutral-800 text-neutral-500 cursor-not-allowed shadow-xs"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                          Phone Number
                        </label>
                        <input
                          type="text"
                          name="phone"
                          value={formData.phone}
                          onChange={handleProfileChange}
                          className="w-full px-3.5 py-2 rounded-xl text-xs bg-neutral-50/50 dark:bg-[#0E1117] border border-neutral-200/80 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:border-[#B91C1C] transition-colors shadow-xs"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                          Department
                        </label>
                        <input
                          type="text"
                          name="department"
                          value={formData.department}
                          onChange={handleProfileChange}
                          className="w-full px-3.5 py-2 rounded-xl text-xs bg-neutral-50/50 dark:bg-[#0E1117] border border-neutral-200/80 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:border-[#B91C1C] transition-colors shadow-xs"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    {profileMsg && (
                      <span className="text-xs text-emerald-600 font-medium">
                        {profileMsg}
                      </span>
                    )}
                    <button
                      type="submit"
                      disabled={savingProfile}
                      className="ml-auto px-4 py-2 rounded-xl bg-[#B91C1C] hover:bg-[#991B1B] text-white text-xs font-medium transition-all duration-300 cursor-pointer shadow-md shadow-red-500/10 hover:-translate-y-0.5"
                    >
                      {savingProfile ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              </div>

              {/* ================= 4. CHANGE PASSWORD ================= */}
              <div className="p-6 rounded-2xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-md shadow-neutral-200/50 dark:shadow-none space-y-4 transition-all duration-300 hover:border-[#B91C1C]/50 hover:-translate-y-0.5">
                <div>
                  <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
                    Change Password
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    Update your password to keep your account secure.
                  </p>
                </div>

                <form onSubmit={handleSavePassword} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrent ? "text" : "password"}
                          name="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          required
                          placeholder="••••••••"
                          className="w-full pl-3.5 pr-9 py-2 rounded-xl text-xs bg-neutral-50/50 dark:bg-[#0E1117] border border-neutral-200/80 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:border-[#B91C1C] transition-colors shadow-xs"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrent(!showCurrent)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 cursor-pointer"
                        >
                          {showCurrent ? (
                            <EyeOff size={13} />
                          ) : (
                            <Eye size={13} />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showNew ? "text" : "password"}
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          required
                          placeholder="••••••••"
                          className="w-full pl-3.5 pr-9 py-2 rounded-xl text-xs bg-neutral-50/50 dark:bg-[#0E1117] border border-neutral-200/80 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:border-[#B91C1C] transition-colors shadow-xs"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNew(!showNew)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 cursor-pointer"
                        >
                          {showNew ? <EyeOff size={13} /> : <Eye size={13} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirm ? "text" : "password"}
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          required
                          placeholder="••••••••"
                          className="w-full pl-3.5 pr-9 py-2 rounded-xl text-xs bg-neutral-50/50 dark:bg-[#0E1117] border border-neutral-200/80 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:border-[#B91C1C] transition-colors shadow-xs"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm(!showConfirm)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 cursor-pointer"
                        >
                          {showConfirm ? (
                            <EyeOff size={13} />
                          ) : (
                            <Eye size={13} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    {passwordMsg.text && (
                      <span
                        className={`text-xs font-medium ${
                          passwordMsg.type === "error"
                            ? "text-[#DC2626]"
                            : "text-emerald-600"
                        }`}
                      >
                        {passwordMsg.text}
                      </span>
                    )}
                    <button
                      type="submit"
                      disabled={savingPassword}
                      className="ml-auto px-4 py-2 rounded-xl bg-[#B91C1C] hover:bg-[#991B1B] text-white text-xs font-medium cursor-pointer shadow-md shadow-red-500/10 hover:-translate-y-0.5 transition-all"
                    >
                      {savingPassword ? "Updating..." : "Change Password"}
                    </button>
                  </div>
                </form>
              </div>

              {/* ================= 5. LOGOUT ================= */}
              <div className="p-6 rounded-2xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-md shadow-neutral-200/50 dark:shadow-none flex items-center justify-between transition-all duration-300 hover:border-[#B91C1C]/50 hover:-translate-y-0.5">
                <div>
                  <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
                    Logout
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    Sign out of admin portal.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onLogout}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-neutral-200/80 dark:border-neutral-700 text-xs font-medium text-[#B91C1C] hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer shadow-xs transition-colors"
                >
                  <LogOut size={13} />
                  <span>Logout</span>
                </button>
              </div>

              <div className="text-center py-2 text-[11px] text-neutral-400">
                © 2026 ASTU MSJ Management Portal. All rights reserved.
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
