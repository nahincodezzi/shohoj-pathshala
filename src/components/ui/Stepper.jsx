import React from 'react';

export default function Stepper({
  steps = ['শিক্ষার্থী', 'অভিভাবক', 'যাচাই ও প্রবেশপত্র'],
  currentStep = 1, // 1-indexed
  className = ''
}) {
  return (
    <div className={`w-full flex flex-col gap-2.5 ${className}`}>
      {/* Bars */}
      <div className="grid grid-cols-3 gap-2 w-full">
        {steps.map((_, index) => {
          const stepNum = index + 1;
          const isDoneOrActive = stepNum <= currentStep;
          return (
            <div
              key={index}
              className={`h-1.5 rounded-full transition-colors duration-300 ${
                isDoneOrActive ? 'bg-primary' : 'bg-border-strong'
              }`}
            />
          );
        })}
      </div>

      {/* Label */}
      <div className="flex items-center justify-between text-xs sm:text-sm font-medium text-muted">
        <span>
          ধাপ {currentStep} · <strong className="text-text">{steps[currentStep - 1]}</strong>
        </span>
        <span className="font-mono text-xs text-subtle">
          {currentStep} / {steps.length}
        </span>
      </div>
    </div>
  );
}

