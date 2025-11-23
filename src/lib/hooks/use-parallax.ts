// src/lib/hooks/use-parallax.ts
'use client';

import { useEffect, useRef } from 'react';
import { useSpring, type MotionValue } from 'framer-motion';

type UseParallaxReturn = {
  ref: React.RefObject<HTMLDivElement | null>;
  y: MotionValue<number>;
  scale: MotionValue<number>;
};

/**
 * Simple parallax hook:
 * - `strength`: how strong the movement is (0–1 good range)
 * - `invert`: reverse direction
 */
export default function useParallax(strength: number = 0.5, invert: boolean = false): UseParallaxReturn {
  const ref = useRef<HTMLDivElement | null>(null);

  // Motion values are created in render but updated in effects only
  const y = useSpring(0);
  const scale = useSpring(1);

  useEffect(() => {
    const handleScroll = () => {
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

      // Compute how far from viewport center the element is (-1 to 1)
      const center = rect.top + rect.height / 2;
      const progress = (center - viewportHeight / 2) / viewportHeight;
      const clamped = Math.max(-1, Math.min(1, progress));

      const distance = strength * 100;
      const direction = invert ? -1 : 1;
      const offset = direction * clamped * distance;

      y.set(offset);

      // Slight scale effect, strongest when centered
      const s = 1 + 0.05 * strength * (1 - Math.abs(clamped));
      scale.set(s);
    };

    // Initial calculation
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [strength, invert, y, scale]);

  return { ref, y, scale };
}
