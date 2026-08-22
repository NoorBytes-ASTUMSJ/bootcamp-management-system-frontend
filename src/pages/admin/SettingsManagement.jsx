import React, { useState, useEffect, useRef } from "react";
import AdminSidebar from "../../components/layout/AdminSidebar";
import {
  getUserProfile,
  updateUserProfile,
  changeUserPassword,
} from "../../services/profileService";
import {
  Bell,
  User,
  Moon,
  Sun,
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
  ChevronDown,
} from "lucide-react";

export default function SettingsManagement({
  isDarkMode,
  onToggleTheme,
  onNavigateAdminView,
  onLogout,
}) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");

  // Form State for Profile (1)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "Male",
    academicYear: "3rd Year",
    department: "Computer Science and Engineering",
    bio: "",
  });

  // Form State for Password Change (3)
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

  // Profile dropdown state
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const fileInputRef = useRef(null);

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
      const data = await getUserProfile();
      setProfile(data);
      setFormData({
        fullName: data.fullName || "",
        email: data.email || "",
        phone: data.phone || "",
        gender: data.gender || "Male",
        academicYear: data.academicYear || "3rd Year",
        department: data.department || "Computer Science and Engineering",
        bio: data.bio || "",
      });
      setLoading(false);
    }
    loadData();
  }, []);

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

  // Password rules validation
  const hasMinLen = passwordData.newPassword.length >= 8;
  const hasCase =
    /[a-z]/.test(passwordData.newPassword) &&
    /[A-Z]/.test(passwordData.newPassword);
  const hasNumber = /[0-9]/.test(passwordData.newPassword);
  const hasSpecial = /[^A-Za-z0-9]/.test(passwordData.newPassword);

  return (
    <div className="flex h-screen w-full font-sans overflow-hidden bg-[#FAFBFC] dark:bg-[#0E1117] text-neutral-900 dark:text-neutral-100 transition-colors">
   
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#FAFBFC] dark:bg-[#0E1117]">
        {/* Top Header */}
       
        {/* Content Body */}
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
                  Settings
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Manage your account, preferences, and security settings.
                </p>
              </div>

              {/* ================= SECTION 1: PROFILE INFORMATION ================= */}
              <div className="p-6 rounded-xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-2xs space-y-5 transition-all duration-300 hover:border-[#B91C1C]/40 hover:shadow-sm">
                <div>
                  <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
                    1. Profile Information
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    Update your personal information and profile details.
                  </p>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-5">
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    {/* Avatar Upload */}
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
                      <div className="text-center">
                        <span className="text-[10px] text-neutral-400 block leading-tight">
                          JPG, PNG or WEBP
                        </span>
                        <span className="text-[10px] text-neutral-400 block leading-tight">
                          Max size 2MB
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1 rounded-md border border-neutral-200/80 dark:border-neutral-700 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:border-[#B91C1C]/40 hover:text-[#B91C1C] transition-colors cursor-pointer"
                      >
                        Change Photo
                      </button>
                    </div>

                    {/* Inputs Grid */}
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
                          className="w-full px-3 py-1.5 rounded-md text-xs bg-neutral-50/40 dark:bg-[#0E1117] border border-neutral-200/80 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:border-[#B91C1C] transition-colors"
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
                          className="w-full px-3 py-1.5 rounded-md text-xs bg-neutral-100/70 dark:bg-neutral-800/50 border border-neutral-200/60 dark:border-neutral-800 text-neutral-500 cursor-not-allowed"
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
                          className="w-full px-3 py-1.5 rounded-md text-xs bg-neutral-50/40 dark:bg-[#0E1117] border border-neutral-200/80 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:border-[#B91C1C] transition-colors"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                          Gender
                        </label>
                        <div className="relative">
                          <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleProfileChange}
                            className="appearance-none w-full px-3 pr-8 py-1.5 rounded-md text-xs bg-neutral-50/40 dark:bg-[#0E1117] border border-neutral-200/80 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:border-[#B91C1C] transition-colors cursor-pointer"
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                          </select>
                          <ChevronDown
                            size={12}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                          Academic Year
                        </label>
                        <div className="relative">
                          <select
                            name="academicYear"
                            value={formData.academicYear}
                            onChange={handleProfileChange}
                            className="appearance-none w-full px-3 pr-8 py-1.5 rounded-md text-xs bg-neutral-50/40 dark:bg-[#0E1117] border border-neutral-200/80 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:border-[#B91C1C] transition-colors cursor-pointer"
                          >
                            <option value="1st Year">1st Year</option>
                            <option value="2nd Year">2nd Year</option>
                            <option value="3rd Year">3rd Year</option>
                            <option value="4th Year">4th Year</option>
                            <option value="5th Year">5th Year</option>
                            <option value="Graduate">Graduate</option>
                          </select>
                          <ChevronDown
                            size={12}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                          Department
                        </label>
                        <div className="relative">
                          <select
                            name="department"
                            value={formData.department}
                            onChange={handleProfileChange}
                            className="appearance-none w-full px-3 pr-8 py-1.5 rounded-md text-xs bg-neutral-50/40 dark:bg-[#0E1117] border border-neutral-200/80 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:border-[#B91C1C] transition-colors cursor-pointer"
                          >
                            <option value="Computer Science and Engineering">
                              Computer Science and Engineering
                            </option>
                            <option value="Software Engineering">
                              Software Engineering
                            </option>
                            <option value="Electrical & Electronics">
                              Electrical & Electronics
                            </option>
                          </select>
                          <ChevronDown
                            size={12}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                      Bio / About You (Optional)
                    </label>
                    <textarea
                      name="bio"
                      rows={3}
                      value={formData.bio}
                      onChange={handleProfileChange}
                      placeholder="Share a short bio..."
                      className="w-full px-3 py-2 rounded-md text-xs bg-neutral-50/40 dark:bg-[#0E1117] border border-neutral-200/80 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:border-[#B91C1C] transition-colors resize-none"
                    />
                  </div>

                  {/* Submit Row */}
                  <div className="flex items-center justify-between pt-2">
                    {profileMsg && (
                      <span className="text-xs text-emerald-600 font-medium">
                        {profileMsg}
                      </span>
                    )}
                    <button
                      type="submit"
                      disabled={savingProfile}
                      className="ml-auto px-4 py-1.5 rounded-md bg-[#B91C1C] hover:bg-[#991B1B] text-white text-xs font-medium transition-colors cursor-pointer shadow-2xs"
                    >
                      {savingProfile ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              </div>

              {/* ================= SECTION 2: ACCOUNT INFORMATION ================= */}
              <div className="p-6 rounded-xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-2xs space-y-4 transition-all duration-300 hover:border-[#B91C1C]/40 hover:shadow-sm">
                <div>
                  <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
                    2. Account Information
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    View your account details and status.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
                  {/* 1. Email Address */}
                  <div className="p-3.5 rounded-lg border border-neutral-200/70 dark:border-neutral-800 bg-neutral-50/30 dark:bg-neutral-800/20 flex items-center gap-3 transition-all duration-200 hover:border-[#B91C1C]/40 hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40">
                    <div className="w-9 h-9 rounded-lg bg-red-50 dark:bg-red-950/40 flex items-center justify-center text-[#B91C1C] shrink-0">
                      <Mail size={16} />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 block">
                        EMAIL ADDRESS
                      </span>
                      <span className="text-xs font-medium text-neutral-800 dark:text-neutral-200 truncate block">
                        {profile?.email || "miftahudin.mohammed@astu.edu.et"}
                      </span>
                    </div>
                  </div>

                  {/* 2. Role */}
                  <div className="p-3.5 rounded-lg border border-neutral-200/70 dark:border-neutral-800 bg-neutral-50/30 dark:bg-neutral-800/20 flex items-center gap-3 transition-all duration-200 hover:border-[#B91C1C]/40 hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40">
                    <div className="w-9 h-9 rounded-lg bg-red-50 dark:bg-red-950/40 flex items-center justify-center text-[#B91C1C] shrink-0">
                      <UserCheck size={16} />
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 block">
                        ROLE
                      </span>
                      <span className="text-xs font-medium text-neutral-800 dark:text-neutral-200 block">
                        {profile?.role || "Admin"}
                      </span>
                    </div>
                  </div>

                  {/* 3. Account Status */}
                  <div className="p-3.5 rounded-lg border border-neutral-200/70 dark:border-neutral-800 bg-neutral-50/30 dark:bg-neutral-800/20 flex items-center gap-3 transition-all duration-200 hover:border-[#B91C1C]/40 hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40">
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

                  {/* 4. Joined Date */}
                  <div className="p-3.5 rounded-lg border border-neutral-200/70 dark:border-neutral-800 bg-neutral-50/30 dark:bg-neutral-800/20 flex items-center gap-3 transition-all duration-200 hover:border-[#B91C1C]/40 hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40">
                    <div className="w-9 h-9 rounded-lg bg-red-50 dark:bg-red-950/40 flex items-center justify-center text-[#B91C1C] shrink-0">
                      <Calendar size={16} />
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 block">
                        JOINED DATE
                      </span>
                      <span className="text-xs font-medium text-neutral-800 dark:text-neutral-200 block">
                        {profile?.joinedDate || "July 15, 2024"}
                      </span>
                    </div>
                  </div>

                  {/* 5. Last Login */}
                  <div className="p-3.5 rounded-lg border border-neutral-200/70 dark:border-neutral-800 bg-neutral-50/30 dark:bg-neutral-800/20 flex items-center gap-3 transition-all duration-200 hover:border-[#B91C1C]/40 hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40">
                    <div className="w-9 h-9 rounded-lg bg-red-50 dark:bg-red-950/40 flex items-center justify-center text-[#B91C1C] shrink-0">
                      <Clock size={16} />
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 block">
                        LAST LOGIN
                      </span>
                      <span className="text-xs font-medium text-neutral-800 dark:text-neutral-200 block">
                        {profile?.lastLogin || "Aug 21, 2026, 10:30 PM"}
                      </span>
                    </div>
                  </div>

                  {/* 6. User ID */}
                  <div className="p-3.5 rounded-lg border border-neutral-200/70 dark:border-neutral-800 bg-neutral-50/30 dark:bg-neutral-800/20 flex items-center gap-3 transition-all duration-200 hover:border-[#B91C1C]/40 hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40">
                    <div className="w-9 h-9 rounded-lg bg-red-50 dark:bg-red-950/40 flex items-center justify-center text-[#B91C1C] shrink-0">
                      <BadgeCheck size={16} />
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 block">
                        USER ID
                      </span>
                      <span className="text-xs font-medium text-neutral-800 dark:text-neutral-200 block">
                        {profile?.userId || "ADM-2024-0012"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ================= SECTION 3: CHANGE PASSWORD ================= */}
              <div className="p-6 rounded-xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-2xs space-y-4 transition-all duration-300 hover:border-[#B91C1C]/40 hover:shadow-sm">
                <div>
                  <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
                    3. Change Password
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    Update your password to keep your account secure.
                  </p>
                </div>

                <form onSubmit={handleSavePassword} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Current Password */}
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
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 cursor-pointer"
                        >
                          {showCurrent ? (
                            <EyeOff size={13} />
                          ) : (
                            <Eye size={13} />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* New Password */}
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
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 cursor-pointer"
                        >
                          {showNew ? <EyeOff size={13} /> : <Eye size={13} />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm New Password */}
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
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 cursor-pointer"
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

                  {/* Password requirements banner */}
                  <div className="p-3 rounded-lg border border-neutral-200/70 dark:border-neutral-800 bg-neutral-50/40 dark:bg-neutral-800/20 text-xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1.5">
                      Password Requirements:
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                      <span
                        className={`flex items-center gap-1.5 ${
                          hasMinLen
                            ? "text-emerald-600 font-medium"
                            : "text-neutral-400"
                        }`}
                      >
                        <Check size={11} /> At least 8 characters long
                      </span>
                      <span
                        className={`flex items-center gap-1.5 ${
                          hasCase
                            ? "text-emerald-600 font-medium"
                            : "text-neutral-400"
                        }`}
                      >
                        <Check size={11} /> Uppercase & lowercase
                      </span>
                      <span
                        className={`flex items-center gap-1.5 ${
                          hasNumber
                            ? "text-emerald-600 font-medium"
                            : "text-neutral-400"
                        }`}
                      >
                        <Check size={11} /> Include a number
                      </span>
                      <span
                        className={`flex items-center gap-1.5 ${
                          hasSpecial
                            ? "text-emerald-600 font-medium"
                            : "text-neutral-400"
                        }`}
                      >
                        <Check size={11} /> Special character
                      </span>
                    </div>
                  </div>

                  {/* Submit Row */}
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
                      className="ml-auto px-4 py-1.5 rounded-md bg-[#B91C1C] hover:bg-[#991B1B] text-white text-xs font-medium transition-colors cursor-pointer shadow-2xs"
                    >
                      {savingPassword ? "Updating..." : "Change Password"}
                    </button>
                  </div>
                </form>
              </div>

              {/* ================= SECTION 4: LOGOUT ================= */}
              <div className="p-6 rounded-xl bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300 hover:border-[#B91C1C]/40 hover:shadow-sm">
                <div>
                  <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
                    4. Logout
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    Sign out of your account on this device.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onLogout}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-md border border-neutral-200/80 dark:border-neutral-700 text-xs font-medium text-[#B91C1C] hover:bg-red-50 dark:hover:bg-red-950/30 hover:border-[#B91C1C]/60 transition-colors cursor-pointer shadow-2xs shrink-0"
                >
                  <LogOut size={13} />
                  <span>Logout</span>
                </button>
              </div>

              {/* Footer text */}
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
