import { useState } from "react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { ChevronDown } from "lucide-react";

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
          a: "The program features a hybrid model with both physical lab sessions on campus and online resource sharing.",
        },
        {
          id: "basics-5",
          q: "How long is the bootcamp?",
          a: "The program runs for a rigorous 12 weeks during the summer break, structured into distinct, progressive phases.",
        },
        {
          id: "basics-6",
          q: "Start date?",
          a: "The exact start date will be announced via our official channels after the registration and assessment period concludes.",
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
          a: "Phase 1 focuses heavily on algorithmic thinking and Competitive Programming, while Phase 2 transitions into full-stack software development and project architecture.",
        },
        {
          id: "curr-3",
          q: "Will there be projects?",
          a: "Yes! Real-world project building is the core pillar of our philosophy. You will build and deploy functional applications to showcase in your portfolio.",
        },
        {
          id: "curr-4",
          q: "Will I have a mentor?",
          a: "Yes. Every student is paired with a high-performing senior mentor who tracks their daily progress and reviews code.",
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
          a: "Applicants complete a short registration form followed by a foundational evaluation to ensure baseline commitment and dedication.",
        },
        {
          id: "proc-2",
          q: "Completion reward?",
          a: "Graduates receive verified certificates of completion, a production-ready portfolio, and potential invitation to join subsequent cohorts as mentors.",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      <Navbar
        currentView="faq"
        onNavigatePage={onNavigatePage}
        onNavigateLogin={onNavigateLogin}
        onNavigateSignUp={onNavigateSignUp}
      />

      {/* ================= 1. HERO SECTION ================= */}
      <section className="pt-20 pb-14 px-4 sm:px-6 lg:px-8 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-foreground leading-[1.12] mb-4">
          Frequently <span className="text-primary">Asked</span> <br />
          <span className="text-primary">Questions</span>
        </h1>
        <p className="text-xs sm:text-sm text-muted max-w-md mx-auto">
          Everything you need to know before starting your journey.
        </p>
      </section>

      {/* ================= 2. FAQ GROUPS ================= */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20 max-w-2xl mx-auto space-y-10">
        {faqData.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-3.5">
            <h2 className="text-xs sm:text-sm font-bold tracking-tight text-foreground">
              {group.category}{" "}
              <span className="text-primary">{group.categoryHighlight}</span>
            </h2>

            <div className="space-y-2.5">
              {group.items.map((item) => {
                const isOpen = openIndex === item.id;
                return (
                  <div
                    key={item.id}
                    className="bg-surface border border-border rounded-xl transition-all duration-200 shadow-2xs overflow-hidden hover:border-primary/30"
                  >
                    <button
                      type="button"
                      onClick={() => toggleAccordion(item.id)}
                      className="w-full px-5 py-3.5 text-left flex items-center justify-between gap-4 cursor-pointer"
                    >
                      <span className="text-xs sm:text-[13px] font-semibold text-foreground">
                        {item.q}
                      </span>
                      <ChevronDown
                        size={15}
                        className={`text-muted shrink-0 transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-primary" : ""
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-4 pt-1 border-t border-border/60 text-xs text-muted leading-relaxed">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* ================= 3. STILL HAVE QUESTIONS CARD ================= */}
        <div className="pt-6">
          <div className="p-8 rounded-2xl bg-surface border border-border shadow-2xs text-center space-y-3 hover:border-primary/30 transition-all duration-300">
            <div className="w-7 h-7 rounded-full bg-red-500/10 text-primary text-xs font-bold flex items-center justify-center mx-auto">
              ?
            </div>

            <h3 className="text-sm sm:text-base font-bold text-foreground">
              Still have questions?
            </h3>

            <p className="text-[11px] sm:text-xs text-muted max-w-xs mx-auto leading-relaxed">
              Can't find the answer you're looking for? Reach out to our team
              directly.
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => onNavigatePage && onNavigatePage("contact")}
                className="px-4 py-2 rounded-xl border border-border bg-background hover:bg-secondary text-foreground text-xs font-medium transition-colors shadow-2xs cursor-pointer"
              >
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 4. FOOTER ================= */}
      <Footer onNavigatePage={onNavigatePage} />
    </div>
  );
}
