import React from "react";
import { ArrowRight } from "lucide-react";

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary", // 'primary' | 'secondary' | 'outline'
  showArrow = false,
  disabled = false,
  className = "",
}) {
  const baseStyles =
    "w-full py-2.5 px-4 rounded-lg font-medium text-xs transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-primary hover:bg-primary-hover text-primary-foreground shadow-2xs",
    secondary:
      "bg-secondary hover:bg-secondary/80 text-primary border border-transparent",
    outline:
      "bg-transparent border border-border text-inherit hover:bg-surface-subtle",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${className}`}
    >
      <span>{children}</span>
      {showArrow && <ArrowRight size={15} />}
    </button>
  );
}
