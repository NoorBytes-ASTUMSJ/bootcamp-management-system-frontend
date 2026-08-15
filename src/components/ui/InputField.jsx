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
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-brand-dark-text mb-1.5">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3 text-gray-400 dark:text-brand-dark-muted">
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
          className={`w-full bg-white dark:bg-brand-dark-surface border border-gray-200 dark:border-brand-dark-border rounded-lg px-3.5 py-2.5 text-sm text-gray-900 dark:text-brand-dark-text placeholder:text-gray-400 dark:placeholder:text-brand-dark-muted/60 focus:outline-none focus:ring-1 focus:ring-[#B93325] focus:border-[#B93325] transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)] ${
            Icon ? "pl-9" : ""
          } ${isPassword ? "pr-9" : ""}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 text-gray-400 hover:text-gray-600 dark:hover:text-brand-dark-text focus:outline-none"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
    </div>
  );
}
