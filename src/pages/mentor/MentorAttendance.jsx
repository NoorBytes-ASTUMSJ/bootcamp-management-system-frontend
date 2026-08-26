import React, { useEffect, useMemo, useRef, useState } from "react";
import { format } from "date-fns";
import {
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiCalendar,
  FiSave,
  FiChevronLeft,
  FiChevronRight,
  FiFileText,
  FiAlignLeft,
  FiSearch,
  FiPlus,
  FiUser,
  FiX,
  FiMonitor,
  FiCode,
  FiCoffee,
  FiEdit3,
  FiInfo,
} from "react-icons/fi";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import API from "../../services/api";

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

export default function MentorAttendance() {
  const [sessionTitle, setSessionTitle] = useState("");
  const [sessionDescription, setSessionDescription] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [sessionType, setSessionType] = useState("weekly_meeting");
  const [selectedBatchId, setSelectedBatchId] = useState("");

  const [attendanceList, setAttendanceList] = useState([]);
  const [pastSessions, setPastSessions] = useState([]);
  const [currentSessionIndex, setCurrentSessionIndex] = useState(-1);
  const [sessionSearch, setSessionSearch] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const searchRef = useRef(null);

  const SESSION_TYPES = [
    {
      label: "Weekly Meeting",
      value: "weekly_meeting",
      icon: <FiMonitor className="w-4 h-4" />,
    },
    {
      label: "Question & Answer",
      value: "question_answer",
      icon: <FiCoffee className="w-4 h-4" />,
    },
    {
      label: "Contest Review",
      value: "contest_review",
      icon: <FiCode className="w-4 h-4" />,
    },
    {
      label: "Assignment Presentation",
      value: "assignment_presentation",
      icon: <FiEdit3 className="w-4 h-4" />,
    },
  ];

  const MENTOR_TYPES = [
    "weekly_meeting",
    "question_answer",
    "contest_review",
    "assignment_presentation",
  ];

  const isHistoryView = currentSessionIndex !== -1;

  useEffect(() => {
    const fetchMentorData = async () => {
      setLoading(true);
      try {
        const studentRes = await API.get("/members/mentor/my-batch");
        const allBatchMembers =
          studentRes.data.data?.members || studentRes.data.members || [];

        const userStorage =
          localStorage.getItem("user") || localStorage.getItem("userInfo");
        let myMentorId = null;
        if (userStorage) {
          const parsedUser = JSON.parse(userStorage);
          myMentorId = parsedUser.id || parsedUser._id;
        }

        const myMentees = allBatchMembers.filter((m) => {
          if (!m.assignedMentor) return false;
          const assignedId =
            typeof m.assignedMentor === "object"
              ? m.assignedMentor._id
              : m.assignedMentor;
          return assignedId === myMentorId;
        });

        if (myMentees.length > 0 && myMentees[0].user?.batch) {
          const batchId =
            typeof myMentees[0].user.batch === "object"
              ? myMentees[0].user.batch._id
              : myMentees[0].user.batch;
          setSelectedBatchId(batchId);
        }

        const formattedStudents = myMentees.map((m) => {
          return {
            id: m._id,
            name: m.user?.fullName || "Unknown",
            email: m.user?.email || "No email",
            university: m.user?.university || "N/A",
            avatar:
              m.user?.avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(m.user?.fullName || "U")}&background=F3F4F6&color=374151`,
            status: "Present",
          };
        });

        const attRes = await API.get("/attendance");
        const rawRecords =
          attRes.data.data?.attendance || attRes.data.attendance || [];
        const groupedSessions = {};

        rawRecords.forEach((record) => {
          const dateStr = new Date(record.date).toISOString().split("T")[0];
          const sessionKey = `${dateStr}-${record.sessionTopic}`;

          if (!groupedSessions[sessionKey]) {
            groupedSessions[sessionKey] = {
              id: sessionKey,
              title: record.sessionTopic,
              date: dateStr,
              type: record.sessionType,
              batch: record.batch?._id || record.batch,
              description: record.notes || "",
              attendance: [],
            };
          }

          const formattedStatus =
            record.status.charAt(0).toUpperCase() + record.status.slice(1);

          groupedSessions[sessionKey].attendance.push({
            id: record.member?._id,
            name: record.member?.user?.fullName || "Unknown User",
            email: record.member?.user?.email || "No Email",
            university: record.member?.user?.university || "N/A",
            avatar:
              record.member?.user?.avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(record.member?.user?.fullName || "U")}&background=F3F4F6&color=374151`,
            status: formattedStatus,
          });
        });

        setPastSessions(Object.values(groupedSessions));
        setAttendanceList(formattedStudents);
      } catch (error) {
        console.error("Error loading mentor data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMentorData();

    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target))
        setShowSearchResults(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!loading) loadSessionData(-1);
  }, [loading, pastSessions]);

  const loadSessionData = (index) => {
    setCurrentSessionIndex(index);
    if (index === -1) {
      setSessionTitle("");
      setSessionDescription("");
      setSessionType("weekly_meeting");
      setSelectedDate(new Date().toISOString().split("T")[0]);
      setAttendanceList((prev) =>
        prev.map((s) => ({ ...s, status: "Present" })),
      );
    } else {
      const session = pastSessions[index];
      setSessionTitle(session.title);
      setSessionDescription(session.description);
      setSessionType(session.type);
      setSelectedDate(session.date);
      setAttendanceList(session.attendance);
    }
  };

  const handlePrevSession = () => {
    if (currentSessionIndex < pastSessions.length - 1)
      loadSessionData(currentSessionIndex + 1);
  };

  const handleNextSession = () => {
    if (currentSessionIndex > -1) loadSessionData(currentSessionIndex - 1);
  };

  const handleSearchSelect = (session) => {
    const index = pastSessions.findIndex((s) => s.id === session.id);
    loadSessionData(index);
    setShowSearchResults(false);
    setSessionSearch("");
  };

  const handleStatusChange = (id, newStatus) => {
    setAttendanceList((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s)),
    );
  };

  const handleMarkAll = (status) => {
    setAttendanceList((prev) =>
      prev.map((student) => ({ ...student, status })),
    );
  };

  const handleSave = async () => {
    if (!sessionTitle.trim()) {
      alert("Session Title is required.");
      return;
    }
    if (attendanceList.length === 0) {
      alert("No students found to save attendance for.");
      return;
    }
    if (!selectedBatchId) {
      alert("Batch context missing. Cannot save attendance.");
      return;
    }

    const payload = {
      sessionTopic: sessionTitle,
      date: selectedDate,
      sessionType: sessionType,
      batchId: selectedBatchId,
      records: attendanceList.map((student) => ({
        member: student.id,
        status: student.status.toLowerCase(),
        notes: sessionDescription,
      })),
    };

    try {
      await API.post("/attendance/bulk", payload);

      const updatedSessionUI = {
        id: isHistoryView
          ? pastSessions[currentSessionIndex].id
          : `${selectedDate}-${sessionTitle}`,
        title: sessionTitle,
        description: sessionDescription,
        date: selectedDate,
        type: sessionType,
        batch: selectedBatchId,
        attendance: attendanceList,
      };

      if (isHistoryView) {
        const updatedSessions = [...pastSessions];
        updatedSessions[currentSessionIndex] = updatedSessionUI;
        setPastSessions(updatedSessions);
      } else {
        setPastSessions([updatedSessionUI, ...pastSessions]);
        setCurrentSessionIndex(0);
      }

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (error) {
      console.error("Save Error:", error);
      alert(error.response?.data?.message || "Failed to save attendance");
    }
  };

  const getStudentHistory = (studentId) => {
    return pastSessions.map((session) => {
      const record = session.attendance.find((a) => a.id === studentId);
      return {
        id: session.id,
        title: session.title,
        date: session.date,
        type: session.type,
        isMentorSession: MENTOR_TYPES.includes(session.type),
        status: record ? record.status : "No Record",
      };
    });
  };

  const getStudentAttendancePercentage = (studentId, scope = "all") => {
    const relevantSessions = pastSessions.filter((session) => {
      if (scope === "mentor") return MENTOR_TYPES.includes(session.type);
      if (scope === "admin") return !MENTOR_TYPES.includes(session.type);
      return true;
    });

    if (relevantSessions.length === 0) return 100;

    let score = 0;
    let validSessions = 0;

    relevantSessions.forEach((session) => {
      const record = session.attendance.find((a) => a.id === studentId);
      if (record) {
        if (record.status === "Present") {
          score += 1;
          validSessions += 1;
        } else if (record.status === "Late") {
          score += 0.5;
          validSessions += 1;
        } else if (record.status === "Absent") {
          validSessions += 1;
        }
      }
    });

    return validSessions === 0
      ? 100
      : Math.round((score / validSessions) * 100);
  };

  const getPercentageColor = (percentage) => {
    if (percentage >= 85) return "text-success bg-success/10 border-success/20";
    if (percentage >= 70) return "text-warning bg-warning/10 border-warning/20";
    return "text-error bg-error/10 border-error/20";
  };

  const filteredSessions = pastSessions.filter((session) =>
    session.title.toLowerCase().includes(sessionSearch.toLowerCase()),
  );

  const counts = {
    present: attendanceList.filter((s) => s.status === "Present").length,
    absent: attendanceList.filter((s) => s.status === "Absent").length,
    late: attendanceList.filter((s) => s.status === "Late").length,
    excused: attendanceList.filter((s) => s.status === "Excused").length,
  };

  const isPrevDisabled =
    pastSessions.length === 0 || currentSessionIndex >= pastSessions.length - 1;
  const isNextDisabled = currentSessionIndex === -1;

  // Shared modern card style
  const cardStyle =
    "bg-surface border border-border rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-primary/50 hover:-translate-y-0.5 transition-all duration-200";

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 pb-10 px-4">
      {/* Top Navigation & Search Bar */}
      <div
        className={`${cardStyle} flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4`}
      >
        <div className="relative w-full lg:w-72" ref={searchRef}>
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search saved sessions..."
            value={sessionSearch}
            onFocus={() => setShowSearchResults(true)}
            onChange={(e) => {
              setSessionSearch(e.target.value);
              setShowSearchResults(true);
            }}
            className="w-full pl-10 pr-4 py-2.5 bg-surface-subtle border border-border rounded-xl text-xs sm:text-sm text-text-primary placeholder:text-text-muted/50 hover:border-primary hover:shadow-[0_0_0_1px_rgba(234,88,12,0.25)] focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all outline-none duration-150 shadow-2xs"
          />

          {showSearchResults && sessionSearch.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-border rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto p-1">
              {filteredSessions.length > 0 ? (
                <div>
                  {filteredSessions.map((session) => (
                    <button
                      key={session.id}
                      onClick={() => handleSearchSelect(session)}
                      className="w-full text-left px-3.5 py-2 text-xs sm:text-sm hover:bg-surface-subtle rounded-lg transition-colors border border-transparent flex flex-col cursor-pointer"
                    >
                      <span className="font-bold text-text-primary truncate">
                        {session.title}
                      </span>
                      <span className="text-[11px] text-text-muted">
                        {session.date}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-xs text-text-muted">
                  No saved sessions found.
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between lg:justify-center gap-2 flex-1">
          <button
            onClick={handlePrevSession}
            disabled={isPrevDisabled}
            className={`p-2 rounded-xl transition-colors border cursor-pointer ${isPrevDisabled ? "text-text-muted/30 border-transparent cursor-not-allowed opacity-50" : "text-text-muted hover:bg-surface-subtle hover:text-primary border-transparent hover:border-border"}`}
          >
            <FiChevronLeft className="w-5 h-5" />
          </button>

          <div className="text-center px-4 min-w-40">
            <h1 className="text-xs sm:text-sm font-bold text-text-primary uppercase tracking-[1px]">
              {isHistoryView
                ? `Session ${pastSessions.length - currentSessionIndex}`
                : "New Session"}
            </h1>
            <p className="text-[11px] font-bold text-text-muted mt-0.5 font-mono">
              {selectedDate}
            </p>
          </div>

          <button
            onClick={handleNextSession}
            disabled={isNextDisabled}
            className={`p-2 rounded-xl transition-colors border cursor-pointer ${isNextDisabled ? "text-text-muted/30 border-transparent cursor-not-allowed opacity-50" : "text-text-muted hover:bg-surface-subtle hover:text-primary border-transparent hover:border-border"}`}
          >
            <FiChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
          {isHistoryView && (
            <button
              onClick={() => loadSessionData(-1)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-surface-subtle border border-border text-text-primary font-bold text-xs rounded-xl hover:bg-surface-muted transition-colors shadow-2xs cursor-pointer"
            >
              <FiPlus className="w-4 h-4" /> New
            </button>
          )}
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-primary text-primary-foreground font-bold text-xs sm:text-sm rounded-xl hover:bg-primary-hover active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:shadow-primary/25 cursor-pointer"
          >
            <FiSave /> {isHistoryView ? "Update Record" : "Save Session"}
          </button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className={`${cardStyle} flex items-center gap-4 p-4 sm:p-5`}>
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0">
            <FiCheckCircle className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div>
            <div className="text-xs text-text-muted font-bold uppercase tracking-wider mb-0.5">
              Present Today
            </div>
            <div className="text-xl md:text-2xl font-black text-text-primary leading-none">
              {counts.present}
            </div>
          </div>
        </div>

        <div className={`${cardStyle} flex items-center gap-4 p-4 sm:p-5`}>
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 shrink-0">
            <FiXCircle className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div>
            <div className="text-xs text-text-muted font-bold uppercase tracking-wider mb-0.5">
              Absent Today
            </div>
            <div className="text-xl md:text-2xl font-black text-text-primary leading-none">
              {counts.absent}
            </div>
          </div>
        </div>

        <div className={`${cardStyle} flex items-center gap-4 p-4 sm:p-5`}>
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
            <FiClock className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div>
            <div className="text-xs text-text-muted font-bold uppercase tracking-wider mb-0.5">
              Late Today
            </div>
            <div className="text-xl md:text-2xl font-black text-text-primary leading-none">
              {counts.late}
            </div>
          </div>
        </div>

        <div className={`${cardStyle} flex items-center gap-4 p-4 sm:p-5`}>
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 shrink-0">
            <FiInfo className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div>
            <div className="text-xs text-text-muted font-bold uppercase tracking-wider mb-0.5">
              Excused Today
            </div>
            <div className="text-xl md:text-2xl font-black text-text-primary leading-none">
              {counts.excused}
            </div>
          </div>
        </div>
      </div>

      {/* Session Configuration Card */}
      <div className={cardStyle}>
        <h3 className="text-xs font-mono font-bold text-text-muted uppercase tracking-wider mb-5">
          Session Configuration
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          <div className="md:col-span-8 flex flex-col justify-end space-y-1.5">
            <label className="text-[10px] font-mono font-bold text-text-muted uppercase ml-1">
              Session Title <span className="text-primary">*</span>
            </label>
            <div className="relative">
              <FiFileText className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                value={sessionTitle}
                onChange={(e) => setSessionTitle(e.target.value)}
                placeholder="Day 01: Introduction to React"
                className="w-full pl-10 pr-4 h-11 bg-surface-subtle border border-border rounded-xl text-xs sm:text-sm text-text-primary placeholder:text-text-muted/50 hover:border-primary hover:shadow-[0_0_0_1px_rgba(234,88,12,0.25)] focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all outline-none duration-150 shadow-2xs"
              />
            </div>
          </div>

          <div className="md:col-span-4 flex flex-col justify-end space-y-1.5">
            <label className="text-[10px] font-mono font-bold text-text-muted uppercase ml-1">
              Date
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <div className="w-full justify-start text-left font-normal pl-3.5 h-11 bg-surface-subtle border border-border rounded-xl hover:border-primary text-xs sm:text-sm text-text-primary transition-all flex items-center cursor-pointer shadow-2xs">
                  <FiCalendar className="mr-3 h-4 w-4 text-text-muted shrink-0" />
                  {selectedDate ? (
                    format(new Date(selectedDate), "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-50 bg-surface border border-border shadow-xl rounded-2xl">
                <Calendar
                  mode="single"
                  selected={new Date(selectedDate)}
                  onSelect={(date) =>
                    setSelectedDate(
                      date ? format(date, "yyyy-MM-dd") : selectedDate,
                    )
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="md:col-span-4 flex flex-col justify-end space-y-1.5">
            <label className="text-[10px] font-mono font-bold text-text-muted uppercase ml-1">
              Session Type <span className="text-primary">*</span>
            </label>
            <Select value={sessionType} onValueChange={setSessionType}>
              <SelectTrigger className="w-full pl-3.5 h-11 bg-surface-subtle border border-border rounded-xl text-xs sm:text-sm text-text-primary hover:border-primary transition-all shadow-2xs cursor-pointer">
                <SelectValue placeholder="Select session type" />
              </SelectTrigger>
              <SelectContent className="z-50 bg-surface border border-border shadow-xl rounded-xl">
                {SESSION_TYPES.map((type) => (
                  <SelectItem
                    key={type.value}
                    value={type.value}
                    className="cursor-pointer hover:bg-surface-subtle text-xs font-medium"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-primary">{type.icon}</span>
                      {type.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-8 flex flex-col justify-end space-y-1.5">
            <label className="text-[10px] font-mono font-bold text-text-muted uppercase ml-1">
              Description
            </label>
            <div className="relative">
              <FiAlignLeft className="absolute left-3.5 top-3.5 text-text-muted" />
              <textarea
                rows="1"
                value={sessionDescription}
                onChange={(e) => setSessionDescription(e.target.value)}
                placeholder="Overview of today's topics..."
                className="w-full pl-10 pr-4 py-2.5 min-h-11 bg-surface-subtle border border-border rounded-xl text-xs sm:text-sm text-text-primary placeholder:text-text-muted/50 hover:border-primary focus:border-primary outline-none transition-all resize-none shadow-2xs"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Student Roster Table Card */}
      <div className={`${cardStyle} overflow-hidden p-0!`}>
        <div className="p-4 sm:p-5 border-b border-border bg-surface-subtle/50 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <h3 className="text-xs font-mono font-bold text-text-muted uppercase tracking-wider">
            Student Roster
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => handleMarkAll("Present")}
              className="px-3 py-1.5 h-8 text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-500 rounded-xl border border-emerald-500/20 hover:bg-emerald-500/20 transition-all whitespace-nowrap cursor-pointer shadow-2xs"
            >
              All Present
            </button>
            <button
              onClick={() => handleMarkAll("Absent")}
              className="px-3 py-1.5 h-8 text-[10px] font-bold uppercase bg-rose-500/10 text-rose-500 rounded-xl border border-rose-500/20 hover:bg-rose-500/20 transition-all whitespace-nowrap cursor-pointer shadow-2xs"
            >
              All Absent
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-200 border-collapse">
            <thead>
              <tr className="bg-surface-subtle text-[11px] font-mono font-bold text-text-muted uppercase tracking-wider border-b border-border">
                <th className="px-4 py-3.5">Student</th>
                <th className="px-4 py-3.5">Email</th>
                <th className="px-4 py-3.5 text-center">Overall %</th>
                <th className="px-4 py-3.5 text-center">Status</th>
                <th className="px-4 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-xs sm:text-sm">
              {attendanceList.length > 0 ? (
                attendanceList.map((student) => {
                  const perc = getStudentAttendancePercentage(
                    student.id,
                    "all",
                  );
                  const colorClass = getPercentageColor(perc);
                  const uniAcronym = getUniversityAcronym(student.university);

                  return (
                    <tr
                      key={student.id}
                      className="group hover:bg-surface-subtle/50 transition-all"
                    >
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setSelectedStudent(student)}
                          className="flex items-center gap-3 w-full text-left hover:opacity-80 transition-opacity focus:outline-none cursor-pointer"
                        >
                          <img
                            src={student.avatar}
                            className="w-9 h-9 rounded-xl border border-border group-hover:border-primary transition-all shrink-0 object-cover shadow-2xs"
                            alt="Avatar"
                          />
                          <div>
                            <span className="text-xs sm:text-sm font-bold text-text-primary group-hover:text-primary transition-colors whitespace-nowrap block">
                              {student.name}
                            </span>
                            <span className="text-[10px] text-text-muted font-mono uppercase">
                              {uniAcronym}
                            </span>
                          </div>
                        </button>
                      </td>
                      <td className="px-4 py-3 text-xs text-text-muted whitespace-nowrap">
                        {student.email}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`px-2 py-1 rounded-lg text-xs font-bold font-mono border ${colorClass}`}
                        >
                          {perc}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border whitespace-nowrap
                          ${
                            student.status === "Present"
                              ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                              : student.status === "Absent"
                                ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                                : student.status === "Late"
                                  ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                  : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                          }`}
                        >
                          {student.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() =>
                              handleStatusChange(student.id, "Present")
                            }
                            className={`px-2.5 py-1.5 rounded-xl text-[10px] font-bold uppercase transition-all border whitespace-nowrap cursor-pointer
                            ${student.status === "Present" ? "bg-emerald-500 text-white border-emerald-500 shadow-sm" : "bg-surface-subtle text-text-muted border-border hover:bg-surface-muted hover:border-emerald-500 hover:text-emerald-500"}`}
                          >
                            Present
                          </button>
                          <button
                            onClick={() =>
                              handleStatusChange(student.id, "Absent")
                            }
                            className={`px-2.5 py-1.5 rounded-xl text-[10px] font-bold uppercase transition-all border whitespace-nowrap cursor-pointer
                            ${student.status === "Absent" ? "bg-rose-500 text-white border-rose-500 shadow-sm" : "bg-surface-subtle text-text-muted border-border hover:bg-surface-muted hover:border-rose-500 hover:text-rose-500"}`}
                          >
                            Absent
                          </button>
                          <button
                            onClick={() =>
                              handleStatusChange(student.id, "Late")
                            }
                            className={`px-2.5 py-1.5 rounded-xl text-[10px] font-bold uppercase transition-all border whitespace-nowrap cursor-pointer
                            ${student.status === "Late" ? "bg-amber-500 text-white border-amber-500 shadow-sm" : "bg-surface-subtle text-text-muted border-border hover:bg-surface-muted hover:border-amber-500 hover:text-amber-500"}`}
                          >
                            Late
                          </button>
                          <button
                            onClick={() =>
                              handleStatusChange(student.id, "Excused")
                            }
                            className={`px-2.5 py-1.5 rounded-xl text-[10px] font-bold uppercase transition-all border whitespace-nowrap cursor-pointer
                            ${student.status === "Excused" ? "bg-blue-500 text-white border-blue-500 shadow-sm" : "bg-surface-subtle text-text-muted border-border hover:bg-surface-muted hover:border-blue-500 hover:text-blue-500"}`}
                          >
                            Excused
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-12 text-xs text-text-muted"
                  >
                    No students assigned to your batch yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Details Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-surface border border-border rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-border bg-surface-subtle">
              <h2 className="text-sm sm:text-base font-bold text-text-primary flex items-center gap-2">
                <FiUser className="text-primary" /> Student Record
              </h2>
              <button
                onClick={() => setSelectedStudent(null)}
                className="p-2 rounded-xl text-text-muted hover:bg-surface hover:text-text-primary transition-colors focus:outline-none cursor-pointer border border-transparent hover:border-border"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-surface-subtle border border-border shadow-2xs">
                <img
                  src={selectedStudent.avatar}
                  alt={selectedStudent.name}
                  className="w-14 h-14 rounded-2xl border-2 border-primary/20 object-cover shadow-xs"
                />
                <div>
                  <h3 className="text-base font-bold text-text-primary">
                    {selectedStudent.name}
                  </h3>
                  <p className="text-xs text-text-muted font-mono mt-0.5">
                    {selectedStudent.email}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div
                  className={`p-4 rounded-xl border flex flex-col justify-center shadow-2xs ${getPercentageColor(getStudentAttendancePercentage(selectedStudent.id, "mentor"))}`}
                >
                  <span className="font-bold uppercase tracking-wider text-[10px] font-mono mb-1">
                    Mentor Sessions
                  </span>
                  <span className="text-2xl font-black font-mono">
                    {getStudentAttendancePercentage(
                      selectedStudent.id,
                      "mentor",
                    )}
                    %
                  </span>
                </div>
                <div
                  className={`p-4 rounded-xl border flex flex-col justify-center shadow-2xs ${getPercentageColor(getStudentAttendancePercentage(selectedStudent.id, "admin"))}`}
                >
                  <span className="font-bold uppercase tracking-wider text-[10px] font-mono mb-1">
                    Bootcamp (Admin)
                  </span>
                  <span className="text-2xl font-black font-mono">
                    {getStudentAttendancePercentage(
                      selectedStudent.id,
                      "admin",
                    )}
                    %
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-center shadow-2xs">
                  <div className="text-2xl font-black text-emerald-500 font-mono">
                    {
                      getStudentHistory(selectedStudent.id).filter(
                        (s) => s.status === "Present",
                      ).length
                    }
                  </div>
                  <div className="text-[10px] font-mono font-bold text-emerald-500 uppercase tracking-wider mt-1">
                    Present
                  </div>
                </div>
                <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 text-center shadow-2xs">
                  <div className="text-2xl font-black text-rose-500 font-mono">
                    {
                      getStudentHistory(selectedStudent.id).filter(
                        (s) => s.status === "Absent",
                      ).length
                    }
                  </div>
                  <div className="text-[10px] font-mono font-bold text-rose-500 uppercase tracking-wider mt-1">
                    Absent
                  </div>
                </div>
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-center shadow-2xs">
                  <div className="text-2xl font-black text-amber-500 font-mono">
                    {
                      getStudentHistory(selectedStudent.id).filter(
                        (s) => s.status === "Late",
                      ).length
                    }
                  </div>
                  <div className="text-[10px] font-mono font-bold text-amber-500 uppercase tracking-wider mt-1">
                    Late
                  </div>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 text-center shadow-2xs">
                  <div className="text-2xl font-black text-blue-500 font-mono">
                    {
                      getStudentHistory(selectedStudent.id).filter(
                        (s) => s.status === "Excused",
                      ).length
                    }
                  </div>
                  <div className="text-[10px] font-mono font-bold text-blue-500 uppercase tracking-wider mt-1">
                    Excused
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-mono font-bold text-text-muted uppercase tracking-wider mb-3">
                  Session History
                </h4>
                <div className="space-y-2.5">
                  {getStudentHistory(selectedStudent.id).length > 0 ? (
                    getStudentHistory(selectedStudent.id).map((historyItem) => (
                      <div
                        key={historyItem.id}
                        className="flex items-center justify-between p-3 bg-surface-subtle border border-border rounded-xl shadow-2xs"
                      >
                        <div className="flex-1 min-w-0 pr-4">
                          <p className="text-xs sm:text-sm font-bold text-text-primary truncate">
                            {historyItem.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-md font-mono font-bold border ${historyItem.isMentorSession ? "bg-primary/10 text-primary border-primary/20" : "bg-surface border-border text-text-muted"}`}
                            >
                              {historyItem.isMentorSession
                                ? "Mentor Session"
                                : "Admin Session"}
                            </span>
                            <span className="text-[10px] text-text-muted font-mono">
                              • {historyItem.type.replace("_", " ")} •{" "}
                              {historyItem.date}
                            </span>
                          </div>
                        </div>
                        <span
                          className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            historyItem.status === "Present"
                              ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                              : historyItem.status === "Absent"
                                ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                                : historyItem.status === "Late"
                                  ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                  : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                          }`}
                        >
                          {historyItem.status}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-text-muted text-center py-4">
                      No past session records found.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end px-6 py-3 border-t border-border bg-surface-subtle">
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 rounded-xl bg-surface border border-border text-xs font-bold text-text-primary hover:bg-surface-subtle transition-colors shadow-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {savedSuccess && (
        <div className="fixed bottom-10 right-10 p-4 bg-emerald-500 text-white rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right-10 z-50">
          <FiCheckCircle size={24} />
          <span className="font-bold text-xs sm:text-sm">
            Attendance Saved Successfully!
          </span>
        </div>
      )}
    </div>
  );
}
