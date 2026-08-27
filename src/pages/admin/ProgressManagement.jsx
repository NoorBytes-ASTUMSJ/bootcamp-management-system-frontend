import React, { useState, useEffect, useMemo } from "react";

import {
  getProgressOverview,
  createProgressItem,
  updateProgressItem,
  updateStudentProgressStatus,
  deleteProgressItem,
} from "../../services/progressService";

import {
  Search,
  ChevronDown,
  X,
  Loader2,
  Trash2,
  Plus,
  Pencil,
  Filter,
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

export default function ProgressManagement({
  isDarkMode,
  onToggleTheme,
  onNavigateAdminView,
  onLogout,
  userRole = "admin",
  currentUserBatch = null,
  currentUserName = "Amir Nesru",
}) {
  const [data, setData] = useState(null);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  // Batch filter
  const [batchFilter, setBatchFilter] = useState(
    userRole === "mentor" && currentUserBatch ? currentUserBatch : "ALL",
  );

  const [universityFilter, setUniversityFilter] = useState("ALL");

  const [genderFilter, setGenderFilter] = useState("ALL");

  // Selected progress column
  const [selectedColumnCell, setSelectedColumnCell] = useState(null);

  // Create modal
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [newProgressForm, setNewProgressForm] = useState({
    title: "",
    topic: "",
    batch: currentUserBatch || "",
    resourceType: "Documentation",
    resourceLink: "",
    week: "1",
    instructions: "",
  });

  // Edit modal
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [editProgressForm, setEditProgressForm] = useState({
    itemId: "",
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
  async function loadData() {
    setLoading(true);

    const overview = await getProgressOverview();

    setData(overview);

    setLoading(false);
  }

  const studentsList = data?.students || [];

  const dynamicColumnsMap = new Map();

  studentsList.forEach((st) => {
    if (batchFilter !== "ALL" && String(st.batchId) !== String(batchFilter)) {
      return;
    }

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
  const availableBatches = Array.from(
    new Map(
      studentsList
        .filter((s) => s.batchId && s.batch)
        .map((s) => [
          String(s.batchId),
          {
            id: s.batchId,
            name: s.batch,
          },
        ]),
    ).values(),
  );

  const availableUniversities = [
    ...new Set(
      studentsList
        .map(
          (s) =>
            s.university || s.uni || "Adama Science and Technology University",
        )
        .filter(Boolean),
    ),
  ];

  const availableGenders = [
    ...new Set(studentsList.map((s) => s.gender).filter(Boolean)),
  ];

  const filteredStudents = studentsList.filter((st) => {
    if (
      userRole === "mentor" &&
      currentUserBatch &&
      String(st.batchId) !== String(currentUserBatch)
    ) {
      return false;
    }

    if (batchFilter === "ALL") {
      return false;
    }

    const query = searchTerm.toLowerCase().trim();

    const matchesSearch =
      !query ||
      (st.name || "").toLowerCase().includes(query) ||
      (st.track || "").toLowerCase().includes(query) ||
      (st.mentor || "").toLowerCase().includes(query);

    const effectiveBatch =
      userRole === "mentor" ? currentUserBatch : batchFilter;

    const matchesBatch =
      String(st.batchId || "") === String(effectiveBatch || "");

    const studentUni =
      st.university || st.uni || "Adama Science and Technology University";

    const matchesUni =
      universityFilter === "ALL" ||
      studentUni.toLowerCase() === universityFilter.toLowerCase();

    const studentGender = st.gender || "Not Specified";

    const matchesGender =
      genderFilter === "ALL" ||
      studentGender.toLowerCase() === genderFilter.toLowerCase();

    return matchesSearch && matchesBatch && matchesUni && matchesGender;
  });

  const calculateStudentTotal = (student) => {
    const topicsMap = student.progressMap || {};

    let totalScore = 0;
    let count = 0;

    Object.keys(topicsMap).forEach((topicKey) => {
      const items = Array.isArray(topicsMap[topicKey])
        ? topicsMap[topicKey]
        : [topicsMap[topicKey]];

      items.forEach((item) => {
        if (userRole === "admin" && item.releasedBy === "mentor") {
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

  const summaryStats = useMemo(() => {
    let progressSum = 0;
    let needsHelpCount = 0;

    filteredStudents.forEach((student) => {
      progressSum += calculateStudentTotal(student);

      Object.values(student.progressMap || {}).forEach((items) => {
        (Array.isArray(items) ? items : []).forEach((item) => {
          if (userRole === "admin" && item.releasedBy === "mentor") {
            return;
          }

          if (item.status === "Needs Help") {
            needsHelpCount++;
          }
        });
      });
    });

    const averageProgress =
      filteredStudents.length > 0
        ? Math.round(progressSum / filteredStudents.length)
        : 0;

    return {
      studentCount: filteredStudents.length,
      taskCount: progressColumns.length,
      averageProgress,
      needsHelpCount,
    };
  }, [filteredStudents, progressColumns, userRole]);

 

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

  const handleCreateProgressItem = async (e) => {
    e.preventDefault();

    if (!data || saving) {
      return;
    }

    const targetBatch =
      userRole === "mentor" ? currentUserBatch : newProgressForm.batch;

    if (!targetBatch) {
      alert("Please select a target batch for this progress item.");
      return;
    }

    setSaving(true);

    try {
      await createProgressItem({
        ...newProgressForm,
        batch: targetBatch,
      });

      await loadData();

      setIsCreateOpen(false);

      setNewProgressForm({
        title: "",
        topic: "",
        batch: currentUserBatch || availableBatches[0]?.id || "",
        resourceType: "Documentation",
        resourceLink: "",
        week: "1",
        instructions: "",
      });
    } catch (err) {
      console.error("Create progress error:", err);

      alert("Failed to create progress item. Please try again.");
    } finally {
      setSaving(false);
    }
  };


  const openEditModal = () => {
    if (!selectedColumnCell) {
      return;
    }

    if (!selectedColumnCell.itemId) {
      alert("Cannot edit: task ID is missing.");
      return;
    }

    setEditProgressForm({
      itemId: selectedColumnCell.itemId,
      title: selectedColumnCell.title || "",
      topic: selectedColumnCell.topicKey || "",
      resourceType: selectedColumnCell.resourceType || "Documentation",
      resourceLink: selectedColumnCell.resourceLink || "",
      week: selectedColumnCell.week || "1",
      instructions: selectedColumnCell.instructions || "",
    });

    setIsEditOpen(true);
  };

  const handleEditProgressItem = async (e) => {
    e.preventDefault();

    if (!data || saving) {
      return;
    }

    if (!editProgressForm.itemId) {
      alert("Cannot update: task ID is missing.");
      return;
    }

    setSaving(true);

    try {
      await updateProgressItem(editProgressForm.itemId, {
        title: editProgressForm.title,
        topic: editProgressForm.topic,
        resourceType: editProgressForm.resourceType,
        resourceLink: editProgressForm.resourceLink,
        week: editProgressForm.week,
        instructions: editProgressForm.instructions,
      });

      const overview = await getProgressOverview();

      setData(overview);

      if (
        selectedColumnCell &&
        selectedColumnCell.itemId === editProgressForm.itemId
      ) {
        const refreshedStudentsData = filteredStudents.map((st) => {
          const overviewStudent = overview.students.find((s) => s.id === st.id);

          const topicItems =
            (overviewStudent?.progressMap || {})[selectedColumnCell.topicKey] ||
            [];

          const matchedItems = topicItems.filter(
            (i) => i.id === editProgressForm.itemId,
          );

          return {
            student: overviewStudent || st,
            items: matchedItems,
          };
        });

        setSelectedColumnCell({
          ...selectedColumnCell,
          title: editProgressForm.title,
          resourceType: editProgressForm.resourceType,
          resourceLink: editProgressForm.resourceLink,
          week: editProgressForm.week,
          instructions: editProgressForm.instructions,
          studentsData: refreshedStudentsData,
        });
      }

      setIsEditOpen(false);
    } catch (err) {
      console.error("Update progress error:", err);

      alert("Failed to update progress item. Please try again.");
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
      console.error("Cannot update progress: item ID is missing.", {
        studentId,
        topicKey,
        itemId,
      });

      alert("Cannot update progress: task ID is missing.");

      return;
    }

    setSaving(true);

    try {
      await updateStudentProgressStatus(itemId, newStatus);

      const overview = await getProgressOverview();

      setData(overview);

      if (selectedColumnCell) {
        const refreshedStudent = overview.students.find(
          (s) => s.id === studentId,
        );

        const refreshedItems =
          (refreshedStudent?.progressMap || {})[topicKey] || [];

        const updatedStudentsInModal = selectedColumnCell.studentsData.map(
          (sObj) => {
            if (sObj.student.id === studentId) {
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

  const handleDeleteColumnProgressItem = async (
    targetTopicKey,
    targetItemId,
  ) => {
    if (
      !targetItemId ||
      targetItemId === "undefined" ||
      targetItemId === "null"
    ) {
      console.error("Cannot delete progress task: ID is missing.", {
        targetTopicKey,
        targetItemId,
        selectedColumnCell,
      });

      alert("Cannot delete this task because its ID is missing.");

      return;
    }

    if (saving) {
      return;
    }

    setSaving(true);

    try {
      await deleteProgressItem(targetItemId);

      await loadData();

      setSelectedColumnCell(null);
    } catch (err) {
      console.error("Delete progress error:", err);

      alert("Failed to delete progress item. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const openProgressColumn = (col) => {
    if (!col.itemId) {
      console.error("Progress column has no task ID:", col);

      alert("This progress task does not have a valid ID.");

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

              <span>Loading progress matrix...</span>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
                    Progress Management
                  </h2>

                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    {userRole === "mentor"
                      ? `Managing assigned batch students (${currentUserBatch || "Assigned Batch"})`
                      : userRole === "student"
                        ? "Track your personalized learning roadmap and update task statuses."
                        : "Monitor student progress metrics, task completion, and cohort performance."}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  {userRole !== "mentor" && (
                    <div className="relative">
                      <select
                        value={batchFilter}
                        onChange={(e) => setBatchFilter(e.target.value)}
                        className="appearance-none pl-3 pr-8 py-2 rounded-lg text-xs bg-white dark:bg-[#151921] border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-200 focus:outline-none focus:border-[#B91C1C] font-medium shadow-2xs cursor-pointer"
                      >
                        <option value="ALL">-- Select Batch --</option>

                        {availableBatches.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.name}
                          </option>
                        ))}
                      </select>

                      <ChevronDown
                        size={13}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
                      />
                    </div>
                  )}

                  {userRole !== "student" && (
                    <button
                      type="button"
                      onClick={() => setIsCreateOpen(true)}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-[#B91C1C] hover:bg-[#991b1b] text-white rounded-lg text-xs font-bold shadow-sm transition-all cursor-pointer"
                    >
                      <Plus size={14} />

                      <span>Create Progress Task</span>
                    </button>
                  )}
                </div>
              </div>

             
              {batchFilter !== "ALL" && (
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
                      matching current filters
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
                      admin-released tasks only
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
                      visible columns in this batch
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
              )}

              {/* Filters */}
              {batchFilter !== "ALL" && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white dark:bg-[#151921] p-3.5 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-2xs">
                  <div className="relative">
                    <Search
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                    />

                    <input
                      type="text"
                      placeholder="Search by student name or track..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-lg text-xs bg-neutral-50/50 dark:bg-[#0E1117] border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:border-[#B91C1C]"
                    />
                  </div>

                  <div className="relative">
                    <select
                      value={universityFilter}
                      onChange={(e) => setUniversityFilter(e.target.value)}
                      className="w-full appearance-none px-3 py-2 rounded-lg text-xs bg-neutral-50/50 dark:bg-[#0E1117] border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-200 focus:outline-none focus:border-[#B91C1C] font-medium cursor-pointer"
                    >
                      <option value="ALL">All Universities</option>

                      {availableUniversities.map((uni) => (
                        <option key={uni} value={uni}>
                          {uni}
                        </option>
                      ))}
                    </select>

                    <ChevronDown
                      size={13}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
                    />
                  </div>

                  <div className="relative">
                    <select
                      value={genderFilter}
                      onChange={(e) => setGenderFilter(e.target.value)}
                      className="w-full appearance-none px-3 py-2 rounded-lg text-xs bg-neutral-50/50 dark:bg-[#0E1117] border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-200 focus:outline-none focus:border-[#B91C1C] font-medium cursor-pointer"
                    >
                      <option value="ALL">All Genders</option>

                      {availableGenders.map((gender) => (
                        <option key={gender} value={gender}>
                          {gender}
                        </option>
                      ))}
                    </select>

                    <ChevronDown
                      size={13}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
                    />
                  </div>
                </div>
              )}

              {/* Main Table */}
              <div className="bg-white dark:bg-[#151921] rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 overflow-hidden shadow-sm">
                <div className="px-5 py-4 flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-neutral-600 dark:text-neutral-300">
                    {batchFilter === "ALL"
                      ? "Batch Selection Required"
                      : `Cohort Matrix (${filteredStudents.length} Students)`}
                  </h3>

                  <span className="text-[11px] text-neutral-400 font-medium">
                    {batchFilter !== "ALL"
                      ? `Showing batch: ${
                          availableBatches.find(
                            (b) => String(b.id) === String(batchFilter),
                          )?.name || ""
                        }`
                      : "Please select a batch above"}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  {batchFilter === "ALL" ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center px-4 space-y-3">
                      <div className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 shadow-inner">
                        <Filter size={20} />
                      </div>

                      <h4 className="font-bold text-sm text-neutral-800 dark:text-neutral-200">
                        Please select a batch
                      </h4>

                      <p className="text-xs text-neutral-400 max-w-sm">
                        Choose a specific batch from the top dropdown to load
                        student records and progress columns.
                      </p>
                    </div>
                  ) : (
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
                            progressColumns.map((col) => (
                              <th
                                key={col.key}
                                onClick={() => openProgressColumn(col)}
                                className="py-3.5 px-4 text-center cursor-pointer hover:bg-neutral-100/80 dark:hover:bg-neutral-800 transition-colors group"
                                title="Click to view full task details & student statuses"
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
                              No students match your filter criteria in this
                              batch.
                            </td>
                          </tr>
                        ) : (
                          filteredStudents.map((st) => {
                            const computedTotal = calculateStudentTotal(st);

                            return (
                              <tr
                                key={st.id}
                                className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 transition-colors"
                              >
                                <td className="py-3.5 px-5 font-semibold text-neutral-900 dark:text-neutral-100">
                                  <div className="flex items-center gap-2.5">
                                    <div className="w-7 h-7 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-[10px] font-bold text-neutral-600 dark:text-neutral-300 shadow-2xs">
                                      {st.initials ||
                                        st.name
                                          ?.split(" ")
                                          .map((n) => n[0])
                                          .join("")}
                                    </div>

                                    <div>
                                      <p className="font-semibold text-neutral-900 dark:text-white">
                                        {st.name}
                                      </p>

                                      <p className="text-[10px] text-neutral-400 font-normal">
                                        {st.track || "Software Engineering"}
                                      </p>
                                    </div>
                                  </div>
                                </td>

                                <td className="py-3.5 px-4 font-black text-[#B91C1C]">
                                  {computedTotal}%
                                </td>

                                {progressColumns.length === 0 ? (
                                  <td className="py-3.5 px-5 text-neutral-400">
                                    -
                                  </td>
                                ) : (
                                  progressColumns.map((col) => {
                                    const topicItems =
                                      (st.progressMap || {})[col.topicKey] ||
                                      [];

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
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  )}
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
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-neutral-700 dark:text-neutral-200 uppercase tracking-wider text-[10px]">
                  Task & Resource Information
                </h4>

                {userRole !== "student" && (
                  <button
                    type="button"
                    disabled={saving || !selectedColumnCell.itemId}
                    onClick={openEditModal}
                    className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/40 hover:bg-sky-100 dark:hover:bg-sky-900/50 rounded-md transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Pencil size={11} />
                    <span>Edit</span>
                  </button>
                )}
              </div>

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
                  {selectedColumnCell.instructions ||
                    "No instructions provided."}
                </p>
              </div>
            </div>

            {/* Student Status */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                  Student Status Breakdown
                </p>

                {userRole !== "student" && (
                  <button
                    type="button"
                    disabled={saving || !selectedColumnCell.itemId}
                    onClick={() => {
                      if (!selectedColumnCell.itemId) {
                        alert("Cannot delete: task ID is missing.");

                        return;
                      }

                      if (
                        window.confirm(
                          `Are you sure you want to delete "${selectedColumnCell.title}" from this batch column entirely?`,
                        )
                      ) {
                        handleDeleteColumnProgressItem(
                          selectedColumnCell.topicKey,
                          selectedColumnCell.itemId,
                        );
                      }
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 size={13} />

                    <span>Delete Column Task</span>
                  </button>
                )}
              </div>

              <div className="max-h-[35vh] overflow-y-auto pr-1 divide-y divide-neutral-100 dark:divide-neutral-800/80 border border-neutral-200/80 dark:border-neutral-800 rounded-xl bg-neutral-50/50 dark:bg-neutral-900/40">
                {selectedColumnCell.studentsData.map(({ student, items }) => {
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
                          {student.university || "ASTU"} •{" "}
                          {student.track || "Software Engineering"}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        {item ? (
                          <>
                            {getStatusBadge(item.status)}

                            {userRole === "student" &&
                              currentUserName === student.name && (
                                <select
                                  value={item.status}
                                  disabled={saving}
                                  onChange={(e) =>
                                    handleUpdateItemStatus(
                                      student.id,
                                      selectedColumnCell.topicKey,
                                      item.id,
                                      e.target.value,
                                    )
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

      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#151921] rounded-2xl border border-neutral-200 dark:border-neutral-800 w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
                Create New Progress Task
              </h3>

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

              {userRole === "admin" && (
                <div>
                  <label className="block font-bold mb-1 text-neutral-600 dark:text-neutral-300">
                    Target Batch
                  </label>

                  <select
                    required
                    value={newProgressForm.batch}
                    onChange={(e) =>
                      setNewProgressForm({
                        ...newProgressForm,
                        batch: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#0E1117] text-neutral-900 dark:text-white focus:outline-none focus:border-[#B91C1C]"
                  >
                    <option value="">-- Select Target Batch --</option>

                    {availableBatches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

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
                    type="text"
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

              <div>
                <label className="block font-bold mb-1 text-neutral-600 dark:text-neutral-300">
                  Instructions
                </label>

                <textarea
                  rows={2}
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

      {isEditOpen && (
        <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#151921] rounded-2xl border border-neutral-200 dark:border-neutral-800 w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
                Edit Progress Task
              </h3>

              <button
                type="button"
                onClick={() => setIsEditOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form
              onSubmit={handleEditProgressItem}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-bold mb-1 text-neutral-600 dark:text-neutral-300">
                  Task Title
                </label>

                <input
                  type="text"
                  required
                  placeholder="e.g. JavaScript DOM Lab 1"
                  value={editProgressForm.title}
                  onChange={(e) =>
                    setEditProgressForm({
                      ...editProgressForm,
                      title: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#0E1117] text-neutral-900 dark:text-white focus:outline-none focus:border-[#B91C1C]"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-neutral-600 dark:text-neutral-300">
                  Category Topic
                </label>

                <input
                  type="text"
                  required
                  placeholder="e.g. JavaScript"
                  value={editProgressForm.topic}
                  disabled
                  title="Topic can't be changed after creation"
                  onChange={(e) =>
                    setEditProgressForm({
                      ...editProgressForm,
                      topic: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 text-neutral-500 dark:text-neutral-500 cursor-not-allowed"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold mb-1 text-neutral-600 dark:text-neutral-300">
                    Resource Type
                  </label>

                  <select
                    value={editProgressForm.resourceType}
                    onChange={(e) =>
                      setEditProgressForm({
                        ...editProgressForm,
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
                    type="text"
                    value={editProgressForm.week}
                    onChange={(e) =>
                      setEditProgressForm({
                        ...editProgressForm,
                        week: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#0E1117] text-neutral-900 dark:text-white focus:outline-none focus:border-[#B91C1C]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1 text-neutral-600 dark:text-neutral-300">
                  Resource Link
                </label>

                <input
                  type="url"
                  placeholder="https://..."
                  value={editProgressForm.resourceLink}
                  onChange={(e) =>
                    setEditProgressForm({
                      ...editProgressForm,
                      resourceLink: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#0E1117] text-neutral-900 dark:text-white focus:outline-none focus:border-[#B91C1C]"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-neutral-600 dark:text-neutral-300">
                  Instructions
                </label>

                <textarea
                  rows={2}
                  placeholder="Task instructions..."
                  value={editProgressForm.instructions}
                  onChange={(e) =>
                    setEditProgressForm({
                      ...editProgressForm,
                      instructions: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#0E1117] text-neutral-900 dark:text-white focus:outline-none focus:border-[#B91C1C]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-3.5 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-lg bg-[#B91C1C] hover:bg-[#991b1b] text-white font-bold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
