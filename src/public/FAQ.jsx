import { useState } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

export default function FAQ({
  onNavigatePage,
  onNavigateLogin,
  onNavigateSignUp,
}) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (id) => {
    setOpenIndex(openIndex === id ? null : id);
  };

  const faqData = [
    {
      category: "The",
      categoryHighlight: "Basics",
      items: [
        {
          id: "basics-1",
          q: "Who can join?",
          a: "The bootcamp is designed exclusively for Muslim students at Adama Science and Technology University (ASTU) who are committed to intensive learning and growth.",
        },
        {
          id: "basics-2",
          q: "Do I need previous programming experience?",
          a: "No prior experience is required for beginner tracks. We start from absolute fundamentals. For advanced tracks (like Competitive Programming), basic familiarity is recommended.",
        },
        {
          id: "basics-3",
          q: "Is it free?",
          a: "Yes, the entire summer bootcamp is 100% free of charge as part of our community service to empower our peers.",
        },
        {
          id: "basics-4",
          q: "Is it online or in person?",
          a: "The program features a hybrid model with both physical lab sessions/mentorship check-ins on campus and online resource sharing.",
        },
        {
          id: "basics-5",
          q: "How long is the bootcamp?",
          a: "The bootcamp runs for the duration of the summer break, structured into intensive multi-week phases.",
        },
        {
          id: "basics-6",
          q: "Start date?",
          a: "Detailed batch schedules and the official start date will be announced via our communication channels prior to launch.",
        },
      ],
    },
    {
      category: "Curriculum &",
      categoryHighlight: "Structure",
      items: [
        {
          id: "curr-1",
          q: "What will I learn?",
          a: "Depending on your selected track, you will learn full-stack web development (React, Node.js, Express, MongoDB) or data structures and algorithms with C++/Python.",
        },
        {
          id: "curr-2",
          q: "What are the two phases?",
          a: "Phase 1 focuses on core fundamentals and intense problem-solving. Phase 2 dives deep into hands-on project building, collaboration, and deployment.",
        },
        {
          id: "curr-3",
          q: "Will there be projects?",
          a: "Yes! Real-world project building is the core pillar of our philosophy. You will build and deploy functional applications to showcase in your portfolio.",
        },
        {
          id: "curr-4",
          q: "Will I have a mentor?",
          a: "Yes. Every student is paired with a high-performing senior mentor who tracks their daily progress, reviews code, and provides personalized guidance.",
        },
      ],
    },
    {
      category: "Process &",
      categoryHighlight: "Outcomes",
      items: [
        {
          id: "proc-1",
          q: "Selection process?",
          a: "Applicants will complete a brief registration form followed by an assessment test to evaluate dedication, problem-solving mindset, and track readiness.",
        },
        {
          id: "proc-2",
          q: "Completion reward?",
          a: "Students who successfully complete all track requirements and final capstone projects will receive verified certificates and opportunities for future mentorship roles.",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background text-text-primary transition-colors selection:bg-primary/20 selection:text-primary">
      <Navbar
        currentView="faq"
        onNavigatePage={onNavigatePage}
        onNavigateLogin={onNavigateLogin}
        onNavigateSignUp={onNavigateSignUp}
      />

      {/* ================= 1. HERO SECTION ================= */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-text-primary leading-[1.15] mb-4">
          Frequently{" "}
          <span className="text-primary bg-gradient-to-r from-primary to-primary/80 bg-clip-text">
            Asked
          </span>{" "}
          <br />
          <span className="text-primary bg-gradient-to-r from-primary to-primary/80 bg-clip-text">
            Questions
          </span>
        </h1>

        <p className="text-sm sm:text-base text-text-muted max-w-md mx-auto leading-relaxed">
          Everything you need to know before starting your journey.
        </p>
      </section>

      {/* ================= 2. FAQ CATEGORIES & ACCORDIONS ================= */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20 max-w-3xl mx-auto space-y-12">
        {faqData.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-4">
            {/* Category Header */}
            <h2 className="text-sm sm:text-base font-bold tracking-tight text-text-primary">
              {group.category}{" "}
              <span className="text-primary">{group.categoryHighlight}</span>
            </h2>

            {/* Accordion Item Cards */}
            <div className="space-y-3.5">
              {group.items.map((item) => {
                const isOpen = openIndex === item.id;
                return (
                  <div
                    key={item.id}
                    className={`bg-surface border rounded-2xl transition-all duration-300 shadow-sm overflow-hidden ${
                      isOpen
                        ? "border-primary/60 shadow-md shadow-primary/5"
                        : "border-border hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleAccordion(item.id)}
                      className="w-full px-6 py-4 sm:py-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-surface-subtle/50 transition-colors"
                    >
                      <span
                        className={`text-sm sm:text-[15px] font-semibold transition-colors duration-200 ${isOpen ? "text-primary" : "text-text-primary"}`}
                      >
                        {item.q}
                      </span>
                      <svg
                        className={`w-4 h-4 shrink-0 transition-transform duration-300 ${
                          isOpen ? "rotate-180 text-primary" : "text-text-muted"
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2.2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {isOpen && (
                      <div className="px-6 pb-5 pt-1 border-t border-border/60 text-xs sm:text-sm text-text-muted leading-relaxed">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </section>

      {/* ================= 3. STILL HAVE QUESTIONS CARD ================= */}
      <section className="px-4 sm:px-6 lg:px-8 pb-24 max-w-xl mx-auto">
        <div className="group bg-surface border border-border hover:border-primary/50 rounded-3xl p-8 sm:p-10 text-center shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1.5 transition-all duration-300 space-y-4">
          <div className="w-10 h-10 rounded-2xl bg-secondary border border-border-subtle text-primary mx-auto flex items-center justify-center text-base font-bold shadow-2xs group-hover:scale-110 transition-transform duration-200">
            ?
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-text-primary group-hover:text-primary transition-colors duration-200">
            Still have questions?
          </h3>

          <p className="text-xs sm:text-sm text-text-muted max-w-xs mx-auto leading-relaxed">
            Can't find the answer you're looking for? Reach out to our team
            directly.
          </p>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => onNavigatePage && onNavigatePage("contact")}
              className="inline-block px-6 py-3 rounded-xl border border-border bg-surface hover:bg-surface-subtle hover:border-primary/50 text-xs sm:text-sm font-semibold text-text-primary shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
            >
              Contact Support
            </button>
          </div>
        </div>
      </section>

      {/* ================= 4. REUSABLE FOOTER ================= */}
      <Footer />
    </div>
  );
}
