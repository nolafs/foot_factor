import React, {useRef, useState} from 'react';
import Notification from '@/components/ui/notification';
import type {EmbedField, ImageField} from '@prismicio/client';
import ReactPlayer, {Config} from 'react-player/lazy';
import VideoControl from '@/components/features/video-player/video-players/video-control';

interface TeamVideoProps {
    id?: string;
    title?: string;
    video?: EmbedField;
    image?: ImageField;
    autoplay?: boolean;
    loading?: 'lazy' | 'eager';
}

export const TeamVideo = ({id, title, video, image, loading , autoplay = false}: TeamVideoProps) => {

    const [showPlayer, setShowPlayer] = useState<boolean>(false);
    const ref = useRef<any>(null);

    if (!video) {
        return <Notification body={'No video source found'} type={'error'}/>;
    }

    if (video.type !== 'video') {
        return <Notification body={'No video source found'} type={'error'}/>;
    }

    if (!video.embed_url) {
        return <Notification body={'No video source found'} type={'error'}/>;
    }

    if (!video.provider_name) {
        return <Notification body={'No video type found'} type={'error'}/>;
    }

    if (video.provider_name !== 'YouTube') {
        return <Notification body={'Video must be YouTube'} type={'error'}/>;
    }

    const opts: Config = {
        youtube: {
            playerVars: {
                mute: true,
                autoplay: autoplay,
                controls: true,
                loop: false,
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
      <div className={'relative aspect-h-16 aspect-w-9 w-full h-full isolated overflow-hidden'}>
          <ReactPlayer
              width="100%"
              height="100%"
              playing={showPlayer}
              ref={ref}
              id={id}
              url={video.embed_url}
              config={opts}
              onPlay={handlePlay}
              className={'absolute  min-h-full w-auto min-w-full max-w-none'}
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
          )} </div>
  )
}

export default TeamVideo;
