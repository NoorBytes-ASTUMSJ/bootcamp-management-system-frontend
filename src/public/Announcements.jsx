import React from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/layout/Navbar"; // Adjust if your Navbar folder differs (e.g., "../components/layout/Navbar")
import Footer from "../components/layout/Footer"; // Adjust if your Footer folder differs

export default function Announcements() {
  const { user } = useAuth();

  // Block only administrative/mentor roles if they accidentally land on the public page view
  const isInternalRole = user && (user.role === "admin" || user.role === "mentor");

  // Currently no announcements published (replace with API fetch when endpoint is ready)
  const announcements = [];

  return (
    <div className="min-h-screen flex flex-col bg-background text-text-primary">
      {/* Top Navbar Header */}
      <Navbar />

      {/* Main Container */}
      <main className="flex-1 mx-auto w-full max-w-[1200px] py-10 px-4 sm:px-6 space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl sm:text-[28px] font-bold text-text-primary tracking-tight">
            Announcements
          </h1>
          <p className="text-xs sm:text-sm text-text-muted">
            Stay up to date with the latest news, cohort updates, and program schedules.
          </p>
        </div>

        {isInternalRole ? (
          <div className="text-center py-12 px-4 bg-surface border border-border rounded-xl shadow-sm">
            <p className="text-sm text-text-muted">
              You are logged in as a <span className="font-semibold text-primary capitalize">{user.role}</span>. Please access your dedicated dashboard portal to manage or view internal announcements.
            </p>
          </div>
        ) : announcements.length > 0 ? (
          <div className="space-y-5">
            {announcements.map((item) => (
              <div
                key={item.id}
                className="bg-surface border border-border rounded-xl p-6 sm:p-7 shadow-sm transition hover:border-primary/50 flex flex-col gap-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h2 className="text-lg sm:text-xl font-bold text-text-primary">
                    {item.title}
                  </h2>
                  <span className="text-xs text-text-muted">{item.date}</span>
                </div>
                <p className="text-text-muted text-sm leading-relaxed">
                  {item.content}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4 bg-surface border border-border rounded-xl shadow-sm">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-3 text-xl">
              📢
            </div>
            <h3 className="text-base font-bold text-text-primary mb-1">
              No announcements yet
            </h3>
            <p className="text-text-muted max-w-sm mx-auto text-xs">
              Stay updated! Important notices and cohort news will appear right
              here as soon as information is released.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}