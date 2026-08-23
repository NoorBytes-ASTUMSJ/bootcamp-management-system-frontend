// src/services/mentorService.js

const INITIAL_MENTORS_DATA = [
  {
    id: "1",
    name: "Mohammed Sadik",
    role: "Senior Frontend Mentor",
    email: "sadik.m@astu.edu.et",
    phone: "+251 911 234 567",
    location: "ASTU, Adama",
    batch: "1st",
    studentsCount: "4/6",
    university: "ASTU",
    status: "Active",
    assignedStudents: [
      {
        initials: "AA",
        name: "Abdurahman Ahmed",
        color: "bg-blue-100 text-blue-700",
      },
      {
        initials: "SN",
        name: "Sumeyya Nuru",
        color: "bg-purple-100 text-purple-700",
      },
      {
        initials: "BJ",
        name: "Bilal Jemal",
        color: "bg-emerald-100 text-emerald-700",
      },
      {
        initials: "HK",
        name: "Hamza Khalid",
        color: "bg-amber-100 text-amber-700",
      },
    ],
  },
  {
    id: "2",
    name: "Abubakar Ali",
    role: "Backend & Systems Mentor",
    email: "abubakar.a@astu.edu.et",
    phone: "+251 922 345 678",
    location: "AAU, Addis Ababa",
    batch: "1st",
    studentsCount: "6/6",
    university: "AAU",
    status: "Active",
    assignedStudents: [
      {
        initials: "FZ",
        name: "Fatima Zahra",
        color: "bg-rose-100 text-rose-700",
      },
      {
        initials: "YM",
        name: "Yusuf Mohammed",
        color: "bg-indigo-100 text-indigo-700",
      },
      {
        initials: "IK",
        name: "Ibrahim Kedir",
        color: "bg-cyan-100 text-cyan-700",
      },
      {
        initials: "MA",
        name: "Maryam Ali",
        color: "bg-teal-100 text-teal-700",
      },
      {
        initials: "OH",
        name: "Omer Hassan",
        color: "bg-emerald-100 text-emerald-700",
      },
      {
        initials: "ZT",
        name: "Zubair Taha",
        color: "bg-blue-100 text-blue-700",
      },
    ],
  },
  {
    id: "3",
    name: "Amina Hussein",
    role: "Competitive Programming Mentor",
    email: "amina.h@astu.edu.et",
    phone: "+251 933 456 789",
    location: "JU, Jimma",
    batch: "2nd",
    studentsCount: "0/6",
    university: "JU",
    status: "Pending",
    assignedStudents: [],
  },
];

export async function getMentors() {
  try {
    const response = await fetch("/api/v1/mentors");
    const contentType = response.headers.get("content-type");

    if (
      response.ok &&
      contentType &&
      contentType.includes("application/json")
    ) {
      const data = await response.json();
      return Array.isArray(data) ? data : data.mentors || INITIAL_MENTORS_DATA;
    }
  } catch (err) {
    console.info(
      "Backend service offline. Loaded standard mock service records.",
    );
  }
  return INITIAL_MENTORS_DATA;
}
