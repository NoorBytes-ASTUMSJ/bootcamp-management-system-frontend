import React, { useState } from "react";
import { sendProfileEditRequest } from "../../services/firebase";
import { Send, Loader2, AlertCircle, X, CheckCircle2 } from "lucide-react";

export default function EditRequestModal({ user, onClose }) {
  const [requestedField, setRequestedField] = useState("Full Name");
  const [requestedValue, setRequestedValue] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const isMentor = (user?.role || "").toLowerCase() === "mentor";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await sendProfileEditRequest({
      userId: user?._id || user?.id || "N/A",
      studentId: user?.studentId || user?.userId || "N/A",
      currentName: user?.fullName || "Applicant",
      email: user?.email || "",
      role: user?.role || "Student",
      requestedField,
      requestedValue: requestedValue.trim(),
      reason: reason.trim(),
    });

    setLoading(false);
    if (res.success) {
      setSuccess(true);
      setTimeout(() => onClose(), 2000);
    } else {
      setError("Failed to submit request. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#151921] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer disabled:opacity-40"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
            <AlertCircle size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
              Request Profile Correction
            </h3>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
              Submit your correction request for admin review and approval.
            </p>
          </div>
        </div>

        {success ? (
          <div className="py-8 flex flex-col items-center justify-center gap-2 text-center animate-in zoom-in-95 duration-200">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 size={22} />
            </div>
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              Request submitted successfully!
            </p>
            <span className="text-[10px] text-neutral-400">
              Admins will review and update your credentials.
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {error && (
              <div className="p-2.5 rounded-lg bg-red-500/10 text-red-500 text-xs border border-red-500/20 animate-in fade-in">
                {error}
              </div>
            )}

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                Field to Update
              </label>
              <select
                value={requestedField}
                onChange={(e) => setRequestedField(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-xs bg-neutral-50 dark:bg-[#0E1117] border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 outline-none focus:border-[#B91C1C] transition-colors cursor-pointer"
              >
                <option value="Full Name">Full Name</option>
                <option value={isMentor ? "Staff / Student ID" : "Student ID"}>
                  {isMentor ? "Staff / Student ID" : "Student ID"}
                </option>
                <option value="Department">Department</option>
                <option value="Academic Year">Academic Year / Status</option>
                {isMentor && (
                  <option value="Mentorship Track">Mentorship Track</option>
                )}
                <option value="Phone Number">Phone Number</option>
                <option value="Other">Other Information</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                Correct Value / New Information
              </label>
              <input
                type="text"
                required
                value={requestedValue}
                onChange={(e) => setRequestedValue(e.target.value)}
                placeholder="e.g. Correct full spelling or title"
                className="w-full px-3 py-2 rounded-lg text-xs bg-neutral-50 dark:bg-[#0E1117] border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 outline-none focus:border-[#B91C1C] transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                Reason for change
              </label>
              <textarea
                rows={2}
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Typo during initial registration"
                className="w-full px-3 py-2 rounded-lg text-xs bg-neutral-50 dark:bg-[#0E1117] border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 outline-none focus:border-[#B91C1C] transition-colors resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-3.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-1.5 rounded-lg bg-[#B91C1C] hover:bg-[#991B1B] text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send size={13} />
                    <span>Submit</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
