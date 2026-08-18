import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import StudentLayout from "./layouts/StudentLayout";
import StudentDashboard from "./pages/student/Dashboard";
import StudentAttendance from "./pages/student/Attendance";
import StudentProgress from "./pages/student/StudentProgress";
import StudentAssignments from "./pages/student/StudentAssignments";

const HomePlaceholder = () => (
  <div className="flex h-screen items-center justify-center bg-white text-2xl font-bold text-[#171717]">
    Public Landing Page (Home)
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePlaceholder />} />

        <Route path="/student" element={<StudentLayout />}>
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="attendance" element={<StudentAttendance />} />
          <Route path="progress" element={<StudentProgress />} />
          <Route path="assignments" element={<StudentAssignments />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
