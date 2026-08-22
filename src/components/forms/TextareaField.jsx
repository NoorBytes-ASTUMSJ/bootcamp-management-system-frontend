import React from "react";

export default function TextareaField({
  label,
  name,
  value,
  onChange,
  placeholder,
  rows = 3,
  required = false,
}) {
  return (
    <div className="w-full mb-3">
      {label && (
        <label className="block text-[10px] font-bold uppercase tracking-wider text-muted mb-1.5">
          {label}
        </label>
      )}
      <textarea
        name={name}
        rows={rows}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full bg-surface border border-border rounded-lg px-3.5 py-2.5 text-xs text-inherit placeholder:text-muted/60 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors resize-none shadow-2xs"
      />
    </div>
  );
}
