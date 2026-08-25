import React from "react";

export default function FormCard({ children, className = "" }) {
  return (
    <div className="relative min-h-screen bg-background flex items-center justify-center p-4 sm:p-6 overflow-hidden select-none">
      {/* 1. Subtle Tech Grid Pattern Background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035] dark:opacity-[0.06]"
        style={{
          backgroundImage: `radial-gradient(currentColor 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />

      {/* 2. Modern Ambient Radial Glow (Primary Brand Tint) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-primary/10 rounded-full blur-[120px] pointer-events-none -z-0" />

      {/* 3. Main Modern Card Container */}
      <div
        className={`relative z-10 w-full max-w-[440px] bg-surface/95 backdrop-blur-md rounded-2xl shadow-xl shadow-black/5 border border-border/80 border-t-2 border-t-primary p-6 sm:p-7 transition-all duration-200 ${className}`}
      >
        {children}
      </div>
    </div>
  );
}
