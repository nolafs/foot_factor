'use client';

import React from 'react';
import useParallax from '@/lib/hooks/use-parallax';
import { motion } from 'framer-motion';

export default function ParallaxAnim({ children }: { children?: React.ReactNode }) {
  const { ref, y, scale } = useParallax(1.2, true);

  return (
    <div className={'relative isolate h-screen w-full overflow-hidden'}>
      <motion.div
        ref={ref}
        style={{
          y,
        }}
        className="absolute inset-0 z-10">
        {children}
      </motion.div>
    </div>
  );
}
