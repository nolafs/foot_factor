import { FC } from 'react';
import {Content, isFilled} from '@prismicio/client';
import { SliceComponentProps } from '@prismicio/react';

import VideoPlayer from '@/components/features/video-player/video-player';

/**
 * Props for `MediaSection`.
 */
export type MediaSectionProps = SliceComponentProps<Content.MediaSectionSlice>;

/**
 * Component for "MediaSection" Slices.
 */
const MediaSection: FC<MediaSectionProps> = ({ slice }) => {


  console.log('slice', slice.variation)

  if(slice.variation === 'sectionVideo') {
    if(isFilled.embed(slice.primary.video))
    return (<section data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
      <div className={'w-full max-w-full'}>
        <VideoPlayer id={slice.id}  video={slice.primary.video} image={slice.primary.poster}  loading={'lazy'} />
      </div>
    </section>)
  }


  return (
    <section data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
      Placeholder component for media_section (variation: {slice.variation}) Slices
    </section>
  );
};

export default MediaSection;
