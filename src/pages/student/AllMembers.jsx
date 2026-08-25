import React, { useEffect, useMemo, useState } from "react";
import { FiSearch, FiUsers, FiStar } from "react-icons/fi";
import { getMyBatchMembers } from "../../services/studentService";

// TODO: Replace this with however your app actually exposes the logged-in
// user (an AuthContext / useAuth() hook, Redux store, decoded JWT, etc).
// This reads from localStorage as a reasonable default — adjust the key
// and shape ("_id" vs "id") to match how you store the user after login.
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

  // No backend filtering exists yet, so we always fetch the full batch
  // roster once and do "My Group" filtering client-side below.
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getMyBatchMembers();

        setMembers(data);
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
      members
        .map((member) => member.assignedMentor?._id)
        .filter(Boolean),
    );
    return mentorIds.size;
  }, [members]);

  const myGroupSize = myGroupMembers.length;

  return (
    <div className="mx-auto w-full max-w-300 space-y-8 animate-in fade-in duration-500 pb-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-bold text-text-primary tracking-tight">
            Batch Members
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            Connect with your batch peers and coordinate with your project group.
          </p>
        </div>
      </div>

      {/* Error */}
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
              My Group Size
            </p>
            <h4 className="text-2xl font-bold text-text-primary leading-none">
              {loading ? "..." : myGroupSize}
            </h4>
          </div>
        </div>
      </div>

      {/* Search & Group Toggle */}
      <div className="flex flex-col sm:flex-row gap-4 bg-surface border border-border p-4 rounded-xl shadow-sm">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
          <input
            type="text"
            placeholder="Search batch members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-surface-subtle border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary transition-shadow"
          />
        </div>

        <div className="flex bg-surface-subtle border border-border rounded-lg p-1 shrink-0">
          <button
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
            onClick={() => setShowOnlyMyGroup(true)}
            className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors flex items-center gap-1.5 ${
              showOnlyMyGroup
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-text-muted hover:text-text-primary"
            }`}
          >
            <FiUsers className="w-3.5 h-3.5" />
            My Group
          </button>
        </div>
      </div>

      {/* Single Table */}
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
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {filteredMembers.map((member) => {
                  const user = member.user;
                  if (!user) return null;

                  const name = user.fullName || "Unknown";

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
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-text-primary">
                          {member.attendance ?? "0%"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-1.5 bg-surface-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#B91C1C] rounded-full"
                              style={{
                                width: `${member.progress ?? 0}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm text-text-muted font-medium">
                            {member.progress ?? 0}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600">
                          {user.university || "N/A"}
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
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-surface-muted text-text-muted mb-3 border border-border">
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