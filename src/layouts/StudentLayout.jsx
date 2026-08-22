<<<<<<< HEAD
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
    console.info(
      "Backend students service unreachable. Loaded initial records.",
    );
  }
  return INITIAL_STUDENTS_DATA;
=======
import React, { useState } from "react";
import { Outlet, NavLink, Link } from "react-router-dom";
import { FiMenu, FiBell, FiUser, FiMoon, FiLogOut } from "react-icons/fi";
import StudentSidebar from "../components/layout/StudentSidebar";

export default function StudentLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const student = { firstName: "Alex", lastName: "Johnson" };

  const navLinks = [
    { name: "Dashboard", path: "/student/dashboard" },
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Tracks", path: "/tracks" },
    { name: "Mentors", path: "/mentors" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <div className="min-h-screen bg-background flex overflow-hidden w-full">
      <StudentSidebar isOpen={isSidebarOpen} />

      <div
        className={`flex-1 flex flex-col min-h-screen min-w-0 transition-all duration-300 ease-in-out w-full ${
          isSidebarOpen ? "md:pl-62.5" : "pl-0"
        }`}
      >
        <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-border bg-surface px-4 md:px-6 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="flex h-8 w-8 items-center justify-center rounded-md text-text-muted hover:bg-surface-subtle hover:text-primary transition-colors focus:outline-none"
            >
              <FiMenu className="h-5 w-5" />
            </button>
            <span className="text-lg font-bold text-primary tracking-tight">
              ASTU MSJ
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `transition-all duration-200 hover:text-primary ${
                    isActive
                      ? "text-primary underline underline-offset-4 decoration-2"
                      : "text-text-muted"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-4 relative">
            <button className="text-text-muted hover:text-text-primary transition-colors relative">
              <FiBell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary"></span>
            </button>

            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface text-text-muted hover:text-text-primary hover:bg-surface-subtle transition-colors focus:outline-none"
            >
              <FiUser className="h-4 w-4" />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 top-10 mt-2 w-48 rounded-md bg-surface border border-border shadow-lg py-1 z-50">
                <div className="px-4 py-2 border-b border-border">
                  <p className="text-sm font-bold text-text-primary truncate">
                    {student.firstName} {student.lastName}
                  </p>
                  <p className="text-xs text-text-muted truncate">Student</p>
                </div>
                <Link
                  onClick={() => setIsProfileOpen(false)}
                  to="/student/settings"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-text-muted hover:bg-surface-subtle hover:text-text-primary"
                >
                  <FiUser className="h-4 w-4" /> Profile
                </Link>
                <button className="flex w-full items-center gap-2 px-4 py-2 text-sm text-text-muted hover:bg-surface-subtle hover:text-text-primary text-left">
                  <FiMoon className="h-4 w-4" /> Dark Mode
                </button>
                <button className="flex w-full items-center gap-2 px-4 py-2 text-sm text-primary hover:bg-primary-light text-left">
                  <FiLogOut className="h-4 w-4" /> Log out
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 min-w-0 overflow-x-hidden overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
>>>>>>> 27d492b4e1fef52818f4ac14ab1ed0e3ead2c914
}
