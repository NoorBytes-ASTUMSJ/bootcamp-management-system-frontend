import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";
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
          className="w-4 h-4 text-[#B93325]"
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
      desc: "To empower ASTU Muslim students with highly practical, industry-grade technical skills, bridging the gap between academic theory and real-world software engineering demands.",
    },
    {
      icon: (
        <svg
          className="w-4 h-4 text-[#B93325]"
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
      desc: "A dedicated collective of outstanding senior ASTU students and recent graduates possessing proven technical expertise and a passion for peer-driven education.",
    },
    {
      icon: (
        <svg
          className="w-4 h-4 text-[#B93325]"
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
      desc: "Designed exclusively for Muslim students at Adama Science and Technology University seeking a focused, rigorous environment to accelerate their technical growth.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-brand-dark-bg text-gray-900 dark:text-brand-dark-text transition-colors">
      <Navbar
        currentView="about"
        onNavigatePage={onNavigatePage}
        onNavigateLogin={onNavigateLogin}
        onNavigateSignUp={onNavigateSignUp}
      />

      {/* ================= 1. HERO SECTION ================= */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 dark:bg-brand-dark-surface border border-red-100 dark:border-brand-dark-border text-[11px] font-mono font-medium text-[#B93325] tracking-wider uppercase mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-[#B93325]" />
          SUMMER BOOTCAMP
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-gray-900 dark:text-white leading-[1.15] mb-6">
          Engineering Excellence. <br />
          <span className="text-[#B93325]">Serving the Ummah.</span>
        </h1>

        <p className="text-xs sm:text-sm text-gray-600 dark:text-brand-dark-muted max-w-xl mx-auto leading-relaxed">
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
              className="p-7 rounded-2xl bg-white dark:bg-brand-dark-surface border border-gray-100 dark:border-brand-dark-border shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col justify-start"
            >
              <div className="w-9 h-9 rounded-xl bg-[#FBF1F0] dark:bg-brand-dark-bg border border-red-100/60 dark:border-brand-dark-border flex items-center justify-center mb-6">
                {item.icon}
              </div>

              <h3 className="font-bold text-base text-gray-900 dark:text-white pb-3 border-b border-gray-100 dark:border-brand-dark-border mb-3.5">
                {item.title}
              </h3>

              <p className="text-xs text-gray-500 dark:text-brand-dark-muted leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= 3. OUR APPROACH ================= */}
      <section className="px-4 sm:px-6 lg:px-8 pb-28 max-w-5xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">
            Our Approach
          </h2>

          <p className="text-xs text-gray-500 dark:text-brand-dark-muted">
            A systematic philosophy for building competent engineers.
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* 1. Build Real Projects */}
            <div className="md:col-span-6 p-7 rounded-2xl bg-white dark:bg-brand-dark-surface border border-gray-100 dark:border-brand-dark-border shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between">
              <div>
                <div className="w-7 h-6 rounded bg-[#B93325] text-white flex items-center justify-center mb-5 shadow-2xs">
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
                    />
                  </svg>
                </div>

                <h3 className="font-bold text-base text-gray-900 dark:text-white mb-2.5">
                  Build Real Projects
                </h3>

                <p className="text-xs text-gray-500 dark:text-brand-dark-muted leading-relaxed">
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
              <div className="p-5 rounded-2xl bg-white dark:bg-brand-dark-surface border border-gray-100 dark:border-brand-dark-border shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[#B93325]">
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

                  <h4 className="font-bold text-xs text-gray-900 dark:text-white">
                    Start from Basics
                  </h4>
                </div>

                <p className="text-[11px] text-gray-500 dark:text-brand-dark-muted leading-relaxed">
                  Solidifying fundamental concepts before scaling complexity.
                </p>
              </div>

              {/* 3. Learn Consistently */}
              <div className="p-5 rounded-2xl bg-white dark:bg-brand-dark-surface border border-gray-100 dark:border-brand-dark-border shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[#B93325]">
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

                  <h4 className="font-bold text-xs text-gray-900 dark:text-white">
                    Learn Consistently
                  </h4>
                </div>

                <p className="text-[11px] text-gray-500 dark:text-brand-dark-muted leading-relaxed">
                  Daily compounding knowledge over sporadic bursts.
                </p>
              </div>

              {/* 4. Solve Problems */}
              <div className="p-5 rounded-2xl bg-white dark:bg-brand-dark-surface border border-gray-100 dark:border-brand-dark-border shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[#B93325]">
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

                  <h4 className="font-bold text-xs text-gray-900 dark:text-white">
                    Solve Problems
                  </h4>
                </div>

                <p className="text-[11px] text-gray-500 dark:text-brand-dark-muted leading-relaxed">
                  Cultivating analytical thinking and algorithmic
                  troubleshooting.
                </p>
              </div>

              {/* 5. Practice Daily */}
              <div className="p-5 rounded-2xl bg-white dark:bg-brand-dark-surface border border-gray-100 dark:border-brand-dark-border shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[#B93325]">
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

                  <h4 className="font-bold text-xs text-gray-900 dark:text-white">
                    Practice Daily
                  </h4>
                </div>

                <p className="text-[11px] text-gray-500 dark:text-brand-dark-muted leading-relaxed">
                  Repetition builds muscle memory in code syntax.
                </p>
              </div>
            </div>
          </div>

          {/* 6. Mentorship & Discipline */}
          <div className="p-6 rounded-2xl bg-white dark:bg-brand-dark-surface border border-gray-100 dark:border-brand-dark-border shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex items-center gap-5">
            <div className="w-11 h-11 rounded-full bg-[#FBEBEA] dark:bg-brand-dark-bg text-[#B93325] flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
              </svg>
            </div>

            <div>
              <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-1">
                Mentorship & Discipline
              </h3>

              <p className="text-xs text-gray-500 dark:text-brand-dark-muted leading-relaxed max-w-xl">
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
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-1.5 tracking-tight">
            Our Journey
          </h2>

          <p className="text-xs text-gray-500 dark:text-brand-dark-muted">
            A history of continuous growth and commitment.
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative pl-6 sm:pl-8 space-y-6">
          {/* ================= NODE 1 ================= */}
          <div
            className="
              relative
              after:absolute
              after:left-[-17.75px]
              sm:after:left-[-19.75px]
              after:top-[30px]
              after:h-[calc(100%+30px)]
              after:w-[1.5px]
              after:bg-gray-200
              dark:after:bg-brand-dark-border
              after:z-0
            "
          >
            {/* Dot */}
            <div
              className="
                absolute
                -left-[23px]
                sm:-left-[25px]
                top-6
                w-3
                h-3
                rounded-full
                border-2
                border-gray-300
                dark:border-gray-600
                bg-white
                dark:bg-brand-dark-bg
                z-10
              "
            />

            {/* Card */}
            <div className="w-full md:w-[75%] p-6 rounded-2xl bg-white dark:bg-brand-dark-surface border border-gray-100 dark:border-brand-dark-border shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
              <span className="inline-block text-[10px] font-mono text-gray-400 dark:text-brand-dark-muted uppercase tracking-wider mb-1">
                Year 1
              </span>

              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1.5">
                The Foundation
              </h3>

              <p className="text-xs text-gray-500 dark:text-brand-dark-muted leading-relaxed">
                Establishing the core curriculum and testing the mentorship
                model with our first cohort of dedicated students.
              </p>
            </div>
          </div>

          {/* ================= NODE 2 ================= */}
          <div
            className="
              relative
              after:absolute
              after:left-[-17.75px]
              sm:after:left-[-19.75px]
              after:top-[30px]
              after:h-[calc(100%+30px)]
              after:w-[1.5px]
              after:bg-gray-200
              dark:after:bg-brand-dark-border
              after:z-0
            "
          >
            {/* Dot */}
            <div
              className="
                absolute
                -left-[23px]
                sm:-left-[25px]
                top-6
                w-3
                h-3
                rounded-full
                border-2
                border-gray-300
                dark:border-gray-600
                bg-white
                dark:bg-brand-dark-bg
                z-10
              "
            />

            {/* Card */}
            <div className="w-full md:w-[80%] md:ml-[18%] p-6 rounded-2xl bg-white dark:bg-brand-dark-surface border border-gray-100 dark:border-brand-dark-border shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
              <span className="inline-block text-[10px] font-mono text-gray-400 dark:text-brand-dark-muted uppercase tracking-wider mb-1">
                Year 2
              </span>

              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1.5">
                Scaling Impact (100+ Participants)
              </h3>

              <p className="text-xs text-gray-500 dark:text-brand-dark-muted leading-relaxed">
                Refining the program and expanding reach. Over 100 participants
                completed rigorous tracks in frontend, backend, and competitive
                programming.
              </p>
            </div>
          </div>

          {/* ================= NODE 3 ================= */}
          <div className="relative">
            {/* Final Red Dot */}
            <div
              className="
                absolute
                -left-[23px]
                sm:-left-[25px]
                top-6
                w-3
                h-3
                rounded-full
                bg-[#B93325]
                border-2
                border-white
                dark:border-brand-dark-bg
                shadow-xs
                z-10
              "
            />

            {/* Card */}
            <div className="w-full md:w-[75%] p-6 rounded-2xl bg-white dark:bg-brand-dark-surface border border-red-100 dark:border-red-950/40 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
              <span className="inline-block text-[10px] font-mono text-[#B93325] font-semibold uppercase tracking-wider mb-1">
                Upcoming
              </span>

              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1.5">
                The 3rd Batch
              </h3>

              <p className="text-xs text-gray-500 dark:text-brand-dark-muted leading-relaxed">
                Our most comprehensive curriculum yet, featuring specialized
                tracks for Frontend development, Backend engineering, and
                high-level Competitive Programming.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 5. BEYOND SYNTAX ================= */}
      <section className="bg-[#242628] dark:bg-[#121212] text-white py-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="flex items-center justify-center mb-3">
            <MdLightbulb className="w-8 h-8 text-[#FCA59C]" />
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Beyond Syntax
          </h2>

          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed max-w-xl mx-auto pt-2">
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
