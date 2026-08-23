import React, { useState } from "react";
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
        <label className="block text-[10px] font-bold uppercase tracking-wider text-muted mb-1.5">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3 text-muted pointer-events-none">
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
          className={`w-full bg-surface border border-border rounded-lg py-2.5 text-xs text-inherit placeholder:text-muted/60 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors shadow-2xs ${
            Icon ? "pl-9" : "px-3.5"
          } ${isPassword ? "pr-9" : "px-3.5"}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 text-muted hover:text-primary transition-colors focus:outline-none cursor-pointer"
          >
            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
    </div>
  );
}
