import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import {
  SiHtml5,
  SiJavascript,
  SiReact,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiGit,
  SiGithub,
} from "react-icons/si";
import { FaCss3Alt } from "react-icons/fa";

export default function Tracks({
  onNavigatePage,
  onNavigateLogin,
  onNavigateSignUp,
}) {
  const supportPoints = [
    {
      icon: (
        <svg
          className="w-4 h-4 text-text-primary group-hover:text-primary transition-colors duration-200"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
      ),
      text: "Teach concepts",
    },
    {
      icon: (
        <svg
          className="w-4 h-4 text-text-primary group-hover:text-primary transition-colors duration-200"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
      text: "Answer questions",
    },
    {
      icon: (
        <svg
          className="w-4 h-4 text-text-primary group-hover:text-primary transition-colors duration-200"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <polyline points="8 12 11 15 16 9" />
        </svg>
      ),
      text: "Review work",
    },
    {
      icon: (
        <svg
          className="w-4 h-4 text-text-primary group-hover:text-primary transition-colors duration-200"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
        </svg>
      ),
      text: "Guide projects",
    },
    {
      icon: (
        <svg
          className="w-4 h-4 text-text-primary group-hover:text-primary transition-colors duration-200"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="4" />
          <line x1="4.93" y1="4.93" x2="9.17" y2="9.17" />
          <line x1="14.83" y1="14.83" x2="19.07" y2="19.07" />
          <line x1="14.83" y1="9.17" x2="19.07" y2="4.93" />
          <line x1="4.93" y1="19.07" x2="9.17" y2="14.83" />
        </svg>
      ),
      text: "Help with difficulties",
    },
    {
      icon: (
        <svg
          className="w-4 h-4 text-text-primary group-hover:text-primary transition-colors duration-200"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      ),
      text: "Track progress",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-text-primary transition-colors selection:bg-primary/20 selection:text-primary">
      <Navbar
        currentView="tracks"
        onNavigatePage={onNavigatePage}
        onNavigateLogin={onNavigateLogin}
        onNavigateSignUp={onNavigateSignUp}
      />

      {/* ================= 1. HERO SECTION ================= */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto">
        <div className="inline-block px-3.5 py-1 rounded-full bg-surface-subtle border border-border-subtle text-text-muted text-[11px] font-mono tracking-widest uppercase mb-6 shadow-2xs">
          THE LEARNING JOURNEY
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-text-primary leading-[1.15] mb-6">
          Start from the basics. <br />
          Build the skills. <br />
          <span className="text-primary bg-gradient-to-r from-primary to-primary/80 bg-clip-text">
            Become a full-stack web developer.
          </span>
        </h1>

        <p className="text-sm sm:text-base text-text-muted max-w-2xl mx-auto leading-relaxed mb-8">
          A rigorous 12-week online program exclusively for ASTU Muslim
          students. No previous programming experience required. Completely
          free.
        </p>

        {/* 3 Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-text-muted">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-border shadow-xs hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-200">
            <svg
              className="w-4 h-4 text-primary"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span className="text-text-primary font-medium">12 Weeks</span>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-border shadow-xs hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-200">
            <svg
              className="w-4 h-4 text-primary"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
              <line x1="8" y1="21" x2="16" y2="21"></line>
              <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
            <span className="text-text-primary font-medium">100% Online</span>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-border shadow-xs hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-200">
            <svg
              className="w-4 h-4 text-primary"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              <line
                x1="4"
                y1="4"
                x2="20"
                y2="20"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
            <span className="text-text-primary font-medium">Free Tuition</span>
          </div>
        </div>
      </section>

      {/* ================= 2. TIMELINE ROADMAP ================= */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20 max-w-4xl mx-auto">
        <div className="relative pl-6 sm:pl-10 space-y-12">
          {/* Vertical Timeline Bar */}
          <div className="absolute left-2 sm:left-3.5 top-8 bottom-12 w-[2px] bg-border-subtle" />

          {/* ---------------- CARD 1: FOUNDATION ---------------- */}
          <div className="relative group">
            <div className="absolute -left-[23px] sm:left-[-35.5px] top-7 w-4 h-4 rounded-full bg-background border-2 border-border-subtle group-hover:border-primary group-hover:scale-110 transition-all duration-300 z-10" />

            <div className="p-6 sm:p-8 rounded-2xl bg-surface border border-border hover:border-primary/50 shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1.5 transition-all duration-300">
              <div className="flex items-center gap-3.5 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center text-primary shadow-2xs group-hover:bg-primary/20 group-hover:scale-105 transition-all duration-300">
                  <svg
                    className="w-5 h-5 text-primary"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect
                      x="2"
                      y="4"
                      width="20"
                      height="16"
                      rx="3"
                      ry="3"
                    ></rect>
                    <polyline points="7 10 10 13 7 16"></polyline>
                    <line x1="12" y1="16" x2="16" y2="16"></line>
                  </svg>
                </div>
                <div>
                  <span className="text-[10px] font-mono tracking-wider text-primary uppercase block font-semibold">
                    FOUNDATION
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-text-primary group-hover:text-primary transition-colors duration-200">
                    Python & Problem Solving
                  </h3>
                </div>
              </div>

              <div className="border-t border-border-subtle group-hover:border-primary/20 my-5 transition-colors duration-300" />

              <p className="text-xs sm:text-sm text-text-muted leading-relaxed mb-6">
                We start from zero. Learn the syntax, control structures, and
                fundamental logic required to tell computers what to do. Focus
                on building strong analytical thinking skills before touching
                advanced frameworks.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3.5 gap-x-6 text-xs sm:text-sm text-text-primary">
                <div className="flex items-center gap-2.5 group/item">
                  <svg
                    className="w-4 h-4 text-primary shrink-0 transition-transform group-hover/item:scale-110"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="9 12 11 14 15 10"></polyline>
                  </svg>
                  <span>Basic Python Syntax</span>
                </div>
                <div className="flex items-center gap-2.5 group/item">
                  <svg
                    className="w-4 h-4 text-primary shrink-0 transition-transform group-hover/item:scale-110"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="9 12 11 14 15 10"></polyline>
                  </svg>
                  <span>DSA Fundamentals</span>
                </div>
                <div className="flex items-center gap-2.5 group/item">
                  <svg
                    className="w-4 h-4 text-primary shrink-0 transition-transform group-hover/item:scale-110"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="9 12 11 14 15 10"></polyline>
                  </svg>
                  <span>Problem Solving Techniques</span>
                </div>
                <div className="flex items-center gap-2.5 group/item">
                  <svg
                    className="w-4 h-4 text-primary shrink-0 transition-transform group-hover/item:scale-110"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="9 12 11 14 15 10"></polyline>
                  </svg>
                  <span>Competitive Programming Intro</span>
                </div>
              </div>
            </div>
          </div>

          {/* ---------------- CARD 2: PHASE 1 ---------------- */}
          <div className="relative group">
            <div className="absolute -left-[23px] sm:left-[-35.5px] top-7 w-4 h-4 rounded-full bg-background border-2 border-primary group-hover:scale-110 transition-all duration-300 z-10" />

            <div className="p-6 sm:p-8 rounded-2xl bg-surface border border-border hover:border-primary/50 shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1.5 transition-all duration-300">
              <span className="text-[10px] font-mono tracking-wider text-primary uppercase block mb-1 font-semibold">
                PHASE 1
              </span>
              <h3 className="text-base sm:text-lg font-bold text-text-primary group-hover:text-primary transition-colors duration-200 mb-2.5">
                Competitive Programming
              </h3>

              <p className="text-xs sm:text-sm text-text-muted leading-relaxed mb-6">
                Shift focus entirely to algorithmic thinking. This phase is
                about discipline, consistency, and tackling complex problems
                under pressure.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="p-4 rounded-xl bg-surface-subtle border border-border flex items-start gap-3 text-xs text-text-muted leading-relaxed">
                  <span className="text-text-primary font-bold">ⓘ</span>
                  <span>
                    <strong className="text-text-primary font-semibold">
                      Note:
                    </strong>{" "}
                    Focus is on learning and contests, not weekly projects.
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-medium text-text-primary mb-1.5 items-center">
                      <span>Contests</span>
                      <svg
                        className="w-4 h-4 text-primary"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                        <path d="M4 22h16"></path>
                        <path d="M10 14.66V17c0 .55-.45 1-1 1H7v4h10v-4h-2c-.55 0-1-.45-1-1v-2.34"></path>
                        <path d="M6 4h12v7a6 6 0 0 1-12 0V4z"></path>
                      </svg>
                    </div>
                    <div className="w-full bg-border-subtle rounded-full h-2 overflow-hidden">
                      <div className="bg-primary h-2 rounded-full w-[45%] transition-all duration-500 ease-out" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium text-text-primary mb-1.5 items-center">
                      <span>Discipline</span>
                      <svg
                        className="w-4 h-4 text-primary"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                        <polyline points="17 6 23 6 23 12"></polyline>
                      </svg>
                    </div>
                    <div className="w-full bg-border-subtle rounded-full h-2 overflow-hidden">
                      <div className="bg-primary h-2 rounded-full w-[65%] transition-all duration-500 ease-out" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ---------------- CARD 3: PHASE 2 (8 TECH CARDS WITH FaCss3Alt) ---------------- */}
          <div className="relative group">
            <div className="absolute -left-[23px] sm:left-[-35.5px] top-7 w-4 h-4 rounded-full bg-background border-2 border-primary ring-4 ring-primary/10 group-hover:scale-110 transition-all duration-300 z-10" />

            <div className="p-6 sm:p-8 rounded-2xl bg-surface border border-border hover:border-primary/50 shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1.5 transition-all duration-300">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono tracking-wider text-primary uppercase block font-semibold">
                  PHASE 2
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-secondary text-primary text-[11px] font-medium border border-border-subtle shadow-2xs">
                  Weekly Projects Included
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-text-primary group-hover:text-primary transition-colors duration-200 mb-2.5">
                Development
              </h3>

              <p className="text-xs sm:text-sm text-text-muted leading-relaxed mb-6">
                Transition from terminal to browser. Build actual, scalable web
                applications using industry-standard tools and frameworks. Apply
                the logic learned in Phase 1 to real-world software
                architecture.
              </p>

              {/* 8 Distinct Technology Cards (4x2 Grid) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                {/* 1. HTML5 */}
                <div className="group/tech p-4 rounded-xl bg-surface-subtle border border-border hover:border-[#E34F26]/50 hover:bg-[#E34F26]/5 hover:-translate-y-1 hover:shadow-md hover:shadow-[#E34F26]/10 transition-all duration-200 flex flex-col items-center justify-center text-center cursor-default">
                  <div className="w-10 h-10 rounded-xl bg-[#E34F26]/10 group-hover/tech:bg-[#E34F26]/20 group-hover/tech:scale-110 transition-all duration-200 flex items-center justify-center mb-2.5 shadow-2xs">
                    <SiHtml5 className="w-5 h-5 text-[#E34F26]" />
                  </div>
                  <span className="text-xs font-semibold text-text-primary block">
                    HTML5
                  </span>
                </div>

                {/* 2. CSS3 (Using FaCss3Alt) */}
                <div className="group/tech p-4 rounded-xl bg-surface-subtle border border-border hover:border-[#1572B6]/50 hover:bg-[#1572B6]/5 hover:-translate-y-1 hover:shadow-md hover:shadow-[#1572B6]/10 transition-all duration-200 flex flex-col items-center justify-center text-center cursor-default">
                  <div className="w-10 h-10 rounded-xl bg-[#1572B6]/10 group-hover/tech:bg-[#1572B6]/20 group-hover/tech:scale-110 transition-all duration-200 flex items-center justify-center mb-2.5 shadow-2xs">
                    <FaCss3Alt className="w-5 h-5 text-[#1572B6]" />
                  </div>
                  <span className="text-xs font-semibold text-text-primary block">
                    CSS3
                  </span>
                </div>

                {/* 3. JavaScript */}
                <div className="group/tech p-4 rounded-xl bg-surface-subtle border border-border hover:border-[#F7DF1E]/50 hover:bg-[#F7DF1E]/5 hover:-translate-y-1 hover:shadow-md hover:shadow-[#F7DF1E]/10 transition-all duration-200 flex flex-col items-center justify-center text-center cursor-default">
                  <div className="w-10 h-10 rounded-xl bg-[#F7DF1E]/10 group-hover/tech:bg-[#F7DF1E]/20 group-hover/tech:scale-110 transition-all duration-200 flex items-center justify-center mb-2.5 shadow-2xs">
                    <SiJavascript className="w-5 h-5 text-[#F7DF1E]" />
                  </div>
                  <span className="text-xs font-semibold text-text-primary block">
                    JavaScript
                  </span>
                </div>

                {/* 4. React */}
                <div className="group/tech p-4 rounded-xl bg-surface-subtle border border-border hover:border-[#61DAFB]/50 hover:bg-[#61DAFB]/5 hover:-translate-y-1 hover:shadow-md hover:shadow-[#61DAFB]/10 transition-all duration-200 flex flex-col items-center justify-center text-center cursor-default">
                  <div className="w-10 h-10 rounded-xl bg-[#61DAFB]/10 group-hover/tech:bg-[#61DAFB]/20 group-hover/tech:scale-110 transition-all duration-200 flex items-center justify-center mb-2.5 shadow-2xs">
                    <SiReact className="w-5 h-5 text-[#61DAFB]" />
                  </div>
                  <span className="text-xs font-semibold text-text-primary block">
                    React
                  </span>
                </div>

                {/* 5. Node.js */}
                <div className="group/tech p-4 rounded-xl bg-surface-subtle border border-border hover:border-[#339933]/50 hover:bg-[#339933]/5 hover:-translate-y-1 hover:shadow-md hover:shadow-[#339933]/10 transition-all duration-200 flex flex-col items-center justify-center text-center cursor-default">
                  <div className="w-10 h-10 rounded-xl bg-[#339933]/10 group-hover/tech:bg-[#339933]/20 group-hover/tech:scale-110 transition-all duration-200 flex items-center justify-center mb-2.5 shadow-2xs">
                    <SiNodedotjs className="w-5 h-5 text-[#339933]" />
                  </div>
                  <span className="text-xs font-semibold text-text-primary block">
                    Node.js
                  </span>
                </div>

                {/* 6. Express.js */}
                <div className="group/tech p-4 rounded-xl bg-surface-subtle border border-border hover:border-primary/50 hover:bg-surface hover:-translate-y-1 hover:shadow-md hover:shadow-primary/10 transition-all duration-200 flex flex-col items-center justify-center text-center cursor-default">
                  <div className="w-10 h-10 rounded-xl bg-surface-muted group-hover/tech:scale-110 transition-all duration-200 flex items-center justify-center mb-2.5 shadow-2xs">
                    <SiExpress className="w-5 h-5 text-text-primary" />
                  </div>
                  <span className="text-xs font-semibold text-text-primary block">
                    Express.js
                  </span>
                </div>

                {/* 7. MongoDB */}
                <div className="group/tech p-4 rounded-xl bg-surface-subtle border border-border hover:border-[#47A248]/50 hover:bg-[#47A248]/5 hover:-translate-y-1 hover:shadow-md hover:shadow-[#47A248]/10 transition-all duration-200 flex flex-col items-center justify-center text-center cursor-default">
                  <div className="w-10 h-10 rounded-xl bg-[#47A248]/10 group-hover/tech:bg-[#47A248]/20 group-hover/tech:scale-110 transition-all duration-200 flex items-center justify-center mb-2.5 shadow-2xs">
                    <SiMongodb className="w-5 h-5 text-[#47A248]" />
                  </div>
                  <span className="text-xs font-semibold text-text-primary block">
                    MongoDB
                  </span>
                </div>

                {/* 8. Git & GitHub */}
                <div className="group/tech p-4 rounded-xl bg-surface-subtle border border-border hover:border-[#F05032]/50 hover:bg-[#F05032]/5 hover:-translate-y-1 hover:shadow-md hover:shadow-[#F05032]/10 transition-all duration-200 flex flex-col items-center justify-center text-center cursor-default">
                  <div className="w-10 h-10 rounded-xl bg-[#F05032]/10 group-hover/tech:bg-[#F05032]/20 group-hover/tech:scale-110 transition-all duration-200 flex items-center justify-center gap-2 mb-2.5 shadow-2xs">
                    <SiGit className="w-4 h-4 text-[#F05032]" />
                    <SiGithub className="w-4 h-4 text-text-primary" />
                  </div>
                  <span className="text-xs font-semibold text-text-primary block">
                    Git & GitHub
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ---------------- MILESTONE BANNER ---------------- */}
          <div className="relative group">
            <div className="absolute -left-[23px] sm:left-[-35.5px] top-6 w-4 h-4 rounded-full bg-primary border-2 border-background shadow-xs group-hover:scale-125 transition-transform duration-300 z-10" />

            <div className="p-8 sm:p-10 rounded-2xl bg-[#151718] border border-[#2d3033] text-center shadow-xl hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300">
              <h3 className="text-lg sm:text-xl font-bold tracking-tight mb-1.5 text-[#f5f5f5]">
                Become a Full-Stack Web Developer.
              </h3>
              <p className="text-xs sm:text-sm text-[#a3a3a3]">
                Ready to build the future.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 3. SUPPORT SYSTEM (GUIDED BY EXPERTS) ================= */}
      <section className="px-4 sm:px-6 lg:px-8 pb-24 max-w-4xl mx-auto">
        <div className="p-7 sm:p-10 rounded-3xl bg-surface border border-border hover:border-primary/50 shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1.5 transition-all duration-300 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Left Column */}
          <div className="md:col-span-7">
            <span className="text-[10px] font-mono tracking-wider text-text-muted uppercase block mb-1 font-semibold">
              SUPPORT SYSTEM
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-text-primary mb-2">
              Guided by Experts.
            </h2>
            <p className="text-xs sm:text-sm text-text-muted leading-relaxed mb-6">
              You are never learning alone. Mentorship is integrated throughout
              every phase of the journey to ensure you never get permanently
              stuck.
            </p>

            <div className="grid grid-cols-2 gap-y-3.5 gap-x-4">
              {supportPoints.map((pt, idx) => (
                <div key={idx} className="group flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-surface-subtle border border-border group-hover:border-primary/40 group-hover:bg-surface flex items-center justify-center shrink-0 transition-colors duration-200">
                    {pt.icon}
                  </div>
                  <span className="text-xs font-medium text-text-primary group-hover:text-primary transition-colors duration-200">
                    {pt.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Interactive Student-Mentor Graphic */}
          <div className="md:col-span-5 flex items-center justify-center">
            <div className="w-full h-56 rounded-2xl bg-surface-subtle/50 border border-border flex items-center justify-center px-6">
              <div className="flex items-center gap-4">
                {/* Student Node */}
                <div className="w-12 h-12 rounded-full bg-surface border border-border shadow-xs flex items-center justify-center text-text-primary hover:scale-105 transition-transform duration-200">
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>

                {/* Connecting Line */}
                <div className="w-10 sm:w-14 h-[2px] bg-primary/40 rounded-full" />

                {/* Mentor Node */}
                <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-md flex items-center justify-center hover:scale-105 transition-transform duration-200">
                  <svg
                    className="w-7 h-7"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="5" r="1.5" />
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 4. REUSABLE FOOTER ================= */}
      <Footer />
    </div>
  );
}
