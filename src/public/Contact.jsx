import { useState } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

export default function Contact({
  onNavigatePage = () => {},
  onNavigateLogin = () => {},
  onNavigateSignUp = () => {},
}) {
  const ADMIN_GMAIL = "miftahadinmohamed99@gmail.com";

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "General Inquiry",
    message: "",
  });

  const [status, setStatus] = useState({
    loading: false,
    success: false,
    error: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: false });

    try {
      const response = await fetch(
        `https://formsubmit.co/ajax/${ADMIN_GMAIL}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            _replyto: formData.email,
            subject: `[ASTU MSJ Bootcamp] ${formData.subject}`,
            message: formData.message,
            _template: "table",
          }),
        },
      );

      if (response.ok) {
        setStatus({ loading: false, success: true, error: false });
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          subject: "General Inquiry",
          message: "",
        });
      } else {
        throw new Error("Failed to send message");
      }
    } catch (err) {
      console.error(err);
      setStatus({ loading: false, success: false, error: true });
    }
  };

  return (
    <div className="min-h-screen bg-background text-text-primary transition-colors selection:bg-primary/20 selection:text-primary">
      <Navbar
        currentView="contact"
        onNavigatePage={onNavigatePage}
        onNavigateLogin={onNavigateLogin}
        onNavigateSignUp={onNavigateSignUp}
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* ================= LEFT COLUMN ================= */}
          <div className="lg:col-span-6 space-y-12">
            {/* Top Heading Block */}
            <div className="space-y-4">
              <div className="inline-block px-3.5 py-1 rounded-full bg-secondary border border-border-subtle text-primary text-[11px] font-mono tracking-widest uppercase shadow-2xs font-semibold">
                GET IN TOUCH
              </div>
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-text-primary leading-[1.1]">
                We are here. <br />
                <span className="text-primary bg-gradient-to-r from-primary to-primary/80 bg-clip-text">
                  Talk to us.
                </span>
              </h1>
              <p className="text-sm sm:text-base text-text-muted leading-relaxed max-w-md pt-2">
                Whether you have questions about the curriculum, need mentorship
                details, or want to discuss partnership opportunities, our team
                is ready to connect. Reach out through the channels below.
              </p>
            </div>

            {/* Follow Us Block */}
            <div className="space-y-6 pt-2">
              <div className="space-y-2">
                <span className="text-[11px] font-mono tracking-widest text-text-muted uppercase font-semibold">
                  FOLLOW US
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-text-primary">
                  Find us on <br />
                  <span className="text-primary">every platform.</span>
                </h2>
                <p className="text-xs sm:text-sm text-text-muted leading-relaxed max-w-md">
                  Stay updated with the latest bootcamp announcements,
                  resources, and community highlights across our social
                  networks.
                </p>
              </div>

              {/* Social Channels Divider & List */}
              <div className="border-t border-border pt-6 space-y-4">
                {/* Telegram */}
                <div className="group/link p-3 -mx-3 rounded-xl hover:bg-surface-subtle border border-transparent hover:border-border transition-all duration-200">
                  <a
                    href="https://t.me/astumsj_bootcamp"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-text-primary font-semibold group-hover/link:text-primary transition-colors"
                  >
                    <span>Telegram</span>
                    <span className="group-hover/link:translate-x-1 transition-transform duration-200 text-primary">
                      →
                    </span>
                  </a>
                  <p className="text-xs text-text-muted">@astumsj_bootcamp</p>
                </div>

                {/* LinkedIn */}
                <div className="group/link p-3 -mx-3 rounded-xl hover:bg-surface-subtle border border-transparent hover:border-border transition-all duration-200">
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-text-primary font-semibold group-hover/link:text-primary transition-colors"
                  >
                    <span>LinkedIn</span>
                    <span className="group-hover/link:translate-x-1 transition-transform duration-200 text-primary">
                      →
                    </span>
                  </a>
                  <p className="text-xs text-text-muted">ASTU MSJ</p>
                </div>

                {/* GitHub */}
                <div className="group/link p-3 -mx-3 rounded-xl hover:bg-surface-subtle border border-transparent hover:border-border transition-all duration-200">
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-text-primary font-semibold group-hover/link:text-primary transition-colors"
                  >
                    <span>GitHub</span>
                    <span className="group-hover/link:translate-x-1 transition-transform duration-200 text-primary">
                      →
                    </span>
                  </a>
                  <p className="text-xs text-text-muted">/astumsj</p>
                </div>
              </div>
            </div>
          </div>

          {/* ================= RIGHT COLUMN ================= */}
          <div className="lg:col-span-6 space-y-8">
            {/* Contact Details Meta Block */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-b border-border pb-8">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-text-muted uppercase block mb-1 font-semibold">
                  EMAIL
                </span>
                <p className="text-xs sm:text-sm font-medium text-text-primary hover:text-primary transition-colors break-all">
                  {ADMIN_GMAIL}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-mono tracking-widest text-text-muted uppercase block mb-1 font-semibold">
                  LOCATION
                </span>
                <p className="text-xs sm:text-sm font-medium text-text-primary leading-relaxed">
                  Adama Science and Technology University, Ethiopia
                </p>
              </div>

              <div>
                <span className="text-[10px] font-mono tracking-widest text-text-muted uppercase block mb-1 font-semibold">
                  PHONE
                </span>
                <p className="text-xs sm:text-sm font-medium text-text-primary">
                  +251 (0) 11 111 1111
                </p>
              </div>
            </div>

            {/* Form Card with Hover Lift & Glow */}
            <div className="group bg-surface border border-border hover:border-primary/50 rounded-3xl p-8 sm:p-10 shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1.5 transition-all duration-300">
              <h3 className="text-xl sm:text-2xl font-bold text-text-primary group-hover:text-primary transition-colors duration-200 mb-1">
                Send us a message
              </h3>
              <p className="text-xs sm:text-sm text-text-muted mb-6 leading-relaxed">
                Fill out the form below and it will be delivered straight to our
                admin inbox.
              </p>

              {/* Status Alerts */}
              {status.success && (
                <div className="mb-5 p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-500 text-xs sm:text-sm font-medium flex items-center gap-2">
                  <span>✓</span>
                  <span>
                    Thank you! Your message has been sent directly to our team.
                  </span>
                </div>
              )}

              {status.error && (
                <div className="mb-5 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs sm:text-sm font-medium flex items-center gap-2">
                  <span>✕</span>
                  <span>
                    Something went wrong. Please try again or reach out directly
                    via email.
                  </span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* First & Last Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-mono tracking-wider text-text-muted uppercase block mb-1.5 font-semibold">
                      FIRST NAME
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ahmed"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm text-text-primary placeholder:text-text-muted/60 focus:outline-hidden focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono tracking-wider text-text-muted uppercase block mb-1.5 font-semibold">
                      LAST NAME
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Mohammed"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm text-text-primary placeholder:text-text-muted/60 focus:outline-hidden focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="text-[10px] font-mono tracking-wider text-text-muted uppercase block mb-1.5 font-semibold">
                    EMAIL ADDRESS
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="ahmed@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm text-text-primary placeholder:text-text-muted/60 focus:outline-hidden focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label className="text-[10px] font-mono tracking-wider text-text-muted uppercase block mb-1.5 font-semibold">
                    SUBJECT
                  </label>
                  <div className="relative">
                    <select
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm text-text-primary appearance-none focus:outline-hidden focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all cursor-pointer"
                    >
                      <option
                        value="General Inquiry"
                        className="bg-surface text-text-primary"
                      >
                        General Inquiry
                      </option>
                      <option
                        value="Curriculum & Tracks"
                        className="bg-surface text-text-primary"
                      >
                        Curriculum & Tracks
                      </option>
                      <option
                        value="Mentorship Program"
                        className="bg-surface text-text-primary"
                      >
                        Mentorship Program
                      </option>
                      <option
                        value="Partnership"
                        className="bg-surface text-text-primary"
                      >
                        Partnership
                      </option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-text-muted">
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
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="text-[10px] font-mono tracking-wider text-text-muted uppercase block mb-1.5 font-semibold">
                    MESSAGE
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="How can we help you?"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm text-text-primary placeholder:text-text-muted/60 focus:outline-hidden focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={status.loading}
                  className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-60 text-primary-foreground text-xs font-mono font-bold tracking-wider uppercase transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 cursor-pointer mt-2"
                >
                  {status.loading ? "SENDING MESSAGE..." : "SEND MESSAGE"}
                </button>

                <p className="text-xs text-text-muted text-center pt-2">
                  We typically respond within 24-48 hours.
                </p>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
