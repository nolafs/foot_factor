import { FC } from 'react';
import { Content } from '@prismicio/client';
import { SliceComponentProps } from '@prismicio/react';
import SectionDefault from '@/components/features/section/section-default/section-default';

/**
 * Props for `Section`.
 */
export type SectionProps = SliceComponentProps<Content.SectionSlice>;

/**
 * Component for "Section" Slices.
 */
const Section: FC<SectionProps> = ({ slice }) => {
  return (
    <SectionDefault heading={slice.primary.heading} body={slice.primary.body} animated={slice.primary.animated}  />
  );
};

export default Section;
