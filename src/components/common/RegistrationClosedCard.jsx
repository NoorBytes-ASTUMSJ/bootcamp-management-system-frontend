import React from "react";
import FormCard from "./FormCard";
import { Clock, ArrowLeft, Send } from "lucide-react";
import jemeaLogo from "../../assets/jemea-logo.jpg";

export default function RegistrationClosedCard({
  role = "Student",
  onBack,
  onNavigateLogin,
}) {
  return (
    <FormCard>
      <div className="w-full text-center py-3 select-none">
        {/* Top Back Link */}
        <div className="flex items-center justify-start mb-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-text-muted hover:text-primary transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Back to selection</span>
          </button>
        </div>

        {/* Brand Logo Header */}
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-surface border border-border/80 shadow-xs p-1 mb-3 overflow-hidden">
          <img
            src={jemeaLogo}
            alt="ASTU MSJ Logo"
            className="w-full h-full object-contain rounded-xl"
          />
        </div>

        {/* Closed Pill Badge */}
        <div className="flex justify-center mb-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Clock size={12} />
            <span>Intake Currently Closed</span>
          </span>
        </div>

        {/* Main Heading */}
        <h2 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight">
          Registration Closed
        </h2>

        {/* Friendly Message */}
        <p className="text-xs text-text-muted mt-2 leading-relaxed max-w-sm mx-auto">
          The registration window for the{" "}
          <span className="font-bold text-text-primary capitalize">
            {role} Track
          </span>{" "}
          has concluded for this cohort. We review submissions carefully to
          maintain top mentorship quality.
        </p>

        {/* Official Telegram Updates Card */}
        <div className="mt-5 p-3.5 rounded-xl bg-surface-subtle border border-border/70 text-left flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Send size={15} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-text-primary">
                Want to join next cohort?
              </h4>
              <p className="text-[10px] text-text-muted">
                Follow ASTU MSJ official channel for release dates.
              </p>
            </div>
          </div>
          <a
            href="https://t.me/ASTU_MSJ"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1 rounded-lg bg-primary text-primary-foreground text-[11px] font-semibold hover:bg-primary-hover transition-colors shrink-0 shadow-2xs"
          >
            Join Channel
          </a>
        </div>

        {/* Login Alternative Link */}
        <div className="mt-6 pt-3 border-t border-border/60">
          <p className="text-xs text-text-muted">
            Already registered for this cohort?{" "}
            <button
              type="button"
              onClick={onNavigateLogin}
              className="text-primary font-bold hover:underline cursor-pointer"
            >
              Log In
            </button>
          </p>
        </div>
      </div>
    </FormCard>
  );
}
