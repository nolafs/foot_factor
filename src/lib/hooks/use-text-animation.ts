// hooks/useTextAnimation.ts
import {useRef, useEffect} from 'react';
import {useGSAP} from '@gsap/react';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {SplitText} from 'gsap/SplitText';

// Register the plugin
gsap.registerPlugin(ScrollTrigger);

interface UseTextAnimationOptions {
  enabled?: boolean;
  trigger?: {
    start?: string;
    end?: string;
    scrub?: boolean;
    markers?: boolean;
  };
  animation?: {
    fromOpacity?: number;
    toOpacity?: number;
    stagger?: number;
    ease?: string;
  };
  splitType?: string;
  refreshOnResize?: boolean;
  refreshDelay?: number; // Delay before refreshing after resize/position changes
}

export const useTextAnimation = (options: UseTextAnimationOptions = {}) => {
  const {
    enabled = true,
    trigger = {
      start: "top 30%",
      end: "130% center",
      scrub: true,
      markers: false
    },
    animation = {
      fromOpacity: 0.15,
      toOpacity: 1,
      stagger: 0.08,
      ease: "power2.out"
    },
    splitType = "words,chars, lines",
    refreshOnResize = true,
    refreshDelay = 100
  } = options;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const splitsRef = useRef<SplitText | null>(null);

  // Function to refresh ScrollTrigger
  const refreshScrollTrigger = () => {
    if (timelineRef.current) {
      ScrollTrigger.refresh();
    }
  };

  // Debounced refresh function
  const debouncedRefresh = useRef<NodeJS.Timeout>();
  const scheduleRefresh = () => {
    if (debouncedRefresh.current) {
      clearTimeout(debouncedRefresh.current);
    }
    debouncedRefresh.current = setTimeout(refreshScrollTrigger, refreshDelay);
  };

  useGSAP(() => {
    if (!enabled || !containerRef.current || !triggerRef.current) return;

    const splits = new SplitText(containerRef.current, {type: splitType});
    splitsRef.current = splits;

    const tl = gsap
        .timeline({
          scrollTrigger: {
            trigger: triggerRef.current,
            start: trigger.start,
            end: trigger.end,
            scrub: trigger.scrub,
            markers: trigger.markers,
            onRefresh: () => {
              // Optional: Add any logic when ScrollTrigger refreshes
              if (trigger.markers) {
                console.log('ScrollTrigger refreshed for text animation');
              }
            }
          }
        })
        .fromTo(
            splits.chars,
            {opacity: animation.fromOpacity},
            {
              opacity: animation.toOpacity,
              stagger: animation.stagger,
              ease: animation.ease,
            },
            0
        );

    timelineRef.current = tl;

    return () => {
      if (debouncedRefresh.current) {
        clearTimeout(debouncedRefresh.current);
      }
      tl.kill();
      splits.revert();
      timelineRef.current = null;
      splitsRef.current = null;
    };
  }, {scope: triggerRef});

  // Handle resize events
  useEffect(() => {
    if (!refreshOnResize) return;

    const handleResize = () => {
      scheduleRefresh();
    };

    const handleOrientationChange = () => {
      // Mobile orientation changes need extra delay
      setTimeout(scheduleRefresh, 200);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
      if (debouncedRefresh.current) {
        clearTimeout(debouncedRefresh.current);
      }
    };
  }, [refreshOnResize, refreshDelay]);

  return {
    containerRef, // Ref for the text container
    triggerRef,   // Ref for the scroll trigger element
    refreshScrollTrigger, // Manual refresh function
    scheduleRefresh, // Debounced refresh function
  };
};
