<<<<<<< Updated upstream
=======
import React, { useEffect, useState } from "react";
import { fetchDashboardOverview } from "../../services/dashboardService";

export default function MentorDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardOverview()
      .then((res) => setData(res))
      .catch((err) => setError("Failed to load mentor overview."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center text-slate-400">Loading Mentor Workspace...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  const { assignedStudentsCount, pendingGradingCount, students, pendingSubmissions } = data || {};

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 bg-slate-950 text-slate-100 min-h-screen">
      <header className="border-b border-slate-800 pb-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-emerald-400">Mentor Portal</h1>
        <p className="text-sm text-slate-400">Manage your assigned mentees and pending assignment reviews.</p>
      </header>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
          <p className="text-xs text-slate-400 font-medium uppercase">Assigned Mentees</p>
          <p className="text-3xl font-bold mt-2 text-emerald-300">{assignedStudentsCount || 0}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
          <p className="text-xs text-slate-400 font-medium uppercase">Pending Submissions to Grade</p>
          <p className="text-3xl font-bold mt-2 text-amber-300">{pendingGradingCount || 0}</p>
        </div>
      </div>

      {/* Grading Queue */}
      <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-semibold text-slate-200">Submissions Awaiting Review</h2>
        {pendingSubmissions?.length === 0 ? (
          <p className="text-sm text-slate-400">No pending submissions to review right now.</p>
        ) : (
          <div className="space-y-3">
            {pendingSubmissions?.map((sub) => (
              <div key={sub._id} className="flex justify-between items-center bg-slate-950 border border-slate-800 p-4 rounded-lg">
                <div>
                  <p className="font-semibold text-slate-200">{sub.assignment?.title || "Assignment Submission"}</p>
                  <p className="text-xs text-slate-400">Max Score: {sub.assignment?.maxScore || 100}</p>
                </div>
                <button className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-4 py-2 rounded-lg font-medium transition">
                  Review & Grade
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Assigned Students List */}
      <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-semibold text-slate-200">Your Mentees</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {students?.map((student) => (
            <div key={student._id} className="bg-slate-950 border border-slate-800 p-4 rounded-lg space-y-1">
              <p className="font-bold text-slate-200">{student.user?.fullName}</p>
              <p className="text-xs text-slate-400">{student.user?.email}</p>
              <p className="text-xs text-emerald-400 uppercase tracking-wider font-semibold pt-1">ID: {student.memberId}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
>>>>>>> Stashed changes
