import { useState } from "react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

export default function Contact({
  onNavigatePage = () => {},
  onNavigateLogin = () => {},
  onNavigateSignUp = () => {},
}) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "General Inquiry",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent! We typically respond within 24-48 hours.");
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      <Navbar
        currentView="contact"
        onNavigatePage={onNavigatePage}
        onNavigateLogin={onNavigateLogin}
        onNavigateSignUp={onNavigateSignUp}
      />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-28">
        {/* ================= TOP SECTION: HEADER + CONTACT DETAILS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-16">
          <div className="md:col-span-7 space-y-3">
            <span className="text-[10px] font-mono tracking-widest text-muted uppercase font-semibold">
              GET IN TOUCH
            </span>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground leading-[1.08]">
              We are here. <br />
              <span className="text-primary">Talk to us.</span>
            </h1>
            <p className="text-xs sm:text-[13px] text-muted leading-relaxed max-w-sm pt-1">
              Whether you have questions about the curriculum, need mentorship
              details, or want to discuss partnership opportunities, our team is
              ready to connect. Reach out through the channels below.
            </p>
          </div>

          <div className="md:col-span-5 space-y-5 text-xs sm:text-[13px] md:pt-6">
            <div>
              <span className="text-[10px] font-mono font-bold tracking-wider text-muted uppercase block mb-0.5">
                EMAIL
              </span>
              <a
                href="mailto:hello@astumsj.edu"
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                hello@astumsj.edu
              </a>
            </div>

            <div>
              <span className="text-[10px] font-mono font-bold tracking-wider text-muted uppercase block mb-0.5">
                LOCATION
              </span>
              <p className="text-foreground font-medium">
                Adama Science and Technology University
              </p>
              <p className="text-muted text-xs">Adama, Ethiopia</p>
            </div>

            <div>
              <span className="text-[10px] font-mono font-bold tracking-wider text-muted uppercase block mb-0.5">
                PHONE
              </span>
              <p className="text-foreground font-medium">
                +251 (0) 11 111 1111
              </p>
            </div>
          </div>
        </div>

        {/* ================= BOTTOM SECTION: FOLLOW US + SEND MESSAGE FORM ================= */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14 items-start pt-6 border-t border-border">
          {/* Left: Follow Us */}
          <div className="md:col-span-5 space-y-4">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-muted uppercase font-semibold block mb-1">
                FOLLOW US
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
                Find us on <br />
                <span className="text-primary">every platform.</span>
              </h2>
            </div>

            <p className="text-xs text-muted leading-relaxed max-w-xs">
              Stay updated with the latest bootcamp announcements, resources,
              and community highlights across our social networks.
            </p>

            <div className="space-y-3.5 pt-2">
              <div>
                <a
                  href="https://t.me/astumsj_bootcamp"
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-1.5 text-xs font-semibold text-foreground hover:text-primary transition-colors"
                >
                  <span>Telegram</span>
                  <span className="text-primary transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </a>
                <p className="text-[11px] text-muted">@astumsj_bootcamp</p>
              </div>

              <div>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-1.5 text-xs font-semibold text-foreground hover:text-primary transition-colors"
                >
                  <span>LinkedIn</span>
                  <span className="text-primary transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </a>
                <p className="text-[11px] text-muted">ASTU MSJ</p>
              </div>

              <div>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-1.5 text-xs font-semibold text-foreground hover:text-primary transition-colors"
                >
                  <span>GitHub</span>
                  <span className="text-primary transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </a>
                <p className="text-[11px] text-muted">/astumsj</p>
              </div>
            </div>
          </div>

          {/* Right: Send Message Form Card */}
          <div className="md:col-span-7">
            <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 shadow-2xs hover:border-primary/40 transition-all duration-300">
              <h3 className="text-base sm:text-lg font-bold text-foreground mb-1">
                Send us a message
              </h3>
              <p className="text-xs text-muted mb-5">
                Fill out the form below and our support team will get back to
                you shortly.
              </p>

              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-[10px] font-mono font-bold tracking-wider text-muted uppercase block mb-1">
                      FIRST NAME
                    </label>
                    <input
                      type="text"
                      placeholder="Ahmed"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-xs text-foreground placeholder:text-muted/60 focus:outline-none focus:border-primary hover:border-primary/30 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono font-bold tracking-wider text-muted uppercase block mb-1">
                      LAST NAME
                    </label>
                    <input
                      type="text"
                      placeholder="Mohammed"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-xs text-foreground placeholder:text-muted/60 focus:outline-none focus:border-primary hover:border-primary/30 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-mono font-bold tracking-wider text-muted uppercase block mb-1">
                    EMAIL ADDRESS
                  </label>
                  <input
                    type="email"
                    placeholder="ahmed@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-xs text-foreground placeholder:text-muted/60 focus:outline-none focus:border-primary hover:border-primary/30 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono font-bold tracking-wider text-muted uppercase block mb-1">
                    SUBJECT
                  </label>
                  <div className="relative">
                    <select
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-xs text-foreground appearance-none focus:outline-none focus:border-primary hover:border-primary/30 transition-colors cursor-pointer pr-8"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Curriculum & Tracks">
                        Curriculum & Tracks
                      </option>
                      <option value="Mentorship Program">
                        Mentorship Program
                      </option>
                      <option value="Partnership">Partnership</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-muted">
                      <svg
                        className="w-3.5 h-3.5"
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
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-mono font-bold tracking-wider text-muted uppercase block mb-1">
                    MESSAGE
                  </label>
                  <textarea
                    rows={4}
                    placeholder="How can we help you?"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-xs text-foreground placeholder:text-muted/60 focus:outline-none focus:border-primary hover:border-primary/30 transition-colors resize-none"
                  />
                </div>

                <div className="pt-1 space-y-2.5 text-center">
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-lg bg-primary hover:bg-primary/90 text-white text-xs font-mono font-bold tracking-wider uppercase transition-colors shadow-2xs cursor-pointer"
                  >
                    SEND MESSAGE
                  </button>
                  <p className="text-[11px] text-muted">
                    We typically respond within 24-48 hours.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer onNavigatePage={onNavigatePage} />
    </div>
  );
}
