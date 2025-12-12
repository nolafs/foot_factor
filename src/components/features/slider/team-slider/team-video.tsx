import React, { useEffect, useRef, useState } from 'react';
import Notification from '@/components/ui/notification';
import type { EmbedField, ImageField } from '@prismicio/client';
import ReactPlayer, { type Config } from 'react-player/lazy';
import VideoControl from '@/components/features/video-player/video-players/video-control';

interface TeamVideoProps {
  id?: string;
  title?: string;
  video?: EmbedField;
  image?: ImageField;
  autoplay?: boolean;
  loading?: 'lazy' | 'eager';
  onPlay?: () => void;
  active?: boolean;
}

export const TeamVideo = ({ id, title, video, image, loading, autoplay = false, onPlay, active }: TeamVideoProps) => {
  const [showPlayer, setShowPlayer] = useState<boolean>(false);
  const ref = useRef<ReactPlayer | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  if (!video) {
    return <Notification body={'No video source found'} type={'error'} />;
  }

  if (video.type !== 'video') {
    return <Notification body={'No video source found'} type={'error'} />;
  }

  if (!video.embed_url) {
    return <Notification body={'No video source found'} type={'error'} />;
  }

  if (!video.provider_name) {
    return <Notification body={'No video type found'} type={'error'} />;
  }

  if (video.provider_name !== 'YouTube') {
    return <Notification body={'Video must be YouTube'} type={'error'} />;
  }

  const opts: Config = {
    youtube: {
      playerVars: {
        mute: false,
        autoplay: false,
        controls: false,
        loop: false,
        playsinline: true,
      },
    },
  };

  const handlePlay = () => {
    if (autoplay) {
      if (isMounted.current) setShowPlayer(true);
      onPlay && onPlay();
    }
  };

  const handlePause = () => {
    if (isMounted.current) setShowPlayer(false);
  };

  const handleEnded = () => {
    if (isMounted.current) {
      setShowPlayer(false);
      ref.current?.seekTo(0);
    }
  };

  const play = () => {
    if (isMounted.current) setShowPlayer(true);
  };

  return (
    <div className={'isolated aspect-h-16 aspect-w-9 relative h-full w-full overflow-hidden'}>
      <ReactPlayer
        width="100%"
        height="100%"
        playing={showPlayer}
        ref={ref}
        id={id}
        url={video.embed_url}
        config={opts}
        onPlay={handlePlay}
        onEnded={handleEnded}
        onPause={handlePause}
        className={'absolute min-h-full w-auto min-w-full max-w-none'}
      />
      {!autoplay && (
        <VideoControl
          handlePlayAction={play}
          title={title ?? ''}
          poster={image}
          loading={loading}
          width={1200}
          height={1920}
        />
      )}{' '}
    </div>
  );
};

export default TeamVideo;
