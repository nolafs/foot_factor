'use client';

import { useRef, useState, useMemo } from 'react';
import { useMotionValue, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion';

type Opts = {
    speed?: number;
    smooth?: boolean;
    scale?: number | null;
    offset?: NonNullable<Parameters<typeof useScroll>[0]>['offset'];
};

type Ret<T extends HTMLElement> = {
    ref: (el: T | null) => void;        // callback ref
    y: MotionValue<number>;
    scale: number;
    scrollProgress: MotionValue<number>;
};

export default function useParallax<T extends HTMLElement = HTMLDivElement>(p0: number, p1: boolean, {
    speed = 0.5, smooth = true, scale = null, offset = ['start end', 'end start'] as const,
}: Opts = {}): Ret<T> {
    const [el, setEl] = useState<T | null>(null);          // ← element exists only after mount
    const fallback = useMotionValue(0);

    // Pass target **only** when we have the element
    const { scrollYProgress } = useScroll({
        target: el ? { current: el } : undefined,
        offset,
    });

    const progress = el ? scrollYProgress : fallback;

    const distance = 100 * Math.abs(speed);
    const sign = Math.sign(speed || 1);

    const yRaw = useTransform(progress, [0, 1], [-distance * sign, distance * sign]);
    const y = smooth ? useSpring(yRaw, { stiffness: 100, damping: 30, restDelta: 0.001 }) : yRaw;

    const finalScale = useMemo(() => (scale ?? 1 + Math.abs(speed) * 0.5), [scale, speed]);

    return { ref: setEl, y, scale: finalScale, scrollProgress: progress };
}

