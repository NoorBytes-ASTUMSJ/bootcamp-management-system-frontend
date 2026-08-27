import React, { useEffect, useMemo, useState } from "react";
import {
  getProgressOverview,
  createProgressItem,
  updateStudentProgressStatus,
  deleteProgressItem,
} from "../../services/progressService";

import {
  Search,
  X,
  Loader2,
  Trash2,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  BookOpen,
  Users,
  TrendingUp,
  ListChecks,
} from "lucide-react";

export default function MentorProgress({
  isDarkMode,
  onToggleTheme,
  onNavigateAdminView,
  onLogout,

  
  currentUserId = null,

  currentUserName = "Mentor",
}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedColumnCell, setSelectedColumnCell] = useState(null);

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [newProgressForm, setNewProgressForm] = useState({
    title: "",
    topic: "",
    resourceType: "Documentation",
    resourceLink: "",
    week: "1",
    instructions: "",
  });


  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);

    try {
    
      const overview = await getProgressOverview();

      setData(overview);
    } catch (error) {
      console.error("Failed to load mentor progress:", error);

      setData({
        students: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const studentsList = data?.students || [];
  const mentorBatch = useMemo(() => {
    if (studentsList.length === 0) {
      return null;
    }

    const firstStudentWithBatch = studentsList.find(
      (student) => student.batchId || student.batch,
    );

    if (!firstStudentWithBatch) {
      return null;
    }

    return {
      id: firstStudentWithBatch.batchId || null,
      name: firstStudentWithBatch.batch || "My Batch",
    };
  }, [studentsList]);


  const filteredStudents = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();

    if (!query) {
      return studentsList;
    }

    return studentsList.filter((student) => {
      const name = student.name || student.studentName || "";

      const email = student.email || "";

      const track = student.track || "";

      return (
        name.toLowerCase().includes(query) ||
        email.toLowerCase().includes(query) ||
        track.toLowerCase().includes(query)
      );
    });
  }, [studentsList, searchTerm]);

 
  const progressColumns = useMemo(() => {
    const columnsMap = new Map();

    studentsList.forEach((student) => {
      const progressMap = student.progressMap || {};

      Object.keys(progressMap).forEach((topicKey) => {
        const items = Array.isArray(progressMap[topicKey])
          ? progressMap[topicKey]
          : [];

        items.forEach((item) => {
          const itemId = item.id || item._id;

          if (!itemId) {
            console.warn("Progress item has no ID:", item);

            return;
          }

          const columnKey = String(itemId);

          if (!columnsMap.has(columnKey)) {
            columnsMap.set(columnKey, {
              key: columnKey,

              topicKey,

              // ProgressTask._id
              itemId: columnKey,
              title: item.title || "Untitled Task",
              resourceType: item.resourceType || "Documentation",
              resourceLink: item.resourceLink || "",
              week: item.week?.toString() || "1",
              instructions: item.instructions || "No instructions provided.",
              releasedBy: item.releasedBy || "mentor",
              creatorName: item.creatorName || currentUserName || "Mentor",
            });
          }
        });
      });
    });

    return Array.from(columnsMap.values());
  }, [studentsList, currentUserName]);

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

  const summaryStats = useMemo(() => {
    let totalTasksAssigned = 0;
    let completedCount = 0;
    let needsHelpCount = 0;
    let progressSum = 0;

    studentsList.forEach((student) => {
      const topicsMap = student.progressMap || {};

      Object.keys(topicsMap).forEach((topicKey) => {
        const items = Array.isArray(topicsMap[topicKey])
          ? topicsMap[topicKey]
          : [];

        items.forEach((item) => {
          totalTasksAssigned++;

          const status = item.status || "Not Started";

          if (status === "Completed") {
            completedCount++;
          } else if (status === "Needs Help") {
            needsHelpCount++;
          }
        });
      });

      progressSum += calculateStudentTotal(student);
    });

    const averageProgress =
      studentsList.length > 0
        ? Math.round(progressSum / studentsList.length)
        : 0;

    return {
      studentCount: studentsList.length,
      taskCount: progressColumns.length,
      averageProgress,
      completedCount,
      needsHelpCount,
      totalTasksAssigned,
    };
  }, [studentsList, progressColumns]);

 
  const openTaskDetails = (column) => {

    const mentorStudents = studentsList.filter((student) => {
     
      if (currentUserId && student.mentorId) {
        return String(student.mentorId) === String(currentUserId);
      }

      return true;
    });

    const studentsDataForColumn = mentorStudents.map((student) => {
      const topicItems = (student.progressMap || {})[column.topicKey] || [];

      const matchedItems = topicItems.filter(
        (item) => String(item.id || item._id) === String(column.itemId),
      );

      return {
        student,
        items: matchedItems,
      };
    });

    setSelectedColumnCell({
      columnKey: column.key,
      topicKey: column.topicKey,
      itemId: column.itemId,
      title: column.title,
      resourceType: column.resourceType,
      resourceLink: column.resourceLink,
      week: column.week,
      instructions: column.instructions,
      releasedBy: column.releasedBy,
      creatorName: column.creatorName,
      studentsData: studentsDataForColumn,
    });
  };

  const handleCreateProgressItem = async (e) => {
    e.preventDefault();

    if (saving) {
      return;
    }

    if (!newProgressForm.title.trim()) {
      alert("Please enter a task title.");
      return;
    }

    if (!newProgressForm.topic.trim()) {
      alert("Please enter a topic.");
      return;
    }

    setSaving(true);

    try {
     

      await createProgressItem({
        title: newProgressForm.title,

        topic: newProgressForm.topic,

        resourceType: newProgressForm.resourceType,

        resourceLink: newProgressForm.resourceLink,

        week: newProgressForm.week,

        instructions: newProgressForm.instructions,

        scope: "mentor",
      });

      // Reload data
      await loadData();

      setIsCreateOpen(false);

      setNewProgressForm({
        title: "",
        topic: "",
        resourceType: "Documentation",
        resourceLink: "",
        week: "1",
        instructions: "",
      });
    } catch (error) {
      console.error("Failed to create mentor progress task:", error);

      const message =
        error?.response?.data?.message ||
        "Failed to create progress task. Please try again.";

      alert(message);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateItemStatus = async (
    studentId,
    topicKey,
    itemId,
    newStatus,
  ) => {
    if (saving) {
      return;
    }

    if (!itemId) {
      console.error("Cannot update progress: invalid task ID", itemId);

      return;
    }

    setSaving(true);

    try {
      await updateStudentProgressStatus(itemId, newStatus);

      const previousModal = selectedColumnCell;

      await loadData();

      if (previousModal) {
        const refreshedStudents = data?.students || [];

        const refreshedStudent = refreshedStudents.find(
          (student) => String(student.id) === String(studentId),
        );

        if (refreshedStudent) {
          const refreshedItems =
            (refreshedStudent.progressMap || {})[topicKey] || [];

          const updatedStudents = previousModal.studentsData.map(
            (studentData) => {
              if (String(studentData.student.id) === String(studentId)) {
                return {
                  ...studentData,

                  student: refreshedStudent,

                  items: refreshedItems.filter(
                    (item) => String(item.id || item._id) === String(itemId),
                  ),
                };
              }

              return studentData;
            },
          );

          setSelectedColumnCell({
            ...previousModal,
            studentsData: updatedStudents,
          });
        }
      }
    } catch (error) {
      console.error("Failed to update progress status:", error);

      alert("Failed to update status. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteColumnProgressItem = async (targetItemId) => {
    if (saving) {
      return;
    }

    if (!targetItemId) {
      console.error("Cannot delete progress task: invalid ID", targetItemId);

      alert("Cannot delete this task because its ID is missing.");

      return;
    }

    setSaving(true);

    try {
      /*
       * targetItemId is ProgressTask._id.
       */
      await deleteProgressItem(targetItemId);

      await loadData();

      setSelectedColumnCell(null);
    } catch (error) {
      console.error("Failed to delete mentor progress task:", error);

      const message =
        error?.response?.data?.message ||
        "Failed to delete progress task. Please try again.";

      alert(message);
    } finally {
      setSaving(false);
    }
  };
  return (
    <div className="flex h-screen w-full font-sans overflow-hidden bg-[#FAFBFC] dark:bg-[#0E1117] text-neutral-900 dark:text-neutral-100">
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <main className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-28 gap-2 text-xs text-neutral-500">
              <Loader2 className="animate-spin text-[#B91C1C]" size={20} />

              <span>Loading mentor progress...</span>
            </div>
          ) : (
            <>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
                    Progress Management
                  </h2>

                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    {mentorBatch
                      ? `Managing students in ${mentorBatch.name}`
                      : "Managing your assigned batch students"}
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsCreateOpen(true)}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-[#B91C1C] hover:bg-[#991b1b] text-white rounded-lg text-xs font-bold shadow-sm transition-all cursor-pointer"
                  >
                    <Plus size={14} />

                    <span>Create Progress Task</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
                <div className="bg-white dark:bg-[#151921] rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 p-4 shadow-2xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                      Students
                    </span>
                    <div className="w-7 h-7 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500 dark:text-neutral-400">
                      <Users size={13} />
                    </div>
                  </div>
                  <p className="text-2xl font-black text-neutral-900 dark:text-white">
                    {summaryStats.studentCount}
                  </p>
                  <p className="text-[10px] text-neutral-400 mt-0.5">
                    assigned to you
                  </p>
                </div>

                <div className="bg-white dark:bg-[#151921] rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 p-4 shadow-2xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                      Avg. Progress
                    </span>
                    <div className="w-7 h-7 rounded-lg bg-[#B91C1C]/10 flex items-center justify-center text-[#B91C1C]">
                      <TrendingUp size={13} />
                    </div>
                  </div>
                  <p className="text-2xl font-black text-neutral-900 dark:text-white">
                    {summaryStats.averageProgress}%
                  </p>
                  <p className="text-[10px] text-neutral-400 mt-0.5">
                    across your students
                  </p>
                </div>

                <div className="bg-white dark:bg-[#151921] rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 p-4 shadow-2xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                      Tasks Released
                    </span>
                    <div className="w-7 h-7 rounded-lg bg-sky-50 dark:bg-sky-950/40 flex items-center justify-center text-sky-600 dark:text-sky-300">
                      <ListChecks size={13} />
                    </div>
                  </div>
                  <p className="text-2xl font-black text-neutral-900 dark:text-white">
                    {summaryStats.taskCount}
                  </p>
                  <p className="text-[10px] text-neutral-400 mt-0.5">
                    admin + your own
                  </p>
                </div>

                <div className="bg-white dark:bg-[#151921] rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 p-4 shadow-2xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                      Needs Help
                    </span>
                    <div className="w-7 h-7 rounded-lg bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center text-rose-600 dark:text-rose-300">
                      <HelpCircle size={13} />
                    </div>
                  </div>
                  <p className="text-2xl font-black text-neutral-900 dark:text-white">
                    {summaryStats.needsHelpCount}
                  </p>
                  <p className="text-[10px] text-neutral-400 mt-0.5">
                    flagged items
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-[#151921] p-3.5 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-2xs">
                <div className="relative max-w-md">
                  <Search
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                  />

                  <input
                    type="text"
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-lg text-xs bg-neutral-50/50 dark:bg-[#0E1117] border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:border-[#B91C1C]"
                  />
                </div>
              </div>


              <div className="bg-white dark:bg-[#151921] rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 overflow-hidden shadow-sm">
                <div className="px-5 py-4 flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-neutral-600 dark:text-neutral-300">
                    Batch Students
                  </h3>

                  <span className="text-[11px] text-neutral-400 font-medium">
                    {filteredStudents.length} Students
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-800/40 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                        <th className="py-3.5 px-5">Student Name</th>

                        <th className="py-3.5 px-4">Overall</th>

                        {progressColumns.length === 0 ? (
                          <th className="py-3.5 px-5 text-neutral-400 italic font-normal">
                            No progress tasks released for this batch yet
                          </th>
                        ) : (
                          progressColumns.map((column) => (
                            <th
                              key={column.key}
                              onClick={() => openTaskDetails(column)}
                              className="py-3.5 px-4 text-center cursor-pointer hover:bg-neutral-100/80 dark:hover:bg-neutral-800 transition-colors group"
                              title="Click to view task details and your students' statuses"
                            >
                              <span className="underline decoration-neutral-300 dark:decoration-neutral-700 underline-offset-2 group-hover:text-[#B91C1C]">
                                {column.title}
                              </span>

                              <span className="block text-[9px] text-neutral-400 font-normal normal-case mt-0.5">
                                Week {column.week} • {column.resourceType}
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
                            No students found.
                          </td>
                        </tr>
                      ) : (
                        filteredStudents.map((student) => {
                          const computedTotal = calculateStudentTotal(student);

                          return (
                            <tr
                              key={student.id}
                              className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 transition-colors"
                            >
                              {/* STUDENT */}

                              <td className="py-3.5 px-5 font-semibold text-neutral-900 dark:text-neutral-100">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-7 h-7 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-[10px] font-bold text-neutral-600 dark:text-neutral-300">
                                    {student.initials ||
                                      (student.name || "S")
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                  </div>

                                  <div>
                                    <p className="font-semibold text-neutral-900 dark:text-white">
                                      {student.name}
                                    </p>

                                    <p className="text-[10px] text-neutral-400 font-normal">
                                      {student.email}
                                    </p>
                                  </div>
                                </div>
                              </td>

                              {/* OVERALL */}

                              <td className="py-3.5 px-4 font-black text-[#B91C1C]">
                                {computedTotal}%
                              </td>

                              {/* TASK COLUMNS */}

                              {progressColumns.length === 0 ? (
                                <td className="py-3.5 px-5 text-neutral-400">
                                  -
                                </td>
                              ) : (
                                progressColumns.map((column) => {
                                  const topicItems =
                                    (student.progressMap || {})[
                                      column.topicKey
                                    ] || [];

                                  const matchingItem = topicItems.find(
                                    (item) =>
                                      String(item.id || item._id) ===
                                      String(column.itemId),
                                  );

                                  const cellStatus = matchingItem
                                    ? matchingItem.status
                                    : "Not Started";

                                  return (
                                    <td
                                      key={column.key}
                                      onClick={() => openTaskDetails(column)}
                                      className="py-3.5 px-4 text-center cursor-pointer hover:bg-neutral-100/60 dark:hover:bg-neutral-800/70 transition-colors"
                                    >
                                      {getStatusBadge(cellStatus)}
                                    </td>
                                  );
                                })
                              )}
                            </tr>
                          );
                        })
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
            {/* HEADER */}

            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4">
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 uppercase tracking-wider mb-1">
                  <BookOpen size={11} />
                  Week {selectedColumnCell.week}
                  {" • "}
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

            {/* TASK INFORMATION */}

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
                    {selectedColumnCell.creatorName})
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

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                  My Students' Status
                </p>

                <button
                  type="button"
                  disabled={saving}
                  onClick={() => {
                    const confirmed = window.confirm(
                      `Are you sure you want to delete "${selectedColumnCell.title}"?`,
                    );

                    if (confirmed) {
                      handleDeleteColumnProgressItem(selectedColumnCell.itemId);
                    }
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 size={13} />

                  <span>Delete Task</span>
                </button>
              </div>

              <div className="max-h-[35vh] overflow-y-auto pr-1 divide-y divide-neutral-100 dark:divide-neutral-800/80 border border-neutral-200/80 dark:border-neutral-800 rounded-xl bg-neutral-50/50 dark:bg-neutral-900/40">
                {selectedColumnCell.studentsData.length === 0 ? (
                  <div className="p-8 text-center text-xs text-neutral-400">
                    No students assigned to you have this task.
                  </div>
                ) : (
                  selectedColumnCell.studentsData.map(({ student, items }) => {
                    const item = items[0];

                    return (
                      <div
                        key={student.id}
                        className="p-3.5 flex items-center justify-between gap-4"
                      >
                        <div>
                          <p className="font-semibold text-neutral-900 dark:text-white text-xs">
                            {student.name}
                          </p>

                          <p className="text-[10px] text-neutral-400">
                            {student.email}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          {item ? (
                            <>
                              {getStatusBadge(item.status)}
                            </>
                          ) : (
                            <span className="text-[11px] text-neutral-400 italic">
                              Not assigned
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* FOOTER */}

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

      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#151921] rounded-2xl border border-neutral-200 dark:border-neutral-800 w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <div>
                <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
                  Create New Progress Task
                </h3>

                <p className="text-[10px] text-neutral-400 mt-1">
                  This task will be assigned only to your students.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form
              onSubmit={handleCreateProgressItem}
              className="space-y-3 text-xs"
            >
              {/* TITLE */}

              <div>
                <label className="block font-bold mb-1 text-neutral-600 dark:text-neutral-300">
                  Task Title
                </label>

                <input
                  type="text"
                  required
                  placeholder="e.g. JavaScript DOM Lab 1"
                  value={newProgressForm.title}
                  onChange={(e) =>
                    setNewProgressForm({
                      ...newProgressForm,
                      title: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#0E1117] text-neutral-900 dark:text-white focus:outline-none focus:border-[#B91C1C]"
                />
              </div>

              {/* TOPIC */}

              <div>
                <label className="block font-bold mb-1 text-neutral-600 dark:text-neutral-300">
                  Category Topic
                </label>

                <input
                  type="text"
                  required
                  placeholder="e.g. JavaScript"
                  value={newProgressForm.topic}
                  onChange={(e) =>
                    setNewProgressForm({
                      ...newProgressForm,
                      topic: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#0E1117] text-neutral-900 dark:text-white focus:outline-none focus:border-[#B91C1C]"
                />
              </div>

              {/* RESOURCE + WEEK */}

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold mb-1 text-neutral-600 dark:text-neutral-300">
                    Resource Type
                  </label>

                  <select
                    value={newProgressForm.resourceType}
                    onChange={(e) =>
                      setNewProgressForm({
                        ...newProgressForm,
                        resourceType: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#0E1117] text-neutral-900 dark:text-white focus:outline-none focus:border-[#B91C1C]"
                  >
                    <option value="Documentation">Documentation</option>

                    <option value="Video">Video</option>

                    <option value="Assignment">Assignment</option>

                    <option value="Quiz">Quiz</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1 text-neutral-600 dark:text-neutral-300">
                    Week
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={newProgressForm.week}
                    onChange={(e) =>
                      setNewProgressForm({
                        ...newProgressForm,
                        week: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#0E1117] text-neutral-900 dark:text-white focus:outline-none focus:border-[#B91C1C]"
                  />
                </div>
              </div>

              {/* RESOURCE LINK */}

              <div>
                <label className="block font-bold mb-1 text-neutral-600 dark:text-neutral-300">
                  Resource Link
                </label>

                <input
                  type="url"
                  placeholder="https://..."
                  value={newProgressForm.resourceLink}
                  onChange={(e) =>
                    setNewProgressForm({
                      ...newProgressForm,
                      resourceLink: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#0E1117] text-neutral-900 dark:text-white focus:outline-none focus:border-[#B91C1C]"
                />
              </div>

              {/* INSTRUCTIONS */}

              <div>
                <label className="block font-bold mb-1 text-neutral-600 dark:text-neutral-300">
                  Instructions
                </label>

                <textarea
                  rows={3}
                  placeholder="Task instructions..."
                  value={newProgressForm.instructions}
                  onChange={(e) =>
                    setNewProgressForm({
                      ...newProgressForm,
                      instructions: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#0E1117] text-neutral-900 dark:text-white focus:outline-none focus:border-[#B91C1C]"
                />
              </div>

              {/* BUTTONS */}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-3.5 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-lg bg-[#B91C1C] hover:bg-[#991b1b] text-white font-bold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? "Saving..." : "Create Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
