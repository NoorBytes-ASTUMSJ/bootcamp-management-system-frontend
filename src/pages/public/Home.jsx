import React from "react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import {
  BookOpen,
  Code2,
  Puzzle,
  Users,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";

export default function Home({
  onNavigatePage,
  onNavigateLogin,
  onNavigateSignUp,
}) {
  const stats = [
    { label: "100+", sub: "Participants (Last 2 Years)" },
    { label: "3rd", sub: "Batch Coming Next" },
    { label: "12 Weeks", sub: "Structured Duration" },
    { label: "100%", sub: "Free", isHighlight: true },
  ];

  const features = [
    {
      icon: <BookOpen size={18} className="text-primary" />,
      title: "Structured Learning",
      desc: "Clear weekly modules starting from absolute basics up to advanced full-stack concepts.",
    },
    {
      icon: <Code2 size={18} className="text-primary" />,
      title: "Competitive Programming",
      desc: "Sharpen logic and problem-solving skills through regular contests and foundational DSA.",
    },
    {
      icon: <Puzzle size={18} className="text-primary" />,
      title: "Weekly Projects",
      desc: "Build practical, tangible projects every week based on the exact lessons covered.",
    },
    {
      icon: <Users size={18} className="text-primary" />,
      title: "Full-time Mentorship",
      desc: "Guidance from ~20 current experienced ASTU student mentors and alumni.",
    },
    {
      icon: <TrendingUp size={18} className="text-primary" />,
      title: "Progress Tracking",
      desc: "Rigorous assignment feedback loops to ensure no student is left behind.",
    },
    {
      icon: <ShieldCheck size={18} className="text-primary" />,
      title: "Certification",
      desc: "Receive a certificate upon successful completion of the rigorous 12-week program.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      <Navbar
        currentView="home"
        onNavigatePage={onNavigatePage}
        onNavigateLogin={onNavigateLogin}
        onNavigateSignUp={onNavigateSignUp}
      />

      {/* ================= 1. HERO SECTION ================= */}
      <section className="pt-16 pb-20 px-4 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto">
        {/* Badge Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary border border-border text-[11px] font-medium text-primary mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          for ASTU Muslim Students
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-foreground leading-[1.12] mb-6">
          Discipline. Practice. <br />
          <span className="text-primary">Full-Stack Mentorship.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
          A structured, beginner-friendly journey into web development. No
          previous programming experience required. Replace scattered learning
          with a clear path.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={onNavigateSignUp}
            className="px-6 py-3 rounded-lg bg-primary text-primary-foreground text-xs sm:text-sm font-semibold hover:bg-primary-hover transition-colors shadow-2xs cursor-pointer"
          >
            Sign Up for Batch 3
          </button>
          <button
            type="button"
            onClick={() => onNavigatePage && onNavigatePage("tracks")}
            className="px-6 py-3 rounded-lg bg-background hover:bg-surface-subtle text-foreground text-xs sm:text-sm font-semibold transition-colors border border-border cursor-pointer shadow-2xs"
          >
            Explore the Bootcamp
          </button>
        </div>
      </section>

      {/* ================= 2. STATS SECTION ================= */}
      <section className="border-y border-border bg-surface-subtle">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x-0 md:divide-x divide-border">
            {stats.map((stat, idx) => (
              <div key={idx} className="px-4">
                <div
                  className={`text-2xl sm:text-3xl font-extrabold tracking-tight mb-1 ${
                    stat.isHighlight ? "text-primary" : "text-foreground"
                  }`}
                >
                  {stat.label}
                </div>
                <div className="text-[11px] text-muted">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 3. FEATURES & INTRO SECTION ================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        {/* Middle Header & Paragraph */}
        <div className="mb-12 max-w-3xl">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-3">
            A Structured Journey
          </h2>
          <p className="text-xs sm:text-sm text-muted leading-relaxed">
            We believe in learning through doing. This bootcamp replaces the
            endless cycle of scattered tutorials with a rigid, structured
            journey. You will learn concepts, practice them immediately, compete
            with peers, build tangible projects, and receive continuous
            full-time mentorship.
          </p>
        </div>

        {/* 6 Feature Cards (with Box styling) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item, idx) => (
            <div
              key={idx}
              className="p-7 rounded-2xl bg-surface border border-border shadow-2xs flex flex-col justify-start space-y-3.5 hover:border-primary/40 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-secondary border border-border flex items-center justify-center">
                {item.icon}
              </div>
              <h3 className="text-sm sm:text-base font-bold text-foreground">
                {item.title}
              </h3>
              <p className="text-xs text-muted leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= 4. FOOTER ================= */}
      <Footer onNavigatePage={onNavigatePage} />
    </div>
  );
}
