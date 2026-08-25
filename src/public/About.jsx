import React from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { MdLightbulb } from "react-icons/md";

export default function About({
  onNavigatePage,
  onNavigateLogin,
  onNavigateSignUp,
}) {
  const coreCards = [
    {
      icon: (
        <svg
          className="w-4 h-4 text-primary group-hover:scale-110 transition-transform duration-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="10" strokeWidth="2" />
          <circle cx="12" cy="12" r="6" strokeWidth="2" />
          <circle cx="12" cy="12" r="2" fill="currentColor" />
        </svg>
      ),
      title: "Our Purpose",
      desc: "To empower Muslim students with practical, industry-grade technical skills, bridging the gap between academic theory and real-world software engineering demands.",
    },
    {
      icon: (
        <svg
          className="w-4 h-4 text-primary group-hover:scale-110 transition-transform duration-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      title: "Who We Are",
      desc: "A dedicated collective of outstanding senior students and recent graduates possessing proven technical expertise and a passion for peer-driven education.",
    },
    {
      icon: (
        <svg
          className="w-4 h-4 text-primary group-hover:scale-110 transition-transform duration-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 14l9-5-9-5-9 5 9 5z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 14v7"
          />
        </svg>
      ),
      title: "Who We Serve",
      desc: "Designed for Muslim students across universities seeking a focused, rigorous environment to accelerate their technical growth.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-text-primary transition-colors flex flex-col font-sans selection:bg-primary/20 selection:text-primary">
      <Navbar
        currentView="about"
        onNavigatePage={onNavigatePage}
        onNavigateLogin={onNavigateLogin}
        onNavigateSignUp={onNavigateSignUp}
      />

      {/* ================= 1. HERO SECTION ================= */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-secondary border border-border-subtle text-[11px] font-mono font-medium text-primary tracking-wider uppercase mb-8 shadow-2xs hover:border-primary/40 transition-colors">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          SUMMER BOOTCAMP
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-text-primary leading-[1.15] mb-6">
          Engineering Excellence. <br />
          <span className="text-primary bg-gradient-to-r from-primary to-primary/80 bg-clip-text">
            Serving the Ummah.
          </span>
        </h1>

        <p className="text-xs sm:text-sm text-text-muted max-w-xl mx-auto leading-relaxed">
          Forging full-stack developers through rigorous discipline, relentless
          practice, expert mentorship, and a deep-rooted commitment to community
          service.
        </p>
      </section>

      {/* ================= 2. 3 CORE CARDS ================= */}
      <section className="px-4 sm:px-6 lg:px-8 pb-24 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {coreCards.map((item, idx) => (
            <div
              key={idx}
              className="group p-7 sm:p-8 rounded-3xl bg-surface border border-border hover:border-primary/50 shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-start cursor-default"
            >
              <div className="w-10 h-10 rounded-2xl bg-secondary border border-border-subtle group-hover:border-primary/40 flex items-center justify-center mb-6 transition-colors duration-300 shadow-2xs">
                {item.icon}
              </div>

              <h3 className="font-bold text-base sm:text-lg text-text-primary group-hover:text-primary transition-colors duration-200 pb-3 border-b border-border group-hover:border-primary/20 mb-3.5">
                {item.title}
              </h3>

              <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= 3. OUR APPROACH ================= */}
      <section className="px-4 sm:px-6 lg:px-8 pb-28 max-w-5xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary mb-2 tracking-tight">
            Our Approach
          </h2>

          <p className="text-xs sm:text-sm text-text-muted">
            A systematic philosophy for building competent engineers.
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* 1. Build Real Projects */}
            <div className="group md:col-span-6 p-7 sm:p-8 rounded-3xl bg-surface border border-border hover:border-primary/50 shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between cursor-default">
              <div>
                <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center mb-5 shadow-2xs group-hover:scale-105 transition-transform duration-200">
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      d="M4 6.5l3.5 3.5L4 13.5"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M10.5 13.5h5.5"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <h3 className="font-bold text-base sm:text-lg text-text-primary group-hover:text-primary transition-colors duration-200 mb-2.5">
                  Build Real Projects
                </h3>

                <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                  Theory is meaningless without application. We mandate
                  project-based learning, requiring students to architect,
                  develop, and deploy functional applications from scratch,
                  simulating real-world engineering constraints.
                </p>
              </div>
            </div>

            {/* 4 Small Sub-cards */}
            <div className="md:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 2. Start from Basics */}
              <div className="group/sub p-5 sm:p-6 rounded-2xl bg-surface border border-border hover:border-primary/50 shadow-sm hover:shadow-md hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 cursor-default">
                <div className="flex items-center gap-2.5 mb-2">
                  <span className="text-primary group-hover/sub:scale-110 transition-transform duration-200">
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        d="M3 9l9-6 9 6v2H3V9z"
                        strokeWidth="1.6"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M6 11v7M10 11v7M14 11v7M18 11v7"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                      <path
                        d="M2 18h20v3H2v-3z"
                        strokeWidth="1.6"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>

                  <h4 className="font-bold text-xs sm:text-sm text-text-primary group-hover/sub:text-primary transition-colors duration-200">
                    Start from Basics
                  </h4>
                </div>

                <p className="text-[11px] sm:text-xs text-text-muted leading-relaxed">
                  Solidifying fundamental concepts before scaling complexity.
                </p>
              </div>

              {/* 3. Learn Consistently */}
              <div className="group/sub p-5 sm:p-6 rounded-2xl bg-surface border border-border hover:border-primary/50 shadow-sm hover:shadow-md hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 cursor-default">
                <div className="flex items-center gap-2.5 mb-2">
                  <span className="text-primary group-hover/sub:scale-110 transition-transform duration-200">
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        d="M12 7v5l3 2"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M21 12a9 9 0 1 1-2.636-6.364M21 4v5h-5"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>

                  <h4 className="font-bold text-xs sm:text-sm text-text-primary group-hover/sub:text-primary transition-colors duration-200">
                    Learn Consistently
                  </h4>
                </div>

                <p className="text-[11px] sm:text-xs text-text-muted leading-relaxed">
                  Daily compounding knowledge over sporadic bursts.
                </p>
              </div>

              {/* 4. Solve Problems */}
              <div className="group/sub p-5 sm:p-6 rounded-2xl bg-surface border border-border hover:border-primary/50 shadow-sm hover:shadow-md hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 cursor-default">
                <div className="flex items-center gap-2.5 mb-2">
                  <span className="text-primary group-hover/sub:scale-110 transition-transform duration-200">
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <circle cx="12" cy="10" r="7" strokeWidth="1.6" />
                      <circle cx="12" cy="10" r="2.5" fill="currentColor" />
                      <path
                        d="M12 17v4M8 21h8"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>

                  <h4 className="font-bold text-xs sm:text-sm text-text-primary group-hover/sub:text-primary transition-colors duration-200">
                    Solve Problems
                  </h4>
                </div>

                <p className="text-[11px] sm:text-xs text-text-muted leading-relaxed">
                  Cultivating analytical thinking and algorithmic
                  troubleshooting.
                </p>
              </div>

              {/* 5. Practice Daily */}
              <div className="group/sub p-5 sm:p-6 rounded-2xl bg-surface border border-border hover:border-primary/50 shadow-sm hover:shadow-md hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 cursor-default">
                <div className="flex items-center gap-2.5 mb-2">
                  <span className="text-primary group-hover/sub:scale-110 transition-transform duration-200">
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        d="M5 13a7 7 0 0 1 14 0"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                      <path
                        d="M8 13a4 4 0 0 1 8 0"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                      <circle cx="12" cy="13" r="1.5" fill="currentColor" />
                      <path
                        d="M12 14.5v5.5M9 20h6"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>

                  <h4 className="font-bold text-xs sm:text-sm text-text-primary group-hover/sub:text-primary transition-colors duration-200">
                    Practice Daily
                  </h4>
                </div>

                <p className="text-[11px] sm:text-xs text-text-muted leading-relaxed">
                  Repetition builds muscle memory in code syntax.
                </p>
              </div>
            </div>
          </div>

          {/* 6. Mentorship & Discipline */}
          <div className="group p-6 sm:p-8 rounded-3xl bg-surface border border-border hover:border-primary/50 shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1.5 transition-all duration-300 flex items-center gap-5 cursor-default">
            <div className="w-12 h-12 rounded-2xl bg-secondary text-primary group-hover:border-primary/40 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-all duration-200">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
              </svg>
            </div>

            <div>
              <h3 className="font-bold text-sm sm:text-base text-text-primary group-hover:text-primary transition-colors duration-200 mb-1">
                Mentorship & Discipline
              </h3>

              <p className="text-xs sm:text-sm text-text-muted leading-relaxed max-w-xl">
                Guidance from experienced peers fosters rigorous discipline,
                while the ultimate goal remains leveraging tech to help others.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 4. OUR JOURNEY ================= */}
      <section className="px-4 sm:px-6 lg:px-8 pb-28 max-w-5xl mx-auto">
        <div className="mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary mb-1.5 tracking-tight">
            Our Journey
          </h2>

          <p className="text-xs sm:text-sm text-text-muted">
            A history of continuous growth and commitment.
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative pl-6 sm:pl-8 space-y-8">
          {/* Node 1 */}
          <div
            className="
              group
              relative
              after:absolute
              after:left-[-17.75px]
              sm:after:left-[-19.75px]
              after:top-7.5
              after:h-[calc(100%+35px)]
              after:w-[1.5px]
              after:bg-border-subtle
              after:z-0
            "
          >
            <div
              className="
                absolute
                -left-[23px]
                sm:-left-[25px]
                top-6
                w-3.5
                h-3.5
                rounded-full
                border-2
                border-border-subtle
                group-hover:border-primary
                group-hover:scale-125
                transition-all
                duration-300
                bg-background
                z-10
              "
            />

            <div className="w-full md:w-[75%] p-6 sm:p-7 rounded-2xl bg-surface border border-border hover:border-primary/50 shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 cursor-default">
              <span className="inline-block text-[10px] font-mono text-text-muted uppercase tracking-wider mb-1 font-semibold">
                Year 1
              </span>

              <h3 className="text-base font-bold text-text-primary group-hover:text-primary transition-colors duration-200 mb-1.5">
                The Foundation
              </h3>

              <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                Establishing the core curriculum and testing the mentorship
                model with our first cohort of dedicated students.
              </p>
            </div>
          </div>

          {/* Node 2 */}
          <div
            className="
              group
              relative
              after:absolute
              after:left-[-17.75px]
              sm:after:left-[-19.75px]
              after:top-7.5
              after:h-[calc(100%+35px)]
              after:w-[1.5px]
              after:bg-border-subtle
              after:z-0
            "
          >
            <div
              className="
                absolute
                -left-[23px]
                sm:-left-[25px]
                top-6
                w-3.5
                h-3.5
                rounded-full
                border-2
                border-border-subtle
                group-hover:border-primary
                group-hover:scale-125
                transition-all
                duration-300
                bg-background
                z-10
              "
            />

            <div className="w-full md:w-[80%] md:ml-[18%] p-6 sm:p-7 rounded-2xl bg-surface border border-border hover:border-primary/50 shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 cursor-default">
              <span className="inline-block text-[10px] font-mono text-text-muted uppercase tracking-wider mb-1 font-semibold">
                Year 2
              </span>

              <h3 className="text-base font-bold text-text-primary group-hover:text-primary transition-colors duration-200 mb-1.5">
                Scaling Impact (100+ Participants)
              </h3>

              <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                Refining the program and expanding reach. Over 100 participants
                completed rigorous tracks in frontend, backend, and competitive
                programming.
              </p>
            </div>
          </div>

          {/* Node 3 */}
          <div className="group relative">
            <div
              className="
                absolute
                -left-[23px]
                sm:-left-[25px]
                top-6
                w-3.5
                h-3.5
                rounded-full
                bg-primary
                border-2
                border-background
                group-hover:scale-125
                transition-all
                duration-300
                shadow-xs
                z-10
              "
            />

            <div className="w-full md:w-[75%] p-6 sm:p-7 rounded-2xl bg-surface border border-border hover:border-primary/50 shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 cursor-default">
              <span className="inline-block text-[10px] font-mono text-primary font-semibold uppercase tracking-wider mb-1">
                Upcoming
              </span>

              <h3 className="text-base font-bold text-text-primary group-hover:text-primary transition-colors duration-200 mb-1.5">
                The 3rd Batch
              </h3>

              <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                Our most comprehensive curriculum yet, featuring specialized
                tracks for Frontend development, Backend engineering, and
                high-level Competitive Programming.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 5. BEYOND SYNTAX ================= */}
      <section className="bg-[#0B0F17] border-t border-b border-neutral-800 py-24 px-4 sm:px-6 lg:px-8 text-center transition-colors">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="flex items-center justify-center mb-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center shadow-lg shadow-amber-400/5 hover:scale-110 transition-transform duration-300">
              <MdLightbulb className="w-8 h-8 text-amber-400 animate-pulse" />
            </div>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Beyond Syntax
          </h2>

          <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-xl mx-auto pt-2">
            Our ultimate goal transcends mere coding proficiency. We strive to
            mold capable, ethical developers who view their technical skills as
            a tool to benefit the Ummah and solve meaningful societal problems.
          </p>
        </div>
      </section>

      {/* ================= 6. REUSABLE FOOTER ================= */}
      <Footer />
    </div>
  );
}
