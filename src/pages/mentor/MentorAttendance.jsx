import React, { useState, useEffect, useRef } from "react";
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

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 pb-10 px-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-surface border border-border p-4 rounded-2xl shadow-sm">
        <div className="relative w-full lg:w-72" ref={searchRef}>
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search saved sessions..."
            value={sessionSearch}
            onFocus={() => setShowSearchResults(true)}
            onChange={(e) => {
              setSessionSearch(e.target.value);
              setShowSearchResults(true);
            }}
            className="w-full pl-9 pr-4 py-2 bg-surface-subtle hover:bg-surface-muted border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary transition-all"
          />

          {showSearchResults && sessionSearch.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-border rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
              {filteredSessions.length > 0 ? (
                <div className="p-1">
                  {filteredSessions.map((session) => (
                    <button
                      key={session.id}
                      onClick={() => handleSearchSelect(session)}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-surface-subtle rounded-md transition-colors border border-transparent flex flex-col"
                    >
                      <span className="font-bold text-foreground truncate">
                        {session.title}
                      </span>
                      <span className="text-xs text-muted">{session.date}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-sm text-muted">
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
            className={`p-2 rounded-lg transition-colors border ${isPrevDisabled ? "text-disabled border-transparent cursor-not-allowed opacity-50" : "text-muted hover:bg-surface-subtle hover:text-primary border-transparent hover:border-border"}`}
          >
            <FiChevronLeft className="w-5 h-5" />
          </button>

          <div className="text-center px-4 min-w-[160px]">
            <h1 className="text-sm font-bold text-foreground uppercase tracking-[1px]">
              {isHistoryView
                ? `Session ${pastSessions.length - currentSessionIndex}`
                : "New Session"}
            </h1>
            <p className="text-[11px] font-bold text-muted mt-0.5">
              {selectedDate}
            </p>
          </div>

          <button
            onClick={handleNextSession}
            disabled={isNextDisabled}
            className={`p-2 rounded-lg transition-colors border ${isNextDisabled ? "text-disabled border-transparent cursor-not-allowed opacity-50" : "text-muted hover:bg-surface-subtle hover:text-primary border-transparent hover:border-border"}`}
          >
            <FiChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
          {isHistoryView && (
            <button
              onClick={() => loadSessionData(-1)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-surface-subtle border border-border text-foreground font-bold text-xs rounded-lg hover:bg-surface-muted transition-colors shadow-sm"
            >
              <FiPlus className="w-4 h-4" /> New
            </button>
          )}
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-primary text-white font-bold text-sm rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
          >
            <FiSave /> {isHistoryView ? "Update Record" : "Save Session"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-surface border border-border shadow-sm rounded-xl p-5 flex items-center gap-4 hover:border-border-strong transition-colors">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-success/10 flex items-center justify-center text-success shrink-0">
            <FiCheckCircle className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div>
            <div className="text-xs md:text-sm text-muted font-medium mb-0.5">
              Present Today
            </div>
            <div className="text-xl md:text-2xl font-black text-foreground leading-none">
              {counts.present}
            </div>
          </div>
        </div>
        <div className="bg-surface border border-border shadow-sm rounded-xl p-5 flex items-center gap-4 hover:border-border-strong transition-colors">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-error/10 flex items-center justify-center text-error shrink-0">
            <FiXCircle className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div>
            <div className="text-xs md:text-sm text-muted font-medium mb-0.5">
              Absent Today
            </div>
            <div className="text-xl md:text-2xl font-black text-foreground leading-none">
              {counts.absent}
            </div>
          </div>
        </div>
        <div className="bg-surface border border-border shadow-sm rounded-xl p-5 flex items-center gap-4 hover:border-border-strong transition-colors">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-warning/10 flex items-center justify-center text-warning shrink-0">
            <FiClock className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div>
            <div className="text-xs md:text-sm text-muted font-medium mb-0.5">
              Late Today
            </div>
            <div className="text-xl md:text-2xl font-black text-foreground leading-none">
              {counts.late}
            </div>
          </div>
        </div>
        <div className="bg-surface border border-border shadow-sm rounded-xl p-5 flex items-center gap-4 hover:border-border-strong transition-colors">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-info/10 flex items-center justify-center text-info shrink-0">
            <FiInfo className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div>
            <div className="text-xs md:text-sm text-muted font-medium mb-0.5">
              Excused Today
            </div>
            <div className="text-xl md:text-2xl font-black text-foreground leading-none">
              {counts.excused}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
        <h3 className="text-xs font-black text-muted uppercase tracking-widest mb-6">
          Session Configuration
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-8 flex flex-col justify-end space-y-3">
            <label className="text-[11px] font-black text-muted uppercase ml-1">
              Session Title <span className="text-error">*</span>
            </label>
            <div className="relative">
              <FiFileText className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                value={sessionTitle}
                onChange={(e) => setSessionTitle(e.target.value)}
                placeholder="Day 01: Introduction to React"
                className="w-full pl-11 pr-4 h-[48px] bg-surface-subtle hover:bg-surface-muted border border-border rounded-xl text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
            </div>
          </div>

          <div className="md:col-span-4 flex flex-col justify-end space-y-3">
            <label className="text-[11px] font-black text-muted uppercase ml-1">
              Date
            </label>
            <Popover>
              <PopoverTrigger>
                <div className="w-full justify-start text-left font-normal pl-4 h-[48px] bg-surface-subtle border border-border rounded-xl hover:bg-surface-muted hover:text-foreground text-foreground transition-all flex items-center cursor-pointer">
                  <FiCalendar className="mr-4 h-4 w-4 text-muted" />
                  {selectedDate ? (
                    format(new Date(selectedDate), "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-50 bg-surface border border-border shadow-xl">
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

          <div className="md:col-span-4 flex flex-col justify-end space-y-3">
            <label className="text-[11px] font-black text-muted uppercase ml-1">
              Session Type <span className="text-error">*</span>
            </label>
            <Select value={sessionType} onValueChange={setSessionType}>
              <SelectTrigger className="w-full pl-4 h-[48px] bg-surface-subtle hover:bg-surface-muted border-border rounded-xl text-sm focus:ring-primary text-foreground transition-all">
                <SelectValue placeholder="Select session type" />
              </SelectTrigger>
              <SelectContent className="z-50 bg-surface border border-border shadow-xl">
                {SESSION_TYPES.map((type) => (
                  <SelectItem
                    key={type.value}
                    value={type.value}
                    className="cursor-pointer hover:bg-surface-subtle"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-primary">{type.icon}</span>{" "}
                      {type.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-8 flex flex-col justify-end space-y-3">
            <label className="text-[11px] font-black text-muted uppercase ml-1">
              Description
            </label>
            <div className="relative">
              <FiAlignLeft className="absolute left-4 top-4 text-muted" />
              <textarea
                rows="1"
                value={sessionDescription}
                onChange={(e) => setSessionDescription(e.target.value)}
                placeholder="Overview of today's topics..."
                className="w-full pl-11 pr-4 py-3 min-h-[48px] bg-surface-subtle hover:bg-surface-muted border border-border rounded-xl text-sm text-foreground focus:border-primary outline-none transition-all resize-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-border bg-surface-subtle/30 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <h3 className="text-xs font-black text-muted uppercase tracking-widest">
            Student Roster
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => handleMarkAll("Present")}
              className="px-3 py-2 h-[36px] text-[10px] font-black uppercase bg-success/10 text-success rounded-lg border border-success/20 hover:bg-success/20 transition-all whitespace-nowrap"
            >
              All Present
            </button>
            <button
              onClick={() => handleMarkAll("Absent")}
              className="px-3 py-2 h-[36px] text-[10px] font-black uppercase bg-error/10 text-error rounded-lg border border-error/20 hover:bg-error/20 transition-all whitespace-nowrap"
            >
              All Absent
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead>
              <tr className="bg-surface-subtle/50 text-[10px] font-black text-muted uppercase tracking-widest border-b border-border">
                <th className="px-3 py-3">Student</th>
                <th className="px-3 py-3">Email</th>
                <th className="px-3 py-3 text-center">Overall %</th>
                <th className="px-3 py-3 text-center">Status</th>
                <th className="px-3 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {attendanceList.length > 0 ? (
                attendanceList.map((student) => {
                  const perc = getStudentAttendancePercentage(
                    student.id,
                    "all",
                  );
                  const colorClass = getPercentageColor(perc);
                  return (
                    <tr
                      key={student.id}
                      className="group hover:bg-surface-subtle/30 transition-all"
                    >
                      <td className="px-3 py-3">
                        <button
                          onClick={() => setSelectedStudent(student)}
                          className="flex items-center gap-3 w-full text-left hover:opacity-80 transition-opacity focus:outline-none"
                        >
                          <img
                            src={student.avatar}
                            className="w-9 h-9 rounded-full border border-border group-hover:border-primary transition-all shrink-0"
                            alt="Avatar"
                          />
                          <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors whitespace-nowrap">
                            {student.name}
                          </span>
                        </button>
                      </td>
                      <td className="px-3 py-3 text-sm text-muted whitespace-nowrap">
                        {student.email}
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span
                          className={`px-2 py-1 rounded text-xs font-bold border ${colorClass}`}
                        >
                          {perc}%
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border whitespace-nowrap
                          ${
                            student.status === "Present"
                              ? "bg-success/10 text-success border-success/20"
                              : student.status === "Absent"
                                ? "bg-error/10 text-error border-error/20"
                                : student.status === "Late"
                                  ? "bg-warning/10 text-warning border-warning/20"
                                  : "bg-info/10 text-info border-info/20"
                          }`}
                        >
                          {student.status}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() =>
                              handleStatusChange(student.id, "Present")
                            }
                            className={`px-2 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all border whitespace-nowrap
                            ${student.status === "Present" ? "bg-success text-white border-success shadow-md shadow-success/20" : "bg-surface-subtle text-muted border-border hover:bg-surface-muted hover:border-success hover:text-success"}`}
                          >
                            Present
                          </button>
                          <button
                            onClick={() =>
                              handleStatusChange(student.id, "Absent")
                            }
                            className={`px-2 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all border whitespace-nowrap
                            ${student.status === "Absent" ? "bg-error text-white border-error shadow-md shadow-error/20" : "bg-surface-subtle text-muted border-border hover:bg-surface-muted hover:border-error hover:text-error"}`}
                          >
                            Absent
                          </button>
                          <button
                            onClick={() =>
                              handleStatusChange(student.id, "Late")
                            }
                            className={`px-2 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all border whitespace-nowrap
                            ${student.status === "Late" ? "bg-warning text-white border-warning shadow-md shadow-warning/20" : "bg-surface-subtle text-muted border-border hover:bg-surface-muted hover:border-warning hover:text-warning"}`}
                          >
                            Late
                          </button>
                          <button
                            onClick={() =>
                              handleStatusChange(student.id, "Excused")
                            }
                            className={`px-2 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all border whitespace-nowrap
                            ${student.status === "Excused" ? "bg-info text-white border-info shadow-md shadow-info/20" : "bg-surface-subtle text-muted border-border hover:bg-surface-muted hover:border-info hover:text-info"}`}
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
                    className="text-center py-8 text-sm text-muted"
                  >
                    No students assigned to your batch yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-surface border border-border rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <FiUser className="text-primary" /> Student Record
              </h2>
              <button
                onClick={() => setSelectedStudent(null)}
                className="p-2 rounded-lg text-muted hover:bg-surface-subtle hover:text-primary transition-colors focus:outline-none"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 overflow-y-auto custom-scrollbar flex-1">
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={selectedStudent.avatar}
                  alt={selectedStudent.name}
                  className="w-16 h-16 rounded-full border-2 border-border"
                />
                <div>
                  <h3 className="text-xl font-bold text-foreground">
                    {selectedStudent.name}
                  </h3>
                  <p className="text-sm text-muted">{selectedStudent.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div
                  className={`p-4 rounded-xl border flex flex-col justify-center ${getPercentageColor(getStudentAttendancePercentage(selectedStudent.id, "mentor"))}`}
                >
                  <span className="font-bold uppercase tracking-wider text-[10px] mb-1">
                    Mentor Sessions (Yours)
                  </span>
                  <span className="text-2xl font-black">
                    {getStudentAttendancePercentage(
                      selectedStudent.id,
                      "mentor",
                    )}
                    %
                  </span>
                </div>
                <div
                  className={`p-4 rounded-xl border flex flex-col justify-center ${getPercentageColor(getStudentAttendancePercentage(selectedStudent.id, "admin"))}`}
                >
                  <span className="font-bold uppercase tracking-wider text-[10px] mb-1">
                    Bootcamp (Admin)
                  </span>
                  <span className="text-2xl font-black">
                    {getStudentAttendancePercentage(
                      selectedStudent.id,
                      "admin",
                    )}
                    %
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                <div className="bg-success/10 border border-success/20 rounded-xl p-3 text-center">
                  <div className="text-2xl font-black text-success">
                    {
                      getStudentHistory(selectedStudent.id).filter(
                        (s) => s.status === "Present",
                      ).length
                    }
                  </div>
                  <div className="text-[10px] font-bold text-success uppercase tracking-wider mt-1">
                    Present
                  </div>
                </div>
                <div className="bg-error/10 border border-error/20 rounded-xl p-3 text-center">
                  <div className="text-2xl font-black text-error">
                    {
                      getStudentHistory(selectedStudent.id).filter(
                        (s) => s.status === "Absent",
                      ).length
                    }
                  </div>
                  <div className="text-[10px] font-bold text-error uppercase tracking-wider mt-1">
                    Absent
                  </div>
                </div>
                <div className="bg-warning/10 border border-warning/20 rounded-xl p-3 text-center">
                  <div className="text-2xl font-black text-warning">
                    {
                      getStudentHistory(selectedStudent.id).filter(
                        (s) => s.status === "Late",
                      ).length
                    }
                  </div>
                  <div className="text-[10px] font-bold text-warning uppercase tracking-wider mt-1">
                    Late
                  </div>
                </div>
                <div className="bg-info/10 border border-info/20 rounded-xl p-3 text-center">
                  <div className="text-2xl font-black text-info">
                    {
                      getStudentHistory(selectedStudent.id).filter(
                        (s) => s.status === "Excused",
                      ).length
                    }
                  </div>
                  <div className="text-[10px] font-bold text-info uppercase tracking-wider mt-1">
                    Excused
                  </div>
                </div>
              </div>

              <h4 className="text-xs font-bold text-muted uppercase tracking-wider mb-3">
                Session History
              </h4>
              <div className="space-y-3">
                {getStudentHistory(selectedStudent.id).length > 0 ? (
                  getStudentHistory(selectedStudent.id).map((historyItem) => (
                    <div
                      key={historyItem.id}
                      className="flex items-center justify-between p-3 bg-surface-subtle border border-border rounded-lg"
                    >
                      <div className="flex-1 min-w-0 pr-4">
                        <p className="text-sm font-bold text-foreground truncate">
                          {historyItem.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded font-bold border ${historyItem.isMentorSession ? "bg-primary/10 text-primary border-primary/20" : "bg-surface border-border text-muted"}`}
                          >
                            {historyItem.isMentorSession
                              ? "Mentor Session"
                              : "Admin Session"}
                          </span>
                          <span className="text-[10px] text-muted">
                            • {historyItem.type.replace("_", " ")} •{" "}
                            {historyItem.date}
                          </span>
                        </div>
                      </div>
                      <span
                        className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          historyItem.status === "Present"
                            ? "bg-success/10 text-success border-success/20"
                            : historyItem.status === "Absent"
                              ? "bg-error/10 text-error border-error/20"
                              : historyItem.status === "Late"
                                ? "bg-warning/10 text-warning border-warning/20"
                                : "bg-info/10 text-info border-info/20"
                        }`}
                      >
                        {historyItem.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted text-center py-4">
                    No past session records found.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {savedSuccess && (
        <div className="fixed bottom-10 right-10 p-4 bg-success text-white rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right-10 z-50">
          <FiCheckCircle size={24} />
          <span className="font-bold">Attendance Saved Successfully!</span>
        </div>
      )}
    </div>
  );
}
