'use client'
import React, {useCallback, useLayoutEffect, useRef, useState} from 'react';
import {TeamCarouselSliceDefaultPrimaryMembersItem} from '@/prismic-types';
import {PrismicNextImage} from '@prismicio/next';
import {Button} from '@/components/ui/button';
import {ArrowRight} from 'lucide-react';
import {PrismicRichText} from '@prismicio/react';
import {type HTMLMotionProps, motion, type MotionValue, useMotionValueEvent, useSpring} from 'framer-motion';
import {ScrollArea} from '@/components/ui/scroll-area';
import {isFilled} from '@prismicio/client';
import TeamVideo from '@/components/features/slider/team-slider/team-video';
import type {RectReadOnly} from 'react-use-measure';



interface TeamCardProps {
    id: string
    data: TeamCarouselSliceDefaultPrimaryMembersItem,
    bounds: RectReadOnly,
    scrollX: MotionValue<number>
}

export const TeamCard = ({id,data, bounds, scrollX}: TeamCardProps & HTMLMotionProps<'div'>) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const computeOpacity = useCallback(() => {
    const element = ref.current;
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
  }, [ref, bounds.width, bounds.left, bounds.right]);

  const opacity = useSpring(computeOpacity(), {
    stiffness: 154,
    damping: 23,
  });

  useLayoutEffect(() => {
    opacity.set(computeOpacity());
  }, [computeOpacity, opacity]);

  useMotionValueEvent(scrollX, 'change', () => {
    opacity.set(computeOpacity());
  });

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };



  return (
	  <motion.div
		  ref={ref}
		  style={{opacity}}>
      <div className={'relative flex flex-col rounded-3xl bg-white p-5 transition-shadow duration-700 ease-in-out group hover:z-20 hover:shadow-[0px_4px_25px_0px_rgba(0,0,0,0.10)]'}>
      <motion.div
          layout
          initial={{
            width: '420px',
            maxWidth: '420px',
          }}
          className={'flex flex-col max-h-[940px]'}
          animate={{
            width: isExpanded ? '904px' : '420px',
            maxWidth: isExpanded ? '904px' : '420px'
          }}
          transition={{
            duration: 0.5,
            ease: "easeInOut"
          }}
      >
        <div className={'flex gap-5 items-start justify-between'}>
          <div className={'flex flex-col max-w-[420px] max-h-[743px] w-full flex-shrink-0'}>
            <div className={'flex flex-col space-y-5 rounded-2xl overflow-hidden'}>
              <div className={'aspect-h-16 aspect-w-9 relative w-full'}>
              {isFilled.embed(data.video) ? <TeamVideo id={id} title={data.title ?? ''} video={data.video} image={data.photo} loading={'lazy'}/> :
              <PrismicNextImage field={data.photo} className={'inset-x-0 h-full w-full object-center object-cover'}/>}
              </div>
            </div>
            <div className={'flex flex-col items-start mt-5 space-y-1'}>
              <h3 className={'text-3xl font-semibold transition ease-in-out group-hover:text-accent'}>{data.name}</h3>
              <p className={'text-xl text-gray-300'}>{data.title}</p>
            </div>
          </div>
          <div className={'relative overflow-hidden'}>
            <motion.div
                className={'prose prose-lg max-w-none  min-w-[400px] overflow-hidden'}
                initial={{
                  opacity: 0
                }}
                animate={{
                  opacity: isExpanded ? 100: 0
                }}
                transition={{
                  duration: 0.6,
                  ease: "easeInOut"
                }}
            >
              <ScrollArea className="h-[743px] w-[452px] px-4">
              <PrismicRichText field={data.bio}/>
              </ScrollArea>
            </motion.div>
          </div>
        </div>

        <div className={'relative flex items-end justify-end mt-5'}>
          <Button
              onClick={toggleExpanded}
              size={'icon'}
              variant={'secondary'}
              className={'w-12 h-12 bg-accent'}
          >
            <motion.div
                animate={{rotate: isExpanded ? 180 : 0}}
                transition={{duration: 0.3}}
            >
              <ArrowRight size={32} strokeWidth={3} className={'text-white'}/>
            </motion.div>
          </Button>
        </div>
      </motion.div>
      </div>
    </motion.div>
  )
}

export default TeamCard;
