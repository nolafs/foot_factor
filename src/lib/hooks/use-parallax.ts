// src/lib/hooks/use-parallax.ts
'use client';

import { useRef } from 'react';
import { useScroll, useTransform, type MotionValue } from 'framer-motion';

type UseParallaxReturn = {
  ref: React.RefObject<HTMLDivElement>;
  y: MotionValue<number>;
  scale: MotionValue<number>;
};

/**
 * Parallax hook using Framer Motion's useScroll.
 *
 * @param strength How strong the parallax effect is (0–1 is usually nice).
 * @param invert If true, moves in the opposite direction.
 */
export default function useParallax(strength: number = 0.5, invert: boolean = false): UseParallaxReturn {
  // Ref object – note the non-null assertion just for TS
  const ref = useRef<HTMLDivElement>(null!);

  // Framer handles scroll + DOM for us (no manual ref.current reads in render)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const distance = 100 * strength;

  const from = invert ? distance : -distance;
  const to = invert ? -distance : distance;

  const y = useTransform(scrollYProgress, [0, 1], [from, to]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1 + 0.05 * strength]);

  return { ref, y, scale };
}
