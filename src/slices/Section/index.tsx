import { FC } from 'react';
import { Content } from '@prismicio/client';
import { SliceComponentProps } from '@prismicio/react';
import SectionDefault from '@/components/features/section/section-default/section-default';
import SectionContentWithButton
  from '@/components/features/section/section-content-with-button/section-content-with-button';

/**
 * Props for `Section`.
 */
export type SectionProps = SliceComponentProps<Content.SectionSlice>;

/**
 * Component for "Section" Slices.
 */
const Section: FC<SectionProps> = ({ slice }) => {

  if(slice.variation === 'contentWithLeadButtons') {
    return (
        <SectionContentWithButton
            heading={slice.primary.heading}
            subheading={slice.primary.subheading}
            body={slice.primary.body}
            links={slice.primary.links}
            hasBooking={slice.primary.has_booking}
            bookingLabel={slice.primary.booking_label}
        />
    );
  }

  if(slice.variation === 'default') {
    return (
        <SectionDefault heading={slice.primary.heading} body={slice.primary.body} animated={slice.primary.animated}/>
    );
  }
};

export default Section;
