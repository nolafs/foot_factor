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
      fromOpacity: 0.25,
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
  const isResizing = useRef(false);
  const currentWidth = useRef<number>(0);

  // Function to completely recreate the animation
  const recreateAnimation = () => {
    if (!enabled || !containerRef.current || !triggerRef.current) return;

    gsap.set(containerRef.current, {opacity: 0});
    // Clean up existing animation

    if (timelineRef.current) {
      timelineRef.current.kill();
    }
    if (splitsRef.current) {

      splitsRef.current.revert();
    }

    // Small delay to ensure DOM has updated after resize
    setTimeout(() => {
      if (!containerRef.current || !triggerRef.current) return;

      // Create new SplitText instance
      const splits = new SplitText(containerRef.current, {type: splitType, aria: 'hidden'});
      splitsRef.current = splits;

      // Create new timeline
      timelineRef.current = gsap
          .timeline({
            scrollTrigger: {
              trigger: triggerRef.current,
              start: trigger.start,
              end: trigger.end,
              scrub: trigger.scrub,
              markers: trigger.markers,
              onRefresh: () => {
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
      isResizing.current = false;
      gsap.set(containerRef.current, {opacity: 1}); // Ensure container is visible after animation

    }, 50);
  };

  // Function to refresh ScrollTrigger without recreating
  const refreshScrollTrigger = () => {
    if (timelineRef.current && !isResizing.current) {
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

  // Debounced recreate function for resize events
  const debouncedRecreate = useRef<NodeJS.Timeout>();
  const scheduleRecreate = () => {
    isResizing.current = true;
    if (debouncedRecreate.current) {
      clearTimeout(debouncedRecreate.current);
    }
    debouncedRecreate.current = setTimeout(recreateAnimation, refreshDelay);
  };

  useGSAP(() => {

    //set current width
    currentWidth.current = containerRef.current?.offsetWidth ?? 0;

    recreateAnimation();

    return () => {
      if (debouncedRefresh.current) {
        clearTimeout(debouncedRefresh.current);
      }
      if (debouncedRecreate.current) {
        clearTimeout(debouncedRecreate.current);
      }
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
      if (splitsRef.current) {
        splitsRef.current.revert();
      }
      timelineRef.current = null;
      splitsRef.current = null;
    };
  }, {scope: triggerRef});

  // Handle resize events
  useEffect(() => {
    if (!refreshOnResize) return;

    const handleResize = () => {
      //check if width had change but ignore height changes
      if(!containerRef.current || containerRef.current.offsetWidth !== currentWidth.current) {
        currentWidth.current = containerRef.current?.offsetWidth ?? 0;
        scheduleRecreate(); // Use recreate instead of refresh for resize
      }
    };

    const handleOrientationChange = () => {
      // Mobile orientation changes need complete recreation
      setTimeout(scheduleRecreate, 200);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
      if (debouncedRefresh.current) {
        clearTimeout(debouncedRefresh.current);
      }
      if (debouncedRecreate.current) {
        clearTimeout(debouncedRecreate.current);
      }
    };
  }, [refreshOnResize, refreshDelay]);

  return {
    containerRef, // Ref for the text container
    triggerRef,   // Ref for the scroll trigger element
    refreshScrollTrigger, // Manual refresh function
    scheduleRefresh, // Debounced refresh function
    recreateAnimation, // Manual recreation function
    scheduleRecreate, // Debounced recreation function
  };
};
