export const MOCK_STUDENT_DASHBOARD = {
  student: {
    firstName: "Alex",
  },
  overview: {
    attendance: 92,
    progress: 68,
    assignments: 3,
    averageGrade: 86,
  },
  progressSummary: [
    {
      id: 1,
      topic: "HTML / CSS",
      percentage: 100,
      status: "Completed",
      iconText: "5",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
    {
      id: 2,
      topic: "JavaScript",
      percentage: 72,
      status: "In Progress",
      iconText: "JS",
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
    {
      id: 3,
      topic: "React",
      percentage: 45,
      status: "Needs Improvement",
      iconText: "Re",
      iconBg: "bg-cyan-100",
      iconColor: "text-cyan-600",
    },
    {
      id: 4,
      topic: "Node.js",
      percentage: 60,
      status: "In Progress",
      iconText: "nS",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
  ],
  announcements: [
    {
      id: 1,
      title: "Project Submission Deadline Updated",
      date: "Aug 14, 2025",
      preview: "The deadline for this week's project has been updated.",
      priority: "High",
    },
    {
      id: 2,
      title: "New Learning Resources Added",
      date: "Aug 12, 2025",
      preview: "Check out the new resources for advanced JavaScript.",
      priority: "Normal",
    },
    {
      id: 3,
      title: "Bootcamp Orientation Recording",
      date: "Aug 10, 2025",
      preview: "The orientation recording is now available for all students.",
      priority: "Low",
    },
  ],
  upcomingDeadlines: [
    {
      id: 1,
      title: "React Portfolio Project",
      description: "Build and deploy your portfolio website.",
      date: "Aug 20, 2025",
      status: "In Progress",
    },
    {
      id: 2,
      title: "Backend API Assignment",
      description: "Create RESTful API with authentication.",
      date: "Aug 24, 2025",
      status: "Not Started",
    },
  ],
  recentFeedback: [
    {
      id: 1,
      title: "React Portfolio Project",
      feedback:
        "Great component structure and clean code. Work on accessibility and responsiveness.",
      score: 92,
      maxScore: 100,
      date: "Aug 13, 2025",
    },
    {
      id: 2,
      title: "JavaScript Quiz",
      feedback:
        "Good understanding of concepts. Keep practicing array methods.",
      score: 78,
      maxScore: 100,
      date: "Aug 09, 2025",
    },
  ],
};
