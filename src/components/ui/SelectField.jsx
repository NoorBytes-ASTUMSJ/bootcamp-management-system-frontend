import { ChevronDown } from "lucide-react";

export default function SelectField({
  label,
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
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-brand-dark-text mb-1.5">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <select
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className="w-full bg-white dark:bg-brand-dark-surface border border-gray-200 dark:border-brand-dark-border rounded-lg px-3.5 py-2.5 text-sm text-gray-900 dark:text-brand-dark-text appearance-none focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand transition-all cursor-pointer"
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3.5 pointer-events-none text-gray-400 dark:text-brand-dark-muted">
          <ChevronDown size={16} />
        </div>
      </div>
    </div>
  );
}
