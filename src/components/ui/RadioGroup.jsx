export default function RadioGroup({
  label,
  name,
  options = [],
  value,
  onChange,
}) {
  return (
    <div className="w-full mb-3">
      {label && (
        <label className="block text-[10px] font-bold tracking-wider text-theme-muted uppercase mb-1.5">
          {label}
        </label>
      )}
      <div className="grid grid-cols-2 gap-3">
        {options.map((option) => {
          const isSelected = value === option.value;
          return (
            <label
              key={option.value}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg border cursor-pointer transition-all ${
                isSelected
                  ? "border-[#B93325] bg-[#B93325]/5 text-theme-text"
                  : "border-theme-border bg-theme-surface text-theme-muted hover:border-theme-border-subtle"
              }`}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={isSelected}
                onChange={() => onChange(option.value)}
                className="hidden"
              />
              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                  isSelected ? "border-[#B93325]" : "border-theme-border-subtle"
                }`}
              >
                {isSelected && (
                  <div className="w-2 h-2 rounded-full bg-[#B93325]" />
                )}
              </div>
              <span className="text-sm font-medium">{option.label}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
