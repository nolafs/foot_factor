'use client';
import { isFilled, type KeyTextField } from '@prismicio/client';
import React, { useEffect, useState } from 'react';
import Script from 'next/script';

interface ReviewSliderElfsightProps {
  share_link?: KeyTextField | string;
  width?: string;
}

export const ReviewSliderElfsight = ({ share_link, width = '100%' }: ReviewSliderElfsightProps) => {
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (!isFilled.keyText(share_link)) return;
    // mode: 'no-cors' avoids CORS errors for cross-origin URLs;
    // any successful response (even opaque) means the URL is reachable
    fetch(share_link, { method: 'HEAD', mode: 'no-cors' })
      .then(e => {
        if (e.ok) {
          setIsValid(true);
        } else {
          setIsValid(false);
        }
      })
      .catch(() => setIsValid(false));
  }, [share_link]);

  return (
    isValid && (
      <>
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/4.2.10/iframeResizer.min.js"
          strategy="lazyOnload"
        />
        <iframe
          title={'Google Review'}
          src={share_link as string}
          style={{ border: 'none', background: 'transparent', width: width ?? '100%' }}
          ref={el => {
            if (el && typeof window !== 'undefined' && 'iFrameResize' in window) {
              //@ts-expect-error: iframeResizer is a global function provided by the script
              iFrameResize({}, el);
            }
          }}
        />
      </>
    )
  );
};

export default ReviewSliderElfsight;
