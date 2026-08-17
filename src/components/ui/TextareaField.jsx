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
        <label className="block text-[10px] font-bold tracking-wider text-theme-muted uppercase mb-1">
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
        className="w-full bg-theme-surface border border-theme-border rounded-lg px-3 py-2 text-sm text-theme-text placeholder:text-theme-muted/60 focus:outline-none focus:ring-1 focus:ring-[#B93325] focus:border-[#B93325] transition-all resize-none shadow-2xs"
      />
    </div>
  );
}
