'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { trackingConfig } from '@/lib/tracking/config.tracking';

type IdleHandle = number;

export const scheduleIdle = (cb: () => void): IdleHandle => {
  if (typeof window !== 'undefined') {
    const w = window as any;

    if (typeof w.requestIdleCallback === 'function') {
      return w.requestIdleCallback(cb);
    }

    return window.setTimeout(cb, 500);
  }

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

export function GoogleTagManager({ consented }: { consented: boolean }) {
  const [readyToLoad, setReadyToLoad] = useState(false);

  useEffect(() => {
    if (!consented) return;

    const handle = scheduleIdle(() => {
      setReadyToLoad(true);
    });

    return () => cancelIdle(handle);
  }, [consented]);

  const shouldLoad = consented && readyToLoad;

  if (!shouldLoad) return null;

  const gtmId = trackingConfig.gtmId;

  return (
    <>
      <Script id="gtm-init" strategy="afterInteractive">
        {`
          (function(w,d,s,l,i){
            w[l]=w[l]||[];
            w[l].push({
              'gtm.start': new Date().getTime(),
              event:'gtm.js'
            });
            var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),
                dl=l!='dataLayer'?'&l='+l:'';
            j.async=true;
            j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
            f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${gtmId}');
        `}
      </Script>
    </>
  );
}
