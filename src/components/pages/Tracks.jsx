import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";

export default function Tracks({
  onNavigatePage,
  onNavigateLogin,
  onNavigateSignUp,
}) {
  const supportPoints = [
    {
      icon: (
        <svg
          className="w-3.5 h-3.5 text-text-muted"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      ),
      text: "Teach concepts",
    },
    {
      icon: (
        <svg
          className="w-3.5 h-3.5 text-text-muted"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
      ),
      text: "Answer questions",
    },
    {
      icon: (
        <svg
          className="w-3.5 h-3.5 text-text-muted"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
          />
        </svg>
      ),
      text: "Review work",
    },
    {
      icon: (
        <svg
          className="w-3.5 h-3.5 text-text-muted"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
      text: "Guide projects",
    },
    {
      icon: (
        <svg
          className="w-3.5 h-3.5 text-text-muted"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
      text: "Help with difficulties",
    },
    {
      icon: (
        <svg
          className="w-3.5 h-3.5 text-text-muted"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      text: "Track progress",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-text-primary transition-colors">
      <Navbar
        currentView="tracks"
        onNavigatePage={onNavigatePage}
        onNavigateLogin={onNavigateLogin}
        onNavigateSignUp={onNavigateSignUp}
      />

      {/* ================= 1. HERO SECTION ================= */}
      <section className="pt-16 pb-14 px-4 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto">
        <div className="inline-block px-3 py-1 rounded-full bg-surface-subtle border border-border-subtle text-text-muted text-[10px] font-mono tracking-widest uppercase mb-6">
          THE LEARNING JOURNEY
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-text-primary leading-[1.2] mb-6">
          Start from the basics. <br />
          Build the skills. <br />
          <span className="text-primary">
            Become a full-stack web developer.
          </span>
        </h1>

        <p className="text-xs sm:text-sm text-text-muted max-w-2xl mx-auto leading-relaxed mb-8">
          A rigorous 12-week online program exclusively for ASTU Muslim
          students. No previous programming experience required. Completely
          free.
        </p>

        {/* 3 Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-text-muted">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface border border-border shadow-xs">
            <span className="text-xs">📅</span>
            <span className="text-text-primary">12 Weeks</span>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface border border-border shadow-xs">
            <span className="text-xs">💻</span>
            <span className="text-text-primary">100% Online</span>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface border border-border shadow-xs">
            <span className="text-xs">🎓</span>
            <span className="text-text-primary">Free Tuition</span>
          </div>
        </div>
      </section>

      {/* ================= 2. TIMELINE ROADMAP ================= */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20 max-w-4xl mx-auto">
        <div className="relative pl-6 sm:pl-10 space-y-10">
          {/* Vertical Timeline Bar */}
          <div className="absolute left-2 sm:left-3.5 top-6 bottom-10 w-[1.5px] bg-border-subtle" />

          {/* ---------------- CARD 1: FOUNDATION ---------------- */}
          <div className="relative">
            {/* Node Dot */}
            <div className="absolute -left-[20px] sm:-left-[32.5px] top-7 w-3.5 h-3.5 rounded-full bg-background border-2 border-border-subtle z-10" />

            <div className="p-6 sm:p-8 rounded-2xl bg-surface border border-border shadow-xs">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-surface-subtle border border-border-subtle flex items-center justify-center text-xs text-text-primary font-bold">
                  📄
                </div>
                <div>
                  <span className="text-[10px] font-mono tracking-wider text-text-muted uppercase block">
                    FOUNDATION
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-text-primary">
                    Python & Problem Solving
                  </h3>
                </div>
              </div>

              <p className="text-xs text-text-muted leading-relaxed mb-6">
                We start from zero. Learn the syntax, control structures, and
                fundamental logic required to tell computers what to do. Focus
                on building strong analytical thinking skills before touching
                advanced frameworks.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-4 text-xs text-text-primary">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span>Basic Python Syntax</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span>DSA Fundamentals</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span>Problem Solving Techniques</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span>Competitive Programming Intro</span>
                </div>
              </div>
            </div>
          </div>

          {/* ---------------- CARD 2: PHASE 1 ---------------- */}
          <div className="relative">
            {/* Node Dot (Red Ring) */}
            <div className="absolute -left-[20px] sm:-left-[32.5px] top-7 w-3.5 h-3.5 rounded-full bg-background border-2 border-primary z-10" />

            <div className="p-6 sm:p-8 rounded-2xl bg-surface border border-border shadow-xs">
              <span className="text-[10px] font-mono tracking-wider text-primary uppercase block mb-1">
                PHASE 1
              </span>
              <h3 className="text-base sm:text-lg font-bold text-text-primary mb-2.5">
                Competitive Programming
              </h3>

              <p className="text-xs text-text-muted leading-relaxed mb-6">
                Shift focus entirely to algorithmic thinking. This phase is
                about discipline, consistency, and tackling complex problems
                under pressure.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
                {/* Note Callout */}
                <div className="p-3.5 rounded-xl bg-surface-subtle border border-border flex items-start gap-2.5 text-[11px] text-text-muted leading-relaxed">
                  <span className="text-text-muted mt-0.5">ⓘ</span>
                  <span>
                    <strong className="text-text-primary">Note:</strong> Focus
                    is on learning and contests, not weekly projects.
                  </span>
                </div>

                {/* Meter Bars */}
                <div className="space-y-3 pt-1">
                  <div>
                    <div className="flex justify-between text-[11px] font-medium text-text-primary mb-1">
                      <span>Contests</span>
                      <span className="text-xs">📍</span>
                    </div>
                    <div className="w-full bg-border-subtle rounded-full h-1.5">
                      <div className="bg-primary h-1.5 rounded-full w-[45%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-medium text-text-primary mb-1">
                      <span>Discipline</span>
                      <span className="text-xs">📈</span>
                    </div>
                    <div className="w-full bg-border-subtle rounded-full h-1.5">
                      <div className="bg-primary h-1.5 rounded-full w-[65%]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ---------------- CARD 3: PHASE 2 ---------------- */}
          <div className="relative">
            {/* Node Dot (Double Ring) */}
            <div className="absolute -left-[20px] sm:-left-[32.5px] top-7 w-3.5 h-3.5 rounded-full bg-background border-2 border-primary ring-2 ring-primary/20 z-10" />

            <div className="p-6 sm:p-8 rounded-2xl bg-surface border border-border shadow-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono tracking-wider text-primary uppercase block">
                  PHASE 2
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary text-primary text-[10px] font-medium border border-border-subtle">
                  ✨ Weekly Projects Included
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-text-primary mb-2.5">
                Development
              </h3>

              <p className="text-xs text-text-muted leading-relaxed mb-6">
                Transition from terminal to browser. Build actual, scalable web
                applications using industry-standard tools and frameworks. Apply
                the logic learned in Phase 1 to real-world software
                architecture.
              </p>

              {/* Tech Stack Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* HTML & CSS */}
                <div className="p-3 rounded-xl bg-surface-subtle border border-border text-center">
                  <div className="w-8 h-8 mx-auto rounded-lg bg-orange-500/10 text-orange-600 font-bold text-xs flex items-center justify-center mb-1.5">
                    H5
                  </div>
                  <span className="text-[11px] font-medium text-text-primary block">
                    HTML & CSS
                  </span>
                </div>

                {/* JavaScript */}
                <div className="p-3 rounded-xl bg-surface-subtle border border-border text-center">
                  <div className="w-8 h-8 mx-auto rounded-lg bg-yellow-500/10 text-yellow-600 font-bold text-xs flex items-center justify-center mb-1.5">
                    JS
                  </div>
                  <span className="text-[11px] font-medium text-text-primary block">
                    JavaScript
                  </span>
                </div>

                {/* React */}
                <div className="p-3 rounded-xl bg-surface-subtle border border-border text-center">
                  <div className="w-8 h-8 mx-auto rounded-lg bg-sky-500/10 text-sky-500 font-bold text-xs flex items-center justify-center mb-1.5">
                    Re
                  </div>
                  <span className="text-[11px] font-medium text-text-primary block">
                    React
                  </span>
                </div>

                {/* Node.js */}
                <div className="p-3 rounded-xl bg-surface-subtle border border-border text-center">
                  <div className="w-8 h-8 mx-auto rounded-lg bg-emerald-500/10 text-emerald-600 font-bold text-xs flex items-center justify-center mb-1.5">
                    No
                  </div>
                  <span className="text-[11px] font-medium text-text-primary block">
                    Node.js
                  </span>
                </div>

                {/* Express.js */}
                <div className="p-3 rounded-xl bg-surface-subtle border border-border text-center">
                  <div className="w-8 h-8 mx-auto rounded-lg bg-surface-muted text-text-primary font-bold text-xs flex items-center justify-center mb-1.5">
                    Ex
                  </div>
                  <span className="text-[11px] font-medium text-text-primary block">
                    Express.js
                  </span>
                </div>

                {/* MongoDB */}
                <div className="p-3 rounded-xl bg-surface-subtle border border-border text-center">
                  <div className="w-8 h-8 mx-auto rounded-lg bg-green-500/10 text-green-600 font-bold text-xs flex items-center justify-center mb-1.5">
                    Mo
                  </div>
                  <span className="text-[11px] font-medium text-text-primary block">
                    MongoDB
                  </span>
                </div>

                {/* Git / GitHub */}
                <div className="p-3 rounded-xl bg-surface-subtle border border-border text-center col-span-2">
                  <div className="w-8 h-8 mx-auto rounded-lg bg-secondary text-primary font-bold text-xs flex items-center justify-center mb-1.5">
                    Git
                  </div>
                  <span className="text-[11px] font-medium text-text-primary block">
                    Git / GitHub Workflow
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ---------------- MILESTONE BANNER ---------------- */}
          <div className="relative">
            {/* Solid Red Node Dot */}
            <div className="absolute -left-[20px] sm:-left-[32.5px] top-6 w-3.5 h-3.5 rounded-full bg-primary border-2 border-background shadow-xs z-10" />

            <div className="p-7 sm:p-9 rounded-2xl bg-surface-muted text-text-primary border border-border text-center shadow-md transition-colors">
              <h3 className="text-lg sm:text-xl font-bold tracking-tight mb-1">
                Become a Full-Stack Web Developer.
              </h3>
              <p className="text-xs text-text-muted">
                Ready to build the future.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 3. SUPPORT SYSTEM (GUIDED BY EXPERTS) ================= */}
      <section className="px-4 sm:px-6 lg:px-8 pb-24 max-w-4xl mx-auto">
        <div className="p-7 sm:p-10 rounded-2xl bg-surface border border-border shadow-xs grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Left Column: Information & Points */}
          <div className="md:col-span-7">
            <span className="text-[10px] font-mono tracking-wider text-text-muted uppercase block mb-1">
              SUPPORT SYSTEM
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-text-primary mb-2">
              Guided by Experts.
            </h2>
            <p className="text-xs text-text-muted leading-relaxed mb-6">
              You are never learning alone. Mentorship is integrated throughout
              every phase of the journey to ensure you never get permanently
              stuck.
            </p>

            <div className="grid grid-cols-2 gap-y-3 gap-x-4">
              {supportPoints.map((pt, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-surface-subtle border border-border-subtle flex items-center justify-center shrink-0">
                    {pt.icon}
                  </div>
                  <span className="text-[11px] text-text-primary">
                    {pt.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Connection Graphic Card */}
          <div className="md:col-span-5 flex items-center justify-center">
            <div className="w-full h-48 rounded-xl bg-surface-subtle border border-border flex items-center justify-center px-6">
              <div className="flex items-center gap-3">
                {/* Student Node */}
                <div className="w-10 h-10 rounded-full bg-surface border border-border shadow-xs flex items-center justify-center text-text-primary">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>

                {/* Connecting Line */}
                <div className="w-10 sm:w-12 h-[2px] bg-primary/30" />

                {/* Mentor Node */}
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-md flex items-center justify-center">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.8"
                      d="M12 14l9-5-9-5-9 5 9 5z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.8"
                      d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.8"
                      d="M12 14v7"
                    />
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
