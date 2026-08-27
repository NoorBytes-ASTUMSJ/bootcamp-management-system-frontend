import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  getUserProfile,
  changeUserPassword,
} from "../../services/profileService";
import EditRequestModal from "../../components/modals/EditRequestModal";
import {
  User,
  LogOut,
  Check,
  Mail,
  UserCheck,
  CheckCircle2,
  Calendar,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
} from "lucide-react";

export default function StudentSettings({ onLogout }) {
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);

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
    <div className="flex h-screen w-full font-sans overflow-hidden bg-[#FAFBFC] dark:bg-[#0E1117] text-neutral-900 dark:text-neutral-100 transition-colors">
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#FAFBFC] dark:bg-[#0E1117]">
        <main className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-24 gap-2 text-xs text-neutral-500">
              <Loader2 className="animate-spin text-[#B91C1C]" size={18} />
              <span>Loading settings...</span>
            </div>
          ) : (
            <>
              {/* Header Title */}
              <div>
                <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
                  Account Settings
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Manage your account credentials and security settings.
                </p>
              </div>

              {/* ================= 1. PROFILE INFORMATION ================= */}
              <div className="p-6 rounded-2xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-md shadow-neutral-200/50 dark:shadow-none space-y-5 transition-all duration-300 hover:border-[#B91C1C]/50 hover:-translate-y-0.5">
                <div>
                  <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
                    Profile Information
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    View your verified profile credentials.
                  </p>
                </div>

                {/* Locked Banner & Request Correction Button */}
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <AlertCircle
                      size={18}
                      className="text-amber-600 shrink-0"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-neutral-900 dark:text-white">
                        Direct profile editing is locked
                      </h4>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                        To protect cohort records, submit an admin review
                        request to update your credentials.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowEditModal(true)}
                    className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold transition-colors shrink-0 cursor-pointer shadow-xs"
                  >
                    Request Correction
                  </button>
                </div>

                {/* Read-Only Form View */}
                <div className="space-y-5">
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="flex flex-col items-center gap-2.5 w-full md:w-44 shrink-0">
                      <div className="relative w-24 h-24 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center overflow-hidden">
                        <User
                          size={46}
                          className="text-neutral-400 dark:text-neutral-500"
                        />
                      </div>
                    </div>

                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                      <div>
                        <label className="text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          disabled
                          value={formData.fullName}
                          className="w-full px-3 py-1.5 rounded-md text-xs bg-neutral-100/70 dark:bg-neutral-800/50 border border-neutral-200/60 dark:border-neutral-800 text-neutral-500 cursor-not-allowed"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          disabled
                          value={formData.email}
                          className="w-full px-3 py-1.5 rounded-md text-xs bg-neutral-100/70 dark:bg-neutral-800/50 border border-neutral-200/60 dark:border-neutral-800 text-neutral-500 cursor-not-allowed"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                          Phone Number
                        </label>
                        <input
                          type="text"
                          disabled
                          value={formData.phone || "N/A"}
                          className="w-full px-3 py-1.5 rounded-md text-xs bg-neutral-100/70 dark:bg-neutral-800/50 border border-neutral-200/60 dark:border-neutral-800 text-neutral-500 cursor-not-allowed"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                          Department
                        </label>
                        <input
                          type="text"
                          disabled
                          value={formData.department}
                          className="w-full px-3 py-1.5 rounded-md text-xs bg-neutral-100/70 dark:bg-neutral-800/50 border border-neutral-200/60 dark:border-neutral-800 text-neutral-500 cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ================= 2. ACCOUNT INFORMATION ================= */}
              <div className="p-6 rounded-2xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-md shadow-neutral-200/50 dark:shadow-none space-y-4 transition-all duration-300 hover:border-[#B91C1C]/50 hover:-translate-y-0.5">
                <div>
                  <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
                    Account Information
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    View your account details and status.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
                  <div className="p-3.5 rounded-lg border border-neutral-200/70 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-800/20 flex items-center gap-3 transition-all hover:border-neutral-300 dark:hover:border-neutral-700">
                    <div className="w-9 h-9 rounded-lg bg-red-50 dark:bg-red-950/40 flex items-center justify-center text-[#B91C1C] shrink-0">
                      <Mail size={16} />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 block">
                        EMAIL ADDRESS
                      </span>
                      <span className="text-xs font-medium text-neutral-800 dark:text-neutral-200 truncate block">
                        {formData.email}
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg border border-neutral-200/70 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-800/20 flex items-center gap-3 transition-all hover:border-neutral-300 dark:hover:border-neutral-700">
                    <div className="w-9 h-9 rounded-lg bg-red-50 dark:bg-red-950/40 flex items-center justify-center text-[#B91C1C] shrink-0">
                      <UserCheck size={16} />
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 block">
                        ROLE
                      </span>
                      <span className="text-xs font-medium text-neutral-800 dark:text-neutral-200 block capitalize">
                        {authUser?.role || "User"}
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg border border-neutral-200/70 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-800/20 flex items-center gap-3 transition-all hover:border-neutral-300 dark:hover:border-neutral-700">
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 shrink-0">
                      <CheckCircle2 size={16} />
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 block">
                        ACCOUNT STATUS
                      </span>
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/40 mt-0.5">
                        {profile?.accountStatus || "Active"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ================= 3. CHANGE PASSWORD ================= */}
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
                          className="w-full pl-3 pr-8 py-1.5 rounded-md text-xs bg-neutral-50/40 dark:bg-[#0E1117] border border-neutral-200/80 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:border-[#B91C1C] transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrent(!showCurrent)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 cursor-pointer"
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
                          className="w-full pl-3 pr-8 py-1.5 rounded-md text-xs bg-neutral-50/40 dark:bg-[#0E1117] border border-neutral-200/80 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:border-[#B91C1C] transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNew(!showNew)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 cursor-pointer"
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
                          className="w-full pl-3 pr-8 py-1.5 rounded-md text-xs bg-neutral-50/40 dark:bg-[#0E1117] border border-neutral-200/80 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:border-[#B91C1C] transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm(!showConfirm)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 cursor-pointer"
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

                  <div className="p-3 rounded-lg border border-neutral-200/70 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-800/20 text-xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1.5">
                      Password Requirements:
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                      <span
                        className={`flex items-center gap-1.5 ${hasMinLen ? "text-emerald-600 font-medium" : "text-neutral-400"}`}
                      >
                        <Check size={11} /> At least 8 characters long
                      </span>
                      <span
                        className={`flex items-center gap-1.5 ${hasCase ? "text-emerald-600 font-medium" : "text-neutral-400"}`}
                      >
                        <Check size={11} /> Uppercase & lowercase
                      </span>
                      <span
                        className={`flex items-center gap-1.5 ${hasNumber ? "text-emerald-600 font-medium" : "text-neutral-400"}`}
                      >
                        <Check size={11} /> Include a number
                      </span>
                      <span
                        className={`flex items-center gap-1.5 ${hasSpecial ? "text-emerald-600 font-medium" : "text-neutral-400"}`}
                      >
                        <Check size={11} /> Special character
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    {passwordMsg.text && (
                      <span
                        className={`text-xs font-medium ${passwordMsg.type === "error" ? "text-[#DC2626]" : "text-emerald-600"}`}
                      >
                        {passwordMsg.text}
                      </span>
                    )}
                    <button
                      type="submit"
                      disabled={savingPassword}
                      className="ml-auto px-4 py-1.5 rounded-md bg-[#B91C1C] hover:bg-[#991B1B] text-white text-xs font-medium cursor-pointer shadow-xs"
                    >
                      {savingPassword ? "Updating..." : "Change Password"}
                    </button>
                  </div>
                </form>
              </div>

              {/* ================= 4. LOGOUT ================= */}
              <div className="p-6 rounded-2xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-md shadow-neutral-200/50 dark:shadow-none flex items-center justify-between transition-all duration-300 hover:border-[#B91C1C]/50 hover:-translate-y-0.5">
                <div>
                  <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
                    Logout
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    Sign out of your account on this device.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onLogout}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-md border border-neutral-200/80 dark:border-neutral-700 text-xs font-medium text-[#B91C1C] hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer shadow-xs"
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

      {showEditModal && (
        <EditRequestModal
          user={profile || authUser}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </div>
  );
}
