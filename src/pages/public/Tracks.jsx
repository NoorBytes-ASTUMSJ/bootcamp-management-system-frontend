import React from "react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import {
  Calendar,
  Monitor,
  CheckCircle2,
  Terminal,
  Trophy,
  TrendingUp,
  Info,
  Layers,
  Sparkles,
  BookOpen,
  HelpCircle,
  FileCheck,
  Compass,
  LifeBuoy,
  BarChart3,
  User,
  GraduationCap,
} from "lucide-react";

export default function Tracks({
  onNavigatePage,
  onNavigateLogin,
  onNavigateSignUp,
}) {
  const techStack = [
    {
      code: "H5",
      name: "HTML & CSS",
      color: "text-red-500",
      bg: "bg-red-500/10",
    },
    {
      code: "JS",
      name: "JavaScript",
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    { code: "Re", name: "React", color: "text-cyan-500", bg: "bg-cyan-500/10" },
    {
      code: "No",
      name: "Node.js",
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      code: "Ex",
      name: "Express.js",
      color: "text-neutral-800 dark:text-neutral-200",
      bg: "bg-neutral-500/10",
    },
    {
      code: "Mo",
      name: "MongoDB",
      color: "text-emerald-600",
      bg: "bg-emerald-600/10",
    },
    {
      code: "Git",
      name: "Git / GitHub Workflow",
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      wide: true,
    },
  ];

  const mentorshipFeatures = [
    { icon: <BookOpen size={14} />, text: "Teach concepts" },
    { icon: <HelpCircle size={14} />, text: "Answer questions" },
    { icon: <FileCheck size={14} />, text: "Review work" },
    { icon: <Compass size={14} />, text: "Guide projects" },
    { icon: <LifeBuoy size={14} />, text: "Help with difficulties" },
    { icon: <BarChart3 size={14} />, text: "Track progress" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      <Navbar
        currentView="tracks"
        onNavigatePage={onNavigatePage}
        onNavigateLogin={onNavigateLogin}
        onNavigateSignUp={onNavigateSignUp}
      />

      {/* ================= 1. HERO SECTION ================= */}
      <section className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary border border-border text-[11px] font-semibold text-muted tracking-widest uppercase mb-6">
          THE LEARNING JOURNEY
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-foreground leading-[1.12] mb-6">
          Start from the basics. <br />
          Build the skills. <br />
          <span className="text-primary">
            Become a full-stack web developer.
          </span>
        </h1>

        <p className="text-xs sm:text-sm text-muted max-w-xl mx-auto leading-relaxed mb-8">
          A rigorous 12-week online program exclusively for ASTU Muslim
          students. No previous programming experience required. Completely
          free.
        </p>

        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-border bg-surface text-[11px] font-medium text-foreground shadow-2xs hover:border-primary/40 transition-all">
            <Calendar size={13} className="text-primary" />
            <span>12 Weeks</span>
          </div>

          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-border bg-surface text-[11px] font-medium text-foreground shadow-2xs hover:border-primary/40 transition-all">
            <Monitor size={13} className="text-primary" />
            <span>100% Online</span>
          </div>

          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-border bg-surface text-[11px] font-medium text-foreground shadow-2xs hover:border-primary/40 transition-all">
            <Sparkles size={13} className="text-primary" />
            <span>Free Tuition</span>
          </div>
        </div>
      </section>

      {/* ================= 2. TIMELINE SECTION ================= */}
      <section className="px-4 sm:px-6 lg:px-8 pb-16 max-w-4xl mx-auto">
        <div className="relative pl-6 sm:pl-10 space-y-10">
          {/* Continuous Red-tinted Vertical Timeline Line */}
          <div className="absolute left-[7px] sm:left-[11px] top-6 bottom-6 w-[1.5px] bg-border z-0" />

          {/* ---------- CARD 1: FOUNDATION ---------- */}
          <div className="relative">
            {/* Dot 1 */}
            <div className="absolute -left-[27px] sm:-left-[39px] top-6 w-3.5 h-3.5 rounded-full border-2 border-border bg-background z-10" />

            <div className="p-7 sm:p-8 rounded-2xl bg-surface border border-border shadow-2xs hover:border-primary/40 transition-all duration-300">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-7 h-7 rounded-lg bg-secondary border border-border text-muted flex items-center justify-center">
                  <Terminal size={14} />
                </div>
                <span className="text-[11px] font-mono font-bold tracking-widest text-muted uppercase">
                  FOUNDATION
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-foreground mb-3">
                Python & Problem Solving
              </h3>

              <p className="text-xs sm:text-sm text-muted leading-relaxed mb-6">
                We start from zero. Learn the syntax, control structures, and
                fundamental logic required to tell computers what to do. Focus
                on building strong analytical thinking skills before touching
                advanced frameworks.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-6 pt-2 border-t border-border/50 text-xs text-muted">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-primary shrink-0" />
                  <span>Basic Python Syntax</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-primary shrink-0" />
                  <span>DSA Fundamentals</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-primary shrink-0" />
                  <span>Problem Solving Techniques</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-primary shrink-0" />
                  <span>Competitive Programming Intro</span>
                </div>
              </div>
            </div>
          </div>

          {/* ---------- CARD 2: PHASE 1 ---------- */}
          <div className="relative">
            {/* Dot 2 */}
            <div className="absolute -left-[27px] sm:-left-[39px] top-6 w-3.5 h-3.5 rounded-full border-2 border-primary bg-background ring-2 ring-primary/20 z-10" />

            <div className="p-7 sm:p-8 rounded-2xl bg-surface border border-border shadow-2xs hover:border-primary/40 transition-all duration-300">
              <span className="block text-[11px] font-mono font-bold tracking-widest text-primary uppercase mb-2">
                PHASE 1
              </span>

              <h3 className="text-lg sm:text-xl font-bold text-foreground mb-3">
                Competitive Programming
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-7 space-y-4">
                  <p className="text-xs sm:text-sm text-muted leading-relaxed">
                    Shift focus entirely to algorithmic thinking. This phase is
                    about discipline, consistency, and tackling complex problems
                    under pressure.
                  </p>

                  <div className="flex items-start gap-2 p-3 rounded-xl bg-secondary/60 border border-border text-[11px] text-muted leading-relaxed">
                    <Info size={14} className="text-primary shrink-0 mt-0.5" />
                    <span>
                      Note: Focus is on learning and contests, not weekly
                      projects.
                    </span>
                  </div>
                </div>

                {/* Right side stats box */}
                <div className="lg:col-span-5 p-4 rounded-xl bg-secondary/40 border border-border space-y-3">
                  <div>
                    <div className="flex justify-between items-center text-[11px] font-medium text-foreground mb-1.5">
                      <span>Contests</span>
                      <Trophy size={13} className="text-primary" />
                    </div>
                    <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full w-[45%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center text-[11px] font-medium text-foreground mb-1.5">
                      <span>Discipline</span>
                      <TrendingUp size={13} className="text-primary" />
                    </div>
                    <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full w-[85%]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ---------- CARD 3: PHASE 2 ---------- */}
          <div className="relative">
            {/* Dot 3 */}
            <div className="absolute -left-[27px] sm:-left-[39px] top-6 w-3.5 h-3.5 rounded-full border-2 border-primary bg-background ring-2 ring-primary/20 z-10" />

            <div className="p-7 sm:p-8 rounded-2xl bg-surface border border-border shadow-2xs hover:border-primary/40 transition-all duration-300">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-mono font-bold tracking-widest text-primary uppercase">
                  PHASE 2
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary border border-border text-[10px] font-medium text-muted">
                  <Layers size={11} className="text-primary" /> Weekly Projects
                  Included
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-foreground mb-3">
                Development
              </h3>

              <p className="text-xs sm:text-sm text-muted leading-relaxed mb-6">
                Transition from terminal to browser. Build actual, scalable web
                applications using industry-standard tools and frameworks. Apply
                the logic learned in Phase 1 to real-world software
                architecture.
              </p>

              {/* Tech Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {techStack.map((tech, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl bg-secondary/50 border border-border flex flex-col items-center justify-center text-center hover:border-primary/40 transition-colors ${
                      tech.wide ? "col-span-2 sm:col-span-2" : ""
                    }`}
                  >
                    <span
                      className={`text-xs font-black font-mono px-2 py-0.5 rounded mb-1 ${tech.bg} ${tech.color}`}
                    >
                      {tech.code}
                    </span>
                    <span className="text-[10px] text-muted font-medium">
                      {tech.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ---------- ENDPOINT BADGE ---------- */}
          <div className="relative pt-2">
            {/* Checked Final Dot */}
            <div className="absolute -left-[27px] sm:-left-[39px] top-8 w-3.5 h-3.5 rounded-full bg-primary flex items-center justify-center z-10">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-r from-[#211818] via-[#1a1c20] to-[#121417] text-white shadow-md text-center border border-white/10 hover:border-primary/40 transition-all">
              <h3 className="text-base sm:text-lg font-bold mb-1">
                Become a Full-Stack Web Developer.
              </h3>
              <p className="text-[11px] sm:text-xs text-gray-400">
                Ready to build the future.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 3. GUIDED BY EXPERTS ================= */}
      <section className="px-4 sm:px-6 lg:px-8 pb-28 max-w-4xl mx-auto">
        <div className="p-7 sm:p-10 rounded-2xl bg-surface border border-border shadow-2xs hover:border-primary/40 transition-all duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <span className="text-[10px] font-mono font-bold tracking-widest text-muted uppercase block mb-1">
                SUPPORT SYSTEM
              </span>

              <h2 className="text-2xl font-bold text-foreground mb-3">
                Guided by Experts.
              </h2>

              <p className="text-xs text-muted leading-relaxed mb-6">
                You are never learning alone. Mentorship is integrated
                throughout every phase of the journey to ensure you never get
                permanently stuck.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4">
                {mentorshipFeatures.map((feat, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 text-xs text-muted"
                  >
                    <span className="p-1 rounded-md bg-secondary text-primary border border-border">
                      {feat.icon}
                    </span>
                    <span>{feat.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side connection illustration */}
            <div className="lg:col-span-5 flex items-center justify-center p-8 rounded-2xl bg-secondary/40 border border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center text-muted shadow-2xs">
                  <User size={18} />
                </div>

                <div className="w-10 h-[2px] bg-primary" />

                <div className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center shadow-md shadow-primary/20">
                  <GraduationCap size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 4. FOOTER ================= */}
      <Footer onNavigatePage={onNavigatePage} />
    </div>
  );
}
