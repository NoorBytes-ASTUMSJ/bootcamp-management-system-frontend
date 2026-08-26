import React, { useState, useEffect } from "react";
import { FiTrendingUp, FiAlertCircle, FiAward, FiSearch } from "react-icons/fi";

export default function MentorProgress() {
  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate an API call to fetch student progress
    const fetchProgress = async () => {
      try {
        setLoading(true);
        setTimeout(() => {
          setStudents([
            {
              id: 1,
              name: "Bilal Mohammed",
              assignmentsCompleted: 11,
              totalAssignments: 12,
              completionRate: 92,
              averageScore: 88,
              status: "On Track",
            },
            {
              id: 2,
              name: "Sumaya Ali",
              assignmentsCompleted: 12,
              totalAssignments: 12,
              completionRate: 100,
              averageScore: 95,
              status: "Excelling",
            },
            {
              id: 3,
              name: "Khalid Hassan",
              assignmentsCompleted: 5,
              totalAssignments: 12,
              completionRate: 41,
              averageScore: 65,
              status: "At Risk",
            },
            {
              id: 4,
              name: "Aisha Ahmed",
              assignmentsCompleted: 10,
              totalAssignments: 12,
              completionRate: 83,
              averageScore: 82,
              status: "On Track",
            },
          ]);
          setLoading(false);
        }, 800); // 800ms loading simulation
      } catch (error) {
        console.error("Failed to fetch progress", error);
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Shared modern card style
  const cardStyle =
    "bg-surface border border-border rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-primary/50 hover:-translate-y-0.5 transition-all duration-200";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-text-muted">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-medium">Loading student progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 animate-in fade-in duration-500 pb-12 px-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight">
            My Students Progress
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-0.5">
            Monitor the performance and completion rates of your specific
            mentees.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
          <input
            type="text"
            placeholder="Search my students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-surface-subtle border border-border rounded-xl text-xs sm:text-sm text-text-primary placeholder:text-text-muted/50 hover:border-primary hover:shadow-[0_0_0_1px_rgba(234,88,12,0.25)] focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all outline-none duration-150 shadow-2xs"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={`${cardStyle} flex items-center gap-4`}>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shrink-0">
            <FiAward className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-text-muted mb-1 uppercase tracking-wider">
              Excelling
            </p>
            <h4 className="text-2xl font-black text-text-primary leading-none">
              {students.filter((s) => s.status === "Excelling").length}
            </h4>
          </div>
        </div>

        <div className={`${cardStyle} flex items-center gap-4`}>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
            <FiTrendingUp className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-text-muted mb-1 uppercase tracking-wider">
              On Track
            </p>
            <h4 className="text-2xl font-black text-text-primary leading-none">
              {students.filter((s) => s.status === "On Track").length}
            </h4>
          </div>
        </div>

        <div className={`${cardStyle} flex items-center gap-4`}>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 shrink-0">
            <FiAlertCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-text-muted mb-1 uppercase tracking-wider">
              At Risk
            </p>
            <h4 className="text-2xl font-black text-text-primary leading-none">
              {students.filter((s) => s.status === "At Risk").length}
            </h4>
          </div>
        </div>
      </div>

      <div className={`${cardStyle} overflow-hidden p-0!`}>
        <div className="px-6 py-4 border-b border-border font-bold text-xs sm:text-sm text-text-primary flex justify-between items-center bg-surface-subtle/50 font-mono">
          <span className="uppercase tracking-wider">
            Mentee Performance Metrics
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border text-[11px] uppercase tracking-wider text-text-muted font-mono font-bold bg-surface-subtle">
                <th className="px-6 py-4 w-[30%]">Student Name</th>
                <th className="px-6 py-4 w-[20%]">Status</th>
                <th className="px-6 py-4 w-[30%]">Completion Rate</th>
                <th className="px-6 py-4 w-[20%] text-right">Avg Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredStudents.map((student) => (
                <tr
                  key={student.id}
                  className="hover:bg-surface-subtle/50 transition-colors"
                >
                  <td className="px-6 py-4 font-bold text-xs sm:text-sm text-text-primary">
                    {student.name}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                        student.status === "Excelling"
                          ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                          : student.status === "At Risk"
                            ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                            : "bg-primary/10 text-primary border border-primary/20"
                      }`}
                    >
                      {student.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-full bg-surface-subtle rounded-full h-2 max-w-30 overflow-hidden border border-border/60">
                        <div
                          className={`h-2 rounded-full ${
                            student.completionRate < 50
                              ? "bg-amber-500"
                              : "bg-primary"
                          }`}
                          style={{ width: `${student.completionRate}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-bold text-text-muted font-mono">
                        {student.completionRate}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-mono">
                    <span className="text-sm font-black text-text-primary">
                      {student.averageScore}
                    </span>
                    <span className="text-xs text-text-muted font-medium">
                      /100
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredStudents.length === 0 && (
            <div className="text-center py-12 text-xs text-text-muted">
              No assigned students found matching your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
