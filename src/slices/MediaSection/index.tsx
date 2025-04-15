import { FC } from 'react';
import { Content } from '@prismicio/client';
import { SliceComponentProps } from '@prismicio/react';

/**
 * Props for `MediaSection`.
 */
export type MediaSectionProps = SliceComponentProps<Content.MediaSectionSlice>;

/**
 * Component for "MediaSection" Slices.
 */
const MediaSection: FC<MediaSectionProps> = ({ slice }) => {



  if(slice.variation === 'sectionVideo') {
    <section data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
    </section>
  }


  return (
    <section data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
      Placeholder component for media_section (variation: {slice.variation}) Slices
    </section>
  );
};

export default MediaSection;
