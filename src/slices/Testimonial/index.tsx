import { type Content } from '@prismicio/client';
import { type SliceComponentProps } from '@prismicio/react';
import { TestimonialSingle } from '@/components/features/testimonial/testimonial-single';


/**
 * Props for `Testimonial`.
 */
export type TestimonialProps = SliceComponentProps<Content.TestimonialSlice>;

/**
 * Component for "Testimonial" Slices.
 */
const Testimonial = ({ slice }: TestimonialProps): JSX.Element => {
  if (slice.variation === 'default') {
    return (
        <TestimonialSingle
          body={slice.primary.body}
          image={slice.primary.image}
          name={slice.primary.name}
          position={slice.primary.position}
        />
    );
  }

  return <></>;
};

export default Testimonial;
