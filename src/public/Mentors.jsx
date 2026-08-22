<<<<<<<< HEAD:src/pages/public/Mentors.jsx
import React from "react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
========
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
>>>>>>>> 27d492b4e1fef52818f4ac14ab1ed0e3ead2c914:src/public/Mentors.jsx
import { MdHandshake } from "react-icons/md";
import MentorsImage from "../../assets/mentors-group.png";

export default function Mentors({
  onNavigatePage,
  onNavigateLogin,
  onNavigateSignUp,
}) {
  return (
    <div className="min-h-screen bg-background text-inherit transition-colors">
      <Navbar
        currentView="mentors"
        onNavigatePage={onNavigatePage}
        onNavigateLogin={onNavigateLogin}
        onNavigateSignUp={onNavigateSignUp}
      />

      {/* ================= 1. HERO SECTION ================= */}
      <section className="pt-20 pb-20 px-4 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-inherit leading-[1.15] mb-6">
          Learn from experienced <br />
          mentors.{" "}
          <span className="text-primary">
            Get continuous <br />
            guidance.
          </span>
        </h1>

        <p className="text-xs sm:text-sm text-muted max-w-xl mx-auto leading-relaxed">
          You don't have to learn alone. Our mentorship program pairs you with
          experienced peers to accelerate your growth and provide personalized
          support throughout your bootcamp journey.
        </p>
      </section>

      {/* ================= 2. GUIDED BY EXCELLENCE CARD ================= */}
      <section className="px-4 sm:px-6 lg:px-8 pb-32 max-w-5xl mx-auto">
        <div className="p-8 sm:p-10 rounded-3xl bg-surface border border-border shadow-2xs grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center hover:border-primary/40 transition-all duration-300">
          {/* Left Column: Text */}
          <div className="md:col-span-6 space-y-4">
            <span className="inline-block px-3 py-1 rounded-md bg-secondary text-primary text-[10px] font-mono tracking-wider font-semibold uppercase">
              Our Philosophy
            </span>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-inherit tracking-tight">
              Guided by Excellence
            </h2>

            <p className="text-xs text-muted leading-relaxed">
              Our mentors are a select group of approximately 20 high-performing
              current ASTU students. They bring diverse technological expertise
              across various domains, ensuring that no matter your interest,
              there is a mentor ready to guide you.
            </p>

            <p className="text-xs text-muted leading-relaxed">
              They are not just instructors; they are peers who have
              successfully navigated the same challenges you will face, offering
              empathetic, relevant, and actionable advice.
            </p>
          </div>

          {/* Right Column: Image */}
          <div className="md:col-span-6">
            <div className="overflow-hidden rounded-2xl border border-border shadow-2xs">
              <img
                src={MentorsImage}
                alt="ASTU MSJ Mentorship Group"
                className="w-full h-64 sm:h-72 object-cover object-center hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= 3. PERSONALIZED MENTOR MATCHING ================= */}
      <section className="px-4 sm:px-6 lg:px-8 pb-28 text-center max-w-3xl mx-auto">
        <div className="flex items-center justify-center text-primary mb-4">
          <MdHandshake className="w-10 h-10" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-inherit mb-3.5 tracking-tight">
          Personalized Mentor Matching
        </h2>

        <p className="text-xs sm:text-sm text-muted max-w-xl mx-auto leading-relaxed">
          Every student is specifically assigned to a dedicated mentor. This
          ensures you receive a personalized, consistent experience with someone
          who understands your unique learning style, tracks your individual
          progress, and provides tailored guidance every step of the way.
        </p>
      </section>

      {/* ================= 4. WHAT MENTORS DO ================= */}
      <section className="px-4 sm:px-6 lg:px-8 pb-28 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-inherit mb-2 tracking-tight">
            What Mentors Do
          </h2>
          <p className="text-xs sm:text-sm text-muted max-w-md mx-auto">
            Comprehensive support designed to ensure you never feel stuck and
            constantly move forward.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Academic Support */}
          <div className="p-7 rounded-2xl bg-surface border border-border shadow-2xs flex flex-col hover:border-primary/40 transition-all duration-300">
            <div className="flex items-center gap-3 pb-5 border-b border-border mb-5">
              <div className="w-9 h-9 rounded-xl bg-secondary border border-border flex items-center justify-center text-primary">
                <svg
                  className="w-5 h-5"
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
                </svg>
              </div>
              <h3 className="font-bold text-base text-inherit">
                Academic Support
              </h3>
            </div>
            <div className="space-y-3.5 flex-1">
              <div className="flex items-start gap-2.5 text-xs text-muted leading-relaxed">
                <svg
                  className="w-4 h-4 text-primary shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="9" strokeWidth="1.8" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4"
                  />
                </svg>
                <span>Teach core concepts and simplify complex topics.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-muted leading-relaxed">
                <svg
                  className="w-4 h-4 text-primary shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="9" strokeWidth="1.8" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4"
                  />
                </svg>
                <span>
                  Answer questions and provide immediate technical assistance.
                </span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-muted leading-relaxed">
                <svg
                  className="w-4 h-4 text-primary shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="9" strokeWidth="1.8" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4"
                  />
                </svg>
                <span>
                  Guide students carefully through difficult or frustrating
                  topics.
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Progress Tracking */}
          <div className="p-7 rounded-2xl bg-surface border border-border shadow-2xs flex flex-col hover:border-primary/40 transition-all duration-300">
            <div className="flex items-center gap-3 pb-5 border-b border-border mb-5">
              <div className="w-9 h-9 rounded-xl bg-secondary border border-border flex items-center justify-center text-primary">
                <svg
                  className="w-5 h-5"
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
              </div>
              <h3 className="font-bold text-base text-inherit">
                Progress Tracking
              </h3>
            </div>
            <div className="space-y-3.5 flex-1">
              <div className="flex items-start gap-2.5 text-xs text-muted leading-relaxed">
                <svg
                  className="w-4 h-4 text-primary shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="9" strokeWidth="1.8" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4"
                  />
                </svg>
                <span>
                  Track overall progress and manage session attendance.
                </span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-muted leading-relaxed">
                <svg
                  className="w-4 h-4 text-primary shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="9" strokeWidth="1.8" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4"
                  />
                </svg>
                <span>
                  Actively monitor and intervene for students falling behind.
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Assessment */}
          <div className="p-7 rounded-2xl bg-surface border border-border shadow-2xs flex flex-col hover:border-primary/40 transition-all duration-300">
            <div className="flex items-center gap-3 pb-5 border-b border-border mb-5">
              <div className="w-9 h-9 rounded-xl bg-secondary border border-border flex items-center justify-center text-primary">
                <svg
                  className="w-5 h-5"
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
              </div>
              <h3 className="font-bold text-base text-inherit">Assessment</h3>
            </div>
            <div className="space-y-3.5 flex-1">
              <div className="flex items-start gap-2.5 text-xs text-muted leading-relaxed">
                <svg
                  className="w-4 h-4 text-primary shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="9" strokeWidth="1.8" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4"
                  />
                </svg>
                <span>Review projects and assignments rigorously.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-muted leading-relaxed">
                <svg
                  className="w-4 h-4 text-primary shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="9" strokeWidth="1.8" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4"
                  />
                </svg>
                <span>
                  Give constructive feedback and fairly grade submissions.
                </span>
              </div>
            </div>
          </div>

          {/* Card 4: Specialized Guidance */}
          <div className="p-7 rounded-2xl bg-surface border border-border shadow-2xs flex flex-col hover:border-primary/40 transition-all duration-300">
            <div className="flex items-center gap-3 pb-5 border-b border-border mb-5">
              <div className="w-9 h-9 rounded-xl bg-secondary border border-border flex items-center justify-center text-primary">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="10" strokeWidth="2" />
                  <circle cx="12" cy="12" r="5" strokeWidth="1.8" />
                  <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                </svg>
              </div>
              <h3 className="font-bold text-base text-inherit">
                Specialized Guidance
              </h3>
            </div>
            <div className="space-y-3.5 flex-1">
              <div className="flex items-start gap-2.5 text-xs text-muted leading-relaxed">
                <svg
                  className="w-4 h-4 text-primary shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="9" strokeWidth="1.8" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4"
                  />
                </svg>
                <span>
                  Provide targeted guidance for competitive programming.
                </span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-muted leading-relaxed">
                <svg
                  className="w-4 h-4 text-primary shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="9" strokeWidth="1.8" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4"
                  />
                </svg>
                <span>
                  Offer holistic support to help students improve continuously.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 5. ALUMNI INSIGHTS ================= */}
<<<<<<<< HEAD:src/pages/public/Mentors.jsx
      <section className="bg-[#181a1d] border-t border-b border-border py-20 px-4 sm:px-6 lg:px-8 transition-colors text-white">
========
      <section className="bg-[#0d0e0f] border-t border-b border-[#2d3033] py-20 px-4 sm:px-6 lg:px-8">
>>>>>>>> 27d492b4e1fef52818f4ac14ab1ed0e3ead2c914:src/public/Mentors.jsx
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Text & List */}
          <div className="md:col-span-7 space-y-5">
<<<<<<<< HEAD:src/pages/public/Mentors.jsx
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-inherit leading-tight">
========
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#f5f5f5] leading-tight">
>>>>>>>> 27d492b4e1fef52818f4ac14ab1ed0e3ead2c914:src/public/Mentors.jsx
              Alumni Insights & Experience <br />
              Sharing
            </h2>

<<<<<<<< HEAD:src/pages/public/Mentors.jsx
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed max-w-lg">
========
            <p className="text-xs sm:text-sm text-[#a3a3a3] leading-relaxed max-w-lg">
>>>>>>>> 27d492b4e1fef52818f4ac14ab1ed0e3ead2c914:src/public/Mentors.jsx
              Beyond daily mentorship, successful Muslim ASTU graduates
              frequently return to share their professional journeys. These
              sessions offer invaluable real-world perspectives outside the
              bootcamp curriculum.
            </p>

<<<<<<<< HEAD:src/pages/public/Mentors.jsx
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-xs text-gray-300">
                <svg
                  className="w-4 h-4 text-gray-400 shrink-0"
========
            <div className="space-y-4 pt-4">
              {/* List Item 1 */}
              <div className="flex items-center gap-3 text-xs text-[#d4d4d4]">
                <svg
                  className="w-4 h-4 text-[#a3a3a3] shrink-0"
>>>>>>>> 27d492b4e1fef52818f4ac14ab1ed0e3ead2c914:src/public/Mentors.jsx
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                  />
                </svg>
                <span>Personal Journeys & Career Paths</span>
              </div>

<<<<<<<< HEAD:src/pages/public/Mentors.jsx
              <div className="flex items-center gap-3 text-xs text-gray-300">
                <svg
                  className="w-4 h-4 text-gray-400 shrink-0"
========
              {/* List Item 2 */}
              <div className="flex items-center gap-3 text-xs text-[#d4d4d4]">
                <svg
                  className="w-4 h-4 text-[#a3a3a3] shrink-0"
>>>>>>>> 27d492b4e1fef52818f4ac14ab1ed0e3ead2c914:src/public/Mentors.jsx
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
                <span>Crucial Lessons Learned</span>
              </div>

<<<<<<<< HEAD:src/pages/public/Mentors.jsx
              <div className="flex items-center gap-3 text-xs text-gray-300">
                <svg
                  className="w-4 h-4 text-gray-400 shrink-0"
========
              {/* List Item 3 */}
              <div className="flex items-center gap-3 text-xs text-[#d4d4d4]">
                <svg
                  className="w-4 h-4 text-[#a3a3a3] shrink-0"
>>>>>>>> 27d492b4e1fef52818f4ac14ab1ed0e3ead2c914:src/public/Mentors.jsx
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span>Real-World Industry Experience</span>
              </div>

<<<<<<<< HEAD:src/pages/public/Mentors.jsx
              <div className="flex items-center gap-3 text-xs text-gray-300">
                <svg
                  className="w-4 h-4 text-gray-400 shrink-0"
========
              {/* List Item 4 */}
              <div className="flex items-center gap-3 text-xs text-[#d4d4d4]">
                <svg
                  className="w-4 h-4 text-[#a3a3a3] shrink-0"
>>>>>>>> 27d492b4e1fef52818f4ac14ab1ed0e3ead2c914:src/public/Mentors.jsx
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <span>Strategic Career Advice</span>
              </div>
            </div>
          </div>

          {/* Right Column: Quote Card */}
          <div className="md:col-span-5">
<<<<<<<< HEAD:src/pages/public/Mentors.jsx
            <div className="p-7 sm:p-8 rounded-2xl bg-[#212429] border border-white/5 shadow-2xs">
              <span className="text-3xl text-gray-500 font-serif leading-none block mb-2">
                “
              </span>
              <p className="text-xs sm:text-sm italic text-gray-300 leading-relaxed mb-6">
========
            {/* This makes the card the exact black color (#151718) from your design */}
            <div className="p-7 sm:p-8 rounded-2xl bg-[#151718] border border-[#2d3033] shadow-xl">
              <span className="text-4xl text-[#a3a3a3]/30 font-serif leading-none block mb-2">
                “
              </span>
              <p className="text-[13px] sm:text-sm italic text-[#d4d4d4] leading-relaxed mb-6 font-serif">
>>>>>>>> 27d492b4e1fef52818f4ac14ab1ed0e3ead2c914:src/public/Mentors.jsx
                "The transition from academia to industry is challenging. We
                come back to ensure the next generation understands the
                practical realities of software engineering, beyond just writing
                code."
              </p>

              <div className="flex items-center gap-4">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
                  alt="Tarik Ibrahim"
<<<<<<<< HEAD:src/pages/public/Mentors.jsx
                  className="w-10 h-10 rounded-full object-cover border border-white/10 shadow-2xs"
                />
                <div>
                  <h4 className="text-xs font-bold text-inherit">
                    Tarik Ibrahim
                  </h4>
                  <p className="text-[10px] text-gray-400">
========
                  className="w-10 h-10 rounded-full object-cover border border-[#2d3033]"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-[#f5f5f5]">
                    Tarik Ibrahim
                  </span>
                  <span className="text-[10px] sm:text-xs text-[#a3a3a3]">
>>>>>>>> 27d492b4e1fef52818f4ac14ab1ed0e3ead2c914:src/public/Mentors.jsx
                    Senior Engineer at TechCorp, Class of '20
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 6. REUSABLE FOOTER ================= */}
      <Footer onNavigatePage={onNavigatePage} />
    </div>
  );
}
