import { useState } from "react";
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";

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
    <div className="min-h-screen bg-theme-bg text-theme-text transition-colors">
      <Navbar
        currentView="contact"
        onNavigatePage={onNavigatePage}
        onNavigateLogin={onNavigateLogin}
        onNavigateSignUp={onNavigateSignUp}
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* ================= LEFT COLUMN ================= */}
          <div className="lg:col-span-6 space-y-12">
            {/* Top Heading Block */}
            <div className="space-y-4">
              <span className="text-[11px] font-mono tracking-widest text-theme-muted uppercase">
                GET IN TOUCH
              </span>
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-theme-text leading-[1.1]">
                We are here. <br />
                <span className="text-[#B93325]">Talk to us.</span>
              </h1>
              <p className="text-xs sm:text-[13px] text-theme-muted leading-relaxed max-w-md pt-2">
                Whether you have questions about the curriculum, need mentorship
                details, or want to discuss partnership opportunities, our team
                is ready to connect. Reach out through the channels below.
              </p>
            </div>

            {/* Follow Us Block */}
            <div className="space-y-6 pt-4">
              <div className="space-y-2">
                <span className="text-[11px] font-mono tracking-widest text-theme-muted uppercase">
                  FOLLOW US
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-theme-text">
                  Find us on <br />
                  <span className="text-[#B93325]">every platform.</span>
                </h2>
                <p className="text-xs sm:text-[13px] text-theme-muted leading-relaxed max-w-md">
                  Stay updated with the latest bootcamp announcements,
                  resources, and community highlights across our social
                  networks.
                </p>
              </div>

              {/* Social Channels Divider & List */}
              <div className="border-t border-theme-border pt-6 space-y-5">
                {/* Telegram */}
                <div>
                  <a
                    href="https://t.me/astumsj_bootcamp"
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center gap-2 text-xs text-theme-text font-semibold hover:text-[#B93325] transition-colors"
                  >
                    <span>Telegram</span>
                    <span className="group-hover:translate-x-0.5 transition-transform text-[#B93325]">
                      →
                    </span>
                  </a>
                  <p className="text-[11px] text-theme-muted">
                    @astumsj_bootcamp
                  </p>
                </div>

                {/* LinkedIn */}
                <div>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center gap-2 text-xs text-theme-text font-semibold hover:text-[#B93325] transition-colors"
                  >
                    <span>LinkedIn</span>
                    <span className="group-hover:translate-x-0.5 transition-transform text-[#B93325]">
                      →
                    </span>
                  </a>
                  <p className="text-[11px] text-theme-muted">ASTU MSJ</p>
                </div>

                {/* GitHub */}
                <div>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center gap-2 text-xs text-theme-text font-semibold hover:text-[#B93325] transition-colors"
                  >
                    <span>GitHub</span>
                    <span className="group-hover:translate-x-0.5 transition-transform text-[#B93325]">
                      →
                    </span>
                  </a>
                  <p className="text-[11px] text-theme-muted">/astumsj</p>
                </div>
              </div>
            </div>
          </div>

          {/* ================= RIGHT COLUMN ================= */}
          <div className="lg:col-span-6 space-y-8">
            {/* Contact Details Meta Block */}
            <div className="border-t border-theme-border pt-2 space-y-6">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-theme-muted uppercase block mb-1">
                  EMAIL
                </span>
                <p className="text-xs sm:text-[13px] font-medium text-theme-text">
                  hello@astumsj.edu
                </p>
              </div>

              <div>
                <span className="text-[10px] font-mono tracking-widest text-theme-muted uppercase block mb-1">
                  LOCATION
                </span>
                <p className="text-xs sm:text-[13px] font-medium text-theme-text">
                  Adama Science and Technology University <br />
                  Adama, Ethiopia
                </p>
              </div>

              <div>
                <span className="text-[10px] font-mono tracking-widest text-theme-muted uppercase block mb-1">
                  PHONE
                </span>
                <p className="text-xs sm:text-[13px] font-medium text-theme-text">
                  +251 (0) 11 111 1111
                </p>
              </div>
            </div>

            {/* Form Card */}
            <div className="bg-theme-surface border border-theme-border rounded-2xl p-7 sm:p-9 shadow-xs">
              <h3 className="text-lg font-bold text-theme-text mb-1">
                Send us a message
              </h3>
              <p className="text-xs text-theme-muted mb-6">
                Fill out the form below and our support team will get back to
                you shortly.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* First & Last Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-mono tracking-wider text-theme-muted uppercase block mb-1.5">
                      FIRST NAME
                    </label>
                    <input
                      type="text"
                      placeholder="Ahmed"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-lg border border-theme-border bg-theme-bg text-xs text-theme-text placeholder-theme-muted/60 focus:outline-hidden focus:border-[#B93325]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono tracking-wider text-theme-muted uppercase block mb-1.5">
                      LAST NAME
                    </label>
                    <input
                      type="text"
                      placeholder="Mohammed"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-lg border border-theme-border bg-theme-bg text-xs text-theme-text placeholder-theme-muted/60 focus:outline-hidden focus:border-[#B93325]"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="text-[10px] font-mono tracking-wider text-theme-muted uppercase block mb-1.5">
                    EMAIL ADDRESS
                  </label>
                  <input
                    type="email"
                    placeholder="ahmed@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-lg border border-theme-border bg-theme-bg text-xs text-theme-text placeholder-theme-muted/60 focus:outline-hidden focus:border-[#B93325]"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label className="text-[10px] font-mono tracking-wider text-theme-muted uppercase block mb-1.5">
                    SUBJECT
                  </label>
                  <div className="relative">
                    <select
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-lg border border-theme-border bg-theme-bg text-xs text-theme-text appearance-none focus:outline-hidden focus:border-[#B93325]"
                    >
                      <option
                        value="General Inquiry"
                        className="bg-theme-surface text-theme-text"
                      >
                        General Inquiry
                      </option>
                      <option
                        value="Curriculum & Tracks"
                        className="bg-theme-surface text-theme-text"
                      >
                        Curriculum & Tracks
                      </option>
                      <option
                        value="Mentorship Program"
                        className="bg-theme-surface text-theme-text"
                      >
                        Mentorship Program
                      </option>
                      <option
                        value="Partnership"
                        className="bg-theme-surface text-theme-text"
                      >
                        Partnership
                      </option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-theme-muted">
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
                  <label className="text-[10px] font-mono tracking-wider text-theme-muted uppercase block mb-1.5">
                    MESSAGE
                  </label>
                  <textarea
                    rows={4}
                    placeholder="How can we help you?"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-lg border border-theme-border bg-theme-bg text-xs text-theme-text placeholder-theme-muted/60 focus:outline-hidden focus:border-[#B93325] resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-3 rounded-lg bg-[#B93325] hover:bg-[#a32a1e] text-white text-xs font-mono font-bold tracking-wider uppercase transition-colors shadow-sm cursor-pointer mt-2"
                >
                  SEND MESSAGE
                </button>

                <p className="text-[11px] text-theme-muted text-center pt-2">
                  We typically respond within 24-48 hours.
                </p>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* ================= REUSABLE FOOTER ================= */}
      <Footer />
    </div>
  );
}
