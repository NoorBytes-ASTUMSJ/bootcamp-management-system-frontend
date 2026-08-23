import React, { useState } from "react";
import { FiSearch, FiUsers, FiStar } from "react-icons/fi";

export default function AllMembers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showOnlyMyGroup, setShowOnlyMyGroup] = useState(false);

  const MY_GROUP_ID = 1;

  // Mock data updated to include the new table columns (Attendance, Progress, University)
  const [members] = useState([
    {
      id: 1,
      name: "Ahmed Mansour",
      role: "Mentor",
      group: "All",
      email: "ahmed.m@astu.edu.et",
      github: "ahmed-man",
      attendance: "100%",
      progress: 100,
      university: "ASTU",
    },
    {
      id: 2,
      name: "Bilal Mohammed",
      role: "Student",
      group: 1,
      email: "bilal.m@aau.edu.et",
      github: "bilal-dev",
      attendance: "92%",
      progress: 78,
      university: "AAU",
    },
    {
      id: 3,
      name: "Sumaya Ali",
      role: "Student",
      group: 1,
      email: "sumaya.a@astu.edu.et",
      github: "sumaya-codes",
      attendance: "96%",
      progress: 88,
      university: "ASTU",
    },
    {
      id: 4,
      name: "Tariq Rahman",
      role: "Student",
      group: 2,
      email: "tariq.r@ju.edu.et",
      github: "tariq-r",
      attendance: "82%",
      progress: 65,
      university: "JU",
    },
    {
      id: 5,
      name: "Fatima Zahra",
      role: "Student",
      group: 2,
      email: "fatima.z@hu.edu.et",
      github: "f-zahra",
      attendance: "68%",
      progress: 42,
      university: "HU",
    },
    {
      id: 6,
      name: "Yusuf Ibrahim",
      role: "Student",
      group: 1,
      email: "yusuf.i@astu.edu.et",
      github: "yusuf-ib",
      attendance: "88%",
      progress: 70,
      university: "ASTU",
    },
    {
      id: 7,
      name: "Zainab Hassan",
      role: "Student",
      group: 3,
      email: "zainab.h@aau.edu.et",
      github: "zainab-h",
      attendance: "95%",
      progress: 91,
      university: "AAU",
    },
    {
      id: 8,
      name: "Omar Farooq",
      role: "Student",
      group: 3,
      email: "omar.f@ju.edu.et",
      github: "omar-f",
      attendance: "75%",
      progress: 55,
      university: "JU",
    },
  ]);

  // Derived metrics for the top counters
  const totalStudents = members.filter((m) => m.role === "Student").length;
  const totalMentors = members.filter((m) => m.role === "Mentor").length;
  const myGroupSize = members.filter((m) => m.group === MY_GROUP_ID).length;

  const filteredMembers = members.filter((member) => {
    const matchesSearch = member.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesGroup = showOnlyMyGroup
      ? member.group === MY_GROUP_ID || member.role === "Mentor"
      : true;
    return matchesSearch && matchesGroup;
  });

  return (
    <div className="mx-auto w-full max-w-300 space-y-8 animate-in fade-in duration-500 pb-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-bold text-text-primary tracking-tight">
            Batch Members
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            Connect with your batch peers and coordinate with your project
            group.
          </p>
        </div>
      </div>

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
              {totalStudents}
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
              {totalMentors}
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
              {myGroupSize}
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
            <FiUsers className="w-3.5 h-3.5" /> My Group
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
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
              {filteredMembers.map((member) => (
                <tr
                  key={member.id}
                  className="hover:bg-surface-subtle transition-colors group"
                >
                  {/* Member Column */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=F3F4F6&color=374151`}
                        alt={`${member.name} profile`}
                        className="w-8 h-8 rounded-full border border-border group-hover:border-primary/50 transition-colors shrink-0 object-cover"
                      />
                      <span className="text-sm font-bold text-text-primary">
                        {member.name}
                      </span>
                    </div>
                  </td>

                  {/* Email Column */}
                  <td className="px-6 py-4">
                    <span className="text-sm text-text-muted">
                      {member.email}
                    </span>
                  </td>

                  {/* Attendance Column */}
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-text-primary">
                      {member.attendance}
                    </span>
                  </td>

                  {/* Progress Column */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-1.5 bg-surface-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#B91C1C] rounded-full"
                          style={{ width: `${member.progress}%` }}
                        />
                      </div>
                      <span className="text-sm text-text-muted font-medium">
                        {member.progress}%
                      </span>
                    </div>
                  </td>

                  {/* University Badge Column */}
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600">
                      {member.university}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Empty State */}
          {filteredMembers.length === 0 && (
            <div className="text-center py-12 px-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-surface-muted text-text-muted mb-3 border border-border">
                <FiSearch className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-text-primary mb-1">
                No members found
              </h3>
              <p className="text-text-muted text-xs">
                We couldn't find anyone matching your current search in this
                view.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
