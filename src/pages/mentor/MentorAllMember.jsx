import React, { useEffect, useMemo, useState } from "react";
<<<<<<< Updated upstream
import { FiSearch, FiUsers, FiStar, FiEye, FiX, FiMail, FiPhone, FiBookOpen, FiCalendar, FiLock } from "react-icons/fi";
=======
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
import API from "../../services/api";
import { getProgressOverview } from "../../services/progressService";
>>>>>>> Stashed changes
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

  // ==================================================
  // REAL PROGRESS / ATTENDANCE METRICS
  // ==================================================

  const [progressMap, setProgressMap] = useState({}); // memberId -> progress %
  const [attendanceMap, setAttendanceMap] = useState({}); // memberId -> { percentage, totalSessions }

  // ==================================================
  // LOAD PROGRESS
  // ==================================================
  // Same computation as StudentsDashboard.jsx / ProgressManagement.jsx:
  // getProgressOverview() + Completed=100 / In Progress|Needs Help=50 / else 0,
  // averaged per student. Unlike the admin Students page, nothing here is
  // filtered out by releasedBy, so a mentor sees combined progress
  // (admin-released + their own assigned tasks) — matching how
  // ProgressManagement.jsx already treats the mentor role.

  const loadProgressMap = async () => {
    try {
      const overview = await getProgressOverview("", {
        scopeToAssigned: "false",
      });
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
            count++;

            const status = item.status || "Not Started";

            if (status === "Completed") {
              totalScore += 100;
            } else if (status === "In Progress" || status === "Needs Help") {
              totalScore += 50;
            }
          });
        });

        // student.id === Member._id, same key space as member._id below
        map[student.id] = count > 0 ? Math.round(totalScore / count) : 0;
      });

      setProgressMap(map);
    } catch (error) {
      console.error("Failed to load progress overview:", error);
      setProgressMap({});
    }
  };

  // ==================================================
  // LOAD ATTENDANCE
  // ==================================================
  // Scoring: present=1, late=0.5, excused=0.25, absent=0. All four
  // statuses count toward the session denominator. Defaults to 100%
  // when a member has no gradeable sessions. Matches
  // getBatchAttendanceStats() in attendance.service.js and the same
  // client-side calc in StudentsDashboard.jsx.

  const loadAttendanceMap = async (membersList) => {
    try {
      const batchIds = Array.from(
        new Set(
          membersList
            .map((member) => {
              const batch = member?.user?.batch;
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
            params: { batchId, scopeToAssigned: "false" },
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

  // Fetch mentor batch members on mount
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getMentorBatchMembers();
        setMembers(data);

        await Promise.all([loadProgressMap(), loadAttendanceMap(data)]);
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
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* Summary Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface border border-border rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <FiUsers className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-text-primary mb-1 uppercase tracking-wider">
              Total Students
            </p>
            <h4 className="text-2xl font-bold text-text-primary leading-none">
              {loading ? "..." : totalStudents}
            </h4>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10 text-success">
            <FiStar className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-text-primary mb-1 uppercase tracking-wider">
              Batch Mentors
            </p>
            <h4 className="text-2xl font-bold text-text-primary leading-none">
              {loading ? "..." : totalMentors}
            </h4>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/10 text-warning">
            <FiUsers className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-text-primary mb-1 uppercase tracking-wider">
              My Students Size
            </p>
            <h4 className="text-2xl font-bold text-text-primary leading-none">
              {loading ? "..." : myGroupSize}
            </h4>
          </div>
        </div>
      </div>

      {/* Search & Toggle */}
      <div className="flex flex-col sm:flex-row gap-4 bg-surface border border-border p-4 rounded-xl shadow-sm">
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
            className="w-full pl-9 pr-4 py-2.5 bg-surface-subtle border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary transition-shadow"
          />
        </div>

        <div className="flex bg-surface-subtle border border-border rounded-lg p-1 shrink-0">
          <button
            type="button"
            onClick={() => setShowOnlyMyGroup(false)}
            className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors ${
              !showOnlyMyGroup
                ? "bg-surface border border-border shadow-sm text-text-primary"
                : "text-text-muted hover:text-text-primary"
            }`}
          >
            All Batch
          </button>

          <button
            type="button"
            onClick={() => setShowOnlyMyGroup(true)}
            className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors flex items-center gap-1.5 ${
              showOnlyMyGroup
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-text-muted hover:text-text-primary"
            }`}
          >
            <FiUsers className="w-3.5 h-3.5" />
            My Students
          </button>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-12 text-sm text-text-muted">
              Loading batch members...
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border text-[11px] uppercase tracking-wider text-text-muted font-bold bg-surface-subtle">
                  <th className="px-6 py-4 font-bold">Member</th>
                  <th className="px-6 py-4 font-bold">Email</th>
                  <th className="px-6 py-4 font-bold">Attendance</th>
                  <th className="px-6 py-4 font-bold">Progress</th>
                  <th className="px-6 py-4 font-bold">University</th>
                  <th className="px-6 py-4 font-bold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {filteredMembers.map((member) => {
                  const user = member.user;
                  if (!user) return null;

                  const name = user.fullName || "Unknown";
                  const belongsToMe = isMyStudent(member);

                  const attendanceInfo = attendanceMap[member._id];
                  const progressValue = progressMap[member._id];

                  return (
                    <tr
                      key={member._id}
                      className="hover:bg-surface-subtle transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                              name,
                            )}&background=F3F4F6&color=374151`}
                            alt={`${name} profile`}
                            className="w-8 h-8 rounded-full border border-border group-hover:border-primary/50 transition-colors shrink-0 object-cover"
                          />
                          <span className="text-sm font-bold text-text-primary">
                            {name}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="text-sm text-text-muted">
                          {user.email}
                        </span>
                      </td>

<<<<<<< Updated upstream
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-text-primary">
                          {member.attendance ?? "0%"}
=======
                      <td className="px-4 py-3">
                        <span className="text-xs sm:text-sm font-semibold text-text-primary font-mono">
                          {attendanceInfo
                            ? `${attendanceInfo.percentage}%`
                            : "N/A"}
>>>>>>> Stashed changes
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-1.5 bg-surface-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#B91C1C] rounded-full"
                              style={{
                                width: `${
                                  typeof progressValue === "number"
                                    ? progressValue
                                    : 0
                                }%`,
                              }}
                            />
                          </div>
<<<<<<< Updated upstream
                          <span className="text-sm text-text-muted font-medium">
                            {member.progress ?? 0}%
=======
                          <span className="text-xs text-text-muted font-mono font-semibold">
                            {typeof progressValue === "number"
                              ? `${progressValue}%`
                              : "N/A"}
>>>>>>> Stashed changes
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600">
                          {user.university || "N/A"}
                        </span>
                      </td>

                      {/* Action Cell: Details allowed ONLY if they are your student */}
                      <td className="px-6 py-4">
                        {belongsToMe ? (
                          <button
                            type="button"
                            onClick={() => handleViewDetails(user._id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition-colors"
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
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-surface-muted text-text-muted mb-3 border border-border">
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
                className="p-2 rounded-lg text-text-muted hover:bg-surface hover:text-text-primary transition-colors"
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
                <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">
                  {detailError}
                </div>
              ) : selectedStudent ? (
                <div className="space-y-6">
                  
                  {/* Hero Profile Card */}
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-surface-subtle border border-border">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                        selectedStudent.user?.fullName ||
                          selectedStudent.fullName ||
                          "Student",
                      )}&background=3B82F6&color=FFFFFF`}
                      alt="Student profile"
                      className="w-14 h-14 rounded-full border-2 border-primary/20 object-cover shadow-xs"
                    />
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-text-primary">
                        {selectedStudent.user?.fullName ||
                          selectedStudent.fullName ||
                          "Unknown"}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-text-muted">
                        <span className="flex items-center gap-1">
                          <FiMail className="w-3.5 h-3.5 text-primary" />
                          {selectedStudent.user?.email || selectedStudent.email || "N/A"}
                        </span>
                        <span className="flex items-center gap-1">
                          <FiPhone className="w-3.5 h-3.5 text-success" />
                          {selectedStudent.user?.phone || selectedStudent.phone || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Information Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-3.5 rounded-xl border border-border bg-surface hover:border-primary/40 transition-colors">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-1">
                        Member ID
                      </p>
                      <p className="text-sm font-semibold text-text-primary">
                        {selectedStudent.memberId || "N/A"}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-border bg-surface hover:border-primary/40 transition-colors">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-1">
                        Gender
                      </p>
                      <p className="text-sm font-semibold text-text-primary capitalize">
                        {selectedStudent.user?.gender || selectedStudent.gender || "N/A"}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-border bg-surface hover:border-primary/40 transition-colors">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-1">
                        University
                      </p>
                      <p className="text-sm font-semibold text-text-primary">
                        {selectedStudent.user?.university || selectedStudent.university || "N/A"}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-border bg-surface hover:border-primary/40 transition-colors">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-1">
                        Department
                      </p>
                      <p className="text-sm font-semibold text-text-primary flex items-center gap-1.5">
                        <FiBookOpen className="w-4 h-4 text-warning" />
                        {selectedStudent.user?.department || selectedStudent.department || "N/A"}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-border bg-surface hover:border-primary/40 transition-colors sm:col-span-2">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-1">
                        Academic Year
                      </p>
                      <p className="text-sm font-semibold text-text-primary flex items-center gap-1.5">
                        <FiCalendar className="w-4 h-4 text-emerald-500" />
                        Year {selectedStudent.user?.year || selectedStudent.year || "N/A"}
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
                className="px-4 py-2 rounded-lg bg-surface border border-border text-xs font-bold text-text-primary hover:bg-surface-subtle transition-colors shadow-xs"
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