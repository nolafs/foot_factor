'use client';

import { useState } from 'react';
import cn from 'clsx';
import { PrismicNextImage } from '@prismicio/next';

export interface VideoControlProps {
  handlePlayAction: () => void;
  poster?: any;
  width?: number;
  height?: number;
  title: string;
  loading?: 'lazy' | 'eager';
  mode?: 'light' | 'dark';
}

export function VideoControl({ poster, handlePlayAction, width, height, title, loading = 'lazy', mode }: VideoControlProps) {
  const [showPlayer, setShowPlayer] = useState<boolean>(false);

  const play = () => {

    console.log('Play action triggered');

    setShowPlayer(true);
    handlePlayAction();

  };

  return (
    <button onClick={play} className={cn(showPlayer ? 'hidden' : 'block')} aria-label={`Play ${title}`}>
      <div className={'sr-only'}>Play {title}</div>
      <div className={'fill-secondary absolute z-20 left-0 top-0 flex h-full w-full flex-col items-center justify-center'}>
        <div className={'flex h-16 w-16 items-center justify-center rounded-full'}>
          <svg width="179" height="178" viewBox="0 0 179 178" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g filter="url(#filter0_dd_8928_4595)">
              <circle cx="89.5" cy="85" r="64" fill="white"/>
            </g>
            <path
                d="M113.5 82.6801L76.1668 61.1334C75.7614 60.8993 75.3015 60.7761 74.8334 60.7761C74.3653 60.7761 73.9055 60.8993 73.5001 61.1334C73.0932 61.3683 72.7555 61.7066 72.5214 62.114C72.2872 62.5215 72.1649 62.9835 72.1668 63.4534V106.547C72.1649 107.017 72.2872 107.479 72.5214 107.886C72.7555 108.293 73.0932 108.632 73.5001 108.867C73.9055 109.101 74.3653 109.224 74.8334 109.224C75.3015 109.224 75.7614 109.101 76.1668 108.867L113.5 87.3201C113.91 87.0875 114.252 86.7502 114.489 86.3426C114.727 85.935 114.852 85.4718 114.852 85.0001C114.852 84.5283 114.727 84.0651 114.489 83.6575C114.252 83.2499 113.91 82.9126 113.5 82.6801ZM77.5001 101.933V68.0667L106.833 85.0001L77.5001 101.933Z"
                fill="#D1BF73"/>
            <defs>
              <filter id="filter0_dd_8928_4595" x="0.5" y="0" width="178" height="178" filterUnits="userSpaceOnUse"
                      colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                               result="hardAlpha"/>
                <feOffset dy="4"/>
                <feGaussianBlur stdDeviation="12.5"/>
                <feComposite in2="hardAlpha" operator="out"/>
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_8928_4595"/>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                               result="hardAlpha"/>
                <feMorphology radius="4" operator="erode" in="SourceAlpha" result="effect2_dropShadow_8928_4595"/>
                <feOffset dy="4"/>
                <feGaussianBlur stdDeviation="5"/>
                <feColorMatrix type="matrix" values="0 0 0 0 0.164706 0 0 0 0 0.2 0 0 0 0 0.258824 0 0 0 0.22 0"/>
                <feBlend mode="normal" in2="effect1_dropShadow_8928_4595" result="effect2_dropShadow_8928_4595"/>
                <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_8928_4595" result="shape"/>
              </filter>
            </defs>
          </svg>

        </div>
      </div>
      {poster && (
        <PrismicNextImage
          field={poster}
          width={width}
          height={height}
          fallbackAlt=""
          loading={loading}
          className={'z-10 h-full w-full object-center object-cover'}
          imgixParams={{ fit: 'fill', fm: 'webp' }}
          quality={80}
        />
      ) }
    </button>
  );
}

export default VideoControl;
