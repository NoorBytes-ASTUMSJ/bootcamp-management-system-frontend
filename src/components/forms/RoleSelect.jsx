import FormCard from "../common/FormCard";
import { GraduationCap, Briefcase, ArrowRight, ArrowLeft } from "lucide-react";
import jemeaLogo from "../../assets/jemea-logo.jpg";

export default function RoleSelect({
  onSelectRole,
  onNavigateLogin,
  onBackToHome,
}) {
  return (
    <FormCard>
      <div className="w-full">
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-2">
          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-text-muted hover:text-primary transition-colors cursor-pointer select-none"
          >
            <ArrowLeft size={14} />
            <span>Back to home</span>
          </button>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary uppercase border border-primary/20">
            Get Started
          </span>
        </div>

        {/* Brand Logo & Heading (Navbar Style Match) */}
        <div className="text-center mb-5 pt-1">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-surface border border-border/80 shadow-xs p-1 mb-2.5 overflow-hidden">
            <img
              src={jemeaLogo}
              alt="ASTU MSJ Logo"
              className="w-full h-full object-contain rounded-xl"
            />
          </div>

          {/* Styled Branding Title */}
          <div className="flex items-center justify-center gap-2 flex-wrap mb-1">
            <h2 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight">
              Join ASTU <span className="text-primary">MSJ</span>
            </h2>
            <span className="text-[10px] font-mono font-black tracking-wider px-2 py-0.5 rounded-md bg-primary/10 text-primary uppercase border border-primary/20">
              Bootcamp
            </span>
          </div>

          <p className="text-xs text-text-muted mt-0.5">
            Choose your learning or mentoring path to proceed.
          </p>
        </div>

        {/* Role Cards */}
        <div className="space-y-3">
          {/* Student Card */}
          <button
            type="button"
            onClick={() => onSelectRole("student")}
            className="w-full text-left p-4 rounded-xl border border-border hover:border-primary hover:shadow-[0_0_0_1px_rgba(234,88,12,0.25)] bg-surface hover:bg-surface-subtle transition-all duration-200 group cursor-pointer shadow-2xs relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-105 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-200 shrink-0">
                  <GraduationCap size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors">
                    Apply as a Student
                  </h3>
                  <p className="text-xs text-text-muted mt-0.5 leading-relaxed">
                    Participate in bootcamps, solve problems, and access
                    tailored learning tracks.
                  </p>
                </div>
              </div>
              <ArrowRight
                size={16}
                className="text-text-muted group-hover:text-primary group-hover:translate-x-1 transition-all ml-2 shrink-0"
              />
            </div>
          </button>

          {/* Mentor Card */}
          <button
            type="button"
            onClick={() => onSelectRole("mentor")}
            className="w-full text-left p-4 rounded-xl border border-border hover:border-primary hover:shadow-[0_0_0_1px_rgba(234,88,12,0.25)] bg-surface hover:bg-surface-subtle transition-all duration-200 group cursor-pointer shadow-2xs relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-105 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-200 shrink-0">
                  <Briefcase size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors">
                    Join as a Mentor
                  </h3>
                  <p className="text-xs text-text-muted mt-0.5 leading-relaxed">
                    Share your experience, mentor junior peers, and lead
                    technical project tracks.
                  </p>
                </div>
              </div>
              <ArrowRight
                size={16}
                className="text-text-muted group-hover:text-primary group-hover:translate-x-1 transition-all ml-2 shrink-0"
              />
            </div>
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-text-muted mt-6">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onNavigateLogin}
            className="text-primary font-bold hover:underline cursor-pointer"
          >
            Log In
          </button>
        </p>
      </div>
    </FormCard>
  );
}
