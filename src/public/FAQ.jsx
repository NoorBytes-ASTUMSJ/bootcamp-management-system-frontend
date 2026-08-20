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
    <div className="min-h-screen bg-background text-text-primary transition-colors">
      <Navbar
        currentView="faq"
        onNavigatePage={onNavigatePage}
        onNavigateLogin={onNavigateLogin}
        onNavigateSignUp={onNavigateSignUp}
      />

      {/* ================= 1. HERO SECTION ================= */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-text-primary leading-[1.15] mb-4">
          Frequently <span className="text-primary">Asked</span> <br />
          <span className="text-primary">Questions</span>
        </h1>

        <p className="text-xs sm:text-sm text-text-muted max-w-md mx-auto">
          Everything you need to know before starting your journey.
        </p>
      </section>

      {/* ================= 2. FAQ CATEGORIES & ACCORDIONS ================= */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20 max-w-3xl mx-auto space-y-12">
        {faqData.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-4">
            {/* Category Header */}
            <h2 className="text-sm font-bold tracking-tight text-text-primary">
              {group.category}{" "}
              <span className="text-primary">{group.categoryHighlight}</span>
            </h2>

            {/* Accordion Item Cards */}
            <div className="space-y-3">
              {group.items.map((item) => {
                const isOpen = openIndex === item.id;
                return (
                  <div
                    key={item.id}
                    className="bg-surface border border-border rounded-xl transition-all duration-200 shadow-xs overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => toggleAccordion(item.id)}
                      className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-surface-subtle transition-colors"
                    >
                      <span className="text-xs sm:text-[13px] font-semibold text-text-primary">
                        {item.q}
                      </span>
                      <svg
                        className={`w-4 h-4 text-text-muted shrink-0 transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-primary" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-4 pt-1 border-t border-border text-xs text-text-muted leading-relaxed">
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
        <div className="bg-surface border border-border rounded-2xl p-8 text-center shadow-xs space-y-4">
          <div className="w-8 h-8 rounded-full bg-secondary border border-border-subtle text-primary mx-auto flex items-center justify-center text-sm font-bold">
            ?
          </div>

          <h3 className="text-base font-bold text-text-primary">
            Still have questions?
          </h3>

          <p className="text-xs text-text-muted max-w-xs mx-auto leading-relaxed">
            Can't find the answer you're looking for? Reach out to our team
            directly.
          </p>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => onNavigatePage && onNavigatePage("contact")}
              className="inline-block px-5 py-2 rounded-lg border border-border bg-surface hover:bg-surface-subtle text-xs font-semibold text-text-primary transition-colors shadow-xs cursor-pointer"
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
