import React, { FC } from 'react';
import {Content, isFilled} from '@prismicio/client';
import {SliceComponentProps} from '@prismicio/react';
import {Container} from '@/components/ui/container';
import SectionColumns from '@/components/features/section/section-columns';

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
                 data-slice-variation={slice.variation}>

        <SectionColumns heading={slice.primary.heading} classNames={''}>
          {isFilled.keyText(slice.primary.embedded_code) && <div dangerouslySetInnerHTML={{__html: slice.primary.embedded_code.toString()}} />}
        </SectionColumns>
      </Container>
  );
};

export default Reviews;
