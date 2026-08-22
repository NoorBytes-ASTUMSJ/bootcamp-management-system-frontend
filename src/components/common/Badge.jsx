import React from "react";

export default function Badge({
  children,
  variant = "default", // 'default' | 'primary' | 'outline'
  className = "",
}) {
  const baseStyles =
    "inline-flex items-center justify-center px-2.5 py-0.5 rounded text-[11px] font-medium transition-colors select-none";

  const variants = {
    default: "bg-surface-muted text-muted",
    primary: "bg-secondary text-primary",
    outline: "border border-border text-muted bg-transparent",
  };

  return (
    <span
      className={`${baseStyles} ${variants[variant] || variants.default} ${className}`}
    >
      {children}
    </span>
  );
}
