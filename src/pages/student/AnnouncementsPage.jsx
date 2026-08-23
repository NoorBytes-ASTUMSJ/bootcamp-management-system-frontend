import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function Announcements() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: "Welcome to the Bootcamp Cohort!",
      author: "Organizer",
      date: "August 21, 2026",
      content:
        "We are thrilled to kick off this new semester. Please make sure to check your student dashboards for initial setup guides and lab details.",
    },
    {
      id: 2,
      title: "First React Assignment Released",
      author: "Mentor",
      date: "August 20, 2026",
      content:
        "The repository link for the first frontend lab has been posted. Reach out to your mentors if you run into environment setup blocks.",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const newAnnouncement = {
      id: Date.now(),
      title,
      author: "Organizer",
      date: new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      content,
    };

    setAnnouncements([newAnnouncement, ...announcements]);
    setTitle("");
    setContent("");
    setShowForm(false);
  };

  return (
    <div className="mx-auto w-full max-w-300 space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-bold text-text-primary tracking-tight">
            Announcements
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            Stay up to date with the latest cohort news, updates, and schedule
            changes.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-primary text-primary-foreground font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition text-xs shadow-sm self-start sm:self-auto"
          >
            {showForm ? "Cancel" : "+ Post Announcement"}
          </button>
        )}
      </div>

      {showForm && isAdmin && (
        <form
          onSubmit={handlePostSubmit}
          className="bg-surface border border-border rounded-xl p-6 space-y-4 shadow-md"
        >
          <h2 className="text-base font-bold text-text-primary">
            Create New Announcement
          </h2>
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Room Change for Lab Session"
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-primary"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1">
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write announcement details here..."
              rows="3"
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-primary resize-none"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-primary text-primary-foreground font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition text-xs"
          >
            Publish Post
          </button>
        </form>
      )}

      {announcements.length > 0 ? (
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
                <div className="flex items-center gap-3">
                  {user?.role !== "user" && (
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                      {item.author}
                    </span>
                  )}
                  <span className="text-xs text-text-muted">{item.date}</span>
                </div>
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
            here as soon as they are posted.
          </p>
        </div>
      )}
    </div>
  );
}
