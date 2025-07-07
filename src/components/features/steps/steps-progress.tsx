'use client';

import {useRef} from 'react';
import {gsap} from 'gsap';
import {useGSAP} from '@gsap/react';

const StepsProgress = ({
                            percentage = 0,
                            size = 120,
                            strokeWidth = 8,
                            color = '#3b82f6',
                            backgroundColor = '#e5e7eb',
                            textColor = '#3b82f6',
                            showText = true,
                            duration = 1.5,
                            className = '',
                            style = {}
                          }) => {
  const circleRef = useRef(null);
  const textRef = useRef(null);
  const containerRef = useRef(null);

  // Calculate circle properties
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  useGSAP(() => {
    const circle = circleRef.current;
    const text = textRef.current;
    const container = containerRef.current;

    if (!circle) return;

    const offset = circumference - (percentage / 100) * circumference;

    // Create GSAP timeline
    const tl = gsap.timeline();

    // Animate the stroke-dashoffset
    tl.to(circle, {
      strokeDashoffset: offset,
      duration: duration,
      ease: "power2.out"
    });


    // Add subtle scale animation
    tl.to(container, {
      scale: 1.05,
      duration: 0.2,
      ease: "power2.out",
      yoyo: true,
      repeat: 1
    }, 0);
  }, {dependencies: [percentage, duration, circumference, showText], scope: containerRef});

  return (
      <div
          ref={containerRef}
          className={`relative inline-flex items-center justify-center ${className}`}
          style={{width: size, height: size, ...style}}
      >
        <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="transform"
        >
          {/* Background Circle */}
          <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={backgroundColor}
              strokeWidth={strokeWidth}
              opacity={0.3}
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
              className="transition-all duration-300"
          />
        </svg>

        {/* Progress Text */}
        {showText && (
            <div className="absolute inset-0 flex items-center justify-center">
          <span
              ref={textRef}
              className="font-semibold"
              style={{
                color: textColor,
                fontSize: `${size * 0.2}px`
              }}
          >
            0
          </span>
            </div>
        )}
      </div>
  );
};

export default StepsProgress;
