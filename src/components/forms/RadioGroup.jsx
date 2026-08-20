import React from "react";

export function RadioGroup({ label, name, value, onChange, options }) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
          {label}
        </label>
      )}
      <div className="flex items-center gap-6">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-center gap-2 cursor-pointer text-sm text-text-primary group"
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              className="w-4 h-4 text-primary bg-surface border-border focus:ring-primary focus:ring-2 cursor-pointer"
            />
            <span className="group-hover:text-primary transition-colors">
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
