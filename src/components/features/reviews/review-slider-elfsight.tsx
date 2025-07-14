'use client';
import {isFilled, KeyTextField} from '@prismicio/client';
import React from 'react';
import Script from 'next/script';

interface ReviewSliderElfsightProps {
    share_link?: KeyTextField | string;
}

export const ReviewSliderElfsight = ({share_link}: ReviewSliderElfsightProps) => {

  return (

          isFilled.keyText(share_link) && (
              <>
                  <Script src="https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/4.2.10/iframeResizer.min.js"/>
                  <iframe
                      src={share_link}
                      style={{border: 'none', width: '100%'}}
                      ref={(el) => {
                          if (el && typeof window !== 'undefined' && 'iFrameResize' in window) {
                              // @ts-ignore
                              iFrameResize({}, el);
                          }
                      }}
                  />
              </>
          )

  )
}

export default ReviewSliderElfsight;
