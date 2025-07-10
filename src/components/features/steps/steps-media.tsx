'use client';
import React from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import {useGSAP} from '@gsap/react';
import {Container} from '@/components/ui/container';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

interface StepsMediaProps {
    data: any[]
}

export const StepsMedia = ({data}: StepsMediaProps) => {
    const contentRef = React.useRef<HTMLDivElement>(null);
    const listRef = React.useRef<HTMLUListElement>(null);


    useGSAP(() => {

        if (!contentRef.current || !listRef.current) return;

    }, {scope: contentRef, dependencies: [data]});

  return (
      <Container>
          <div ref={contentRef} className={'relative w-full isolate'}>
              <ul ref={listRef} className={'w-full flex flex-col'}>
              </ul>
          </div>
      </Container>
  )
}

export default StepsMedia;
