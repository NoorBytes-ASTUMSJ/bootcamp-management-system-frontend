import React from "react";

export default function RadioGroup({
  label,
  name,
  value,
  onChange,
  options = [],
}) {
  return (
    <div className="w-full mb-4">
      {label && (
        <label className="block text-[10px] font-bold uppercase tracking-wider text-muted mb-2">
          {label}
        </label>
      )}
      <div className="flex items-center gap-3">
        {options.map((opt) => {
          const isChecked = value === opt.value;
          return (
            <label
              key={opt.value}
              className={`flex-1 flex items-center justify-center px-4 py-2.5 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${
                isChecked
                  ? "bg-secondary border-primary text-primary font-semibold"
                  : "bg-surface border-border text-inherit hover:bg-surface-subtle"
              }`}
            >
              <input
                type="radio"
                name={name}
                value={opt.value}
                checked={isChecked}
                onChange={() => onChange(opt.value)}
                className="hidden"
              />
              <span>{opt.label}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
