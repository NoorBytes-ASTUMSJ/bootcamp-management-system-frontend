import API from "./api";

function calculateAssignmentMetrics(assignments = []) {
  const total = assignments.length;
  const activeCount = assignments.filter((a) => a.status === "Active").length;
  const pastDueCount = assignments.filter(
    (a) => a.status === "Past Due",
  ).length;
  const totalPendingReview = assignments.reduce(
    (acc, curr) => acc + (curr.pendingReview || 0),
    0,
  );

  return {
    metrics: {
      totalAssignments: total,
      active: activeCount,
      pendingReview: totalPendingReview,
      pastDue: pastDueCount,
    },
    assignments,
  };
}

export const assignmentService = {
  getAssignmentsOverview: async () => {
    try {
      const response = await API.get("/assignments/admin");
      const data = response.data.data.assignments;

      const formattedAssignments = data.map((a) => {
        const deadlineDate = new Date(a.deadline);
        const now = new Date();
        const isPastDue = now > deadlineDate;

        return {
          id: a._id,
          title: a.title,
          description: a.description,
          batch: a.batch?.name || "Unknown",
          batchName: a.batch?.name || "Unknown",
          rawBatchId: a.batch?._id || a.batch,
          rawDeadline: a.deadline,
          rawMaxScore: a.maxScore,
          scope: a.scope,
          type: a.scope === "global" ? "Global" : "Mentor",
          deadline: deadlineDate.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          deadlineFull: deadlineDate.toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
          }),
          isPastDue: isPastDue,
          submissionsCount: a.submissionsCount || 0,
          totalStudents: a.totalStudents || 0,
          pendingReview: a.pendingReview || 0,
          maxScore: `${a.maxScore} Points`,
          resourceName: a.fileName || "No attachment",
          resourceLink: a.fileUrl || "",
          status: isPastDue ? "Past Due" : "Active",
        };
      });

      return calculateAssignmentMetrics(formattedAssignments);
    } catch (error) {
      throw error;
    }
  },

  createAssignment: async (formData) => {
    try {
      const response = await API.post("/assignments", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data.data.assignment;
    } catch (error) {
      throw error;
    }
  },

  updateAssignment: async (id, formData) => {
    try {
      const response = await API.patch(`/assignments/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data.data.assignment;
    } catch (error) {
      throw error;
    }
  },

  deleteAssignment: async (assignmentId) => {
    try {
      const response = await API.delete(`/assignments/${assignmentId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
