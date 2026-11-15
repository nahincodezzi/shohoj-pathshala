import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

export function Reveal({
  children,
  className = '',
  delay = 0,
  y = 28,
  amount = 0.2
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{
        duration: shouldReduceMotion ? 0.3 : 0.8,
        delay,
        ease: [0.22, 1, 0.36, 1]
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default Reveal;
