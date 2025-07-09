import { type FC } from 'react';
import { type Content } from '@prismicio/client';
import { type SliceComponentProps } from '@prismicio/react';
import Steps from '@/components/features/steps/steps';

/**
 * Props for `VerticalStepsWithImages`.
 */
export type VerticalStepsWithImagesProps = SliceComponentProps<Content.VerticalStepsWithImagesSlice>;

/**
 * Component for "VerticalStepsWithImages" Slices.
 */
const VerticalStepsWithImages: FC<VerticalStepsWithImagesProps> = ({ slice }) => {
  return (
    <section data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
      <Steps data={slice.primary.steps} />
    </section>
  );
};

export default VerticalStepsWithImages;
