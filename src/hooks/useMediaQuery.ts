'use client';

import { useEffect, useState } from 'react';

/** Client-only media query. Defaults to `false` until mounted (SSR-safe). */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [query]);

  return matches;
}

export function useIsMobile(breakpointPx = 768): boolean {
  return useMediaQuery(`(max-width: ${breakpointPx - 1}px)`);
}
