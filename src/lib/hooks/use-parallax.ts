import React, {useEffect, useRef} from 'react';
import {motion, useScroll, useTransform, useSpring} from 'framer-motion';


// Custom hook for parallax scrolling
const useParallax = (speed = 0.5, smooth = true, scale: number | null  = null) => {
  const ref = useRef(null);

  const {scrollYProgress} = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Transform scroll progress to parallax offset
  const y = useTransform(scrollYProgress, [0, 1], [-100 * speed, 100 * speed]);

  // Optional smooth spring animation
  const smoothY = useSpring(y, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Auto-calculate scale based on parallax speed if not provided
  const autoScale = 1 + (Math.abs(speed) * 0.2);
  const finalScale = scale ?? autoScale;

  return {
    ref,
    y: smooth ? smoothY : y,
    scale: finalScale,
    scrollProgress: scrollYProgress
  };
};

export default useParallax;
