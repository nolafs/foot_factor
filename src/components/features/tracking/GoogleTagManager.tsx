'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { trackingConfig } from '@/lib/tracking/config.tracking';

// Idle helper
type IdleHandle = number;

export const scheduleIdle = (cb: () => void): IdleHandle => {
  if (typeof window !== 'undefined') {
    const w = window as any;

    if (typeof w.requestIdleCallback === 'function') {
      return w.requestIdleCallback(cb);
    }

    return window.setTimeout(cb, 500);
  }

  // SSR fallback – never used in browser
  return 0 as IdleHandle;
};

export const cancelIdle = (h: IdleHandle) => {
  if (typeof window !== 'undefined') {
    const w = window as any;

    if (typeof w.cancelIdleCallback === 'function') {
      w.cancelIdleCallback(h);
      return;
    }

    clearTimeout(h);
  }
};

// Local safe gtag wrapper (no direct dependency on gtag existing)
const gtag = (...args: unknown[]) => {
  if (typeof window === 'undefined') return;
  (window as any).dataLayer = (window as any).dataLayer ?? [];
  (window as any).dataLayer.push(args);
};

export function GoogleTagManager({ consented }: { consented: boolean }) {
  const [readyToLoad, setReadyToLoad] = useState(false);

  // When consent changes to true, schedule loading
  useEffect(() => {
    if (!consented) {
      setReadyToLoad(false);
      return;
    }

    const handle = scheduleIdle(() => setReadyToLoad(true));
    return () => cancelIdle(handle);
  }, [consented]);

  useEffect(() => {
    console.log('Ready to load GTM', { readyToLoad, consented });
  }, [readyToLoad, consented]);

  if (!readyToLoad) return null;

  return (
    <>
      <Script
        id="gtm"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtm.js?id=${trackingConfig.gtmId}`}
        onLoad={() => {
          // Send consent mode info via dataLayer (safe even if GTM just booted)
          gtag('consent', 'update', {
            ad_storage: 'granted',
            ad_user_data: 'granted',
            ad_personalization: 'granted',
            analytics_storage: 'granted',
          });
        }}
      />
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${trackingConfig.gtmId}`}
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
        />
      </noscript>
    </>
  );
}