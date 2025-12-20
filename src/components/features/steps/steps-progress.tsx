'use client';

import { useRef, useEffect } from 'react';

const StepsProgress = ({
  percentage = 0,
  size = 100,
  strokeWidth = 3,
  color = '#6C9EBF',
  backgroundColor = '#E9EFF5',
  textColor = '#6C9EBF',
  text = 0,
  showText = true,
  duration = 0.3,
  className = '',
  style = {},
}) => {
  const circleRef = useRef<SVGCircleElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate circle properties
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  // Calculate the offset based on percentage
  const offset = circumference - (percentage / 100) * circumference;

  // Smooth update without animation jumps
  useEffect(() => {
    const circle = circleRef.current;
    if (!circle) return;

    // Use requestAnimationFrame for smooth updates synced with browser paint
    requestAnimationFrame(() => {
      circle.style.strokeDashoffset = `${offset}`;
    });
  }, [offset]);

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size, ...style }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform">
        {/* Background Circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          opacity={1}
        />

        {/* Progress Circle */}
        <circle
          ref={circleRef}
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          transform={`rotate(-90 ${center} ${center})`}
          style={{
            transition: 'stroke-dashoffset 0.1s linear',
            willChange: 'stroke-dashoffset',
          }}
        />

        <circle cx={center} cy={center} r={radius} fill="white" />
      </svg>

      {/* Progress Text */}
      {showText && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            ref={textRef}
            className="font-semibold"
            style={{
              color: textColor,
              fontSize: `${size * 0.2}px`,
            }}>
            {text !== 0 ? (text < 10 ? '0' + text : text) : `${percentage}%`}
          </span>
        </div>
      )}
    </div>
  );
};

export default StepsProgress;
