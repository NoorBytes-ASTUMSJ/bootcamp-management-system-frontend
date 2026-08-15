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
        <label className="block text-[10px] font-bold tracking-wider text-gray-500 dark:text-brand-dark-muted uppercase mb-1.5">
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
                  ? "border-brand bg-brand/5 dark:bg-brand/10 text-gray-900 dark:text-brand-dark-text"
                  : "border-gray-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-surface text-gray-700 dark:text-brand-dark-muted hover:border-gray-300"
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
                  isSelected
                    ? "border-brand"
                    : "border-gray-300 dark:border-brand-dark-border"
                }`}
              >
                {isSelected && (
                  <div className="w-2 h-2 rounded-full bg-brand" />
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
