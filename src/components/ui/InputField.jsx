import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function InputField({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  name,
  icon: Icon,
  required = false,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="w-full mb-3">
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-theme-text mb-1.5">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3 text-theme-muted">
            <Icon size={15} />
          </div>
        )}
        <input
          type={isPassword ? (showPassword ? "text" : "password") : type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full bg-theme-surface border border-theme-border rounded-lg px-3.5 py-2.5 text-sm text-theme-text placeholder:text-theme-muted/60 focus:outline-none focus:ring-1 focus:ring-[#B93325] focus:border-[#B93325] transition-all shadow-2xs ${
            Icon ? "pl-9" : ""
          } ${isPassword ? "pr-9" : ""}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 text-theme-muted hover:text-theme-text focus:outline-none cursor-pointer"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
    </div>
  );
}
