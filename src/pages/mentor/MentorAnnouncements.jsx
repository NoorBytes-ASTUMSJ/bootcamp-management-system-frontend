import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { FiBell, FiPlus, FiX } from "react-icons/fi";

export default function MentorAnnouncements() {
  const { user } = useAuth();

  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: "Batch 3 React Lab Session Rescheduled",
      author: user?.name || "Mentor",
      date: "August 21, 2026",
      content:
        "Please note that tomorrow's interactive React hooks lab has been pushed back by one hour to accommodate the mentor sync meeting.",
    },
    {
      id: 2,
      title: "Reviewing Final Project SRS Guidelines",
      author: user?.name || "Mentor",
      date: "August 18, 2026",
      content:
        "Ensure your team repositories have the base folder structure ready before our Friday code review walkthrough.",
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
      author: user?.name || "Mentor",
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
            Mentor Announcements
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            Broadcast updates, lab schedules, and notices to your assigned
            students.
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex justify-center items-center gap-2 bg-primary text-primary-foreground font-bold px-4 py-2.5 rounded-lg hover:opacity-90 transition text-xs sm:text-sm shadow-sm whitespace-nowrap"
        >
          {showForm ? (
            <FiX className="h-4 w-4" />
          ) : (
            <FiPlus className="h-4 w-4" />
          )}
          {showForm ? "Cancel" : "Post Announcement"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handlePostSubmit}
          className="bg-surface border border-border rounded-xl p-6 sm:p-7 space-y-5 shadow-md animate-in zoom-in-95 duration-200"
        >
          <h2 className="text-base font-bold text-text-primary">
            Create New Batch Announcement
          </h2>
          <div>
            <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1.5">
              Title <span className="text-error">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Lab Schedule Update"
              className="w-full bg-surface-subtle border border-border rounded-lg px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-primary transition-shadow"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1.5">
              Content <span className="text-error">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your notice details here..."
              rows="4"
              className="w-full p-3 bg-surface-subtle border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary transition-shadow resize-none"
              required
            />
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t border-border">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-surface text-text-primary border border-border hover:bg-surface-subtle font-bold text-xs sm:text-sm rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-primary text-primary-foreground font-bold text-xs sm:text-sm rounded-lg hover:opacity-90 transition-colors shadow-sm"
            >
              Publish Announcement
            </button>
          </div>
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
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                    {item.author}
                  </span>
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
            <FiBell className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-text-primary mb-1">
            No announcements posted yet
          </h3>
          <p className="text-text-muted max-w-sm mx-auto text-xs">
            Create your first broadcast using the button above to keep your
            students updated.
          </p>
        </div>
      )}
    </div>
  );
}
