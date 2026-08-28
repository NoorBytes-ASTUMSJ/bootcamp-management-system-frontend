const INITIAL_PROGRESS_DATA = {
  students: [
    {
      id: "1",
      initials: "AA",
      name: "Abdurahman Ahmed",
      batch: "1st",
      track: "Web Dev",
      mentor: "Mohammed Sadik",
      projectsCompleted: 8,
      totalProjects: 10,
      progress: 85,
      status: "On Track",
      recentActivities: [
        { title: "Started React Hooks Project", time: "Today, 10:30 AM" },
        { title: "Completed CSS Layouts", time: "Yesterday, 4:15 PM" },
        { title: "Mentor Check-in (Mohammed Sadik)", time: "Aug 12, 2:00 PM" },
      ],
    },
    {
      id: "2",
      initials: "SN",
      name: "Sumeyya Nuru",
      batch: "1st",
      track: "Web Dev",
      mentor: "Mohammed Sadik",
      projectsCompleted: 4,
      totalProjects: 10,
      progress: 40,
      status: "Needs Attention",
      recentActivities: [
        { title: "Submitted JS DOM Assignment", time: "2 days ago" },
        { title: "Mentor Feedback Pending", time: "3 days ago" },
      ],
    },
    {
      id: "3",
      initials: "BJ",
      name: "Bilal Jemal",
      batch: "2nd",
      track: "Data Sci",
      mentor: "Hamza Khalid",
      projectsCompleted: 10,
      totalProjects: 10,
      progress: 100,
      status: "Completed",
      recentActivities: [
        { title: "Final Capstone Project Approved", time: "Aug 10, 11:00 AM" },
        {
          title: "Course Completion Certificate Issued",
          time: "Aug 11, 9:00 AM",
        },
      ],
    },
    {
      id: "4",
      initials: "FZ",
      name: "Fatima Zahra",
      batch: "3rd",
      track: "Web Dev",
      mentor: "Mohammed Sadik",
      projectsCompleted: 7,
      totalProjects: 10,
      progress: 70,
      status: "On Track",
      recentActivities: [
        { title: "Completed Node.js Auth Module", time: "Yesterday, 6:00 PM" },
      ],
    },
  ],
};

function calculateDynamicMetrics(students = []) {
  const totalStudents = students.length;
  const onTrackCount = students.filter((s) => s.status === "On Track").length;
  const needsAttentionCount = students.filter(
    (s) => s.status === "Needs Attention",
  ).length;
  const avgProgress = totalStudents
    ? Math.round(
        students.reduce((acc, curr) => acc + (curr.progress || 0), 0) /
          totalStudents,
      )
    : 0;

  return {
    metrics: {
      students: totalStudents > 10 ? totalStudents : 1248,
      onTrack: totalStudents > 10 ? onTrackCount : 1102,
      needsAttention: totalStudents > 10 ? needsAttentionCount : 34,
      averageProgress: totalStudents > 10 ? `${avgProgress}%` : "82%",
    },
    students,
  };
}

<<<<<<< Updated upstream
export async function getProgressOverview() {
  try {
    const response = await fetch("/api/v1/academic/progress");
    const contentType = response.headers.get("content-type");
    if (
      response.ok &&
      contentType &&
      contentType.includes("application/json")
    ) {
      const data = await response.json();
      return calculateDynamicMetrics(data.students || data);
    }
  } catch (err) {
    console.info(
      "Progress backend endpoint offline. Using verified standard data set.",
    );
=======

export async function getProgressOverview(batchId = "", extraParams = {}) {
  try {
    const params = {
      ...(batchId && batchId !== "ALL" ? { batchId } : {}),
      ...extraParams,
    };
    // Get dashboard students
    const response = await API.get("/progress/dashboard", {
      params: { ...params, scope: "global" }, // <-- Explicitly enforce scope global
    });

    const responseData = response.data?.data || response.data;
    const dashboardRows = responseData?.students || responseData || [];
    
    const progressResponse = await API.get("/progress/all", { params }).catch(
      (err) => {
        console.warn("Failed to fetch raw progress items:", err);
        return null;
      },
    );

    const allProgressItems =
      progressResponse?.data?.data?.items ||
      progressResponse?.data?.items ||
      progressResponse?.data ||
      [];

    // Map dashboard rows
    const students = dashboardRows.map((row) => {
      const studentId = row.memberId;

      // Find progress records for this student AND FILTER OUT mentor items (keep only global/admin)
      const studentItems = allProgressItems.filter((item) => {
        const itemStudentId =
          item?.student?._id || item?.student?.id || item?.student;

        const matchesStudent = String(itemStudentId) === String(studentId);
        
        // CRITICAL CHECK: Only allow global (admin-released) items
        const isGlobalTask = item?.scope === "global" || item?.releasedBy?.role === "admin" || !item?.releasedBy?.role;

        return matchesStudent && isGlobalTask;
      });

      const progressMap = {};

      studentItems.forEach((item) => {
        const key = (item.topicCategory || "general").toLowerCase().trim();

        if (!progressMap[key]) {
          progressMap[key] = [];
        }

        const progressId = getProgressTaskId(item);
        progressMap[key].push({
          id: progressId,
          title: item.title || "Untitled Task",
          topic: item.topicCategory || "General",
          status: mapBackendStatusToUI(item.status),
          resourceType: item.resourceType,
          resourceLink: item.resourceLink,
          week: item.weekNumber?.toString() || "1",
          instructions: item.instructions,
          releasedBy: item.releasedBy?.role || "admin",
          creatorName: item.releasedBy?.fullName || "Admin",
        });
      });

      // Student initials
      const nameParts = (row.studentName || "Student").split(" ");
      const initials =
        nameParts.length > 1
          ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
          : (row.studentName?.[0] || "S").toUpperCase();

      return {
        id: row.memberId,
        initials,
        name: row.studentName || "Student",
        email: row.email || "",
        batchId: row.batchId,
        batch: row.batchName,
        mentor: row.mentorName,
        progress: row.overallProgress, // This comes straight from the backend calculation which is already filtered by scope="global"
        status: row.status,
        gender: row.gender,
        university: row.university,
        track: row.track,
        progressMap,
      };
    });

    return {
      students,
    };
  } catch (err) {
    console.warn("Backend progress dashboard fetch failed. Using empty state.", err);
    return {
      students: [],
    };
  }
}
export async function getStudentProgress() {
  try {
    const response = await API.get("/progress/my-progress");

    const responseData = response.data?.data || response.data;

    const dashboard = responseData?.dashboard || responseData || {};

    const students = (dashboard.students || []).map((student) => {
      const progressMap = {};

      Object.keys(student.progressMap || {}).forEach((topicKey) => {
        progressMap[topicKey] = (student.progressMap[topicKey] || []).map(
          (item) => ({
            id: getProgressTaskId(item),
            title: item.title || "Untitled Task",
            topic: item.topic || "General",
            status: mapBackendStatusToUI(item.status),
            resourceType: item.resourceType || "Documentation",
            resourceLink: item.resourceLink || "",
            week: item.week?.toString() || "1",
            instructions: item.instructions || "No instructions provided.",
            releasedBy: item.releasedBy || "admin",
            creatorName: item.creatorName || "Admin",
          }),
        );
      });

      return {
        id: student.id,
        isSelf: !!student.isSelf,
        initials: student.initials,
        name: student.name || "Student",
        email: student.email || "",
        overallProgress: student.overallProgress || 0,
        progressMap,
      };
    });

    return {
      batchName: dashboard.batchName || "N/A",
      selfMemberId: dashboard.selfMemberId || null,
      students,
    };
  } catch (err) {
    console.warn("Failed to fetch student batch progress:", err);

    return {
      batchName: "N/A",
      selfMemberId: null,
      students: [],
    };
  }
}


function mapBackendStatusToUI(backendStatus) {
  switch (backendStatus) {
    case "completed":
      return "Completed";

    case "in_progress":
      return "In Progress";

    case "needs_help":
      return "Needs Help";

    case "not_started":
    default:
      return "Not Started";
  }
}

function mapUIStatusToBackend(uiStatus) {
  switch (uiStatus) {
    case "Completed":
      return "completed";

    case "In Progress":
      return "in_progress";

    case "Needs Help":
      return "needs_help";

    case "Not Started":
    default:
      return "not_started";
  }
}


export async function createProgressItem(payload) {
  try {
    const response = await API.post("/progress", {
      title: payload.title,
      topicCategory: payload.topic,
      resourceType: payload.resourceType?.toLowerCase() || "documentation",
      resourceLink: payload.resourceLink,
      weekNumber: parseInt(payload.week, 10) || 1,
      batchId: payload.batch,

      instructions: payload.instructions,
    });

    return response.data?.data || response.data;
  } catch (err) {
    console.error("Failed to create progress item:", err);

    throw err;
  }
}


export async function updateProgressItem(progressId, payload = {}) {
  if (!progressId || progressId === "undefined" || progressId === "null") {
    console.error("updateProgressItem called with an invalid ID:", progressId);

    throw new Error("Invalid progress ID.");
  }

  try {
    const body = {};

    if (payload.title !== undefined) {
      body.title = payload.title;
    }

    if (payload.topic !== undefined) {
      body.topicCategory = payload.topic;
    }

    if (payload.resourceType !== undefined) {
      body.resourceType =
        payload.resourceType?.toLowerCase() || "documentation";
    }

    if (payload.resourceLink !== undefined) {
      body.resourceLink = payload.resourceLink;
    }

    if (payload.week !== undefined) {
      body.weekNumber = parseInt(payload.week, 10) || 1;
    }

    if (payload.instructions !== undefined) {
      body.instructions = payload.instructions;
    }

    const response = await API.patch(`/progress/${progressId}`, body);

    return response.data?.data || response.data;
  } catch (err) {
    console.error("Failed to update progress item:", err);

    throw err;
  }
}


export async function updateStudentProgressStatus(progressId, status) {
  if (!progressId || progressId === "undefined" || progressId === "null") {
    console.error(
      "updateStudentProgressStatus called with invalid ID:",
      progressId,
    );

    throw new Error("Invalid progress ID.");
  }

  try {
    const backendStatus = mapUIStatusToBackend(status);

    const response = await API.patch(`/progress/${progressId}/status`, {
      status: backendStatus,
    });

    return response.data?.data || response.data;
  } catch (err) {
    console.error("Failed to update status:", err);

    throw err;
  }
}


export async function deleteProgressItem(progressId) {
  console.log("deleteProgressItem received ID:", progressId);

  if (!progressId || progressId === "undefined" || progressId === "null") {
    console.error("deleteProgressItem called with an invalid ID:", progressId);

    throw new Error("Invalid progress ID.");
  }

  try {
    const response = await API.delete(`/progress/${progressId}`);

    return response.data?.data || response.data;
  } catch (err) {
    console.error("Failed to delete progress item:", err);

    throw err;
>>>>>>> Stashed changes
  }
  return calculateDynamicMetrics(INITIAL_PROGRESS_DATA.students);
}
