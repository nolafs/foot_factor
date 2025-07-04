'use client';
import React, {useRef, useState} from 'react';
import useMeasure from 'react-use-measure';
import {clsx} from 'clsx';
import {useMotionValueEvent, useScroll} from 'framer-motion';
import {Container} from '@/components/ui/container';
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from '@/components/ui/tooltip';
import {Button} from '@/components/ui/button';

export type sliderControlItem = {
    title: string;
}

interface SliderProps {
    data?: sliderControlItem[];
    children?: React.ReactNode;
}

export const Slider = ({children, data}: SliderProps) => {
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const [setReferenceWindowRef, bounds] = useMeasure();
    const {scrollX} = useScroll({container: scrollRef});
    const [activeIndex, setActiveIndex] = useState(0);

    useMotionValueEvent(scrollX, 'change', x => {
        if (scrollRef.current?.children[0]) {
            setActiveIndex(Math.floor(x / scrollRef.current.children[0].clientWidth));
        }
    });

    function scrollTo(index: number) {
        const gap = 32;
        const width = (scrollRef.current!.children[0] as HTMLElement).offsetWidth;
        scrollRef.current!.scrollTo({left: (width + gap) * index});
    }


    return (
      <div ref={setReferenceWindowRef} className={'relative'}>
          <div
              ref={scrollRef}
              className={clsx([
                  'flex gap-2 py-7',
                  '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
                  'snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-smooth',
              ])}>
              {children}
          </div>
          {data && data.length > 0 && (
          <Container className="mt-1">
              <div className="hidden sm:flex justify-center sm:gap-2">
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
          )}
      </div>
  )
}

export default Slider;
