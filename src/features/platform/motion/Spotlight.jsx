import React, { useRef, useState, useEffect } from 'react';
import { useReducedMotion } from 'motion/react';

export default function Spotlight({
  children,
  className = '',
  radius = 250,
  spotlightColor = 'rgba(var(--ink-rgb), 0.08)'
}) {
  const cardRef = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);
  const [isTouch, setIsTouch] = useState(false);
  const shouldReduce = useReducedMotion();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
    }
  }, []);

  const handlePointerMove = (e) => {
    if (isTouch || shouldReduce || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setOpacity(1);
  };

  const handlePointerLeave = () => {
    setOpacity(0);
  };

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`relative overflow-hidden group ${className}`}
    >
      {!isTouch && !shouldReduce && (
        <div
          className="pointer-events-none absolute -inset-px transition-opacity duration-300 z-10"
          style={{
            opacity,
            background: `radial-gradient(${radius}px circle at ${pos.x}px ${pos.y}px, ${spotlightColor}, transparent 80%)`
          }}
          aria-hidden="true"
        />
      )}
      {children}
    </div>
  );
}
