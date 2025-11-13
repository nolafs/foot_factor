'use client'
import {useCallback, useEffect, useState} from 'react';

export function useMediaQuery(query: string): boolean {
  const getMatches = (query: string): boolean => {
    // Prevents SSR issues
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  };

  const [matches, setMatches] = useState<boolean>(getMatches(query));

    const handleChange = useCallback(() => {
        setMatches(getMatches(query));
    }, [query]);

    useEffect(() => {
        const matchMedia = window.matchMedia(query);

        // Trigger initial check
        handleChange();

        // Listen to media query changes
        matchMedia.addEventListener("change", handleChange);

        return () => {
            matchMedia.removeEventListener("change", handleChange);
        };
    }, [query, handleChange]);

  return matches;
}
