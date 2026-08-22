import React from "react";

<<<<<<< HEAD
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
=======
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
>>>>>>> 27d492b4e1fef52818f4ac14ab1ed0e3ead2c914
      </div>
    </div>
  );
}
