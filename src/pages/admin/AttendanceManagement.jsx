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
  FiBookOpen,
  FiAward,
  FiMessageCircle,
  FiStar,
  FiInfo,
  FiLayers,
} from "react-icons/fi";

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

export default function AttendanceManagement() {
  const [sessionTitle, setSessionTitle] = useState("");
  const [sessionDescription, setSessionDescription] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [sessionType, setSessionType] = useState("lecture");
  const [selectedBatch, setSelectedBatch] = useState("");

  const [attendanceList, setAttendanceList] = useState([]);
  const [pastSessions, setPastSessions] = useState([]);
  const [currentSessionIndex, setCurrentSessionIndex] = useState(-1);
  const [sessionSearch, setSessionSearch] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [genderFilter, setGenderFilter] = useState("All");

  const [batches, setBatches] = useState([]);

  const searchRef = useRef(null);

  const SESSION_TYPES = [
    {
      label: "Lecture",
      value: "lecture",
      icon: <FiBookOpen className="w-4 h-4" />,
    },
    {
      label: "Contest",
      value: "contest",
      icon: <FiAward className="w-4 h-4" />,
    },
    {
      label: "Experience Sharing",
      value: "experience_sharing",
      icon: <FiMessageCircle className="w-4 h-4" />,
    },
    {
      label: "Showcase",
      value: "showcase",
      icon: <FiStar className="w-4 h-4" />,
    },
  ];

  const isHistoryView = currentSessionIndex !== -1;

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const batchRes = await API.get("/batches");
        const fetchedBatches = (batchRes.data.data?.batches || []).map((b) => ({
          id: b._id,
          name: b.name,
        }));
        setBatches(fetchedBatches);

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

          const rawGender = record.member?.user?.gender || "All";
          const formattedGender =
            rawGender !== "All"
              ? rawGender.charAt(0).toUpperCase() + rawGender.slice(1)
              : "All";

          groupedSessions[sessionKey].attendance.push({
            id: record.member?._id,
            name: record.member?.user?.fullName || "Unknown User",
            email: record.member?.user?.email || "No Email",
            avatar:
              record.member?.user?.avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(record.member?.user?.fullName || "U")}&background=F3F4F6&color=374151`,
            status: formattedStatus,
            gender: formattedGender,
          });
        });

        setPastSessions(Object.values(groupedSessions));
      } catch (error) {
        console.error("Error loading initial data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();

    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target))
        setShowSearchResults(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchStudentsForBatch = async () => {
      if (!selectedBatch || isHistoryView) return;

      try {
        const res = await API.get(`/members/students?batch=${selectedBatch}`);

        const membersList = res.data.data?.students || res.data.students || [];

        const formattedStudents = membersList.map((m) => {
          const rawGender = m.user?.gender || "All";

          const formattedGender =
            rawGender !== "All"
              ? rawGender.charAt(0).toUpperCase() + rawGender.slice(1)
              : "All";

          return {
            id: m._id,
            name: m.user?.fullName || "Unknown",
            email: m.user?.email || "No email",
            gender: formattedGender,
            avatar:
              m.user?.avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(m.user?.fullName || "U")}&background=F3F4F6&color=374151`,
            status: "Present",
          };
        });

        setAttendanceList(formattedStudents);
      } catch (err) {
        console.error("Failed to fetch batch students:", err);
      }
    };

    fetchStudentsForBatch();
  }, [selectedBatch, isHistoryView]);

  useEffect(() => {
    if (!loading) loadSessionData(-1);
  }, [loading]);

  const loadSessionData = (index) => {
    setCurrentSessionIndex(index);
    if (index === -1) {
      setSessionTitle("");
      setSessionDescription("");
      setSessionType("lecture");
      setSelectedBatch("");
      setSelectedDate(new Date().toISOString().split("T")[0]);
      setAttendanceList([]);
    } else {
      const session = pastSessions[index];
      setSessionTitle(session.title);
      setSessionDescription(session.description || "");
      setSessionType(session.type);
      setSelectedBatch(session.batch || "");
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
      prev.map((student) => {
        if (genderFilter === "All" || student.gender === genderFilter) {
          return { ...student, status };
        }
        return student;
      }),
    );
  };

  const handleSave = async () => {
    if (!selectedBatch) {
      alert("Please select a batch before saving.");
      return;
    }
    if (!sessionTitle.trim()) {
      alert("Session Title is required.");
      return;
    }
    if (attendanceList.length === 0) {
      alert("No students found in this batch to save attendance for.");
      return;
    }

    const payload = {
      sessionTopic: sessionTitle,
      date: selectedDate,
      sessionType: sessionType,
      batchId: selectedBatch,
      records: attendanceList.map((student) => ({
        member: student.id,
        status: student.status.toLowerCase(),
        notes: sessionDescription,
      })),
    };

    try {
      await API.post("/attendance/bulk", payload);

      const updatedSessionUI = {
        id: `${selectedDate}-${sessionTitle}`,
        title: sessionTitle,
        description: sessionDescription,
        date: selectedDate,
        type: sessionType,
        batch: selectedBatch,
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
        status: record ? record.status : "No Record",
      };
    });
  };

  const getStudentAttendancePercentage = (studentId) => {
    if (pastSessions.length === 0) return 100;
    let score = 0;
    let validSessions = 0;

    pastSessions.forEach((session) => {
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

  const displayStudents = attendanceList.filter(
    (s) => genderFilter === "All" || s.gender === genderFilter,
  );

  const counts = {
    present: displayStudents.filter((s) => s.status === "Present").length,
    absent: displayStudents.filter((s) => s.status === "Absent").length,
    late: displayStudents.filter((s) => s.status === "Late").length,
    excused: displayStudents.filter((s) => s.status === "Excused").length,
  };

  const isPrevDisabled =
    pastSessions.length === 0 || currentSessionIndex >= pastSessions.length - 1;
  const isNextDisabled = currentSessionIndex === -1;

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-[#FAFBFC] dark:bg-[#0E1117]">
        <div className="w-8 h-8 border-4 border-[#B91C1C] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="w-full font-sans bg-[#FAFBFC] dark:bg-[#0E1117] text-neutral-900 dark:text-neutral-100 transition-colors">
      <div className="flex-1 flex flex-col min-w-0">
        <main className="px-8 py-6 space-y-6">
          <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 pb-10 w-full">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 p-4 rounded-2xl shadow-md shadow-neutral-200/50 dark:shadow-none">
              <div className="relative w-full lg:w-72" ref={searchRef}>
                <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search saved sessions..."
                  value={sessionSearch}
                  onFocus={() => setShowSearchResults(true)}
                  onChange={(e) => {
                    setSessionSearch(e.target.value);
                    setShowSearchResults(true);
                  }}
                  className="w-full pl-9 pr-4 py-2 bg-neutral-50 dark:bg-[#0E1117] border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-[#B91C1C] transition-all shadow-xs"
                />

                {showSearchResults && sessionSearch.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#151921] border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto p-1.5">
                    {filteredSessions.length > 0 ? (
                      <div className="space-y-1">
                        {filteredSessions.map((session) => (
                          <button
                            key={session.id}
                            onClick={() => handleSearchSelect(session)}
                            className="w-full text-left px-3 py-2 text-xs hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors flex flex-col cursor-pointer"
                          >
                            <span className="font-bold text-neutral-900 dark:text-white truncate">
                              {session.title}
                            </span>
                            <span className="text-[10px] text-neutral-400 mt-0.5">
                              {session.date}
                            </span>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-xs text-neutral-400">
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
                  className={`p-2 rounded-xl transition-colors border cursor-pointer ${isPrevDisabled ? "text-neutral-300 dark:text-neutral-700 border-transparent cursor-not-allowed opacity-50" : "text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-[#B91C1C] border-transparent"}`}
                >
                  <FiChevronLeft className="w-5 h-5" />
                </button>

                <div className="text-center px-4 min-w-40">
                  <h1 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                    {isHistoryView
                      ? `Session ${pastSessions.length - currentSessionIndex}`
                      : "New Session"}
                  </h1>
                  <p className="text-[10px] font-medium text-neutral-400 mt-0.5">
                    {selectedDate}
                  </p>
                </div>

                <button
                  onClick={handleNextSession}
                  disabled={isNextDisabled}
                  className={`p-2 rounded-xl transition-colors border cursor-pointer ${isNextDisabled ? "text-neutral-300 dark:text-neutral-700 border-transparent cursor-not-allowed opacity-50" : "text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-[#B91C1C] border-transparent"}`}
                >
                  <FiChevronRight className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-2.5 w-full lg:w-auto justify-end">
                {isHistoryView && (
                  <button
                    onClick={() => loadSessionData(-1)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 font-semibold text-xs rounded-xl hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer shadow-xs"
                  >
                    <FiPlus className="w-4 h-4" /> New
                  </button>
                )}
                <button
                  onClick={handleSave}
                  className="px-5 py-2 bg-[#B91C1C] hover:bg-[#991B1B] text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shadow-red-500/10 cursor-pointer hover:-translate-y-0.5"
                >
                  <FiSave /> {isHistoryView ? "Update Record" : "Save Session"}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-md shadow-neutral-200/50 dark:shadow-none rounded-2xl p-5 flex items-center gap-4 transition-all duration-300 hover:border-[#B91C1C]/50 hover:-translate-y-1">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 shrink-0">
                  <FiCheckCircle className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div>
                  <div className="text-xs text-neutral-400 font-medium mb-0.5">
                    Present Today
                  </div>
                  <div className="text-xl md:text-2xl font-black text-neutral-900 dark:text-white leading-none">
                    {counts.present}
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-md shadow-neutral-200/50 dark:shadow-none rounded-2xl p-5 flex items-center gap-4 transition-all duration-300 hover:border-[#B91C1C]/50 hover:-translate-y-1">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center text-rose-600 shrink-0">
                  <FiXCircle className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div>
                  <div className="text-xs text-neutral-400 font-medium mb-0.5">
                    Absent Today
                  </div>
                  <div className="text-xl md:text-2xl font-black text-neutral-900 dark:text-white leading-none">
                    {counts.absent}
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-md shadow-neutral-200/50 dark:shadow-none rounded-2xl p-5 flex items-center gap-4 transition-all duration-300 hover:border-[#B91C1C]/50 hover:-translate-y-1">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center text-amber-600 shrink-0">
                  <FiClock className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div>
                  <div className="text-xs text-neutral-400 font-medium mb-0.5">
                    Late Today
                  </div>
                  <div className="text-xl md:text-2xl font-black text-neutral-900 dark:text-white leading-none">
                    {counts.late}
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 shadow-md shadow-neutral-200/50 dark:shadow-none rounded-2xl p-5 flex items-center gap-4 transition-all duration-300 hover:border-[#B91C1C]/50 hover:-translate-y-1">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-sky-50 dark:bg-sky-950/40 flex items-center justify-center text-sky-600 shrink-0">
                  <FiInfo className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div>
                  <div className="text-xs text-neutral-400 font-medium mb-0.5">
                    Excused Today
                  </div>
                  <div className="text-xl md:text-2xl font-black text-neutral-900 dark:text-white leading-none">
                    {counts.excused}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 rounded-2xl p-6 shadow-md shadow-neutral-200/50 dark:shadow-none">
              <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-5">
                Session Configuration
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                <div className="md:col-span-6 flex flex-col justify-end space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    Session Title <span className="text-[#B91C1C]">*</span>
                  </label>
                  <div className="relative">
                    <FiFileText className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="text"
                      value={sessionTitle}
                      onChange={(e) => setSessionTitle(e.target.value)}
                      placeholder="Overall Bootcamp Assembly..."
                      className="w-full pl-9 pr-4 py-2 bg-neutral-50 dark:bg-[#0E1117] border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-[#B91C1C] transition-all shadow-xs"
                    />
                  </div>
                </div>

                <div className="md:col-span-3 flex flex-col justify-end space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    Batch <span className="text-[#B91C1C]">*</span>
                  </label>
                  <Select
                    value={selectedBatch}
                    onValueChange={setSelectedBatch}
                  >
                    <SelectTrigger className="w-full pl-3.5 py-2 bg-neutral-50 dark:bg-[#0E1117] border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-[#B91C1C] shadow-xs">
                      <SelectValue placeholder="Select batch">
                        {batches.find((b) => b.id === selectedBatch)?.name ||
                          "Select batch"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="z-50 bg-white dark:bg-[#151921] border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-xl p-1">
                      {batches.map((batch) => (
                        <SelectItem
                          key={batch.id}
                          value={batch.id}
                          className="cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <FiLayers className="text-[#B91C1C] w-3.5 h-3.5" />{" "}
                            {batch.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-3 flex flex-col justify-end space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    Date <span className="text-[#B91C1C]">*</span>
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <div className="w-full justify-start text-left font-normal pl-3.5 py-2 bg-neutral-50 dark:bg-[#0E1117] border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs text-neutral-900 dark:text-neutral-100 flex items-center cursor-pointer transition-all shadow-xs">
                        <FiCalendar className="mr-3 h-3.5 w-3.5 text-neutral-400" />
                        {selectedDate ? (
                          format(new Date(selectedDate), "MMM d, yyyy")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 z-50 bg-white dark:bg-[#151921] border border-neutral-200 dark:border-neutral-700 rounded-2xl shadow-xl">
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

                <div className="md:col-span-9 flex flex-col justify-end space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    Description
                  </label>
                  <div className="relative">
                    <FiAlignLeft className="absolute left-3.5 top-3 text-neutral-400" />
                    <textarea
                      rows="1"
                      value={sessionDescription}
                      onChange={(e) => setSessionDescription(e.target.value)}
                      placeholder="Overview of today's topics..."
                      className="w-full pl-9 pr-4 py-2 bg-neutral-50 dark:bg-[#0E1117] border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-[#B91C1C] transition-all shadow-xs resize-none"
                    />
                  </div>
                </div>

                <div className="md:col-span-3 flex flex-col justify-end space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    Session Type <span className="text-[#B91C1C]">*</span>
                  </label>
                  <Select value={sessionType} onValueChange={setSessionType}>
                    <SelectTrigger className="w-full pl-3.5 py-2 bg-neutral-50 dark:bg-[#0E1117] border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-[#B91C1C] shadow-xs">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="z-50 bg-white dark:bg-[#151921] border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-xl p-1">
                      {SESSION_TYPES.map((type) => (
                        <SelectItem
                          key={type.value}
                          value={type.value}
                          className="cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-[#B91C1C]">{type.icon}</span>
                            {type.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#151921] border border-neutral-200/80 dark:border-neutral-800/80 rounded-2xl overflow-hidden shadow-md shadow-neutral-200/50 dark:shadow-none">
              <div className="p-4 border-b border-neutral-100 dark:border-neutral-800 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-neutral-50/50 dark:bg-neutral-800/30">
                <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  Student Roster{" "}
                  {selectedBatch
                    ? `(Loaded from Database)`
                    : `(Select a Batch first)`}
                </h3>
                <div className="flex flex-wrap items-center gap-3">
                  <Select value={genderFilter} onValueChange={setGenderFilter}>
                    <SelectTrigger className="w-32 h-8 bg-white dark:bg-[#0E1117] border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs font-medium text-neutral-700 dark:text-neutral-300 focus:outline-none focus:border-[#B91C1C] shadow-xs">
                      <SelectValue placeholder="Filter Gender" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-[#151921] border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-xl p-1 text-xs">
                      <SelectItem value="All" className="rounded-lg">
                        All Genders
                      </SelectItem>
                      <SelectItem value="Male" className="rounded-lg">
                        Male
                      </SelectItem>
                      <SelectItem value="Female" className="rounded-lg">
                        Female
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleMarkAll("Present")}
                      className="px-3 py-1.5 text-[10px] font-bold uppercase bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 rounded-xl border border-emerald-200/50 dark:border-emerald-800/40 hover:bg-emerald-100 transition-all whitespace-nowrap cursor-pointer shadow-xs"
                    >
                      All Present
                    </button>
                    <button
                      onClick={() => handleMarkAll("Absent")}
                      className="px-3 py-1.5 text-[10px] font-bold uppercase bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 rounded-xl border border-rose-200/50 dark:border-rose-800/40 hover:bg-rose-100 transition-all whitespace-nowrap cursor-pointer shadow-xs"
                    >
                      All Absent
                    </button>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                      <th className="py-3.5 px-5">Student</th>
                      <th className="py-3.5 px-4">Email</th>
                      <th className="py-3.5 px-4 text-center">Gender</th>
                      <th className="py-3.5 px-4 text-center">Overall %</th>
                      <th className="py-3.5 px-4 text-center">Status</th>
                      <th className="py-3.5 px-5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
                    {displayStudents.length > 0 ? (
                      displayStudents.map((student) => {
                        const perc = getStudentAttendancePercentage(student.id);
                        const colorClass = getPercentageColor(perc);

                        return (
                          <tr
                            key={student.id}
                            className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/50 transition-colors"
                          >
                            <td className="py-4 px-5">
                              <button
                                onClick={() => setSelectedStudent(student)}
                                className="flex items-center gap-3 w-full text-left hover:opacity-80 transition-opacity focus:outline-none cursor-pointer"
                              >
                                <img
                                  src={student.avatar}
                                  className="w-8 h-8 rounded-full border border-neutral-200 dark:border-neutral-700 shrink-0"
                                  alt="Avatar"
                                />
                                <span className="font-semibold text-neutral-900 dark:text-neutral-100 whitespace-nowrap">
                                  {student.name}
                                </span>
                              </button>
                            </td>
                            <td className="py-4 px-4 text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                              {student.email}
                            </td>
                            <td className="py-4 px-4 text-center text-neutral-600 dark:text-neutral-300 capitalize">
                              {student.gender}
                            </td>
                            <td className="py-4 px-4 text-center">
                              <span
                                className={`px-2 py-0.5 rounded-lg text-xs font-bold border ${colorClass}`}
                              >
                                {perc}%
                              </span>
                            </td>
                            <td className="py-4 px-4 text-center">
                              <span
                                className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border whitespace-nowrap
                                ${
                                  student.status === "Present"
                                    ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200/50 dark:border-emerald-800/40"
                                    : student.status === "Absent"
                                      ? "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200/50 dark:border-rose-800/40"
                                      : student.status === "Late"
                                        ? "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200/50 dark:border-amber-800/40"
                                        : "bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-200/50 dark:border-sky-800/40"
                                }`}
                              >
                                {student.status}
                              </span>
                            </td>
                            <td className="py-4 px-5 text-right">
                              <div className="flex justify-end gap-1.5">
                                <button
                                  onClick={() =>
                                    handleStatusChange(student.id, "Present")
                                  }
                                  className={`px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase transition-all border whitespace-nowrap cursor-pointer shadow-xs
                                  ${student.status === "Present" ? "bg-emerald-600 text-white border-emerald-600" : "bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:border-emerald-500 hover:text-emerald-600"}`}
                                >
                                  Present
                                </button>
                                <button
                                  onClick={() =>
                                    handleStatusChange(student.id, "Absent")
                                  }
                                  className={`px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase transition-all border whitespace-nowrap cursor-pointer shadow-xs
                                  ${student.status === "Absent" ? "bg-rose-600 text-white border-rose-600" : "bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:border-rose-500 hover:text-rose-600"}`}
                                >
                                  Absent
                                </button>
                                <button
                                  onClick={() =>
                                    handleStatusChange(student.id, "Late")
                                  }
                                  className={`px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase transition-all border whitespace-nowrap cursor-pointer shadow-xs
                                  ${student.status === "Late" ? "bg-amber-600 text-white border-amber-600" : "bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:border-amber-500 hover:text-amber-600"}`}
                                >
                                  Late
                                </button>
                                <button
                                  onClick={() =>
                                    handleStatusChange(student.id, "Excused")
                                  }
                                  className={`px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase transition-all border whitespace-nowrap cursor-pointer shadow-xs
                                  ${student.status === "Excused" ? "bg-sky-600 text-white border-sky-600" : "bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:border-sky-500 hover:text-sky-600"}`}
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
                          colSpan="6"
                          className="text-center py-12 text-xs text-neutral-400"
                        >
                          {selectedBatch
                            ? "No students found in this batch."
                            : "Please select a batch above to load the student roster."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {selectedStudent && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
              <div className="bg-white dark:bg-[#151921] border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 dark:border-neutral-800">
                  <h2 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                    <FiUser className="text-[#B91C1C]" /> Student Record
                  </h2>
                  <button
                    onClick={() => setSelectedStudent(null)}
                    className="p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 rounded-lg cursor-pointer"
                  >
                    <FiX size={16} />
                  </button>
                </div>
                <div className="p-6 overflow-y-auto space-y-5 text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedStudent.avatar}
                      alt={selectedStudent.name}
                      className="w-12 h-12 rounded-full border border-neutral-200 dark:border-neutral-700 shrink-0"
                    />
                    <div>
                      <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
                        {selectedStudent.name}
                      </h3>
                      <p className="text-neutral-400 mt-0.5">
                        {selectedStudent.email}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`p-3.5 rounded-xl border flex items-center justify-between ${getPercentageColor(getStudentAttendancePercentage(selectedStudent.id))}`}
                  >
                    <span className="font-bold uppercase tracking-wider text-[10px]">
                      Overall Attendance Health
                    </span>
                    <span className="text-lg font-black">
                      {getStudentAttendancePercentage(selectedStudent.id)}%
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/50 dark:border-emerald-800/40 rounded-xl p-3 text-center">
                      <div className="text-lg font-black text-emerald-700 dark:text-emerald-300">
                        {
                          getStudentHistory(selectedStudent.id).filter(
                            (s) => s.status === "Present",
                          ).length
                        }
                      </div>
                      <div className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider mt-0.5">
                        Present
                      </div>
                    </div>
                    <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200/50 dark:border-rose-800/40 rounded-xl p-3 text-center">
                      <div className="text-lg font-black text-rose-700 dark:text-rose-300">
                        {
                          getStudentHistory(selectedStudent.id).filter(
                            (s) => s.status === "Absent",
                          ).length
                        }
                      </div>
                      <div className="text-[9px] font-bold text-rose-600 uppercase tracking-wider mt-0.5">
                        Absent
                      </div>
                    </div>
                    <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200/50 dark:border-amber-800/40 rounded-xl p-3 text-center">
                      <div className="text-lg font-black text-amber-700 dark:text-amber-300">
                        {
                          getStudentHistory(selectedStudent.id).filter(
                            (s) => s.status === "Late",
                          ).length
                        }
                      </div>
                      <div className="text-[9px] font-bold text-amber-600 uppercase tracking-wider mt-0.5">
                        Late
                      </div>
                    </div>
                    <div className="bg-sky-50 dark:bg-sky-950/40 border border-sky-200/50 dark:border-sky-800/40 rounded-xl p-3 text-center">
                      <div className="text-lg font-black text-sky-700 dark:text-sky-300">
                        {
                          getStudentHistory(selectedStudent.id).filter(
                            (s) => s.status === "Excused",
                          ).length
                        }
                      </div>
                      <div className="text-[9px] font-bold text-sky-600 uppercase tracking-wider mt-0.5">
                        Excused
                      </div>
                    </div>
                  </div>

                  <h4 className="font-bold text-neutral-400 uppercase tracking-wider text-[10px] pt-1">
                    Session History
                  </h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {getStudentHistory(selectedStudent.id).length > 0 ? (
                      getStudentHistory(selectedStudent.id).map(
                        (historyItem) => (
                          <div
                            key={historyItem.id}
                            className="flex items-center justify-between p-2.5 bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800 rounded-xl"
                          >
                            <div className="flex-1 min-w-0 pr-3">
                              <p className="font-semibold text-neutral-900 dark:text-white truncate">
                                {historyItem.title}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[9px] bg-white dark:bg-[#0E1117] border border-neutral-200 dark:border-neutral-700 px-1.5 py-0.5 rounded text-neutral-400">
                                  {historyItem.type}
                                </span>
                                <span className="text-[10px] text-neutral-400">
                                  {historyItem.date}
                                </span>
                              </div>
                            </div>
                            <span
                              className={`shrink-0 px-2.5 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider border ${
                                historyItem.status === "Present"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : historyItem.status === "Absent"
                                    ? "bg-rose-50 text-rose-700 border-rose-200"
                                    : historyItem.status === "Late"
                                      ? "bg-amber-50 text-amber-700 border-amber-200"
                                      : "bg-sky-50 text-sky-700 border-sky-200"
                              }`}
                            >
                              {historyItem.status}
                            </span>
                          </div>
                        ),
                      )
                    ) : (
                      <p className="text-neutral-400 text-center py-4">
                        No past session records found.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {savedSuccess && (
            <div className="fixed bottom-10 right-10 p-4 bg-emerald-600 text-white rounded-2xl shadow-xl flex items-center gap-3 animate-in slide-in-from-right-10 z-50 text-xs font-bold">
              <FiCheckCircle size={18} />
              <span>Attendance Saved Successfully!</span>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
