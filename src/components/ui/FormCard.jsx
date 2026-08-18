export default function FormCard({ children, className = "" }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6 transition-colors duration-200">
      <div
        className={`w-full max-w-[430px] bg-surface rounded-2xl shadow-sm border border-border border-t-4 border-t-primary p-6 sm:p-7 ${className}`}
      >
        {children}
      </div>
    </div>
  );
}
