'use client';
import React, { useCallback, useLayoutEffect, useRef, forwardRef } from 'react';
import { type TeamCarouselSliceDefaultPrimaryMembersItem } from '@/prismic-types';
import { PrismicNextImage } from '@prismicio/next';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { PrismicRichText } from '@prismicio/react';
import { type HTMLMotionProps, motion, type MotionValue, useMotionValueEvent, useSpring } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { isFilled } from '@prismicio/client';
import TeamVideo from '@/components/features/slider/team-slider/team-video';
import type { RectReadOnly } from 'react-use-measure';

interface TeamCardProps {
  id: string;
  data: TeamCarouselSliceDefaultPrimaryMembersItem;
  bounds: RectReadOnly;
  scrollX: MotionValue<number>;
  onExpand?: (id: string, isExpanded: boolean) => void;
  onPlaying?: () => void;
  currentExpanded?: string | null;
  isActive: boolean;
  onPlay: () => void;
}

// Helper: pure(ish) function that *still* reads DOM, but only used in effects
function computeOpacityFor(element: HTMLElement, bounds: RectReadOnly): number {
  if (!element || bounds.width === 0) return 1;

  const rect = element.getBoundingClientRect();

  if (rect.left < bounds.left) {
    const diff = bounds.left - rect.left;
    const percent = diff / rect.width;
    return Math.max(0.5, 1 - percent);
  } else if (rect.right > bounds.right) {
    const diff = rect.right - bounds.right;
    const percent = diff / rect.width;
    return Math.max(0.5, 1 - percent);
  } else {
    return 1;
  }
}

export const TeamCard = forwardRef<HTMLDivElement, TeamCardProps & HTMLMotionProps<'div'>>(
  ({ id, data, bounds, scrollX, onExpand, currentExpanded, isActive, onPlay }, forwardedRef) => {
    const localRef = useRef<HTMLDivElement>(null);

    // Merge the forwarded ref with the local ref
    useLayoutEffect(() => {
      if (!forwardedRef) return;

      if (typeof forwardedRef === 'function') {
        forwardedRef(localRef.current);
      } else {
        forwardedRef.current = localRef.current;
      }
    }, [forwardedRef]);

    // 🔹 1. Derive expansion from parent-controlled state
    const isExpanded = currentExpanded === id;

    // 🔹 2. Spring with static initial value
    const opacity = useSpring(1, {
      stiffness: 154,
      damping: 23,
    });

    // 🔹 3. Update opacity based on DOM + bounds in effects only
    useLayoutEffect(() => {
      const element = localRef.current;
      if (!element) return;

      const value = computeOpacityFor(element, bounds);
      opacity.set(value);
    }, [bounds.left, bounds.right, bounds.width, opacity, bounds]);

    useMotionValueEvent(scrollX, 'change', () => {
      const element = localRef.current;
      if (!element) return;

      const value = computeOpacityFor(element, bounds);
      opacity.set(value);
    });

    // 🔹 4. Toggle just notifies parent
    const toggleExpanded = () => {
      const next = !isExpanded;
      onExpand?.(id, next);
    };

    const handleVideoPlay = useCallback(() => {
      onPlay();
    }, [onPlay]);

    return (
      <motion.div ref={localRef} style={{ opacity }}>
        <div
          className={
            'group relative flex flex-col rounded-3xl bg-white p-5 transition-shadow duration-700 ease-in-out hover:z-20 hover:shadow-[0px_4px_25px_0px_rgba(0,0,0,0.10)]'
          }>
          <motion.div
            layout
            initial={{
              width: '420px',
              maxWidth: '420px',
            }}
            className={'flex max-h-[940px] flex-col'}
            animate={{
              width: isExpanded ? '904px' : '420px',
              maxWidth: isExpanded ? '904px' : '420px',
            }}
            transition={{
              duration: 0.5,
              ease: 'easeInOut',
            }}>
            <div className={'flex items-start justify-between gap-5'}>
              <div className={'flex w-full max-w-md flex-shrink-0 flex-col lg:max-h-[743px] lg:max-w-[420px]'}>
                <div className={'flex flex-col space-y-5 overflow-hidden rounded-2xl'}>
                  <div className={'aspect-h-16 aspect-w-9 relative w-full'}>
                    {isFilled.embed(data.video) ? (
                      <TeamVideo
                        id={id}
                        title={data.title ?? ''}
                        video={data.video}
                        image={data.photo}
                        loading={'lazy'}
                        onPlay={handleVideoPlay}
                        active={isActive}
                      />
                    ) : (
                      <PrismicNextImage
                        quality={55}
                        field={data.photo}
                        className={'inset-x-0 h-full w-full object-cover object-center'}
                      />
                    )}
                  </div>
                </div>
                <div className={'mt-5 flex flex-col items-start space-y-1'}>
                  <h3 className={'text-3xl font-semibold transition ease-in-out group-hover:text-accent'}>
                    {data.name}
                  </h3>
                  <p className={'text-xl text-gray-300'}>{data.title}</p>
                </div>
              </div>
              <div className={'relative overflow-hidden'}>
                <motion.div
                  className={'prose prose-lg min-w-[400px] max-w-none overflow-hidden'}
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: isExpanded ? 100 : 0,
                  }}
                  transition={{
                    duration: 0.6,
                    ease: 'easeInOut',
                  }}>
                  <ScrollArea className="h-[743px] w-[452px] px-4">
                    <PrismicRichText field={data.bio} />
                  </ScrollArea>
                </motion.div>
              </div>
            </div>

            <div className={'relative mt-5 flex items-end justify-end'}>
              <Button onClick={toggleExpanded} size={'icon'} variant={'secondary'} className={'h-12 w-12 bg-accent'}>
                <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
                  <ArrowRight size={32} strokeWidth={3} className={'text-white'} />
                </motion.div>
              </Button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  },
);

TeamCard.displayName = 'TeamCard';

export default TeamCard;
