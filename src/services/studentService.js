const INITIAL_STUDENTS_DATA = [
  {
    id: "1",
    studentId: "STU-2024-892",
    name: "Abdurahman Ahmed",
    email: "abdurahman.a@astu.edu.et",
    phone: "+251 911 234 567",
    initials: "AA",
    batch: "1st",
    batchName: "1st Batch Web Development",
    attendance: "96%",
    progress: 88,
    university: "ASTU",
    status: "Active",
    recentActivity: [
      { title: "Submitted Assignment: React Hooks", time: "Today, 10:45 AM" },
      {
        title: "Attended Live Session: State Management",
        time: "Yesterday, 2:00 PM",
      },
      { title: "Completed Module 4 Quiz", time: "Oct 12, 2024" },
    ],
  },
  {
    id: "2",
    studentId: "STU-2024-893",
    name: "Sumeyya Nuru",
    email: "sumeyya.n@astu.edu.et",
    phone: "+251 922 345 678",
    initials: "SN",
    batch: "1st",
    batchName: "1st Batch Web Development",
    attendance: "100%",
    progress: 94,
    university: "ASTU",
    status: "Active",
    recentActivity: [
      {
        title: "Submitted Assignment: Full-stack Project",
        time: "Today, 9:15 AM",
      },
      { title: "Completed Module 5 Quiz", time: "Oct 14, 2024" },
    ],
  },
  {
    id: "3",
    studentId: "STU-2024-894",
    name: "Bilal Jemal",
    email: "bilal.j@aau.edu.et",
    phone: "+251 933 456 789",
    initials: "BJ",
    batch: "2nd",
    batchName: "2nd Batch DSA & Problem Solving",
    attendance: "92%",
    progress: 78,
    university: "AAU",
    status: "Active",
    recentActivity: [
      { title: "Solved Codeforces Problem Set C", time: "Yesterday, 4:30 PM" },
      { title: "Attended Weekly CP Contest", time: "Oct 13, 2024" },
    ],
  },
  {
    id: "4",
    studentId: "STU-2024-895",
    name: "Hamza Khalid",
    email: "hamza.k@ju.edu.et",
    phone: "+251 944 567 890",
    initials: "HK",
    batch: "3rd",
    batchName: "3rd Batch Competitive Programming",
    attendance: "82%",
    progress: 65,
    university: "JU",
    status: "Pending",
    recentActivity: [{ title: "Registered Application", time: "3 days ago" }],
  },
  {
    id: "5",
    studentId: "STU-2024-896",
    name: "Fatima Zahra",
    email: "fatima.z@hu.edu.et",
    phone: "+251 955 678 901",
    initials: "FZ",
    batch: "2nd",
    batchName: "2nd Batch Web Development",
    attendance: "68%",
    progress: 42,
    university: "HU",
    status: "Inactive",
    recentActivity: [
      { title: "Missed Attendance: Lab Session", time: "2 days ago" },
    ],
  },
];

export async function getStudents() {
  try {
    const response = await fetch("/api/v1/students");
    const contentType = response.headers.get("content-type");
    if (
      response.ok &&
      contentType &&
      contentType.includes("application/json")
    ) {
      const data = await response.json();
      return Array.isArray(data)
        ? data
        : data.students || INITIAL_STUDENTS_DATA;
    }
  } catch (err) {
    console.info("Backend students service offline. Loaded standard records.");
  }
  return INITIAL_STUDENTS_DATA;
}
