import React, { useState, useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';

// Converts English digits to Bengali digits
export function toBengaliNum(n) {
  if (n === null || n === undefined) return '';
  const str = String(n);
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return str.replace(/[0-9]/g, (w) => bengaliDigits[+w]);
}

export default function CountUp({
  to = 0,
  duration = 0.9,
  prefix = '',
  suffix = '',
  isBengali = true,
  className = ''
}) {
  const [val, setVal] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  const isNumeric = typeof to === 'number' || (!isNaN(Number(to)) && to !== '');
  const numericTarget = isNumeric ? Number(to) : null;

  useEffect(() => {
    if (shouldReduceMotion || !isNumeric) {
      setVal(numericTarget ?? to);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let startTime = null;

          const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const elapsed = (timestamp - startTime) / 1000;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(easeOut * numericTarget);
            setVal(current);

            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              setVal(numericTarget);
            }
          };

          requestAnimationFrame(step);
        }
      },
      { threshold: 0.25 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [numericTarget, duration, hasAnimated, shouldReduceMotion, isNumeric, to]);

  if (!isNumeric) {
    return <span className={className}>{prefix}{to}{suffix}</span>;
  }

  const formattedNum = isBengali ? toBengaliNum(val) : val;

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {prefix}{formattedNum}{suffix}
    </span>
  );
}
