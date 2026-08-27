import React, { useState, useEffect, useMemo } from "react";

import {
  getStudentProgress,
  updateStudentProgressStatus,
} from "../../services/progressService";

import {
  Search,
  X,
  Loader2,
  CheckCircle2,
  Clock,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  BookOpen,
  Lock,
  Users,
  TrendingUp,
  ListChecks,
  UserCircle2,
} from "lucide-react";

export default function StudentProgress() {
  const [data, setData] = useState(null);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedColumnCell, setSelectedColumnCell] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);

    const result = await getStudentProgress();

    setData(result);

    setLoading(false);
  }

  const studentsList = data?.students || [];

  const calculateStudentTotal = (student) => {
    const topicsMap = student.progressMap || {};

    let totalScore = 0;
    let count = 0;

    Object.keys(topicsMap).forEach((topicKey) => {
      const items = Array.isArray(topicsMap[topicKey])
        ? topicsMap[topicKey]
        : [];

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

    if (count === 0) {
      return 0;
    }

    return Math.round(totalScore / count);
  };

  const calculateAdminOnlyTotal = (student) => {
    const topicsMap = student.progressMap || {};

    let totalScore = 0;
    let count = 0;

    Object.keys(topicsMap).forEach((topicKey) => {
      const items = Array.isArray(topicsMap[topicKey])
        ? topicsMap[topicKey]
        : [];

      items.forEach((item) => {
        if (item.releasedBy !== "admin") {
          return;
        }

        count++;

        const status = item.status || "Not Started";

        if (status === "Completed") {
          totalScore += 100;
        } else if (status === "In Progress" || status === "Needs Help") {
          totalScore += 50;
        }
      });
    });

    if (count === 0) {
      return 0;
    }

    return Math.round(totalScore / count);
  };

  const dynamicColumnsMap = new Map();

  studentsList.forEach((st) => {
    if (!st.progressMap) {
      return;
    }

    Object.keys(st.progressMap).forEach((topicKey) => {
      const items = st.progressMap[topicKey] || [];

      items.forEach((item) => {
        const colKey = item.id || `${topicKey}-${item.title}`.toLowerCase();

        if (!dynamicColumnsMap.has(colKey)) {
          dynamicColumnsMap.set(colKey, {
            key: colKey,
            topicKey,
            itemId: item.id,
            title: item.title || "Untitled Task",
            resourceType: item.resourceType || "Documentation",
            resourceLink: item.resourceLink || "",
            week: item.week || "1",
            instructions: item.instructions || "No instructions provided.",
            releasedBy: item.releasedBy || "admin",
            creatorName: item.creatorName || "System",
          });
        }
      });
    });
  });

  const progressColumns = Array.from(dynamicColumnsMap.values());

  const filteredStudents = studentsList.filter((st) => {
    const query = searchTerm.toLowerCase().trim();

    if (!query) {
      return true;
    }

    return (st.name || "").toLowerCase().includes(query);
  });

  const summaryStats = useMemo(() => {
    const selfStudent = studentsList.find((st) => st.isSelf);
    const myProgress = selfStudent ? calculateStudentTotal(selfStudent) : 0;
    const myAdminProgress = selfStudent
      ? calculateAdminOnlyTotal(selfStudent)
      : 0;

    let needsHelpCount = 0;

    studentsList.forEach((st) => {
      Object.values(st.progressMap || {}).forEach((items) => {
        (Array.isArray(items) ? items : []).forEach((item) => {
          if (item.status === "Needs Help") {
            needsHelpCount++;
          }
        });
      });
    });

    return {
      myProgress,
      myAdminProgress,
      studentCount: studentsList.length,
      taskCount: progressColumns.length,
      needsHelpCount,
    };
  }, [studentsList, progressColumns]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Completed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
            <CheckCircle2 size={11} />
            Completed
          </span>
        );

      case "In Progress":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200/60 dark:border-sky-800/60">
            <Clock size={11} />
            In Progress
          </span>
        );

      case "Needs Help":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/60">
            <HelpCircle size={11} />
            Needs Help
          </span>
        );

      case "Not Started":
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold bg-neutral-100 dark:bg-neutral-800/80 text-neutral-500 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700">
            <AlertCircle size={11} />
            Not Started
          </span>
        );
    }
  };
  const handleUpdateStatus = async (itemId, newStatus) => {
    if (saving || !itemId) {
      return;
    }

    setSaving(true);

    try {
      await updateStudentProgressStatus(itemId, newStatus);

      const refreshed = await getStudentProgress();

      setData(refreshed);

      if (selectedColumnCell) {
        const refreshedStudent = refreshed.students.find(
          (s) => s.isSelf,
        );

        const refreshedItems =
          (refreshedStudent?.progressMap || {})[
            selectedColumnCell.topicKey
          ] || [];

        const updatedStudentsInModal = selectedColumnCell.studentsData.map(
          (sObj) => {
            if (sObj.student.isSelf) {
              const updatedItems = refreshedItems.filter(
                (i) => i.id === itemId,
              );

              return {
                ...sObj,
                student: refreshedStudent || sObj.student,
                items: updatedItems,
              };
            }

            return sObj;
          },
        );

        setSelectedColumnCell({
          ...selectedColumnCell,
          studentsData: updatedStudentsInModal,
        });
      }
    } catch (err) {
      console.error("Update status error:", err);

      alert("Failed to update status. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const openProgressColumn = (col) => {
    if (!col.itemId) {
      return;
    }

    const studentsDataForColumn = filteredStudents.map((st) => {
      const itemsMap = st.progressMap || {};

      const topicItems = itemsMap[col.topicKey] || [];

      const matchedItems = topicItems.filter((i) => i.id === col.itemId);

      return {
        student: st,
        items: matchedItems,
      };
    });

    setSelectedColumnCell({
      columnKey: col.key,
      topicKey: col.topicKey,
      itemId: col.itemId,
      title: col.title,
      resourceType: col.resourceType,
      resourceLink: col.resourceLink,
      week: col.week,
      instructions: col.instructions,
      releasedBy: col.releasedBy,
      creatorName: col.creatorName,
      studentsData: studentsDataForColumn,
    });
  };
  return (
    <div className="flex h-screen w-full font-sans overflow-hidden bg-[#FAFBFC] dark:bg-[#0E1117] text-neutral-900 dark:text-neutral-100">
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <main className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-28 gap-2 text-xs text-neutral-500">
              <Loader2 className="animate-spin text-[#B91C1C]" size={20} />

              <span>Loading batch progress...</span>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
                    My Progress
                  </h2>

                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    See how your whole batch is tracking. You can only
                    update your own task statuses.
                  </p>
                </div>

                <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white dark:bg-[#151921] border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 shadow-2xs">
                  Batch: {data?.batchName || "N/A"}
                </span>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
                <div className="bg-white dark:bg-[#151921] rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 p-4 shadow-2xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                      My Progress
                    </span>
                    <div className="w-7 h-7 rounded-lg bg-[#B91C1C]/10 flex items-center justify-center text-[#B91C1C]">
                      <UserCircle2 size={13} />
                    </div>
                  </div>
                  <p className="text-2xl font-black text-neutral-900 dark:text-white">
                    {summaryStats.myProgress}%
                  </p>
                  <p className="text-[10px] text-neutral-400 mt-0.5">
                    admin + your mentor's tasks
                  </p>
                </div>

                <div className="bg-white dark:bg-[#151921] rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 p-4 shadow-2xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                      My Progress (Admin)
                    </span>
                    <div className="w-7 h-7 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500 dark:text-neutral-400">
                      <TrendingUp size={13} />
                    </div>
                  </div>
                  <p className="text-2xl font-black text-neutral-900 dark:text-white">
                    {summaryStats.myAdminProgress}%
                  </p>
                  <p className="text-[10px] text-neutral-400 mt-0.5">
                    admin-released tasks only
                  </p>
                </div>

                <div className="bg-white dark:bg-[#151921] rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 p-4 shadow-2xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                      Batchmates
                    </span>
                    <div className="w-7 h-7 rounded-lg bg-sky-50 dark:bg-sky-950/40 flex items-center justify-center text-sky-600 dark:text-sky-300">
                      <Users size={13} />
                    </div>
                  </div>
                  <p className="text-2xl font-black text-neutral-900 dark:text-white">
                    {summaryStats.studentCount}
                  </p>
                  <p className="text-[10px] text-neutral-400 mt-0.5">
                    in your batch
                  </p>
                </div>

                <div className="bg-white dark:bg-[#151921] rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 p-4 shadow-2xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                      Tasks Visible
                    </span>
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-300">
                      <ListChecks size={13} />
                    </div>
                  </div>
                  <p className="text-2xl font-black text-neutral-900 dark:text-white">
                    {summaryStats.taskCount}
                  </p>
                  <p className="text-[10px] text-neutral-400 mt-0.5">
                    released to you
                  </p>
                </div>
              </div>

              {/* Search */}
              <div className="bg-white dark:bg-[#151921] p-3.5 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-2xs max-w-sm">
                <div className="relative">
                  <Search
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                  />

                  <input
                    type="text"
                    placeholder="Search by student name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-lg text-xs bg-neutral-50/50 dark:bg-[#0E1117] border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:border-[#B91C1C]"
                  />
                </div>
              </div>

              {/* Main Table */}
              <div className="bg-white dark:bg-[#151921] rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 overflow-hidden shadow-sm">
                <div className="px-5 py-4 flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-neutral-600 dark:text-neutral-300">
                    Cohort Matrix ({filteredStudents.length} Students)
                  </h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-800/40 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                        <th className="py-3.5 px-5">Student Name</th>

                        <th className="py-3.5 px-4">Overall</th>

                        {progressColumns.length === 0 ? (
                          <th className="py-3.5 px-5 text-neutral-400 italic font-normal">
                            No progress tasks released for your batch yet
                          </th>
                        ) : (
                          progressColumns.map((col) => (
                            <th
                              key={col.key}
                              onClick={() => openProgressColumn(col)}
                              className="py-3.5 px-4 text-center cursor-pointer hover:bg-neutral-100/80 dark:hover:bg-neutral-800 transition-colors group"
                              title="Click to view full task details"
                            >
                              <span className="underline decoration-neutral-300 dark:decoration-neutral-700 underline-offset-2 group-hover:text-[#B91C1C]">
                                {col.title}
                              </span>

                              <span className="block text-[9px] text-neutral-400 font-normal normal-case mt-0.5">
                                Week {col.week} • {col.resourceType}
                              </span>
                            </th>
                          ))
                        )}
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
                      {filteredStudents.length === 0 ? (
                        <tr>
                          <td
                            colSpan={2 + Math.max(1, progressColumns.length)}
                            className="text-center py-12 text-neutral-400 text-xs"
                          >
                            No students match your search.
                          </td>
                        </tr>
                      ) : (
                        filteredStudents.map((st) => (
                          <tr
                            key={st.id}
                            className={`hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 transition-colors ${
                              st.isSelf
                                ? "bg-rose-50/40 dark:bg-rose-950/10"
                                : ""
                            }`}
                          >
                            <td className="py-3.5 px-5 font-semibold text-neutral-900 dark:text-neutral-100">
                              <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-[10px] font-bold text-neutral-600 dark:text-neutral-300 shadow-2xs">
                                  {st.initials ||
                                    st.name?.split(" ").map((n) => n[0]).join("")}
                                </div>

                                <div>
                                  <p className="font-semibold text-neutral-900 dark:text-white flex items-center gap-1.5">
                                    {st.name}
                                    {st.isSelf && (
                                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#B91C1C] text-white">
                                        You
                                      </span>
                                    )}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="py-3.5 px-4 font-black text-[#B91C1C]">
                              {calculateStudentTotal(st)}%
                            </td>

                            {progressColumns.length === 0 ? (
                              <td className="py-3.5 px-5 text-neutral-400">
                                -
                              </td>
                            ) : (
                              progressColumns.map((col) => {
                                const topicItems =
                                  (st.progressMap || {})[col.topicKey] || [];

                                const matchingItem = topicItems.find(
                                  (i) => i.id === col.itemId,
                                );

                                const cellStatus = matchingItem
                                  ? matchingItem.status
                                  : "Not Started";

                                return (
                                  <td
                                    key={col.key}
                                    onClick={() => openProgressColumn(col)}
                                    className="py-3.5 px-4 text-center cursor-pointer hover:bg-neutral-100/60 dark:hover:bg-neutral-800/70 transition-colors"
                                  >
                                    {getStatusBadge(cellStatus)}
                                  </td>
                                );
                              })
                            )}
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      {selectedColumnCell && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#151921] rounded-2xl border border-neutral-200 dark:border-neutral-800 w-full max-w-2xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4">
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 uppercase tracking-wider mb-1">
                  <BookOpen size={11} />
                  Week {selectedColumnCell.week} •{" "}
                  {selectedColumnCell.resourceType}
                </span>

                <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                  {selectedColumnCell.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedColumnCell(null)}
                className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Task Information */}
            <div className="p-4 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/50 space-y-3 text-xs">
              <h4 className="font-bold text-neutral-700 dark:text-neutral-200 uppercase tracking-wider text-[10px]">
                Task & Resource Information
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-neutral-400 block text-[10px]">
                    Released By
                  </span>

                  <span className="font-semibold text-neutral-800 dark:text-neutral-200 capitalize">
                    {selectedColumnCell.releasedBy} (
                    {selectedColumnCell.creatorName || "System"})
                  </span>
                </div>

                <div>
                  <span className="text-neutral-400 block text-[10px]">
                    Resource Type
                  </span>

                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                    {selectedColumnCell.resourceType}
                  </span>
                </div>
              </div>

              {selectedColumnCell.resourceLink && (
                <div>
                  <span className="text-neutral-400 block text-[10px] mb-0.5">
                    Resource Link / URL
                  </span>

                  <a
                    href={selectedColumnCell.resourceLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-semibold hover:underline break-all"
                  >
                    <span>{selectedColumnCell.resourceLink}</span>

                    <ExternalLink size={12} />
                  </a>
                </div>
              )}

              <div>
                <span className="text-neutral-400 block text-[10px] mb-0.5">
                  Instructions & Guidelines
                </span>

                <p className="text-neutral-700 dark:text-neutral-300 bg-white dark:bg-[#151921] p-3 rounded-lg border border-neutral-200/60 dark:border-neutral-800/80 whitespace-pre-wrap">
                  {selectedColumnCell.instructions}
                </p>
              </div>
            </div>

            {/* Student Status */}
            <div className="space-y-3">
              <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                Batch Status Breakdown
              </p>

              <div className="max-h-[35vh] overflow-y-auto pr-1 divide-y divide-neutral-100 dark:divide-neutral-800/80 border border-neutral-200/80 dark:border-neutral-800 rounded-xl bg-neutral-50/50 dark:bg-neutral-900/40">
                {selectedColumnCell.studentsData.map(({ student, items }) => {
                  const item = items[0];

                  return (
                    <div
                      key={student.id}
                      className={`p-3.5 flex items-center justify-between gap-4 ${
                        student.isSelf
                          ? "bg-rose-50/40 dark:bg-rose-950/10"
                          : ""
                      }`}
                    >
                      <div>
                        <p className="font-semibold text-neutral-900 dark:text-white text-xs flex items-center gap-1.5">
                          {student.name}
                          {student.isSelf && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#B91C1C] text-white">
                              You
                            </span>
                          )}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        {item ? (
                          <>
                            {getStatusBadge(item.status)}

                            {student.isSelf ? (
                              <select
                                value={item.status}
                                disabled={saving}
                                onChange={(e) =>
                                  handleUpdateStatus(item.id, e.target.value)
                                }
                                className="px-2.5 py-1 rounded-md text-xs bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 cursor-pointer focus:outline-none focus:border-[#B91C1C] disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <option value="Not Started">
                                  Not Started
                                </option>

                                <option value="In Progress">
                                  In Progress
                                </option>

                                <option value="Needs Help">Needs Help</option>

                                <option value="Completed">Completed</option>
                              </select>
                            ) : (
                              <Lock
                                size={13}
                                className="text-neutral-300 dark:text-neutral-700"
                                title="You can only update your own status"
                              />
                            )}
                          </>
                        ) : (
                          <span className="text-[11px] text-neutral-400 italic">
                            Not assigned
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedColumnCell(null)}
                className="px-4 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700 cursor-pointer"
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