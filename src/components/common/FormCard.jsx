import React from "react";

export default function FormCard({ children, className = "" }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6 transition-colors duration-200">
      <div
<<<<<<< HEAD
        className={`w-full max-w-[430px] bg-surface rounded-2xl shadow-xs border border-border border-t-4 border-t-primary p-6 sm:p-7 ${className}`}
=======
        className={`w-full max-w-107.5 bg-surface rounded-2xl shadow-sm border border-border border-t-4 border-t-primary p-6 sm:p-7 ${className}`}
>>>>>>> 27d492b4e1fef52818f4ac14ab1ed0e3ead2c914
      >
        {children}
      </div>
    </div>
  );
}
