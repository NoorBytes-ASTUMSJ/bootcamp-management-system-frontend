export default function FormCard({ children, className = "" }) {
  return (
    <div className="min-h-screen bg-theme-bg flex items-center justify-center p-4 sm:p-6 transition-colors duration-200">
      <div
        className={`w-full max-w-[430px] bg-theme-surface rounded-2xl shadow-sm border border-theme-border border-t-4 border-t-[#B93325] p-6 sm:p-7 ${className}`}
      >
        {children}
      </div>
    </div>
  );
}
