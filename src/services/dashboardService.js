const INITIAL_DASHBOARD_DATA = {
  metrics: {
    students: 248,
    mentors: 32,
    batches: 8,
    attendance: "92%",
  },
  availableBatches: [
    {
      id: "b24",
      name: "Batch #24 - Fall 2023",
      students: 45,
      mentors: 4,
      attendanceAvg: "94%",
      progress: "Week 4/12",
      attendanceBreakdown: {
        present: 85,
        late: 10,
        absent: 5,
      },
      assignmentStats: {
        total: 42,
        active: 12,
        pendingReview: 28,
        pastDue: 5,
      },
    },
    {
      id: "b25",
      name: "Batch #25 - Winter 2024",
      students: 42,
      mentors: 4,
      attendanceAvg: "96%",
      progress: "Week 8/12",
      attendanceBreakdown: {
        present: 90,
        late: 7,
        absent: 3,
      },
      assignmentStats: {
        total: 50,
        active: 15,
        pendingReview: 31,
        pastDue: 4,
      },
    },
    {
      id: "b26",
      name: "Batch #26 - Spring 2024",
      students: 12,
      mentors: 2,
      attendanceAvg: "98%",
      progress: "Week 1/12",
      attendanceBreakdown: {
        present: 95,
        late: 4,
        absent: 1,
      },
      assignmentStats: {
        total: 10,
        active: 8,
        pendingReview: 2,
        pastDue: 0,
      },
    },
  ],
  recentActivities: [
    {
      type: "submission",
      title: "New submission from Abdurahman Ahmed",
      subtitle: "React Basics Assignment",
      time: "2h ago",
    },
    {
      type: "announcement",
      title: "Announcement: Midterm schedule posted",
      subtitle: "System Admin",
      time: "4h ago",
    },
    {
      type: "attendance",
      title: "Batch #24 attendance updated",
      subtitle: "Sumeyya Nuru",
      time: "Yesterday",
    },
    {
      type: "enrollment",
      title: "3 new students enrolled",
      subtitle: "Batch #25",
      time: "Yesterday",
    },
  ],
};

export async function getDashboardOverview() {
  try {
    const response = await fetch("/api/v1/dashboard/overview");
    const contentType = response.headers.get("content-type");
    if (
      response.ok &&
      contentType &&
      contentType.includes("application/json")
    ) {
      const data = await response.json();
      return data || INITIAL_DASHBOARD_DATA;
    }
  } catch (err) {
    console.info(
      "Backend overview service offline. Loaded standard mock overview.",
    );
  }
  return INITIAL_DASHBOARD_DATA;
}
