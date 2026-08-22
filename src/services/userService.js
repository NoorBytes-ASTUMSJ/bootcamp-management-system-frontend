const INITIAL_USERS_DATA = [
  {
    id: "1",
    userId: "USR-2026-101",
    name: "Abdurahman Ahmed",
    email: "abdurahman.a@astu.edu.et",
    phone: "+251 911 234 567",
    initials: "AA",
    gender: "Male",
    university: "ASTU",
    status: "Approved",
    registeredDate: "Aug 10, 2026",
    role: "Applicant (Student)",
  },
  {
    id: "2",
    userId: "USR-2026-102",
    name: "Sumeyya Nuru",
    email: "sumeyya.n@astu.edu.et",
    phone: "+251 922 345 678",
    initials: "SN",
    gender: "Female",
    university: "ASTU",
    status: "Approved",
    registeredDate: "Aug 11, 2026",
    role: "Applicant (Student)",
  },
  {
    id: "3",
    userId: "USR-2026-103",
    name: "Bilal Jemal",
    email: "bilal.j@aau.edu.et",
    phone: "+251 933 456 789",
    initials: "BJ",
    gender: "Male",
    university: "AAU",
    status: "Pending",
    registeredDate: "Aug 15, 2026",
    role: "Applicant (Student)",
  },
  {
    id: "4",
    userId: "USR-2026-104",
    name: "Fatima Zahra",
    email: "fatima.z@hu.edu.et",
    phone: "+251 955 678 901",
    initials: "FZ",
    gender: "Female",
    university: "HU",
    status: "Approved",
    registeredDate: "Aug 12, 2026",
    role: "Applicant (Mentor)",
  },
  {
    id: "5",
    userId: "USR-2026-105",
    name: "Hamza Khalid",
    email: "hamza.k@ju.edu.et",
    phone: "+251 944 567 890",
    initials: "HK",
    gender: "Male",
    university: "JU",
    status: "Pending",
    registeredDate: "Aug 16, 2026",
    role: "Applicant (Student)",
  },
  {
    id: "6",
    userId: "USR-2026-106",
    name: "Hanan Seid",
    email: "hanan.s@astu.edu.et",
    phone: "+251 966 789 012",
    initials: "HS",
    gender: "Female",
    university: "ASTU",
    status: "Rejected",
    registeredDate: "Aug 05, 2026",
    role: "Applicant (Student)",
  },
];

export async function getAllUsers() {
  try {
    const response = await fetch("/api/v1/users");
    const contentType = response.headers.get("content-type");
    if (
      response.ok &&
      contentType &&
      contentType.includes("application/json")
    ) {
      const data = await response.json();
      return Array.isArray(data) ? data : data.users || INITIAL_USERS_DATA;
    }
  } catch (err) {
    console.info("Backend users service offline. Loaded standard records.");
  }
  return INITIAL_USERS_DATA;
}
