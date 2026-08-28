import React, { useEffect, useMemo, useState } from "react";
import { FiSearch, FiUsers, FiStar } from "react-icons/fi";
import API from "../../services/api";
import { getStudentProgress } from "../../services/progressService";
import { getMyBatchMembers } from "../../services/studentService";

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

  // ==================================================
  // REAL PROGRESS / ATTENDANCE METRICS
  // ==================================================

  const [progressMap, setProgressMap] = useState({}); // memberId -> progress %
  const [attendanceMap, setAttendanceMap] = useState({}); // memberId -> { percentage, totalSessions }

  // ==================================================
  // LOAD PROGRESS
  // ==================================================
  // getStudentProgress() (GET /progress/my-progress) also returns an
  // overallProgress field, but that's computed server-side by
  // calculateStudentStats() which only gives credit for "completed"
  // status (0 credit for "in_progress"/"needs_help"). That's a
  // different formula than the rest of the app uses, so instead we
  // recompute from the same per-topic progressMap using the identical
  // Completed=100 / In Progress|Needs Help=50 / else 0 scoring as
  // StudentsDashboard.jsx and the mentor's AllMembers.jsx.

  const loadProgressMap = async () => {
    try {
      const overview = await getStudentProgress();
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
  // Backed by the new GET /attendance/my-batch endpoint (student-only,
  // scoped server-side to the caller's own batch), which returns
  // { memberId, percentage, totalSessions } per batch member.

  const loadAttendanceMap = async () => {
    try {
      const response = await API.get("/attendance/my-batch");

      const records =
        response.data?.data?.attendance ||
        response.data?.attendance ||
        response.data?.data ||
        [];

      const map = {};

      (Array.isArray(records) ? records : []).forEach((record) => {
        if (!record?.memberId) return;

        map[record.memberId] = {
          percentage: record.percentage,
          totalSessions: record.totalSessions,
        };
      });

      setAttendanceMap(map);
    } catch (error) {
      console.error("Failed to load batch attendance:", error);
      setAttendanceMap({});
    }
  };

  // No backend filtering exists yet, so we always fetch the full batch
  // roster once and do "My Group" filtering client-side below.
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getMyBatchMembers();

        setMembers(data);

        await Promise.all([loadProgressMap(), loadAttendanceMap()]);
      } catch (err) {
        console.error("Failed to load batch members:", err);
        setError("Failed to load batch members.");
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const currentUserId = useMemo(() => getCurrentUserId(), []);

  // Find "me" in the roster to figure out which mentor I'm assigned to.
  const myMentorId = useMemo(() => {
    if (!currentUserId) return null;

    const me = members.find((member) => member.user?._id === currentUserId);
    return me?.assignedMentor?._id || null;
  }, [members, currentUserId]);

  // Everyone who shares my assigned mentor.
  const myGroupMembers = useMemo(() => {
    if (!myMentorId) return [];

    return members.filter(
      (member) => member.assignedMentor?._id === myMentorId,
    );
  }, [members, myMentorId]);

  // Local search filtering by name/email, applied on top of the
  // all-batch or my-group base list depending on the toggle.
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

  // Members only ever list students directly — mentors show up nested
  // under assignedMentor, not as their own member entries — so we count
  // unique assigned mentors instead of filtering by role.
  const totalMentors = useMemo(() => {
    const mentorIds = new Set(
      members.map((member) => member.assignedMentor?._id).filter(Boolean),
    );
    return mentorIds.size;
  }, [members]);

  const myGroupSize = myGroupMembers.length;

  // Shared modern card style
  const cardStyle =
    "bg-surface border border-border rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-primary/50 hover:-translate-y-0.5 transition-all duration-200";

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 animate-in fade-in duration-500 pb-12 px-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight">
            Batch Members
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-0.5">
            Connect with your batch peers and coordinate with your project
            group.
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/25 text-rose-500 rounded-xl px-4 py-3 text-xs sm:text-sm font-medium">
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
              My Group Size
            </p>
            <h4 className="text-2xl font-black text-text-primary leading-none">
              {loading ? "..." : myGroupSize}
            </h4>
          </div>
        </div>
      </div>

      {/* Search & Group Toggle */}
      <div className={`${cardStyle} flex flex-col sm:flex-row gap-4 p-4`}>
        <div className="relative flex-1">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
          <input
            type="text"
            placeholder="Search batch members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-surface-subtle border border-border rounded-xl text-xs sm:text-sm text-text-primary placeholder:text-text-muted/50 hover:border-primary hover:shadow-[0_0_0_1px_rgba(234,88,12,0.25)] focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all outline-none duration-150 shadow-2xs"
          />
        </div>

        <div className="flex bg-surface-subtle border border-border rounded-xl p-1 shrink-0">
          <button
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
            onClick={() => setShowOnlyMyGroup(true)}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
              showOnlyMyGroup
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-text-muted hover:text-text-primary"
            }`}
          >
            <FiUsers className="w-3.5 h-3.5" />
            My Group
          </button>
        </div>
      </div>

      {/* Single Table */}
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
                  <th className="px-4 py-3.5 font-bold">Member</th>
                  <th className="px-4 py-3.5 font-bold">Email</th>
                  <th className="px-4 py-3.5 font-bold">Attendance</th>
                  <th className="px-4 py-3.5 font-bold">Progress</th>
                  <th className="px-4 py-3.5 font-bold">University</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-xs sm:text-sm">
                {filteredMembers.map((member) => {
                  const user = member.user;
                  if (!user) return null;

                  const name = user.fullName || "Unknown";
                  const uniAcronym = getUniversityAcronym(user.university);

                  const attendanceInfo = attendanceMap[member._id];
                  const progressValue = progressMap[member._id];

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
                          <span className="text-xs sm:text-sm font-bold text-text-primary truncate max-w-45">
                            {name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-text-muted truncate max-w-50 block">
                          {user.email}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs sm:text-sm font-semibold text-text-primary font-mono">
                          {attendanceInfo
                            ? `${attendanceInfo.percentage}%`
                            : "N/A"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-16 h-2 bg-surface-subtle rounded-full overflow-hidden border border-border/60">
                            <div
                              className="h-full bg-primary rounded-full transition-all duration-500"
                              style={{
                                width: `${
                                  typeof progressValue === "number"
                                    ? progressValue
                                    : 0
                                }%`,
                              }}
                            />
                          </div>
                          <span className="text-xs text-text-muted font-mono font-semibold">
                            {typeof progressValue === "number"
                              ? `${progressValue}%`
                              : "N/A"}
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
                {showOnlyMyGroup && !myMentorId
                  ? "You don't have an assigned mentor yet"
                  : "No members found"}
              </h3>
              <p className="text-text-muted text-xs">
                {showOnlyMyGroup && !myMentorId
                  ? "Once a mentor is assigned to you, your group will show up here."
                  : "We couldn't find anyone matching your current search in this view."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}