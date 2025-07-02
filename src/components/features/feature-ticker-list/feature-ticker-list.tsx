'use client';
import React, {useRef, useMemo, useEffect, useState} from 'react';

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity
} from 'framer-motion';
import {wrap} from '@motionone/utils';
import {IconNavListSliceDefaultPrimaryItemsItem} from '@/prismic-types';
import cn from 'clsx';
import {PrismicNextImage, PrismicNextLink} from '@prismicio/next';
import {isFilled} from '@prismicio/client';

interface FeatureTickerListProps {
  data: IconNavListSliceDefaultPrimaryItemsItem[],
  baseVelocity?: number;
}

export const FeatureTickerList = ({data, baseVelocity = 10}: FeatureTickerListProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentWidth, setContentWidth] = useState<number>(0);

  const baseX = useMotionValue(0);
  const {scrollY} = useScroll();
  const directionFactor = useRef<number>(1);
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false
  });

  // Measure the actual content width
  useEffect(() => {
    const measureContent = () => {
      if (contentRef.current && containerRef.current) {
        // Get the width of just the original items (first half)
        const singleSetWidth = contentRef.current.scrollWidth / 2;
        const containerWidth = containerRef.current.offsetWidth;
        const widthPercentage = (singleSetWidth / containerWidth) * 100;
        setContentWidth(widthPercentage);
      }
    };

    measureContent();

    const resizeObserver = new ResizeObserver(measureContent);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [data]);

  // Wrap based on actual measured content width
  const x = useTransform(baseX, (v) => contentWidth > 0 ? `${wrap(0, -contentWidth, v)}%` : `${v}%`);

  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();

    baseX.set(baseX.get() + moveBy);
  });

  // Create repeated data for seamless loop - just double it
  const repeatedData = useMemo(() => {
    return [...data, ...data, ...data, ...data]; // Repeat 4 times for seamless effect
  }, [data]);

  return (
      <>
      <div ref={containerRef} className={'w-full overflow-hidden pt-16 md:pt-24 lg:pt-32'}>
        <motion.div
            ref={contentRef}
            className={'flex no-white-space flex-nowrap gap-36'}
            style={{x}}>
          {repeatedData.map((item, idx) => (
              <FeatureTickerListItem key={idx} style={idx % 2} item={item}/>
          ))}
        </motion.div>
      </div>
      </>
  )
}

const FeatureTickerListItem = ({item , style}: { item: IconNavListSliceDefaultPrimaryItemsItem, style: number }) => {

  console.log('FeatureTickerListItem', item, style, isFilled.link(item.link));

  const containerStyle = cn('border w-fit flex-shrink-0 border-primary rounded-full text-2xl md:text-3xl lg:text-4xl text-secondary italic uppercase flex items-center justify-center',
      style === 0 ? 'bg-primary text-white' : 'text-primary border-accent');

  const label = () => {
    return (
      <div className={'flex justify-center items-center whitespace-nowrap flex-nowrap gap-4 px-8 py-4 md:px-8 md:py-4 lg:px-16 lg:py-8'}>
        <PrismicNextImage field={item.icon}
        className={cn('h-6 w-6 md:h-8 md:w-8 lg:h-10 lg:w-10', style === 1 ? 'brightness-[92%] saturate-[3109%] invert-[10%] sepia-[43%] hue-rotate-180 contrast-[101%]' : 'invert')}/>
        <span>{item.label}</span></div>)
  }

  return (isFilled.link(item.link) ? <PrismicNextLink field={item.link} className={cn(containerStyle)} >{label()}</PrismicNextLink> :
      <div className={containerStyle}>
        {label()}
      </div>
  );
}

export default FeatureTickerList;
