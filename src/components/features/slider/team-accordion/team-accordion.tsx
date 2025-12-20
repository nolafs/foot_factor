'use client';
import React, { useState } from 'react';
import type { TeamCarouselSliceDefaultPrimaryMembersItem } from '@/prismic-types';
import { AnimatePresence, motion } from 'framer-motion';
import { PrismicRichText } from '@prismicio/react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PrismicNextImage } from '@prismicio/next';
import { isFilled } from '@prismicio/client';
import TeamVideo from '@/components/features/slider/team-slider/team-video';
import { cn } from '@/lib/utils';

interface TeamAccordionProps {
  data: TeamCarouselSliceDefaultPrimaryMembersItem[];
}

export const TeamAccordion = ({ data }: TeamAccordionProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className={'flex flex-col items-center justify-center'}>
      <div className="flex h-[50vh] w-full overflow-hidden bg-white">
        {data.map((item, index) => {
          const isActive = activeIndex === index;

          return (
            <motion.div
              key={item.name}
              className={`relative flex cursor-pointer`}
              initial={false}
              animate={{
                width: isActive ? '65%' : '15%',
              }}
              transition={{
                duration: 0.6,
                ease: [0.32, 0.72, 0, 1],
              }}
              onClick={() => setActiveIndex(index)}>
              {/* Header */}
              <div
                className={cn(
                  isActive ? 'hidden' : 'block flex w-10 flex-col items-center border-l-2 border-gray-200 bg-white p-2',
                )}>
                <div>
                  <PrismicNextImage
                    field={item.photo}
                    className="mb-2 h-5 w-5 rounded-full object-cover object-center"
                  />
                </div>

                <span
                  className="whitespace-nowrap text-sm font-medium text-primary"
                  style={{ writingMode: 'vertical-rl' }}>
                  {item.name}
                </span>
              </div>

              {/* Content */}
              <div className="relative flex-1 overflow-hidden">
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ x: '-100%' }}
                      animate={{ x: 0 }}
                      exit={{ x: '-100%' }}
                      transition={{
                        duration: 0.5,
                        ease: [0.32, 0.72, 0, 1],
                      }}
                      className="absolute inset-0 flex w-full flex-col justify-center bg-white text-primary">
                      <ScrollArea className="h-full w-[200px] overflow-y-auto border-l-2 border-gray-200 p-2">
                        <div className="flex items-center">
                          <h2 className="flex flex-col text-lg font-bold">
                            {item.name}
                            <span className="text-sm font-medium text-gray-500">{item.title}</span>
                          </h2>
                        </div>
                        <div className={'prose prose-sm !leading-tight'}>
                          <div className={'mb-4 h-auto w-full px-1'}>
                            {isFilled.embed(item.video) ? (
                              <TeamVideo
                                id={item.title ?? 'video'}
                                title={item.title ?? ''}
                                video={item.video}
                                image={item.photo}
                                loading={'lazy'}
                              />
                            ) : (
                              <PrismicNextImage
                                field={item.photo}
                                className={'overflow-hidde h-full w-full rounded-lg object-cover object-center'}
                              />
                            )}
                          </div>
                          <PrismicRichText field={item.bio} />
                        </div>
                      </ScrollArea>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Indicators */}
      <div className="mt-6 flex justify-center space-x-2">
        {data.map((_, index) => (
          <motion.button
            key={index}
            className={`h-3 w-3 rounded-full transition-colors ${
              activeIndex === index ? 'bg-slate-400' : 'bg-slate-100'
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default TeamAccordion;
