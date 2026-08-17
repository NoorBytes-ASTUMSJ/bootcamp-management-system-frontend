export default function Navbar({
  currentView = "home",
  onNavigatePage,
  onNavigateLogin,
  onNavigateSignUp,
}) {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-brand-dark-surface/90 backdrop-blur-md border-b border-gray-100 dark:border-brand-dark-border transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          type="button"
          onClick={() => onNavigatePage && onNavigatePage("home")}
          className="text-lg font-black tracking-tight text-[#B93325] focus:outline-none cursor-pointer"
        >
          ASTU MSJ
        </button>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-gray-600 dark:text-brand-dark-muted">
          <button
            type="button"
            onClick={() => onNavigatePage && onNavigatePage("home")}
            className={`cursor-pointer transition-colors focus:outline-none ${
              currentView === "home"
                ? "text-[#B93325] border-b-2 border-[#B93325] pb-0.5 font-semibold"
                : "hover:text-gray-900 dark:hover:text-white pb-0.5 border-b-2 border-transparent"
            }`}
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => onNavigatePage && onNavigatePage("about")}
            className={`cursor-pointer transition-colors focus:outline-none ${
              currentView === "about"
                ? "text-[#B93325] border-b-2 border-[#B93325] pb-0.5 font-semibold"
                : "hover:text-gray-900 dark:hover:text-white pb-0.5 border-b-2 border-transparent"
            }`}
          >
            About
          </button>
          <button
            type="button"
            onClick={() => onNavigatePage && onNavigatePage("tracks")}
            className={`cursor-pointer transition-colors focus:outline-none ${
              currentView === "tracks"
                ? "text-[#B93325] border-b-2 border-[#B93325] pb-0.5 font-semibold"
                : "hover:text-gray-900 dark:hover:text-white pb-0.5 border-b-2 border-transparent"
            }`}
          >
            Tracks
          </button>
          <button
            type="button"
            onClick={() => onNavigatePage && onNavigatePage("mentors")}
            className={`cursor-pointer transition-colors focus:outline-none ${
              currentView === "mentors"
                ? "text-[#B93325] border-b-2 border-[#B93325] pb-0.5 font-semibold"
                : "hover:text-gray-900 dark:hover:text-white pb-0.5 border-b-2 border-transparent"
            }`}
          >
            Mentors
          </button>
          <button
            type="button"
            onClick={() => onNavigatePage && onNavigatePage("faq")}
            className={`cursor-pointer transition-colors focus:outline-none ${
              currentView === "faq"
                ? "text-[#B93325] border-b-2 border-[#B93325] pb-0.5 font-semibold"
                : "hover:text-gray-900 dark:hover:text-white pb-0.5 border-b-2 border-transparent"
            }`}
          >
            FAQ
          </button>
          <button
            type="button"
            onClick={() => onNavigatePage && onNavigatePage("contact")}
            className={`cursor-pointer transition-colors focus:outline-none ${
              currentView === "contact"
                ? "text-[#B93325] border-b-2 border-[#B93325] pb-0.5 font-semibold"
                : "hover:text-gray-900 dark:hover:text-white pb-0.5 border-b-2 border-transparent"
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
            className="text-xs font-semibold text-gray-700 dark:text-brand-dark-text hover:text-[#B93325] px-3 py-1.5 transition-colors cursor-pointer focus:outline-none"
          >
            Log in
          </button>
          <button
            type="button"
            onClick={onNavigateSignUp}
            className="text-xs font-semibold bg-[#B93325] text-white hover:bg-[#a32c1f] px-3.5 py-1.5 rounded-lg transition-all shadow-sm cursor-pointer focus:outline-none"
          >
            Sign Up
          </button>
        </div>
      </div>
    </header>
  );
}
