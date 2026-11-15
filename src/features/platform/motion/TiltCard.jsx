import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'motion/react';

export default function TiltCard({
  children,
  className = '',
  initialRotateX = 6,
  initialRotateY = -14,
  maxTilt = 6
}) {
  const ref = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const shouldReduce = useReducedMotion();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
    }
  }, []);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 200, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 200, damping: 25 });

  const handleMouseMove = (e) => {
    if (!ref.current || isTouch || shouldReduce) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Range -0.5 to 0.5
    const xPct = (mouseX / width) - 0.5;
    const yPct = (mouseY / height) - 0.5;

    x.set(xPct * (maxTilt * 2));
    y.set(-yPct * (maxTilt * 2));
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  if (isTouch || shouldReduce) {
    return (
      <div className={className}>
        {children}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1400 }}
      className="relative"
    >
      <motion.div
        animate={isHovered ? {
          rotateX: 0,
          rotateY: 0,
          scale: 1.02
        } : {
          rotateX: initialRotateX,
          rotateY: initialRotateY,
          scale: 1
        }}
        style={{
          rotateX: isHovered ? mouseYSpring : undefined,
          rotateY: isHovered ? mouseXSpring : undefined,
          transformStyle: 'preserve-3d'
        }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={className}
      >
        {children}
      </motion.div>
    </div>
  );
}
