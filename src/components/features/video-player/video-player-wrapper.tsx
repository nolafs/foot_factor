'use client';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { type ReactNode, useRef, useState } from 'react';
import ScrollTrigger from 'gsap/ScrollTrigger';


if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface VideoProps {
  children: ReactNode;
  handlePlay: () => void;
  handlePause: () => void;
  handleReplay: () => void;
}

export function VideoPlayerWrapper({ children, handlePlay, handlePause, handleReplay }: VideoProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [ready, setReady] = useState(false);

  useGSAP(
    () => {

      console.log('VideoPlayerWrapper', ref.current);
      if (!ref.current) return;

      gsap.fromTo(
        '.video',
        { opacity: 0 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 70%',
            end: 'bottom 30%',
            markers: false,
            onEnter: () => {
              setReady(true);
              handlePlay();
            },
            onEnterBack: () => {
              handleReplay();
            },
            onLeave: () => {
              handlePause();
            },
            onLeaveBack: () => {
              handlePlay();
            },
          },
        },
      );

      return () => {
        if (ref.current) {

          gsap.killTweensOf('.video');
          ScrollTrigger.getById(ref.current.id)?.kill();
        }
      }
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={'relative'}>
      {children}
    </div>
  );
}

export default VideoPlayerWrapper;
