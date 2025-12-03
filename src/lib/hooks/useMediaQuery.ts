'use client';

import { useEffect, useState } from 'react';

export function useMediaQuery(query: string): boolean {
  const getMatches = (q: string): boolean => {
    // Prevents SSR issues
    if (typeof window !== 'undefined') {
      return window.matchMedia(q).matches;
    }
    return false;
  };

  // Initial value – runs once on mount (client) and is SSR safe
  const [matches, setMatches] = useState<boolean>(() => getMatches(query));

  useEffect(() => {
    // Guard again for safety (in case this ever runs in a non-browser env)
    if (typeof window === 'undefined') return;

    const media = window.matchMedia(query);

    // Only update state in response to external changes
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    media.addEventListener('change', listener);

    return () => {
      media.removeEventListener('change', listener);
    };
  }, [query]);

  return matches;
}
