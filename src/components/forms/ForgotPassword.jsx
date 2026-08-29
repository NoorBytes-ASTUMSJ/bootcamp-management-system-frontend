import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  requestPasswordResetOTP,
  verifyOTPAndResetPassword,
} from "../../services/api";
import {
  Mail,
  KeyRound,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const res = await requestPasswordResetOTP(email);
      setSuccessMsg(res.message || "OTP code sent to your email!");
      setStep(2);
    } catch (err) {
      // አዲሱ የተስተካከለ የ Error አያያዝ ሎጂክ
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to send verification code. Please check your connection.";
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (newPassword.length < 8) {
      setErrorMsg("Password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await verifyOTPAndResetPassword({ email, otp, newPassword });
      setSuccessMsg(
        res.message || "Password reset successful! Redirecting to login...",
      );
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message ||
          err.message ||
          "Failed to reset password.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFBFC] dark:bg-[#0E1117] px-4 py-8">
      <div className="w-full max-w-md bg-white dark:bg-[#151921] border border-neutral-200 dark:border-neutral-800 p-8 rounded-2xl shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-red-50 dark:bg-red-950/40 text-[#B91C1C] rounded-2xl flex items-center justify-center mx-auto border border-red-100 dark:border-red-900/40">
            {step === 1 ? <Mail size={22} /> : <KeyRound size={22} />}
          </div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
            {step === 1 ? "Forgot Password" : "Enter Verification Code"}
          </h2>
          <p className="text-xs text-neutral-500">
            {step === 1
              ? "Enter your registered email and we'll send you a 6-digit OTP code."
              : `Enter the 6-digit code sent to ${email} and your new password.`}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl flex items-center gap-2 text-xs text-red-600 dark:text-red-400">
            <AlertCircle size={15} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 rounded-xl flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 size={15} className="shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div>
              <label className="text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-neutral-50 dark:bg-[#0E1117] border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-[#B91C1C]"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-[#B91C1C] hover:bg-[#991B1B] text-white text-xs font-semibold cursor-pointer transition-all flex items-center justify-center gap-2 shadow-md shadow-red-500/10"
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              <span>
                {loading ? "Sending Code..." : "Send Verification Code"}
              </span>
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                6-Digit OTP Code
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                className="w-full px-3.5 py-2.5 text-center text-base tracking-widest font-mono rounded-xl bg-neutral-50 dark:bg-[#0E1117] border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-[#B91C1C]"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full pl-3.5 pr-9 py-2.5 rounded-xl text-xs bg-neutral-50 dark:bg-[#0E1117] border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-[#B91C1C]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                Confirm New Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-neutral-50 dark:bg-[#0E1117] border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-[#B91C1C]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-[#B91C1C] hover:bg-[#991B1B] text-white text-xs font-semibold cursor-pointer transition-all flex items-center justify-center gap-2 shadow-md shadow-red-500/10"
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              <span>
                {loading ? "Resetting Password..." : "Reset Password"}
              </span>
            </button>
          </form>
        )}

        <div className="pt-2 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
          >
            <ArrowLeft size={13} />
            <span>Back to Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
