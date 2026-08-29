import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Calendar,
  TrendingUp,
  FileText,
  AlertTriangle,
  MessageSquare,
  Star,
  X,
  Mail,
  Phone,
  Loader2,
  ChevronRight,
} from "lucide-react";
import API from "../../services/api";
import { getProgressOverview } from "../../services/progressService";
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

function getCurrentUser() {
  try {
    const stored = localStorage.getItem("user");
    if (!stored) return null;
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

function resolveMentorBatchId(members, mentorId) {
  const myMembers = members.filter((member) => {
    const mentor = member.assignedMentor;
    if (!mentor) return false;
    const mId = typeof mentor === "object" ? mentor._id : mentor;
    return mId === mentorId;
  });

  const source = myMembers.length > 0 ? myMembers : members;

  const batchCounts = {};
  source.forEach((member) => {
    const batch = member?.user?.batch;
    const batchId = batch && typeof batch === "object" ? batch._id : null;
    if (!batchId) return;
    batchCounts[batchId] = (batchCounts[batchId] || 0) + 1;
  });

  const sorted = Object.entries(batchCounts).sort((a, b) => b[1] - a[1]);
  return sorted.length > 0 ? sorted[0][0] : null;
}

const scoreTopics = (topicsMap) => {
  let totalScore = 0;
  let count = 0;

  Object.keys(topicsMap || {}).forEach((topicKey) => {
    const items = Array.isArray(topicsMap[topicKey])
      ? topicsMap[topicKey]
      : [topicsMap[topicKey]];

    items.forEach((item) => {
      count++;
      const status = item.status || "Not Started";
      if (status === "Completed") totalScore += 100;
      else if (status === "In Progress" || status === "Needs Help")
        totalScore += 50;
    });
  });

  return count > 0 ? Math.round(totalScore / count) : 0;
};


function SectionHeader({ title, actionText, actionLink }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-sm sm:text-base font-bold text-text-primary flex items-center gap-2">
        <MessageSquare size={18} className="text-primary" />
        {title}
      </h2>
      <Link
        to={actionLink}
        className="group flex items-center gap-1 text-xs font-bold text-primary hover:underline"
      >
        {actionText}{" "}
        <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
}


function LeaderboardCard({ title, icon: Icon, entries, accent }) {
  return (
    <div className="rounded-xl border border-border bg-surface-subtle/40 p-4">
      <div className="flex items-center gap-2 mb-3.5">
        <div
          className={`flex h-7 w-7 items-center justify-center rounded-lg shrink-0 ${accent.bg} ${accent.text}`}
        >
          <Icon size={14} />
        </div>
        <span className="text-[11px] font-bold text-text-primary uppercase tracking-wide">
          {title}
        </span>
      </div>

      {entries.length === 0 ? (
        <p className="text-[11px] text-text-muted text-center py-5">
          Not enough data yet.
        </p>
      ) : (
        <div className="space-y-2.5">
          {entries.map((entry, idx) => (
            <div key={entry.id} className="flex items-center gap-2.5">
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-black ${
                  idx === 0
                    ? "bg-amber-400 text-amber-950"
                    : "bg-surface-subtle text-text-muted border border-border"
                }`}
              >
                {idx + 1}
              </span>
              <span className="flex-1 min-w-0 text-xs font-semibold text-text-primary truncate">
                {entry.name}
              </span>
              <span className="text-xs font-black text-text-primary font-mono shrink-0">
                {entry.value}%
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function MentorDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [batchMembers, setBatchMembers] = useState([]);
  const [progressMap, setProgressMap] = useState({}); 
  const [attendanceMap, setAttendanceMap] = useState({}); 
  const [gradesMap, setGradesMap] = useState({}); 

  const [leaderboard, setLeaderboard] = useState({
    attendance: [],
    progress: [],
    grades: [],
  });

  const [pendingGrading, setPendingGrading] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  // Student detail modal
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");

  const currentUserId = useMemo(() => getCurrentUserId(), []);
  const currentUser = useMemo(() => getCurrentUser(), []);
  const mentorFirstName =
    currentUser?.firstName ||
    currentUser?.fullName?.split(" ")[0] ||
    "Mentor";

  // My assigned students only (subset of the full batch roster)
  const myGroupMembers = useMemo(() => {
    if (!currentUserId) return [];

    return batchMembers.filter((member) => {
      const mentor = member.assignedMentor;
      if (!mentor) return false;

      const mentorId = typeof mentor === "object" ? mentor._id : mentor;
      return mentorId === currentUserId;
    });
  }, [batchMembers, currentUserId]);


  const atRiskStudents = useMemo(() => {
    return myGroupMembers
      .map((member) => {
        const attendance = attendanceMap[member._id]?.percentage;
        const progress = progressMap[member._id];
        const issues = [];

        if (typeof attendance === "number" && attendance < 75) {
          issues.push(`Attendance ${attendance}%`);
        }
        if (typeof progress === "number" && progress < 50) {
          issues.push(`Progress ${progress}%`);
        }

        return {
          id: member._id,
          userId: member.user?._id,
          name: member.user?.fullName || "Student",
          attendance,
          issues,
        };
      })
      .filter((s) => s.issues.length > 0);
  }, [myGroupMembers, attendanceMap, progressMap]);


  const groupStats = useMemo(() => {
    const attendanceValues = myGroupMembers
      .map((m) => attendanceMap[m._id]?.percentage)
      .filter((v) => typeof v === "number");

    const progressValues = myGroupMembers
      .map((m) => progressMap[m._id])
      .filter((v) => typeof v === "number");

    const avgAttendance =
      attendanceValues.length > 0
        ? Math.round(
            attendanceValues.reduce((sum, v) => sum + v, 0) /
              attendanceValues.length,
          )
        : 0;

    const avgProgress =
      progressValues.length > 0
        ? Math.round(
            progressValues.reduce((sum, v) => sum + v, 0) /
              progressValues.length,
          )
        : 0;

    return {
      assignedCount: myGroupMembers.length,
      avgAttendance,
      avgProgress,
      pendingGradingCount: pendingGrading.length,
      atRiskCount: atRiskStudents.length,
    };
  }, [myGroupMembers, attendanceMap, progressMap, pendingGrading, atRiskStudents]);

  const progressByStudent = useMemo(() => {
    return myGroupMembers
      .map((m) => ({
        id: m._id,
        name: m.user?.fullName || "Student",
        percentage: progressMap[m._id] ?? 0,
      }))
      .sort((a, b) => b.percentage - a.percentage);
  }, [myGroupMembers, progressMap]);

  const loadBatchData = async (mentorBatchId) => {
    try {
      if (!mentorBatchId) {
        setProgressMap({});
        setAttendanceMap({});
        setGradesMap({});
        setLeaderboard({ attendance: [], progress: [], grades: [] });
        return;
      }

      const [progressOverview, attendanceResponse, gradesResponse] =
        await Promise.all([
          getProgressOverview(mentorBatchId, { scopeToAssigned: "false" }),
          API.get("/attendance", {
            params: { batchId: mentorBatchId, scopeToAssigned: "false" },
          }).catch((err) => {
            console.error("Failed to load batch attendance:", err);
            return null;
          }),
          API.get("/submissions/my-batch-grades", {
            params: { batchId: mentorBatchId },
          }).catch((err) => {
            console.error("Failed to load batch grades:", err);
            return null;
          }),
        ]);

      const students = progressOverview?.students || [];

      const nameById = {};
      students.forEach((s) => {
        nameById[s.id] = { name: s.name, initials: s.initials };
      });

      const batchMemberIds = new Set(students.map((s) => s.id));

      // ---- Progress ----
      const newProgressMap = {};
      students.forEach((student) => {
        newProgressMap[student.id] = scoreTopics(student.progressMap);
      });
      setProgressMap(newProgressMap);

      const progressRanking = students
        .map((student) => ({
          id: student.id,
          name: student.name,
          value: scoreTopics(student.progressMap),
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);

      // ---- Attendance ----
      const allAttendanceRecords = (() => {
        if (!attendanceResponse) return [];
        const records =
          attendanceResponse.data?.data?.attendance ||
          attendanceResponse.data?.attendance ||
          attendanceResponse.data?.data ||
          [];
        return Array.isArray(records) ? records : [];
      })();

      const attendanceGrouped = {};
      allAttendanceRecords.forEach((record) => {
        const memberId =
          typeof record.member === "object" ? record.member?._id : record.member;
        if (!memberId) return;
        if (!batchMemberIds.has(memberId)) return; // record belongs to another batch — skip it

        if (!attendanceGrouped[memberId]) {
          attendanceGrouped[memberId] = { present: 0, late: 0, absent: 0, excused: 0 };
        }

        if (record.status === "present") attendanceGrouped[memberId].present += 1;
        else if (record.status === "late") attendanceGrouped[memberId].late += 1;
        else if (record.status === "absent") attendanceGrouped[memberId].absent += 1;
        else if (record.status === "excused") attendanceGrouped[memberId].excused += 1;
      });

      const newAttendanceMap = {};
      Object.keys(attendanceGrouped).forEach((memberId) => {
        const { present, late, absent, excused } = attendanceGrouped[memberId];
        const gradeableSessions = present + late + absent + excused;
        const score = present + late * 0.5 + excused * 0.25;

        newAttendanceMap[memberId] = {
          percentage:
            gradeableSessions > 0
              ? Math.round((score / gradeableSessions) * 100)
              : 100,
          totalSessions: gradeableSessions,
        };
      });
      setAttendanceMap(newAttendanceMap);

      const attendanceRanking = Object.keys(newAttendanceMap)
        .map((memberId) => ({
          id: memberId,
          name: nameById[memberId]?.name || "Student",
          value: newAttendanceMap[memberId].percentage,
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);

      // ---- Grades ----
      const allGradeEntries = (() => {
        if (!gradesResponse) return [];
        const grades =
          gradesResponse.data?.data?.grades ||
          gradesResponse.data?.grades ||
          gradesResponse.data?.data ||
          [];
        return Array.isArray(grades) ? grades : [];
      })();

      const batchGradeEntries = allGradeEntries.filter((entry) =>
        batchMemberIds.has(entry.memberId),
      );

      const newGradesMap = {};
      batchGradeEntries.forEach((entry) => {
        newGradesMap[entry.memberId] = {
          percentage: entry.percentage,
          gradedCount: entry.gradedCount,
        };
      });
      setGradesMap(newGradesMap);

      const gradesRanking = batchGradeEntries
        .filter((entry) => entry.gradedCount > 0)
        .map((entry) => ({
          id: entry.memberId,
          name: nameById[entry.memberId]?.name || "Student",
          value: entry.percentage,
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);

      setLeaderboard({
        attendance: attendanceRanking,
        progress: progressRanking,
        grades: gradesRanking,
      });
    } catch (err) {
      console.error("Failed to load batch data:", err);
    }
  };

  const loadPendingGrading = async () => {
    try {
      const response = await API.get("/submissions/mentor");
      const raw =
        response.data?.data?.submissions || response.data?.submissions || [];

      const pending = (Array.isArray(raw) ? raw : [])
        .filter((s) => s.status === "submitted")
        .map((s) => ({
          id: s._id,
          student: s.member?.user?.fullName || "Student",
          assignment: s.assignment?.title || "Assignment",
          submitted: s.submittedAt
            ? new Date(s.submittedAt).toLocaleDateString()
            : "Not Submitted",
        }));

      setPendingGrading(pending);
    } catch (err) {
      console.error("Failed to load pending submissions:", err);
      setPendingGrading([]);
    }
  };
  const loadAnnouncements = async (mentorBatchId) => {
    try {
      const response = await API.get("/announcements", {
        params: mentorBatchId
          ? { batchId: mentorBatchId, limit: 5 }
          : { limit: 5 },
      });

      const raw =
        response.data?.data?.announcements ||
        response.data?.announcements ||
        response.data?.data ||
        [];

      setAnnouncements(Array.isArray(raw) ? raw.slice(0, 5) : []);
    } catch (err) {
      console.error("Failed to load announcements:", err);
      setAnnouncements([]);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        setError("");

        const members = await getMentorBatchMembers();
        const memberList = Array.isArray(members) ? members : [];
        setBatchMembers(memberList);

        const mentorBatchId = resolveMentorBatchId(memberList, currentUserId);

        await Promise.all([
          loadBatchData(mentorBatchId),
          loadPendingGrading(),
          loadAnnouncements(mentorBatchId),
        ]);
      } catch (err) {
        console.error("Failed to load mentor dashboard:", err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const handleViewDetails = async (studentUserId) => {
    try {
      setDetailLoading(true);
      setDetailError("");
      setSelectedStudent(null);

      const student = await getMyStudentDetail(studentUserId);

      if (!student) throw new Error("Student details were not found.");
      setSelectedStudent(student);
    } catch (err) {
      console.error("Failed to load student details:", err);
      setDetailError(
        err.response?.data?.message || "Unable to load this student's details.",
      );
    } finally {
      setDetailLoading(false);
    }
  };

  const closeDetails = () => {
    setSelectedStudent(null);
    setDetailError("");
  };

  const cardStyle =
    "bg-surface border border-border rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-primary/50 hover:-translate-y-0.5 transition-all duration-200";

  const stats = [
    {
      title: "Assigned Students",
      value: groupStats.assignedCount,
      subtitle: "Students in your group",
      icon: Users,
      color: "text-rose-500 bg-rose-500/10 border-rose-500/20",
    },
    {
      title: "Attendance",
      value: `${groupStats.avgAttendance}%`,
      subtitle: "Average attendance",
      icon: Calendar,
      color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    },
    {
      title: "Progress",
      value: `${groupStats.avgProgress}%`,
      subtitle: "Average progress",
      icon: TrendingUp,
      color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: "Pending Grading",
      value: groupStats.pendingGradingCount,
      subtitle: "Submissions to review",
      icon: FileText,
      color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    },
    {
      title: "At-Risk Students",
      value: groupStats.atRiskCount,
      subtitle: "Need attention",
      icon: AlertTriangle,
      color: "text-orange-500 bg-orange-500/10 border-orange-500/20",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-sm text-text-muted">
        <Loader2 className="animate-spin mr-2" size={18} />
        Loading your dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Top Header / Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight">
            Welcome back, {mentorFirstName}
            <span className="text-primary">.</span>
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-0.5">
            Overview of your assigned students and their current bootcamp
            progress.
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/25 text-red-500 rounded-xl px-4 py-3 text-sm font-medium">
          {error}
        </div>
      )}

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className={cardStyle + " flex flex-col justify-between"}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-text-muted tracking-wide uppercase">
                  {stat.title}
                </span>
                <div className={`p-2 rounded-xl border ${stat.color}`}>
                  <Icon size={18} />
                </div>
              </div>
              <div>
                <div className="text-2xl font-black text-text-primary tracking-tight">
                  {stat.value}
                </div>
                <p className="text-[11px] text-text-muted mt-1">
                  {stat.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* BATCH LEADERBOARD — scoped to the mentor's own batch only */}
      <div className={cardStyle}>
        <div className="mb-5">
          <h3 className="text-sm sm:text-base font-bold text-text-primary tracking-tight">
            Batch Leaderboard
          </h3>
          <p className="text-[11px] text-text-muted mt-0.5">
            Top 5 performers in your batch
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <LeaderboardCard
            title="Attendance"
            icon={Calendar}
            entries={leaderboard.attendance}
            accent={{ bg: "bg-primary/10", text: "text-primary" }}
          />
          <LeaderboardCard
            title="Progress"
            icon={TrendingUp}
            entries={leaderboard.progress}
            accent={{ bg: "bg-emerald-500/10", text: "text-emerald-500" }}
          />
          <LeaderboardCard
            title="Grades"
            icon={Star}
            entries={leaderboard.grades}
            accent={{ bg: "bg-amber-500/10", text: "text-amber-500" }}
          />
        </div>
      </div>

      {/* Assigned Students Table + Attendance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`lg:col-span-2 ${cardStyle}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm sm:text-base font-bold text-text-primary flex items-center gap-2">
              <Users size={18} className="text-primary" />
              Assigned Students
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border text-[11px] font-mono font-bold text-text-muted uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Student</th>
                  <th className="pb-3 font-semibold">Attendance</th>
                  <th className="pb-3 font-semibold">Progress</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-xs sm:text-sm">
                {myGroupMembers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-text-muted">
                      No students assigned to you yet.
                    </td>
                  </tr>
                ) : (
                  myGroupMembers.map((member) => {
                    const user = member.user || {};
                    const name = user.fullName || "Unknown";
                    const initials = name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2);

                    const attendance = attendanceMap[member._id]?.percentage;
                    const progress = progressMap[member._id];

                    return (
                      <tr
                        key={member._id}
                        className="hover:bg-surface-subtle/50 transition-colors"
                      >
                        <td className="py-3 flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                            {initials}
                          </div>
                          <div>
                            <div className="font-semibold text-text-primary">
                              {name}
                            </div>
                            <div className="text-[11px] text-text-muted">
                              {user.email}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 font-mono text-xs text-text-primary font-semibold">
                          {typeof attendance === "number" ? `${attendance}%` : "N/A"}
                        </td>
                        <td className="py-3 font-mono text-xs text-text-primary font-semibold">
                          {typeof progress === "number" ? `${progress}%` : "N/A"}
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => handleViewDetails(user._id)}
                            className="text-xs font-semibold text-primary hover:underline cursor-pointer"
                          >
                            View Profile
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Attendance Overview (my group) */}
        <div className={`${cardStyle} flex flex-col justify-between`}>
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm sm:text-base font-bold text-text-primary flex items-center gap-2">
                <Calendar size={18} className="text-primary" />
                Attendance Overview
              </h2>
            </div>

            <div className="flex flex-col items-center justify-center py-6">
              <div className="relative w-32 h-32 rounded-full border-8 border-primary/20 flex items-center justify-center border-t-primary">
                <div className="text-center">
                  <span className="text-3xl font-black text-text-primary">
                    {groupStats.avgAttendance}%
                  </span>
                  <div className="text-[10px] text-text-muted uppercase font-mono font-bold">
                    Average
                  </div>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-text-muted text-center">
              Average across your {groupStats.assignedCount} assigned student
              {groupStats.assignedCount === 1 ? "" : "s"}
            </p>
          </div>
        </div>
      </div>

      {/* Progress by Student + Pending Assignments to Grade */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={cardStyle}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm sm:text-base font-bold text-text-primary flex items-center gap-2">
              <TrendingUp size={18} className="text-primary" />
              Progress by Student
            </h2>
          </div>

          <div className="space-y-4 pt-2">
            {progressByStudent.length === 0 ? (
              <p className="text-xs text-text-muted text-center py-4">
                No students assigned to you yet.
              </p>
            ) : (
              progressByStudent.map((item) => (
                <div key={item.id} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-text-primary">{item.name}</span>
                    <span className="text-text-muted font-mono">
                      {item.percentage}%
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-surface-subtle rounded-full overflow-hidden border border-border/60">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className={cardStyle}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm sm:text-base font-bold text-text-primary flex items-center gap-2">
              <FileText size={18} className="text-primary" />
              Pending Assignments to Grade
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border text-[11px] font-mono font-bold text-text-muted uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Student</th>
                  <th className="pb-3 font-semibold">Assignment</th>
                  <th className="pb-3 font-semibold">Submitted</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-xs sm:text-sm">
                {pendingGrading.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-text-muted">
                      No pending submissions to grade.
                    </td>
                  </tr>
                ) : (
                  pendingGrading.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-surface-subtle/50 transition-colors"
                    >
                      <td className="py-3 font-semibold text-text-primary">
                        {item.student}
                      </td>
                      <td className="py-3 text-text-muted">{item.assignment}</td>
                      <td className="py-3 text-text-muted font-mono text-xs">
                        {item.submitted}
                      </td>
                      <td className="py-3 text-right">
                        <a
                          href="/mentor/submissions"
                          className="text-xs font-bold text-primary hover:underline cursor-pointer"
                        >
                          Grade
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Students Needing Attention + Recent Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={cardStyle}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm sm:text-base font-bold text-text-primary flex items-center gap-2 text-rose-500">
              <AlertTriangle size={18} />
              Students Needing Attention
            </h2>
          </div>

          <div className="space-y-3">
            {atRiskStudents.length === 0 ? (
              <p className="text-xs text-text-muted text-center py-4">
                No at-risk students right now.
              </p>
            ) : (
              atRiskStudents.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-surface-subtle border border-border"
                >
                  <div>
                    <div className="font-bold text-xs sm:text-sm text-text-primary">
                      {student.name}
                    </div>
                    <div className="text-[11px] text-text-muted mt-0.5">
                      {student.issues.join(" • ")}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-rose-500/10 text-rose-500 border border-rose-500/20">
                      Needs Attention
                    </span>
                    <button
                      onClick={() => handleViewDetails(student.userId)}
                      className="px-3 py-1.5 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground text-xs font-semibold transition-colors cursor-pointer"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className={cardStyle}>
          <SectionHeader
            title="Recent Announcements"
            actionText="View All"
            actionLink="/mentor/announcements"
          />

          <div className="divide-y divide-border/60">
            {announcements.length === 0 ? (
              <p className="text-xs text-text-muted text-center py-4">
                No announcements available.
              </p>
            ) : (
              announcements.map((ann) => (
                <div
                  key={ann._id || ann.id}
                  className="py-3 first:pt-0 last:pb-0 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-primary shrink-0"></div>
                    <span className="text-xs sm:text-sm font-semibold text-text-primary">
                      {ann.title}
                    </span>
                  </div>
                  <span className="text-[11px] text-text-muted font-mono">
                    {ann.createdAt
                      ? new Date(ann.createdAt).toLocaleDateString()
                      : ann.date || ""}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Student Details Modal (reused from AllMembers.jsx) */}
      {(detailLoading || selectedStudent || detailError) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs px-4 animate-in fade-in duration-200">
          <div className="w-full max-w-xl bg-surface rounded-2xl shadow-2xl border border-border overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface-subtle">
              <h2 className="text-base font-bold text-text-primary">
                Student Profile Overview
              </h2>
              <button
                type="button"
                onClick={closeDetails}
                className="p-2 rounded-xl text-text-muted hover:bg-surface hover:text-text-primary transition-colors cursor-pointer border border-transparent hover:border-border"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

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
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-surface-subtle border border-border">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                        selectedStudent.user?.fullName ||
                          selectedStudent.fullName ||
                          "Student",
                      )}&background=3B82F6&color=FFFFFF`}
                      alt="Student profile"
                      className="w-14 h-14 rounded-2xl border-2 border-primary/20 object-cover"
                    />
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-text-primary">
                        {selectedStudent.user?.fullName ||
                          selectedStudent.fullName ||
                          "Unknown"}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-text-muted">
                        <span className="flex items-center gap-1 font-mono">
                          <Mail className="w-3.5 h-3.5 text-primary" />
                          {selectedStudent.user?.email ||
                            selectedStudent.email ||
                            "N/A"}
                        </span>
                        <span className="flex items-center gap-1 font-mono">
                          <Phone className="w-3.5 h-3.5 text-emerald-500" />
                          {selectedStudent.user?.phone ||
                            selectedStudent.phone ||
                            "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-3.5 rounded-xl border border-border bg-surface">
                      <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-text-muted mb-1">
                        Member ID
                      </p>
                      <p className="text-sm font-bold text-text-primary font-mono">
                        {selectedStudent.memberId || "N/A"}
                      </p>
                    </div>
                    <div className="p-3.5 rounded-xl border border-border bg-surface">
                      <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-text-muted mb-1">
                        University
                      </p>
                      <p className="text-sm font-bold text-text-primary">
                        {selectedStudent.user?.university ||
                          selectedStudent.university ||
                          "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="flex items-center justify-end px-6 py-3 border-t border-border bg-surface-subtle">
              <button
                type="button"
                onClick={closeDetails}
                className="px-4 py-2 rounded-xl bg-surface border border-border text-xs font-bold text-text-primary hover:bg-surface-subtle transition-colors cursor-pointer"
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