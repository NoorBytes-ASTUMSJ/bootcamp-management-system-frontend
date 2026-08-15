export default function TextareaField({
  label,
  name,
  placeholder,
  value,
  onChange,
  rows = 3,
  required = false,
}) {
  return (
    <div className="w-full mb-3">
      {label && (
        <label className="block text-[10px] font-bold tracking-wider text-gray-500 dark:text-brand-dark-muted uppercase mb-1">
          {label}
        </label>
      )}
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        required={required}
        className="w-full bg-white dark:bg-brand-dark-surface border border-gray-200 dark:border-brand-dark-border rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-brand-dark-text placeholder:text-gray-400 dark:placeholder:text-brand-dark-muted/60 focus:outline-none focus:ring-1 focus:ring-[#B93325] focus:border-[#B93325] transition-all resize-none shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
      />
    </div>
  );
}
