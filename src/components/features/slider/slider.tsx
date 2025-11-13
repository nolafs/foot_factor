'use client';
import React, {useEffect, useRef, useState} from 'react';
import useMeasure from 'react-use-measure';
import {useMotionValueEvent, useScroll} from 'framer-motion';
import { cn } from '@/lib/utils';

export type SliderControlItem = {
    title: string;
}

interface SliderProps {
    data?: SliderControlItem[];
    children?: React.ReactNode;
    size?: 'default' | 'large';
}

export const Slider = ({children, data}: SliderProps) => {
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const [setReferenceWindowRef] = useMeasure();
    const {scrollX} = useScroll({container: scrollRef});
    const [activeIndex, setActiveIndex] = useState(0);

    useMotionValueEvent(scrollX, 'change', x => {
        if (scrollRef.current?.children[0]) {
            setActiveIndex(Math.floor(x / scrollRef.current.children[0].clientWidth));
        }
    });

  function scrollTo(index: number) {
    const container = scrollRef.current;
    if (!container) return;

    const child = container.children[index] as HTMLElement;
    if (!child) return;

    const containerWidth = container.offsetWidth;
    const childWidth = child.offsetWidth;

    // Get child's left offset relative to container
    const offsetLeft = child.offsetLeft;

    // Scroll so the selected child is centered
    const scrollPosition = offsetLeft - containerWidth / 2 + childWidth / 2;

    container.scrollTo({left: scrollPosition, behavior: 'smooth'});
  }

    useEffect(() => {
      if (data && data.length > 0) {
        const centerIndex = Math.floor(data.length / 2);
        scrollTo(centerIndex);
      }
    }, [data]);


    return (
      <div ref={setReferenceWindowRef} className={cn('relative' )} data-active={activeIndex}>
          <div
              ref={scrollRef}
              className={cn([
                  'flex items-stretch pb-10 pt-5',
                  '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
                  'snap-x snap-mandatory overflow-y-visible  overflow-x-auto overscroll-x-contain scroll-smooth',
              ])}>
              {children}
          </div>
      </div>
  )
}

export default Slider;
