import React from "react";
import { ChevronDown } from "lucide-react";

export default function SelectField({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder,
  required = false,
}) {
  return (
    <div className="w-full mb-3">
      {label && (
        <label className="block text-[10px] font-bold uppercase tracking-wider text-muted mb-1.5">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <select
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className="w-full bg-surface border border-border rounded-lg px-3.5 py-2.5 text-xs text-inherit focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors appearance-none cursor-pointer shadow-2xs"
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={14}
          className="absolute right-3 text-muted pointer-events-none"
        />
      </div>
    </div>
  );
}
