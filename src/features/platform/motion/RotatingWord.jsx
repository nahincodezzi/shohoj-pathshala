import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';

export default function RotatingWord({
  words = ['অনলাইন ভর্তি', 'রেজাল্ট প্রকাশ', 'ফি আদায়', 'নোটিশ বোর্ড'],
  interval = 2200,
  className = ''
}) {
  const [index, setIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (words.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, interval);
    return () => clearInterval(timer);
  }, [words, interval]);

  const currentWord = words[index] || words[0] || '';

  if (shouldReduceMotion) {
    return <span className={`inline-block font-semibold text-primary-text ${className}`}>{currentWord}</span>;
  }

  return (
    <span className={`inline-flex relative overflow-hidden align-baseline ${className}`} style={{ minWidth: '95px' }}>
      <AnimatePresence mode="wait">
        <motion.span
          key={currentWord + index}
          initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block whitespace-nowrap font-bold text-primary-text"
        >
          {currentWord}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
