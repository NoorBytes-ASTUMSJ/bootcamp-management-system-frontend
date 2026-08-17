import { ArrowRight } from "lucide-react";

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary", // 'primary' or 'secondary'
  showArrow = false,
  disabled = false,
  className = "",
}) {
  const baseStyles =
    "w-full py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-[#B93325] hover:bg-[#a32c1f] text-white shadow-sm",
    secondary:
      "bg-transparent border border-theme-border text-theme-text hover:bg-theme-subtle",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      <span>{children}</span>
      {showArrow && <ArrowRight size={16} />}
    </button>
  );
}
