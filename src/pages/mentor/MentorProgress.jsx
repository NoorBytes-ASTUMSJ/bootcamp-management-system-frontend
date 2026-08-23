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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-text-muted">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p>Loading student progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-300 space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-bold text-text-primary tracking-tight">
            My Students Progress
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            Monitor the performance and completion rates of your specific
            mentees.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
          <input
            type="text"
            placeholder="Search my students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-surface border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary transition-shadow"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface border border-border rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10 text-success">
            <FiAward className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-text-primary mb-1">
              Excelling
            </p>
            <h4 className="text-2xl font-bold text-text-primary leading-none">
              {students.filter((s) => s.status === "Excelling").length}
            </h4>
          </div>
        </div>
        <div className="bg-surface border border-border rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <FiTrendingUp className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-text-primary mb-1">On Track</p>
            <h4 className="text-2xl font-bold text-text-primary leading-none">
              {students.filter((s) => s.status === "On Track").length}
            </h4>
          </div>
        </div>
        <div className="bg-surface border border-border rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/10 text-warning">
            <FiAlertCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-text-primary mb-1">At Risk</p>
            <h4 className="text-2xl font-bold text-text-primary leading-none">
              {students.filter((s) => s.status === "At Risk").length}
            </h4>
          </div>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-border font-bold text-sm text-text-primary flex justify-between items-center">
          <span>Mentee Performance Metrics</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border text-[11px] uppercase tracking-wider text-text-muted font-bold bg-surface-subtle">
                <th className="px-6 py-3.5 w-[30%]">Student Name</th>
                <th className="px-6 py-3.5 w-[20%]">Status</th>
                <th className="px-6 py-3.5 w-[30%]">Completion Rate</th>
                <th className="px-6 py-3.5 w-[20%] text-right">Avg Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {filteredStudents.map((student) => (
                <tr
                  key={student.id}
                  className="hover:bg-surface-subtle transition-colors"
                >
                  <td className="px-6 py-4 font-bold text-sm text-text-primary">
                    {student.name}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        student.status === "Excelling"
                          ? "bg-success/10 text-success"
                          : student.status === "At Risk"
                            ? "bg-warning/10 text-warning"
                            : "bg-primary/10 text-primary"
                      }`}
                    >
                      {student.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-full bg-surface-muted rounded-full h-2 max-w-[120px]">
                        <div
                          className={`h-2 rounded-full ${
                            student.completionRate < 50
                              ? "bg-warning"
                              : "bg-primary"
                          }`}
                          style={{ width: `${student.completionRate}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-bold text-text-muted">
                        {student.completionRate}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
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
            <div className="text-center py-8 text-sm text-text-muted">
              No assigned students found matching your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
