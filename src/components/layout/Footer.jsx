export default function Footer() {
  return (
    <footer className="border-t border-theme-border py-8 px-4 sm:px-6 lg:px-8 bg-transparent transition-colors">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-theme-muted">
        <p>© 2026 ASTU MSJ Summer Bootcamp. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <a
            href="#privacy"
            className="hover:text-theme-text transition-colors"
          >
            Privacy Policy
          </a>
          <a href="#terms" className="hover:text-theme-text transition-colors">
            Terms of Service
          </a>
          <a href="#cookie" className="hover:text-theme-text transition-colors">
            Cookie Policy
          </a>
        </div>
      </div>
    </footer>
  );
}
