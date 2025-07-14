import React, { FC } from 'react';
import {Content} from '@prismicio/client';
import {SliceComponentProps} from '@prismicio/react';
import {Container} from '@/components/ui/container';
import SectionColumns from '@/components/features/section/section-columns';

import ReviewSliderElfsight from '@/components/features/reviews/review-slider-elfsight';

/**
 * Props for `Reviews`.
 */
export type ReviewsProps = SliceComponentProps<Content.ReviewsSlice>;

/**
 * Component for "Reviews" Slices.
 */
const Reviews: FC<ReviewsProps> = ({ slice }) => {
  return (
      <Container as={'section'} padding={'lg'} data-slice-type={slice.slice_type}
                 data-slice-variation={slice.variation} color={'default'}>
        <SectionColumns heading={slice.primary.heading} columnSize={'small'} classNames="">
          <ReviewSliderElfsight share_link={slice.primary.share_link} />
        </SectionColumns>
      </Container>
  );
};

export default Reviews;
