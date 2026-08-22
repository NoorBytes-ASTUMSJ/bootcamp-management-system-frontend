import React, { useState, useEffect } from "react";
import {
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiSearch,
  FiCalendar,
  FiChevronDown,
  FiSave,
} from "react-icons/fi";

export default function MentorAttendance() {
  const [selectedBatch, setSelectedBatch] = useState(
    "Frontend Web Development - Batch 1",
  );
  const [selectedDate, setSelectedDate] = useState("2026-08-20");
  const [attendanceList, setAttendanceList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const MOCK_STUDENTS = [
    {
      id: 1,
      name: "Alex Johnson",
      email: "alex.johnson@example.com",
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent("Alex Johnson")}&background=F3F4F6&color=374151`,
      status: "Present",
    },
    {
      id: 2,
      name: "Maya Smith",
      email: "maya.smith@example.com",
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent("Maya Smith")}&background=F3F4F6&color=374151`,
      status: "Present",
    },
    {
      id: 3,
      name: "James Wilson",
      email: "james.wilson@example.com",
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent("James Wilson")}&background=F3F4F6&color=374151`,
      status: "Absent",
    },
    {
      id: 4,
      name: "Sophia Brown",
      email: "sophia.brown@example.com",
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent("Sophia Brown")}&background=F3F4F6&color=374151`,
      status: "Late",
    },
    {
      id: 5,
      name: "Liam Davis",
      email: "liam.davis@example.com",
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent("Liam Davis")}&background=F3F4F6&color=374151`,
      status: "Present",
    },
    {
      id: 6,
      name: "Olivia Miller",
      email: "olivia.miller@example.com",
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent("Olivia Miller")}&background=F3F4F6&color=374151`,
      status: "Present",
    },
    {
      id: 7,
      name: "Noah Martinez",
      email: "noah.martinez@example.com",
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent("Noah Martinez")}&background=F3F4F6&color=374151`,
      status: "Absent",
    },
    {
      id: 8,
      name: "Isabella Anderson",
      email: "isabella.anderson@example.com",
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent("Isabella Anderson")}&background=F3F4F6&color=374151`,
      status: "Present",
    },
  ];

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setAttendanceList(MOCK_STUDENTS);
      setLoading(false);
    }, 300);
  }, [selectedBatch, selectedDate]);

  const handleStatusChange = (id, newStatus) => {
    setAttendanceList((prev) =>
      prev.map((student) =>
        student.id === id ? { ...student, status: newStatus } : student,
      ),
    );
    setSavedSuccess(false);
  };

  const handleMarkAll = (status) => {
    setAttendanceList((prev) =>
      prev.map((student) => ({ ...student, status })),
    );
    setSavedSuccess(false);
  };

  const handleSaveAttendance = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const counts = {
    present: attendanceList.filter((s) => s.status === "Present").length,
    absent: attendanceList.filter((s) => s.status === "Absent").length,
    late: attendanceList.filter((s) => s.status === "Late").length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-100">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">
            Attendance Management
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Track and record daily student attendance for your sessions.
          </p>
        </div>

        <button
          onClick={handleSaveAttendance}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-bold text-sm rounded-lg hover:bg-primary-hover transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          <FiSave className="w-4 h-4" />
          Save Attendance
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-success/10 border border-success/20 text-success text-sm font-medium rounded-xl flex items-center gap-3 animate-in fade-in">
          <FiCheckCircle className="w-5 h-5 shrink-0" />
          Attendance records successfully saved for {selectedDate}!
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-surface border border-border shadow-sm rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center text-success shrink-0">
            <FiCheckCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm text-text-muted font-medium mb-0.5">
              Present Today
            </div>
            <div className="text-2xl font-black text-text-primary leading-none">
              {counts.present}
            </div>
            <div className="text-xs text-text-muted mt-1">
              Students in attendance
            </div>
          </div>
        </div>

        <div className="bg-surface border border-border shadow-sm rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center text-error shrink-0">
            <FiXCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm text-text-muted font-medium mb-0.5">
              Absent Today
            </div>
            <div className="text-2xl font-black text-text-primary leading-none">
              {counts.absent}
            </div>
            <div className="text-xs text-text-muted mt-1">
              Missing from session
            </div>
          </div>
        </div>

        <div className="bg-surface border border-border shadow-sm rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center text-warning shrink-0">
            <FiClock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm text-text-muted font-medium mb-0.5">
              Late Today
            </div>
            <div className="text-2xl font-black text-text-primary leading-none">
              {counts.late}
            </div>
            <div className="text-xs text-text-muted mt-1">
              Arrived past start time
            </div>
          </div>
        </div>
      </div>

      <div className="bg-surface border border-border shadow-sm rounded-xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 justify-between items-center bg-surface-subtle/30">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-72">
              <select
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                className="w-full appearance-none pl-3 pr-8 py-2 bg-surface border border-border rounded-lg text-sm text-text-primary font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer"
              >
                <option>Frontend Web Development - Batch 1</option>
                <option>Backend Engineering - Batch 2</option>
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
            </div>

            <div className="relative w-full sm:w-48">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
                <FiCalendar className="w-4 h-4" />
              </div>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-surface border border-border rounded-lg text-sm text-text-primary font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className="text-xs text-text-muted font-medium mr-1">
              Quick Mark:
            </span>
            <button
              onClick={() => handleMarkAll("Present")}
              className="px-3 py-1.5 bg-success/10 text-success hover:bg-success/20 text-xs font-bold rounded-lg transition-colors border border-success/20"
            >
              All Present
            </button>
            <button
              onClick={() => handleMarkAll("Absent")}
              className="px-3 py-1.5 bg-error/10 text-error hover:bg-error/20 text-xs font-bold rounded-lg transition-colors border border-error/20"
            >
              All Absent
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="border-b border-border bg-surface-subtle/10">
                <th className="py-3 px-5 text-xs font-bold text-text-muted uppercase tracking-wider">
                  Student
                </th>
                <th className="py-3 px-5 text-xs font-bold text-text-muted uppercase tracking-wider">
                  Email
                </th>
                <th className="py-3 px-5 text-xs font-bold text-text-muted uppercase tracking-wider text-center">
                  Status
                </th>
                <th className="py-3 px-5 text-xs font-bold text-text-muted uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {attendanceList.map((student) => (
                <tr
                  key={student.id}
                  className="hover:bg-surface-subtle/30 transition-colors"
                >
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-3">
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="w-9 h-9 rounded-full object-cover border border-border"
                      />
                      <div className="text-sm font-bold text-text-primary">
                        {student.name}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-5">
                    <div className="text-sm text-text-muted">
                      {student.email}
                    </div>
                  </td>
                  <td className="py-3 px-5 text-center">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-bold border ${
                        student.status === "Present"
                          ? "bg-success/10 text-success border-success/20"
                          : student.status === "Absent"
                            ? "bg-error/10 text-error border-error/20"
                            : "bg-warning/10 text-warning border-warning/20"
                      }`}
                    >
                      {student.status}
                    </span>
                  </td>
                  <td className="py-3 px-5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() =>
                          handleStatusChange(student.id, "Present")
                        }
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors border ${student.status === "Present" ? "bg-success text-success-foreground border-success" : "bg-surface text-text-muted border-border hover:border-success hover:text-success"}`}
                      >
                        Present
                      </button>
                      <button
                        onClick={() => handleStatusChange(student.id, "Absent")}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors border ${student.status === "Absent" ? "bg-error text-error-foreground border-error" : "bg-surface text-text-muted border-border hover:border-error hover:text-error"}`}
                      >
                        Absent
                      </button>
                      <button
                        onClick={() => handleStatusChange(student.id, "Late")}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors border ${student.status === "Late" ? "bg-warning text-warning-foreground border-warning" : "bg-surface text-text-muted border-border hover:border-warning hover:text-warning"}`}
                      >
                        Late
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
