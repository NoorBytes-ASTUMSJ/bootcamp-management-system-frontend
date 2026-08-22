<<<<<<< HEAD
import React from "react";
=======
>>>>>>> 27d492b4e1fef52818f4ac14ab1ed0e3ead2c914
import { ChevronDown } from "lucide-react";

export default function SelectField({
  label,
<<<<<<< HEAD
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
=======
  value,
  onChange,
  name,
  options = [],
  placeholder = "Select an option",
  required = false,
}) {
  return (
    <div className="w-full mb-4">
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-text-primary mb-1.5">
>>>>>>> 27d492b4e1fef52818f4ac14ab1ed0e3ead2c914
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <select
          name={name}
          value={value}
          onChange={onChange}
          required={required}
<<<<<<< HEAD
          className="w-full bg-surface border border-border rounded-lg px-3.5 py-2.5 text-xs text-inherit focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors appearance-none cursor-pointer shadow-2xs"
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
=======
          className="w-full bg-surface border border-border rounded-lg px-3.5 py-2.5 text-sm text-text-primary appearance-none focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors cursor-pointer shadow-2xs"
        >
          <option value="" disabled className="bg-surface text-text-muted">
            {placeholder}
          </option>
          {options.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              className="bg-surface text-text-primary"
            >
>>>>>>> 27d492b4e1fef52818f4ac14ab1ed0e3ead2c914
              {opt.label}
            </option>
          ))}
        </select>
<<<<<<< HEAD
        <ChevronDown
          size={14}
          className="absolute right-3 text-muted pointer-events-none"
        />
=======
        <div className="absolute right-3.5 pointer-events-none text-text-muted">
          <ChevronDown size={16} />
        </div>
>>>>>>> 27d492b4e1fef52818f4ac14ab1ed0e3ead2c914
      </div>
    </div>
  );
}
