import React from "react";
import { Link } from "react-router-dom";

export default function Footer({ onNavigatePage }) {
  return (
    <footer className="border-t border-border py-8 px-4 sm:px-6 lg:px-8 bg-transparent transition-colors">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
        <p>© 2026 ASTU MSJ Summer Bootcamp. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <Link
            to="/privacy"
            onClick={(e) =>
              onNavigatePage && (e.preventDefault(), onNavigatePage("privacy"))
            }
            className="hover:text-inherit transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            to="/terms"
            onClick={(e) =>
              onNavigatePage && (e.preventDefault(), onNavigatePage("terms"))
            }
            className="hover:text-inherit transition-colors"
          >
            Terms of Service
          </Link>
          <Link
            to="/cookies"
            onClick={(e) =>
              onNavigatePage && (e.preventDefault(), onNavigatePage("cookies"))
            }
            className="hover:text-inherit transition-colors"
          >
            Cookie Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
