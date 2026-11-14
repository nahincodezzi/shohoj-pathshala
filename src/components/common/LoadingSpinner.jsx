import React from 'react';

export default function LoadingSpinner({ fullScreen = true, text = 'লোড হচ্ছে...' }) {
  if (!fullScreen) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center space-y-3">
        <div className="w-8 h-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
        <span className="text-xs text-muted font-medium">{text}</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-6 text-center">
      {/* Top indeterminate glowing line */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-surface-2 overflow-hidden z-50">
        <div className="h-full bg-primary animate-[pulse_1.2s_ease-in-out_infinite] w-full" />
      </div>

      <div className="flex flex-col items-center space-y-4">
        {/* Animated Brand Emblem */}
        <div className="w-12 h-12 rounded-2xl bg-primary text-on-primary font-heading font-bold text-xl flex items-center justify-center shadow-lg animate-pulse">
          সপ
        </div>
        <div className="w-6 h-6 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
        <p className="text-xs text-muted font-medium tracking-wide">
          {text}
        </p>
      </div>
    </div>
  );
}

