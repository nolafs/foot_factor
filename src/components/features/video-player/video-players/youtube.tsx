/* eslint-disable-next-line */
'use client';

import { useReducer, useRef, useState } from 'react';
import ReactPlayer, { type Config } from 'react-player/lazy';

import VideoControl from './video-control';

import VideoPlayerWrapper from '../video-player-wrapper';
import cn from 'clsx';
import {ImageFieldImage} from "@prismicio/client";

export interface YoutubeProps {
  id: string;
  src?: string;
  title: string;
  poster?: ImageFieldImage;
  width?: number;
  height?: number;
  autoplay?: boolean;
  controls?: boolean;
  loop?: boolean;
  loading?: 'lazy' | 'eager';
  frame?: boolean;
}

export function Youtube({
  id,
  src,
  title,
  poster,
  autoplay = false,
  controls = true,
  loop = false,
  loading = 'lazy',
  width = 1920,
  height = 1200,
}: YoutubeProps) {

  const [showPlayer, setShowPlayer] = useState<boolean>(false);
  const [playPlayer, setPlayPlayer] = useState<boolean>(false);
  const ref = useRef<any>(null);

  if (!width) {
    width = 944;
  }

  if (!height) {
    height = 531;
  }

  const opts: Config = {
    youtube: {
      playerVars: {
        mute: !autoplay ,
        autoplay: autoplay,
        controls: controls,
        loop: loop,
        playsinline: true,
      },
    },
  };

  const handlePlay = () => {
    if (autoplay) {
      setShowPlayer(true);
    }
  };

  const handlePause = () => {
    setShowPlayer(false);
  };

  const handleReplay = () => {
    if (autoplay) {
      setShowPlayer(true);
    }
  };

  const play = () => {
    setShowPlayer(true);
  };

  return (
    <VideoPlayerWrapper handlePlay={handlePlay} handlePause={handlePause} handleReplay={handleReplay}>
      <div className={cn('aspect-w-16 aspect-h-9 w-full h-full relative z-20 overflow-hidden')}>
        {showPlayer && (
        <ReactPlayer
              width="100%"
              height="100%"
              playing={showPlayer}
              ref={ref}
              id={id}
              url={src}
              config={opts}
              onPlay={handlePlay}
              className={'absolute  min-h-full w-auto min-w-full max-w-none'}
            />
        )}

          {!autoplay && (
            <VideoControl
              handlePlayAction={play}
              title={title}
              poster={poster}
              loading={loading}
              width={width}
              height={height}
            />
          )}
      </div>
    </VideoPlayerWrapper>
  );
}

export default Youtube;
