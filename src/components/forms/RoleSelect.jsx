import FormCard from "../common/FormCard";

export default function RoleSelect({
  onSelectRole,
  onNavigateLogin,
  onBackToHome,
}) {
  return (
    <FormCard>
      <div>
        {/* Top Left: Back Button */}
        <div className="mb-2">
          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors cursor-pointer"
          >
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to home
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-8 pt-4">
          <h2 className="text-2xl font-bold text-text-primary tracking-tight mb-2">
            Join ASTU MSJ
          </h2>
          <p className="text-xs text-text-muted">
            Choose how you want to get started
          </p>
        </div>

        {/* Role Options */}
        <div className="space-y-4">
          {/* Student Card */}
          <button
            type="button"
            onClick={() => onSelectRole("student")}
            className="w-full text-left p-4 rounded-xl border border-border hover:border-primary bg-surface hover:bg-secondary transition-all duration-200 group cursor-pointer shadow-xs"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-primary font-bold text-lg group-hover:scale-105 transition-transform">
                  🎓
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors">
                    Apply as a Student
                  </h3>
                  <p className="text-xs text-text-muted mt-0.5 leading-relaxed">
                    Participate in bootcamps, solve problems, and access
                    learning tracks.
                  </p>
                </div>
              </div>
              <span className="text-text-muted group-hover:text-primary group-hover:translate-x-1 transition-all text-sm ml-2">
                →
              </span>
            </div>
          </button>

          {/* Mentor Card */}
          <button
            type="button"
            onClick={() => onSelectRole("mentor")}
            className="w-full text-left p-4 rounded-xl border border-border hover:border-primary bg-surface hover:bg-secondary transition-all duration-200 group cursor-pointer shadow-xs"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-primary font-bold text-lg group-hover:scale-105 transition-transform">
                  💼
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors">
                    Join as a Mentor
                  </h3>
                  <p className="text-xs text-text-muted mt-0.5 leading-relaxed">
                    Share your experience, mentor junior students, and lead
                    study tracks.
                  </p>
                </div>
              </div>
              <span className="text-text-muted group-hover:text-primary group-hover:translate-x-1 transition-all text-sm ml-2">
                →
              </span>
            </div>
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-text-muted mt-10">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onNavigateLogin}
            className="text-primary font-semibold hover:underline cursor-pointer"
          >
            Log In
          </button>
        </p>
      </div>
    </FormCard>
  );
}
