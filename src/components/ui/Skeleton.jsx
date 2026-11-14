import React from 'react';

export default function Skeleton({
  className = '',
  width,
  height,
  circle = false,
  ...props
}) {
  const style = {
    width: width || undefined,
    height: height || undefined,
  };

  return (
    <div
      aria-hidden="true"
      style={style}
      className={`animate-pulse bg-border-strong/60 ${
        circle ? 'rounded-full' : 'rounded-lg'
      } ${className}`}
      {...props}
    />
  );
}
