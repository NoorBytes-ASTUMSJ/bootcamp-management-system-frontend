import React, { useEffect, useMemo, useState } from "react";
import {
  FiSearch,
  FiUsers,
  FiStar,
  FiEye,
  FiX,
  FiMail,
  FiPhone,
  FiBookOpen,
  FiCalendar,
  FiLock,
} from "react-icons/fi";
import {
  getMentorBatchMembers,
  getMyStudentDetail,
} from "../../services/studentService";

// Helper to get the logged-in user ID from localStorage
function getCurrentUserId() {
  try {
    const stored = localStorage.getItem("user");
    if (!stored) return null;

    const parsed = JSON.parse(stored);
    return parsed?._id || parsed?.id || null;
  } catch {
    return null;
  }
}

// Helper to convert long university names to clean acronyms
function getUniversityAcronym(uniName) {
  if (!uniName) return "N/A";
  const upper = uniName.toUpperCase();
  if (upper.includes("ADAMA")) return "ASTU";
  if (upper.includes("ADDIS ABABA")) return "AAU";
  if (upper.includes("JIMMA")) return "JU";
  if (upper.includes("BAHIRDAR") || upper.includes("BAHIR DAR")) return "BDU";
  if (upper.includes("HAWASSA")) return "HU";
  if (upper.includes("HARAMAYA")) return "HRU";
  if (upper.includes("ARBA MINCH")) return "AMU";
  return uniName.length > 10
    ? uniName.substring(0, 8).toUpperCase() + "..."
    : uniName;
}

export default function AllMembers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showOnlyMyGroup, setShowOnlyMyGroup] = useState(false);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Student detail modal states
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");

  // Fetch mentor batch members on mount
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getMentorBatchMembers();
        setMembers(data);
      } catch (err) {
        console.error("Failed to load mentor batch members:", err);
        setError("Failed to load batch members.");
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const currentUserId = useMemo(() => getCurrentUserId(), []);

  // Filter members to identify which students belong to the logged-in mentor
  const myGroupMembers = useMemo(() => {
    if (!currentUserId) return [];

    return members.filter((member) => {
      const mentor = member.assignedMentor;
      if (!mentor) return false;

      const mentorId = typeof mentor === "object" ? mentor._id : mentor;
      return mentorId === currentUserId;
    });
  }, [members, currentUserId]);

  // Helper to check if a student belongs to the logged-in mentor
  const isMyStudent = (member) => {
    if (!currentUserId) return false;
    const mentor = member.assignedMentor;
    if (!mentor) return false;
    const mentorId = typeof mentor === "object" ? mentor._id : mentor;
    return mentorId === currentUserId;
  };

  // Local search filtering by name/email
  const filteredMembers = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();
    const base = showOnlyMyGroup ? myGroupMembers : members;

    if (!search) {
      return base;
    }

    return base.filter((member) => {
      const user = member.user;
      if (!user) return false;

      const name = user.fullName || "";
      const email = user.email || "";

      return (
        name.toLowerCase().includes(search) ||
        email.toLowerCase().includes(search)
      );
    });
  }, [members, myGroupMembers, showOnlyMyGroup, searchTerm]);

  const totalStudents = members.filter(
    (member) => member.user?.role?.toLowerCase() === "student",
  ).length;

  const totalMentors = useMemo(() => {
    const mentorIds = new Set(
      members
        .map((member) => {
          const mentor = member.assignedMentor;
          return typeof mentor === "object" ? mentor?._id : mentor;
        })
        .filter(Boolean),
    );
    return mentorIds.size;
  }, [members]);

  const myGroupSize = myGroupMembers.length;

  // Student Details Modal Handler
  const handleViewDetails = async (studentUserId) => {
    try {
      setDetailLoading(true);
      setDetailError("");
      setSelectedStudent(null);

      const student = await getMyStudentDetail(studentUserId);

      if (!student) {
        throw new Error("Student details were not found.");
      }

      setSelectedStudent(student);
    } catch (err) {
      console.error("Failed to load student details:", err);
      setDetailError(
        err.response?.data?.message ||
          "You are not allowed to view this student's details.",
      );
    } finally {
      setDetailLoading(false);
    }
  };

  const closeDetails = () => {
    setSelectedStudent(null);
    setDetailError("");
  };

  // Shared card style with modern shadow, hover movement and border highlight
  const cardStyle =
    "bg-surface border border-border rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-primary/50 hover:-translate-y-0.5 transition-all duration-200";

  return (
    <div className="mx-auto w-full max-w-300 space-y-8 animate-in fade-in duration-500 pb-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-bold text-text-primary tracking-tight">
            Batch Members
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            Browse batch peers or review your assigned students in detail.
          </p>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/25 text-red-500 rounded-xl px-4 py-3 text-sm font-medium">
          {error}
        </div>
      )}

      {/* Summary Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={`${cardStyle} flex items-center gap-4`}>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
            <FiUsers className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-text-muted mb-1 uppercase tracking-wider">
              Total Students
            </p>
            <h4 className="text-2xl font-black text-text-primary leading-none">
              {loading ? "..." : totalStudents}
            </h4>
          </div>
        </div>

        <div className={`${cardStyle} flex items-center gap-4`}>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shrink-0">
            <FiStar className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-text-muted mb-1 uppercase tracking-wider">
              Batch Mentors
            </p>
            <h4 className="text-2xl font-black text-text-primary leading-none">
              {loading ? "..." : totalMentors}
            </h4>
          </div>
        </div>

        <div className={`${cardStyle} flex items-center gap-4`}>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 shrink-0">
            <FiUsers className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-text-muted mb-1 uppercase tracking-wider">
              My Students Size
            </p>
            <h4 className="text-2xl font-black text-text-primary leading-none">
              {loading ? "..." : myGroupSize}
            </h4>
          </div>
        </div>
      </div>

      {/* Search & Toggle */}
      <div className={`${cardStyle} flex flex-col sm:flex-row gap-4 p-4`}>
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
          <input
            type="text"
            placeholder={
              showOnlyMyGroup
                ? "Search my students..."
                : "Search batch members..."
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-surface-subtle border border-border rounded-xl text-xs sm:text-sm text-text-primary placeholder:text-text-muted/50 hover:border-primary hover:shadow-[0_0_0_1px_rgba(234,88,12,0.25)] focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all outline-none duration-150 shadow-2xs"
          />
        </div>

        <div className="flex bg-surface-subtle border border-border rounded-xl p-1 shrink-0">
          <button
            type="button"
            onClick={() => setShowOnlyMyGroup(false)}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              !showOnlyMyGroup
                ? "bg-surface border border-border shadow-xs text-text-primary"
                : "text-text-muted hover:text-text-primary"
            }`}
          >
            All Batch
          </button>

          <button
            type="button"
            onClick={() => setShowOnlyMyGroup(true)}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
              showOnlyMyGroup
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-text-muted hover:text-text-primary"
            }`}
          >
            <FiUsers className="w-3.5 h-3.5" />
            My Students
          </button>
        </div>
      </div>

      {/* Members Table */}
      <div className={`${cardStyle} overflow-hidden p-0!`}>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-12 text-sm text-text-muted">
              Loading batch members...
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border text-[11px] uppercase tracking-wider text-text-muted font-mono font-bold bg-surface-subtle">
                  <th className="px-4 py-3">Member</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Attendance</th>
                  <th className="px-4 py-3">Progress</th>
                  <th className="px-4 py-3">University</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-xs sm:text-sm">
                {filteredMembers.map((member) => {
                  const user = member.user;
                  if (!user) return null;

                  const name = user.fullName || "Unknown";
                  const belongsToMe = isMyStudent(member);
                  const uniAcronym = getUniversityAcronym(user.university);

                  return (
                    <tr
                      key={member._id}
                      className="hover:bg-surface-subtle/50 transition-colors group"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                              name,
                            )}&background=F3F4F6&color=374151`}
                            alt={`${name} profile`}
                            className="w-8 h-8 rounded-xl border border-border group-hover:border-primary/50 transition-colors shrink-0 object-cover shadow-2xs"
                          />
                          <span className="text-xs sm:text-sm font-bold text-text-primary truncate max-w-37">
                            {name}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <span className="text-xs text-text-muted truncate max-w-45 block">
                          {user.email}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <span className="text-xs sm:text-sm font-semibold text-text-primary font-mono">
                          {member.attendance ?? "0%"}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-16 h-2 bg-surface-subtle rounded-full overflow-hidden border border-border/60">
                            <div
                              className="h-full bg-primary rounded-full transition-all duration-500"
                              style={{
                                width: `${member.progress ?? 0}%`,
                              }}
                            />
                          </div>
                          <span className="text-xs text-text-muted font-mono font-semibold">
                            {member.progress ?? 0}%
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                          title={user.university}
                        >
                          {uniAcronym}
                        </span>
                      </td>

                      {/* Action Cell: Details allowed ONLY if they are your student */}
                      <td className="px-4 py-3 text-right">
                        {belongsToMe ? (
                          <button
                            type="button"
                            onClick={() => handleViewDetails(user._id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 border border-primary/20 transition-all cursor-pointer"
                          >
                            <FiEye className="w-3.5 h-3.5" />
                            Details
                          </button>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-text-muted text-xs italic font-medium">
                            <FiLock className="w-3 h-3" /> Not Assigned
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {/* Empty State */}
          {!loading && filteredMembers.length === 0 && (
            <div className="text-center py-12 px-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-surface-subtle text-text-muted mb-3 border border-border shadow-2xs">
                <FiSearch className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-text-primary mb-1">
                {showOnlyMyGroup
                  ? "No students assigned to you yet"
                  : "No members found"}
              </h3>
              <p className="text-text-muted text-xs">
                {showOnlyMyGroup
                  ? "Students assigned to your mentor profile will appear here."
                  : "We couldn't find anyone matching your current search in this view."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Student Details Modal */}
      {(detailLoading || selectedStudent || detailError) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs px-4 animate-in fade-in duration-200">
          <div className="w-full max-w-xl bg-surface rounded-2xl shadow-2xl border border-border overflow-hidden scale-in-center">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface-subtle">
              <div>
                <h2 className="text-base font-bold text-text-primary">
                  Student Profile Overview
                </h2>
                <p className="text-xs text-text-muted mt-0.5">
                  Detailed information and academic record
                </p>
              </div>
              <button
                type="button"
                onClick={closeDetails}
                className="p-2 rounded-xl text-text-muted hover:bg-surface hover:text-text-primary transition-colors cursor-pointer border border-transparent hover:border-border"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 max-h-[80vh] overflow-y-auto">
              {detailLoading ? (
                <div className="py-14 text-center text-sm text-text-muted flex flex-col items-center justify-center gap-3">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  Loading student details...
                </div>
              ) : detailError ? (
                <div className="bg-red-500/10 border border-red-500/25 text-red-500 rounded-xl px-4 py-3 text-sm font-medium">
                  {detailError}
                </div>
              ) : selectedStudent ? (
                <div className="space-y-6">
                  {/* Hero Profile Card */}
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-surface-subtle border border-border shadow-2xs">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                        selectedStudent.user?.fullName ||
                          selectedStudent.fullName ||
                          "Student",
                      )}&background=3B82F6&color=FFFFFF`}
                      alt="Student profile"
                      className="w-14 h-14 rounded-2xl border-2 border-primary/20 object-cover shadow-xs"
                    />
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-text-primary">
                        {selectedStudent.user?.fullName ||
                          selectedStudent.fullName ||
                          "Unknown"}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-text-muted">
                        <span className="flex items-center gap-1 font-mono">
                          <FiMail className="w-3.5 h-3.5 text-primary" />
                          {selectedStudent.user?.email ||
                            selectedStudent.email ||
                            "N/A"}
                        </span>
                        <span className="flex items-center gap-1 font-mono">
                          <FiPhone className="w-3.5 h-3.5 text-emerald-500" />
                          {selectedStudent.user?.phone ||
                            selectedStudent.phone ||
                            "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Information Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-3.5 rounded-xl border border-border bg-surface hover:border-primary/40 transition-colors shadow-2xs">
                      <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-text-muted mb-1">
                        Member ID
                      </p>
                      <p className="text-sm font-bold text-text-primary font-mono">
                        {selectedStudent.memberId || "N/A"}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-border bg-surface hover:border-primary/40 transition-colors shadow-2xs">
                      <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-text-muted mb-1">
                        Gender
                      </p>
                      <p className="text-sm font-bold text-text-primary capitalize">
                        {selectedStudent.user?.gender ||
                          selectedStudent.gender ||
                          "N/A"}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-border bg-surface hover:border-primary/40 transition-colors shadow-2xs">
                      <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-text-muted mb-1">
                        University
                      </p>
                      <p className="text-sm font-bold text-text-primary">
                        {selectedStudent.user?.university ||
                          selectedStudent.university ||
                          "N/A"}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-border bg-surface hover:border-primary/40 transition-colors shadow-2xs">
                      <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-text-muted mb-1">
                        Department
                      </p>
                      <p className="text-sm font-bold text-text-primary flex items-center gap-1.5">
                        <FiBookOpen className="w-4 h-4 text-primary" />
                        {selectedStudent.user?.department ||
                          selectedStudent.department ||
                          "N/A"}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-border bg-surface hover:border-primary/40 transition-colors shadow-2xs sm:col-span-2">
                      <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-text-muted mb-1">
                        Academic Year
                      </p>
                      <p className="text-sm font-bold text-text-primary flex items-center gap-1.5">
                        <FiCalendar className="w-4 h-4 text-emerald-500" />
                        Year{" "}
                        {selectedStudent.user?.year ||
                          selectedStudent.year ||
                          "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end px-6 py-3 border-t border-border bg-surface-subtle">
              <button
                type="button"
                onClick={closeDetails}
                className="px-4 py-2 rounded-xl bg-surface border border-border text-xs font-bold text-text-primary hover:bg-surface-subtle transition-colors shadow-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
