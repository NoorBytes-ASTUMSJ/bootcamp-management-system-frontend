export default function FormCard({ children, className = "" }) {
  return (
    <div className="min-h-screen bg-[#FBFBFC] dark:bg-brand-dark-bg flex items-center justify-center p-4 sm:p-6 transition-colors duration-200">
      <div
        className={`w-full max-w-[430px] bg-white dark:bg-brand-dark-surface rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/80 dark:border-brand-dark-border border-t-4 border-t-[#B93325] p-6 sm:p-7 ${className}`}
      >
        {children}
      </div>
    </div>
  );
}
