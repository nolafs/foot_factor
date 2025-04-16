import React, { FC } from 'react';
import {Content, isFilled} from '@prismicio/client';
import {PrismicRichText, SliceComponentProps} from '@prismicio/react';

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
    return (<section data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
      <div className={'w-full max-w-full'}>
        <VideoPlayer id={slice.id}  video={slice.primary.video} image={slice.primary.poster}  loading={'lazy'} />
      </div>
    </section>)
  }

  if (slice.variation === 'fullWidthImage') {
    return (<div data-slice-type={slice.slice_type} data-slice-variation={slice.variation}
         className={'w-full'}>


          {slice.primary.image && (
              <div className={'w-full flex justify-center aspect-w-16 aspect-h-9 '}>
                <PrismicNextImage field={slice.primary.image}
                                  className={cn('w-full h-full object-center object-cover rounded-4xl overflow-hidden')}/>
              </div>
          )}


    </div>
  )
  }

  if (slice.variation === 'default') {
    return (

          <div data-slice-type={slice.slice_type} data-slice-variation={slice.variation} className={cn('w-full', slice.primary.color === 'default' && 'bg-background', slice.primary.color === 'Accent' && 'bg-accent-50', slice.primary.color === 'Primary' && 'bg-primary')}>
          <Container className={'lg:py-28 py-16 md:py-24'}>
            <div className={'flex flex-col gap-5 md:gap-8 lg:gap-10'}>
              {slice.primary.image && (
                  <div className={'w-full flex justify-center aspect-w-16 aspect-h-9 '}>
                    <PrismicNextImage field={slice.primary.image}
                                      className={cn('w-full h-full object-center object-cover rounded-4xl overflow-hidden')}/>
                  </div>
              )}
            </div>
          </Container>
          </div>

    );
  }
};

export default MediaSection;
