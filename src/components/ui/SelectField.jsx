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
        <label className="block text-xs font-semibold uppercase tracking-wider text-text-primary mb-1.5">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <select
          name={name}
          value={value}
          onChange={onChange}
          required={required}
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
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3.5 pointer-events-none text-text-muted">
          <ChevronDown size={16} />
        </div>
      </div>
    </div>
  );
}
