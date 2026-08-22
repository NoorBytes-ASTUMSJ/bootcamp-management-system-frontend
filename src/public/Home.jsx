import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

export default function Home({
  onNavigatePage,
  onNavigateLogin,
  onNavigateSignUp,
}) {
  const stats = [
    { label: "100+", sub: "Participants (Last 2 Years)" },
    { label: "3rd", sub: "Batch Coming Next" },
    { label: "12 Weeks", sub: "Structured Duration" },
    { label: "100%", sub: "Free" },
  ];

  const features = [
    {
      icon: (
        <svg
          className="w-5 h-5 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      ),
      title: "Structured Learning",
      desc: "Clear weekly modules starting from absolute basics up to advanced full-stack concepts.",
    },
    {
      icon: (
        <svg
          className="w-5 h-5 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
          />
        </svg>
      ),
      title: "Competitive Programming",
      desc: "Sharpen logic and problem-solving skills through regular contests and foundational DSA.",
    },
    {
      icon: (
        <svg
          className="w-5 h-5 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"
          />
        </svg>
      ),
      title: "Weekly Projects",
      desc: "Build practical, tangible projects every week based on the exact lessons covered.",
    },
    {
      icon: (
        <svg
          className="w-5 h-5 text-primary"
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
      title: "Full-time Mentorship",
      desc: "Guidance from ~20 current experienced ASTU student mentors and alumni.",
    },
    {
      icon: (
        <svg
          className="w-5 h-5 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
      ),
      title: "Progress Tracking",
      desc: "Rigorous assignment feedback loops to ensure no student is left behind.",
    },
    {
      icon: (
        <svg
          className="w-5 h-5 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
      title: "Certification",
      desc: "Receive a certificate upon successful completion of the rigorous 12-week program.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-text-primary transition-colors">
      <Navbar
        currentView="home"
        onNavigatePage={onNavigatePage}
        onNavigateLogin={onNavigateLogin}
        onNavigateSignUp={onNavigateSignUp}
      />

      {/* ================= 1. HERO SECTION ================= */}
      <section
        id="home"
        className="pt-16 pb-20 px-4 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto"
      >
        {/* Tag Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary border border-border-subtle text-[11px] font-medium text-primary mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          for ASTU Muslim Students
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-text-primary leading-[1.15] mb-6">
          Discipline. Practice. <br />
          <span className="text-primary">Full-Stack Mentorship.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
          A structured, beginner-friendly journey into web development. No
          previous programming experience required. Replace scattered learning
          with a clear path.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={onNavigateSignUp}
            className="px-6 py-3 rounded-lg bg-primary text-primary-foreground text-xs sm:text-sm font-semibold hover:bg-primary-hover transition-colors shadow-sm cursor-pointer"
          >
            Sign Up for Batch 3
          </button>
          <button
            type="button"
            onClick={() => onNavigatePage && onNavigatePage("tracks")}
            className="px-6 py-3 rounded-lg bg-surface hover:bg-surface-subtle text-text-primary text-xs sm:text-sm font-semibold transition-colors border border-border cursor-pointer shadow-xs"
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
                    idx === 3 ? "text-primary" : "text-text-primary"
                  }`}
                >
                  {stat.label}
                </div>
                <div className="text-[11px] text-text-muted">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 3. FEATURES SECTION ================= */}
      <section
        id="about"
        className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto"
      >
        <div className="mb-14">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary mb-3">
            A Structured Journey
          </h2>
          <p className="text-xs sm:text-sm text-text-muted max-w-3xl leading-relaxed">
            We believe in learning through doing. This bootcamp replaces the
            endless cycle of scattered tutorials with a rigid, structured
            journey. You will learn concepts, practice them immediately, compete
            with peers, build tangible projects, and receive continuous
            full-time mentorship.
          </p>
        </div>

        {/* 6 Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
          {features.map((item, idx) => (
            <div key={idx} className="space-y-2.5">
              <div className="w-9 h-9 rounded-lg bg-secondary border border-border-subtle flex items-center justify-center">
                {item.icon}
              </div>
              <h3 className="text-sm sm:text-base font-bold text-text-primary">
                {item.title}
              </h3>
              <p className="text-xs text-text-muted leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= 4. REUSABLE FOOTER ================= */}
      <Footer />
    </div>
  );
}
