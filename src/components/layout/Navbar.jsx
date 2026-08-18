export default function Navbar({
  currentView = "home",
  onNavigatePage,
  onNavigateLogin,
  onNavigateSignUp,
}) {
  return (
    <header className="sticky top-0 z-40 w-full bg-surface/90 backdrop-blur-md border-b border-border transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          type="button"
          onClick={() => onNavigatePage && onNavigatePage("home")}
          className="text-lg font-black tracking-tight text-primary focus:outline-none cursor-pointer"
        >
          ASTU MSJ
        </button>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-text-muted">
          <button
            type="button"
            onClick={() => onNavigatePage && onNavigatePage("home")}
            className={`cursor-pointer transition-colors focus:outline-none ${
              currentView === "home"
                ? "text-primary border-b-2 border-primary pb-0.5 font-semibold"
                : "hover:text-text-primary pb-0.5 border-b-2 border-transparent"
            }`}
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => onNavigatePage && onNavigatePage("about")}
            className={`cursor-pointer transition-colors focus:outline-none ${
              currentView === "about"
                ? "text-primary border-b-2 border-primary pb-0.5 font-semibold"
                : "hover:text-text-primary pb-0.5 border-b-2 border-transparent"
            }`}
          >
            About
          </button>
          <button
            type="button"
            onClick={() => onNavigatePage && onNavigatePage("tracks")}
            className={`cursor-pointer transition-colors focus:outline-none ${
              currentView === "tracks"
                ? "text-primary border-b-2 border-primary pb-0.5 font-semibold"
                : "hover:text-text-primary pb-0.5 border-b-2 border-transparent"
            }`}
          >
            Tracks
          </button>
          <button
            type="button"
            onClick={() => onNavigatePage && onNavigatePage("mentors")}
            className={`cursor-pointer transition-colors focus:outline-none ${
              currentView === "mentors"
                ? "text-primary border-b-2 border-primary pb-0.5 font-semibold"
                : "hover:text-text-primary pb-0.5 border-b-2 border-transparent"
            }`}
          >
            Mentors
          </button>
          <button
            type="button"
            onClick={() => onNavigatePage && onNavigatePage("faq")}
            className={`cursor-pointer transition-colors focus:outline-none ${
              currentView === "faq"
                ? "text-primary border-b-2 border-primary pb-0.5 font-semibold"
                : "hover:text-text-primary pb-0.5 border-b-2 border-transparent"
            }`}
          >
            FAQ
          </button>
          <button
            type="button"
            onClick={() => onNavigatePage && onNavigatePage("contact")}
            className={`cursor-pointer transition-colors focus:outline-none ${
              currentView === "contact"
                ? "text-primary border-b-2 border-primary pb-0.5 font-semibold"
                : "hover:text-text-primary pb-0.5 border-b-2 border-transparent"
            }`}
          >
            Contact
          </button>
        </nav>

        {/* Right Auth Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onNavigateLogin}
            className="text-xs font-semibold text-text-primary hover:text-primary px-3 py-1.5 transition-colors cursor-pointer focus:outline-none"
          >
            Log in
          </button>
          <button
            type="button"
            onClick={onNavigateSignUp}
            className="text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary-hover px-3.5 py-1.5 rounded-lg transition-colors shadow-sm cursor-pointer focus:outline-none"
          >
            Sign Up
          </button>
        </div>
      </div>
    </header>
  );
}
