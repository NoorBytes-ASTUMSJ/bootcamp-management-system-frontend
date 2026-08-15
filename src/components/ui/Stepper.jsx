import React from "react";

export default function Stepper({ currentStep, totalSteps, stepTitle }) {
  return (
    <div className="flex flex-col items-center mb-6">
      <div className="text-[11px] tracking-widest uppercase font-semibold text-gray-500 dark:text-brand-dark-muted mb-2">
        STEP {currentStep} OF {totalSteps} {stepTitle ? `— ${stepTitle}` : ""}
      </div>
      <div className="flex items-center gap-2">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          return (
            <div
              key={stepNumber}
              className={`h-1 rounded-full transition-all duration-300 ${
                isActive
                  ? "w-8 bg-[#B93325]"
                  : "w-6 bg-gray-200 dark:bg-brand-dark-border"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
