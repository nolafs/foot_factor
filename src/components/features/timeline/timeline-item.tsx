'use client'
import React from 'react';
import {type TimelineSliceVerticalWithImagesPrimaryEventsItem} from '@/prismic-types';
import {motion, useAnimation} from 'framer-motion'
import {cn} from '@/lib/utils';
import {scrollLeftVariants, scrollRightVariants} from '@/utils/variants';
import {PrismicNextImage} from '@prismicio/next';
import {PrismicRichText} from '@prismicio/react';
import {useTextAnimation} from '@/lib/hooks/use-text-animation';

interface TimelineListItemProps {
    data: TimelineSliceVerticalWithImagesPrimaryEventsItem
    isEven?: boolean;
}

export const TimelineListItem = ({data, isEven = false}: TimelineListItemProps) => {

  const {containerRef, triggerRef, scheduleRefresh} = useTextAnimation({enabled: true, refreshDelay: 200});

  const lineControl = useAnimation();
  const handleAnimationComplete = () => {
    void lineControl.start({
       width: "14px",
       opacity: 1,
       transition: {duration: 0.5, ease: 'backOut'}
     });
  }

  return (
      <li  className="relative mb-10 grid w-full grid-cols-1 pl-10 last:mb-0 md:grid-cols-2 md:pl-0 lg:mb-[68px]">

        {!isEven && (<div></div>)}
          <motion.div
              className={cn('md:mx-7.5', !isEven && 'md:order-last', isEven && 'md:text-right')}
              initial="offscreen"
              whileInView="onscreen"
              viewport={{once: true, amount: 0.7}}
              variants={isEven ? scrollLeftVariants : scrollRightVariants}
              onAnimationStart={() => {
                scheduleRefresh();}}
              onAnimationComplete={handleAnimationComplete}
          >

              <div ref={triggerRef} className={cn('flex flex-col items-start gap-4', isEven ? 'md:pr-10 md:items-end' : 'md:pl-10 md:items-start')}>
                {data.image && (
                    <figure className={'aspect-w-16 aspect-h-9 w-full overflow-hidden rounded-2xl'}>
                      <PrismicNextImage
                          field={data.image}
                          width={662}
                          height={422}
                          fallbackAlt=""
                          imgixParams={{
                            fit: 'crop',
                            fm: 'webp',
                          }}
                          className="h-full w-full object-cover"
                      />
                    </figure>
                )}
                <div className={cn('relative flex flex-col md:flex-row gap-5 mt-5', isEven && 'md:flex-row-reverse')}>

                  <motion.div initial={{opacity: 0, width: 0}} animate={lineControl}
                      className={cn("absolute z-10 top-5 h-[2px] w-[14px] bg-secondary/50 ", isEven ? '-left-10 -translate-x-1/2 md:left-auto  md:!-right-10 md:translate-x-1/2' : 'md:-left-10 md:-translate-x-1/2' )}/>

                  <div className={'text-5xl font-heading text-accent'}>
                    {data.year}
                  </div>
                  <div className={'text-xl md:text-2xl'} ref={containerRef}>
                    <PrismicRichText field={data.description} />
                  </div>
                </div>
              </div>
          </motion.div>
      </li>
  )
}

export default TimelineListItem;
