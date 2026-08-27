import API from "./api";

function calculateSubmissionMetrics(submissions = []) {
  const total = submissions.length;
  const pendingCount = submissions.filter(
    (s) => s.status === "Pending Review" || s.status === "Needs Resubmission",
  ).length;
  const reviewedCount = submissions.filter(
    (s) => s.status === "Reviewed",
  ).length;
  const lateCount = submissions.filter((s) => s.isLate).length;

  return {
    metrics: {
      totalSubmissions: total,
      pendingReview: pendingCount,
      reviewed: reviewedCount,
      lateSubmissions: lateCount,
    },
    submissions,
  };
}

export const submissionService = {
  getSubmissionsOverview: async (filters = {}) => {
    try {
      const response = await API.get("/submissions/admin", { params: filters });
      const data = response.data.data.submissions;

      const formattedSubmissions = data.map((s) => {
        const studentName = s.member?.user?.fullName || "Unknown Student";
        const initials = studentName
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .substring(0, 2);
        const submittedDate = s.submittedAt ? new Date(s.submittedAt) : null;

        let displayStatus = "Pending Review";
        if (s.status === "graded") displayStatus = "Reviewed";
        if (s.status === "needs_resubmission")
          displayStatus = "Needs Resubmission";
        if (s.isLate && s.status !== "graded") displayStatus = "Late";

        return {
          id: s._id,
          studentName: studentName,
          studentInitials: initials,
          assignmentTitle: s.assignment?.title || "Unknown Assignment",
          batch: s.assignment?.batch?.name || "Unknown",
          batchName: s.assignment?.batch?.name
            ? `${s.assignment.batch.name} Batch`
            : "Unknown Batch",
          submittedDate: submittedDate
            ? submittedDate.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "-",
          status: displayStatus,
          grade:
            s.score !== undefined && s.score !== null
              ? `${s.score}/${s.assignment?.maxScore || 100}`
              : "-",
          isLate: s.isLate || false,
          githubUrl: s.githubUrl || null,
          demoUrl: s.liveDemoUrl || null,
          feedback: s.feedback || null,
        };
      });

      return calculateSubmissionMetrics(formattedSubmissions);
    } catch (error) {
      throw error;
    }
  },

  getSubmissionsByAssignment: async (assignmentId) => {
    try {
      const response = await API.get(`/submissions/assignment/${assignmentId}`);
      return response.data.data.submissions;
    } catch (error) {
      throw error;
    }
  },
};
