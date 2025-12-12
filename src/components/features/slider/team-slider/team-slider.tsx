'use client';
import React, { useRef, useState } from 'react';
import { type TeamCarouselSliceDefaultPrimaryMembersItem } from '@/prismic-types';
import TeamCard from '@/components/features/slider/team-slider/team-card';
import { useMotionValueEvent, useScroll } from 'framer-motion';
import useMeasure from 'react-use-measure';
import { clsx } from 'clsx';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';

interface TeamSliderProps {
  data: TeamCarouselSliceDefaultPrimaryMembersItem[];
}

export const TeamSlider = ({ data }: TeamSliderProps) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const { scrollX } = useScroll({ container: scrollRef });
  const [setReferenceWindowRef, bounds] = useMeasure();
  const [activeIndex, setActiveIndex] = useState(0);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);

  useMotionValueEvent(scrollX, 'change', x => {
    if (scrollRef.current?.children[0]) {
      setActiveIndex(Math.floor(x / scrollRef.current.children[0].clientWidth));
    }
  });

  function scrollTo(index: number) {
    const gap = 32;
    const width = (scrollRef.current!.children[0] as HTMLElement).offsetWidth;
    scrollRef.current!.scrollTo({ left: (width + gap) * index });
  }

  const onExpand = (id: string, isExpanded: boolean) => {
    //close other if open
    setExpandedId(isExpanded ? id : null);
  };

  return (
    <div ref={setReferenceWindowRef} className={'relative'}>
      <div
        ref={scrollRef}
        className={clsx([
          'flex gap-2 px-[var(--scroll-padding)] py-7',
          '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
          'snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-smooth',
          '[--scroll-padding:max(theme(spacing.6),calc((100vw-theme(maxWidth.2xl))/2))] lg:[--scroll-padding:max(theme(spacing.8),calc((100vw-theme(maxWidth.7xl))/2))]',
        ])}>
        {data.map((member, idx) => {
          const videoId = 'member_' + idx;
          return (
            <TeamCard
              data={member}
              id={videoId}
              key={videoId}
              scrollX={scrollX}
              bounds={bounds}
              currentExpanded={expandedId}
              onExpand={onExpand}
              onClick={() => scrollTo(idx)}
              isActive={currentVideoId === videoId}
              onPlay={() => {
                // Toggle video: if it's already playing, stop it (e.g., when video ends)
                // Otherwise, start playing this video and stop any other
                setCurrentVideoId(currentVideoId === videoId ? null : videoId);
              }}
            />
          );
        })}
      </div>
      <Container className="mt-1">
        <div className="hidden justify-center sm:flex sm:gap-2">
          {data.map((item, idx) => (
            <TooltipProvider key={`${String(item.title).replace(' ', '-')}-${idx}`}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => scrollTo(idx)}
                    size={'icon'}
                    data-active={activeIndex === idx ? true : undefined}
                    aria-label={`Scroll to from ${item.title}`}
                    className={clsx(
                      'size-2.5 rounded-full border border-transparent bg-gray-300 transition',
                      'data-[active]:bg-gray-400 data-[hover]:bg-gray-400',
                      'forced-colors:data-[active]:bg-[Highlight] forced-colors:data-[focus]:outline-offset-4',
                    )}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{item.title}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default TeamSlider;
