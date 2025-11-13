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
import {
  type IconNavListSliceLogoTickerPrimaryItemsItem
} from '@/prismic-types';
import {PrismicNextImage, PrismicNextLink} from '@prismicio/next';
import {isFilled} from '@prismicio/client';

interface LogoTickerListProps {
  data: IconNavListSliceLogoTickerPrimaryItemsItem[],
  baseVelocity?: number;
}

export const LogoTickerList = ({data, baseVelocity = 10}: LogoTickerListProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
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
      <div ref={containerRef} className={'w-full overflow-hidden'}>
        <motion.div
            ref={contentRef}
            className={'flex no-white-space flex-nowrap item-center gap-x-20'}
            style={{x}}>
          {repeatedData.map((item, idx) => (
              <LogoTickerListItem key={idx} item={item}/>
          ))}
        </motion.div>
      </div>
      </>
  )
}

const LogoTickerListItem = ({item}: { item: IconNavListSliceLogoTickerPrimaryItemsItem }) => {

  console.log('LogoTickerListItem', item, isFilled.link(item.link));


  return (<div className={'flex justify-center min-w-[331px] min-h-[331px]'}> {isFilled.link(item.link) ? <PrismicNextLink field={item.link}>
        <PrismicNextImage field={item.icon} width={331} height={331} className={'w-full h-auto '} />
      </PrismicNextLink> : <div><PrismicNextImage field={item.icon} width={331} height={331} /></div>}</div>

  );
}

export default LogoTickerList;
