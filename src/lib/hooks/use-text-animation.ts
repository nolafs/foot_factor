// hooks/useTextAnimation.ts
import { useRef, useEffect, useCallback } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

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
  refreshDelay?: number;
}

export const useTextAnimation = (options: UseTextAnimationOptions = {}) => {
  const {
    enabled = true,
    trigger = {
      start: 'top 30%',
      end: '130% center',
      scrub: true,
      markers: false,
    },
    animation = {
      fromOpacity: 0.25,
      toOpacity: 1,
      stagger: 0.08,
      ease: 'power2.out',
    },
    splitType = 'words,chars, lines',
    refreshOnResize = true,
    refreshDelay = 100,
  } = options;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const splitsRef = useRef<SplitText | null>(null);
  const isResizing = useRef<boolean>(false);
  const isMounted = useRef<boolean>(false);
  const currentWidth = useRef<number>(0);
  const debouncedRefresh = useRef<NodeJS.Timeout | undefined>(undefined);
  const debouncedRecreate = useRef<NodeJS.Timeout | undefined>(undefined);

  // Function to completely recreate the animation
  const recreateAnimation = useCallback(() => {
    if (!enabled || !containerRef.current || !triggerRef.current || !isMounted.current) return;

    // Store original content before splitting
    const originalContent = containerRef.current.innerHTML;

    // Clean up existing animation
    if (timelineRef.current) {
      timelineRef.current.kill();
      timelineRef.current = null;
    }
    if (splitsRef.current) {
      try {
        splitsRef.current.revert();
      } catch (e) {
        // If revert fails, restore from backup
        if (containerRef.current) {
          containerRef.current.innerHTML = originalContent;
        }
      }
      splitsRef.current = null;
    }

    // Set opacity to 0 before creating new split
    if (containerRef.current) {
      gsap.set(containerRef.current, { opacity: 0 });
    }

    // Use requestAnimationFrame instead of setTimeout for better timing
    requestAnimationFrame(() => {
      if (!containerRef.current || !triggerRef.current || !isMounted.current) return;

      try {
        const splits = new SplitText(containerRef.current, { type: splitType, aria: 'hidden' });
        splitsRef.current = splits;

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
              },
            },
          })
          .fromTo(
            splits.chars,
            { opacity: animation.fromOpacity },
            {
              opacity: animation.toOpacity,
              stagger: animation.stagger,
              ease: animation.ease,
            },
            0,
          );
        isResizing.current = false;
        if (containerRef.current && isMounted.current) {
          gsap.set(containerRef.current, { opacity: 1 });
        }
      } catch (error) {
        console.error('Error creating SplitText animation:', error);
        // Restore opacity on error
        if (containerRef.current && isMounted.current) {
          gsap.set(containerRef.current, { opacity: 1 });
        }
      }
    });
  }, [
    enabled,
    splitType,
    trigger.start,
    trigger.end,
    trigger.scrub,
    trigger.markers,
    animation.fromOpacity,
    animation.toOpacity,
    animation.stagger,
    animation.ease,
  ]);

  // Function to refresh ScrollTrigger without recreating
  const refreshScrollTrigger = useCallback(() => {
    if (timelineRef.current && !isResizing.current) {
      ScrollTrigger.refresh();
    }
  }, []);

  // Debounced refresh function
  const scheduleRefresh = useCallback(() => {
    if (debouncedRefresh.current) {
      clearTimeout(debouncedRefresh.current);
    }
    debouncedRefresh.current = setTimeout(refreshScrollTrigger, refreshDelay);
  }, [refreshScrollTrigger, refreshDelay]);

  // Debounced recreate function for resize events
  const scheduleRecreate = useCallback(() => {
    isResizing.current = true;
    if (debouncedRecreate.current) {
      clearTimeout(debouncedRecreate.current);
    }
    debouncedRecreate.current = setTimeout(recreateAnimation, refreshDelay);
  }, [recreateAnimation, refreshDelay]);

  useGSAP(
    () => {
      isMounted.current = true;
      currentWidth.current = containerRef.current?.offsetWidth ?? 0;

      recreateAnimation();

      return () => {
        // Mark as unmounted FIRST to prevent any new animations
        isMounted.current = false;

        // Clear all timeouts
        if (debouncedRefresh.current) {
          clearTimeout(debouncedRefresh.current);
          debouncedRefresh.current = undefined;
        }
        if (debouncedRecreate.current) {
          clearTimeout(debouncedRecreate.current);
          debouncedRecreate.current = undefined;
        }

        // Kill timeline before reverting splits
        if (timelineRef.current) {
          timelineRef.current.kill();
          timelineRef.current = null;
        }

        // Revert SplitText to restore original DOM
        if (splitsRef.current) {
          try {
            splitsRef.current.revert();
          } catch (error) {
            console.warn('SplitText revert failed during cleanup:', error);
          }
          splitsRef.current = null;
        }
      };
    },
    { scope: triggerRef, dependencies: [recreateAnimation] },
  );

  useEffect(() => {
    if (!refreshOnResize) return;

    const handleResize = () => {
      if (!isMounted.current) return;
      if (!containerRef.current || containerRef.current.offsetWidth !== currentWidth.current) {
        currentWidth.current = containerRef.current?.offsetWidth ?? 0;
        scheduleRecreate();
      }
    };

    const handleOrientationChange = () => {
      if (!isMounted.current) return;
      setTimeout(scheduleRecreate, 200);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
      if (debouncedRefresh.current) {
        clearTimeout(debouncedRefresh.current);
        debouncedRefresh.current = undefined;
      }
      if (debouncedRecreate.current) {
        clearTimeout(debouncedRecreate.current);
        debouncedRecreate.current = undefined;
      }
    };
  }, [refreshOnResize, scheduleRecreate]);

  return {
    containerRef,
    triggerRef,
    refreshScrollTrigger,
    scheduleRefresh,
    recreateAnimation,
    scheduleRecreate,
  };
};
