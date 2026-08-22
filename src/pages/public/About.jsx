import React from "react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import {
  Target,
  Users,
  GraduationCap,
  SquareTerminal,
  House,
  RotateCw,
  Flame,
  Lightbulb,
} from "lucide-react";

export default function About({
  onNavigatePage,
  onNavigateLogin,
  onNavigateSignUp,
}) {
  const coreCards = [
    {
      icon: <Target size={16} className="text-primary" />,
      title: "Our Purpose",
      desc: "To empower ASTU Muslim students with highly practical, industry-grade technical skills, bridging the gap between academic theory and real-world software engineering demands.",
    },
    {
      icon: <Users size={16} className="text-primary" />,
      title: "Who We Are",
      desc: "A dedicated collective of outstanding senior ASTU students and recent graduates possessing proven technical expertise and a passion for peer-driven education.",
    },
    {
      icon: <GraduationCap size={16} className="text-primary" />,
      title: "Who We Serve",
      desc: "Designed exclusively for Muslim students at Adama Science and Technology University seeking a focused, rigorous environment to accelerate their technical growth.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      <Navbar
        currentView="about"
        onNavigatePage={onNavigatePage}
        onNavigateLogin={onNavigateLogin}
        onNavigateSignUp={onNavigateSignUp}
      />

      {/* ================= 1. HERO SECTION ================= */}
      <section className="pt-16 pb-16 px-4 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary border border-border text-[11px] font-medium text-primary tracking-wider uppercase mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          SUMMER BOOTCAMP
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-foreground leading-[1.12] mb-6">
          Engineering Excellence. <br />
          <span className="text-primary">Serving the Ummah.</span>
        </h1>

        <p className="text-xs sm:text-sm text-muted max-w-xl mx-auto leading-relaxed">
          Forging full-stack developers through rigorous discipline, relentless
          practice, expert mentorship, and a deep-rooted commitment to community
          service.
        </p>
      </section>

      {/* ================= 2. 3 CORE CARDS ================= */}
      <section className="px-4 sm:px-6 lg:px-8 pb-24 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {coreCards.map((item, idx) => (
            <div
              key={idx}
              className="p-7 rounded-2xl bg-surface border border-border shadow-2xs flex flex-col justify-start space-y-4 hover:border-primary/40 transition-all duration-300"
            >
              <div className="w-9 h-9 rounded-xl bg-secondary border border-border flex items-center justify-center">
                {item.icon}
              </div>

              <h3 className="font-bold text-base text-foreground">
                {item.title}
              </h3>

              <p className="text-xs text-muted leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= 3. OUR APPROACH ================= */}
      <section className="px-4 sm:px-6 lg:px-8 pb-28 max-w-6xl mx-auto">
        <div className="mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-1 tracking-tight">
            Our Approach
          </h2>

          <p className="text-xs text-muted">
            A systematic philosophy for building competent engineers.
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Big Card: Build Real Projects */}
            <div className="md:col-span-6 p-7 rounded-2xl bg-surface border border-border shadow-2xs flex flex-col justify-between hover:border-primary/40 transition-all duration-300">
              <div>
                <div className="w-8 h-8 rounded-lg bg-secondary border border-border text-primary flex items-center justify-center mb-5">
                  <SquareTerminal size={17} />
                </div>

                <h3 className="font-bold text-base text-foreground mb-2.5">
                  Build Real Projects
                </h3>

                <p className="text-xs text-muted leading-relaxed">
                  Theory is meaningless without application. We mandate
                  project-based learning, requiring students to architect,
                  develop, and deploy functional applications from scratch,
                  simulating real-world engineering constraints.
                </p>
              </div>
            </div>

            {/* 4 Smaller Grid Cards */}
            <div className="md:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-surface border border-border shadow-2xs flex flex-col justify-between hover:border-primary/40 transition-all duration-300">
                <div className="flex items-center gap-2 mb-2">
                  <House size={15} className="text-primary" />
                  <h4 className="font-bold text-xs text-foreground">
                    Start from Basics
                  </h4>
                </div>

                <p className="text-[11px] text-muted leading-relaxed">
                  Solidifying fundamental concepts before scaling complexity.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-surface border border-border shadow-2xs flex flex-col justify-between hover:border-primary/40 transition-all duration-300">
                <div className="flex items-center gap-2 mb-2">
                  <RotateCw size={15} className="text-primary" />
                  <h4 className="font-bold text-xs text-foreground">
                    Learn Consistently
                  </h4>
                </div>

                <p className="text-[11px] text-muted leading-relaxed">
                  Daily compounding knowledge over sporadic bursts.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-surface border border-border shadow-2xs flex flex-col justify-between hover:border-primary/40 transition-all duration-300">
                <div className="flex items-center gap-2 mb-2">
                  <Target size={15} className="text-primary" />
                  <h4 className="font-bold text-xs text-foreground">
                    Solve Problems
                  </h4>
                </div>

                <p className="text-[11px] text-muted leading-relaxed">
                  Cultivating analytical thinking and algorithmic
                  troubleshooting.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-surface border border-border shadow-2xs flex flex-col justify-between hover:border-primary/40 transition-all duration-300">
                <div className="flex items-center gap-2 mb-2">
                  <Flame size={15} className="text-primary" />
                  <h4 className="font-bold text-xs text-foreground">
                    Practice Daily
                  </h4>
                </div>

                <p className="text-[11px] text-muted leading-relaxed">
                  Repetition builds muscle memory in code syntax.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Wide Card: Mentorship & Discipline */}
          <div className="p-6 rounded-2xl bg-surface border border-border shadow-2xs flex items-center gap-5 hover:border-primary/40 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-secondary text-primary border border-border flex items-center justify-center shrink-0">
              <Users size={20} />
            </div>

            <div>
              <h3 className="font-bold text-sm text-foreground mb-1">
                Mentorship & Discipline
              </h3>

              <p className="text-xs text-muted leading-relaxed max-w-xl">
                Guidance from experienced peers fosters rigorous discipline,
                while the ultimate goal remains leveraging tech to help others.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 4. OUR JOURNEY (TIMELINE) ================= */}
      <section className="px-4 sm:px-6 lg:px-8 pb-28 max-w-6xl mx-auto">
        <div className="mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-1 tracking-tight">
            Our Journey
          </h2>

          <p className="text-xs text-muted">
            A history of continuous growth and commitment.
          </p>
        </div>

        {/* Timeline List */}
        <div className="relative pl-7 sm:pl-9 space-y-6">
          {/* ================= ITEM 1 ================= */}
          <div className="relative">
            {/* Line: Dot 1 to Dot 2 */}
            <div className="absolute -left-[22px] sm:-left-[30px] top-[30px] h-[calc(100%+24px)] w-[1.5px] bg-border z-0" />

            {/* Year 1 Dot */}
            <div className="absolute -left-[28px] sm:-left-[36px] top-6 w-3.5 h-3.5 rounded-full border-2 border-border bg-background z-10" />

            <div className="w-full md:w-[65%] p-6 rounded-2xl bg-surface border border-border shadow-2xs hover:border-primary/40 transition-all duration-300">
              <span className="inline-block text-[10px] font-mono text-muted uppercase tracking-wider mb-1">
                Year 1
              </span>

              <h3 className="text-sm sm:text-base font-bold text-foreground mb-1.5">
                The Foundation
              </h3>

              <p className="text-xs text-muted leading-relaxed">
                Establishing the core curriculum and testing the mentorship
                model with our first cohort of dedicated students.
              </p>
            </div>
          </div>

          {/* ================= ITEM 2 ================= */}
          <div className="relative">
            {/* Line: Dot 2 to Dot 3 */}
            <div className="absolute -left-[22px] sm:-left-[30px] top-[30px] h-[calc(100%+24px)] w-[1.5px] bg-border z-0" />

            {/* Year 2 Dot */}
            <div className="absolute -left-[28px] sm:-left-[36px] top-6 w-3.5 h-3.5 rounded-full border-2 border-border bg-background z-10" />

            <div className="w-full md:w-[65%] md:ml-[35%] p-6 rounded-2xl bg-surface border border-border shadow-2xs hover:border-primary/40 transition-all duration-300">
              <span className="inline-block text-[10px] font-mono text-muted uppercase tracking-wider mb-1">
                Year 2
              </span>

              <h3 className="text-sm sm:text-base font-bold text-foreground mb-1.5">
                Scaling Impact (100+ Participants)
              </h3>

              <p className="text-xs text-muted leading-relaxed">
                Refining the program and expanding reach. Over 100 participants
                completed rigorous tracks in frontend, backend, and competitive
                programming.
              </p>
            </div>
          </div>

          {/* ================= ITEM 3 (Endpoint - No trailing line) ================= */}
          <div className="relative">
            {/* Year 3 / Upcoming Dot */}
            <div className="absolute -left-[28px] sm:-left-[36px] top-6 w-3.5 h-3.5 rounded-full bg-primary border-2 border-background ring-2 ring-primary/20 z-10" />

            <div className="w-full md:w-[65%] p-6 rounded-2xl bg-surface border border-border shadow-2xs hover:border-primary/40 transition-all duration-300">
              <span className="inline-block text-[10px] font-mono text-primary font-semibold uppercase tracking-wider mb-1">
                Upcoming
              </span>

              <h3 className="text-sm sm:text-base font-bold text-foreground mb-1.5">
                The 3rd Batch
              </h3>

              <p className="text-xs text-muted leading-relaxed">
                Our most comprehensive curriculum yet, featuring specialized
                tracks for Frontend development, Backend engineering, and
                high-level Competitive Programming.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 5. BEYOND SYNTAX (DARK CALLOUT SECTION) ================= */}
      <section className="bg-[#1e2329] text-white py-24 px-4 sm:px-6 lg:px-8 text-center transition-colors">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="mx-auto flex items-center justify-center">
            <Lightbulb size={48} className="text-[#FFB5A7] fill-current" />
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Beyond Syntax
          </h2>

          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-xl mx-auto pt-1">
            Our ultimate goal transcends mere coding proficiency. We strive to
            mold capable, ethical developers who view their technical skills as
            a tool to benefit the Ummah and solve meaningful societal problems.
          </p>
        </div>
      </section>

      {/* ================= 6. FOOTER ================= */}
      <Footer onNavigatePage={onNavigatePage} />
    </div>
  );
}
