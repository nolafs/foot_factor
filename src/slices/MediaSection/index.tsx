import React, { type FC } from 'react';
import {type Content, isFilled} from '@prismicio/client';
import { type SliceComponentProps} from '@prismicio/react';

import VideoPlayer from '@/components/features/video-player/video-player';
import cn from 'clsx';
import {PrismicNextImage} from '@prismicio/next';
import {Container} from '@/components/ui/container';

/**
 * Props for `MediaSection`.
 */
export type MediaSectionProps = SliceComponentProps<Content.MediaSectionSlice>;

/**
 * Component for "MediaSection" Slices.
 */
const MediaSection: FC<MediaSectionProps> = ({ slice }) => {

  if(slice.variation === 'sectionVideo') {
    if(isFilled.embed(slice.primary.video))
    return (<Container fullWidth={true} data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
        <VideoPlayer id={slice.id}  video={slice.primary.video} image={slice.primary.poster}  loading={'lazy'} />
    </Container>)
  }

  if (slice.variation === 'fullWidthImage') {
    return (<div data-slice-type={slice.slice_type} data-slice-variation={slice.variation}
         className={'w-full'}>


          {slice.primary.image && (
              <div className={'w-full flex justify-center aspect-w-16 aspect-h-9 '}>
                <PrismicNextImage field={slice.primary.image}
                                  className={cn('w-full h-full object-center object-cover overflow-hidden')}/>
              </div>
          )}


    </div>
  )
  }

  if (slice.variation === 'default') {
    return (
          <Container as={'section'} padding={'lg'} data-slice-type={slice.slice_type}
                     data-slice-variation={slice.variation} color={slice.primary.color}>
            <div className={'flex flex-col gap-5 md:gap-8 lg:gap-10'}>
              {slice.primary.image && (
                  <div className={'w-full flex justify-center aspect-w-16 aspect-h-9 '}>
                    <PrismicNextImage field={slice.primary.image}
                                      className={cn('w-full h-full object-center object-cover rounded-4xl overflow-hidden')}/>
                  </div>
              )}
            </div>
          </Container>
    );
  }
};

export default MediaSection;
