import { type Content } from '@prismicio/client';
import { type SliceComponentProps } from '@prismicio/react';
import { Bounded } from '@/components/ui/bounded';
import { CallToAction as CallToActionComponent } from '@/components/features/cta/callToAction';

import React from 'react';
import { CallToActionVideo } from '@/components/features/cta/callToAction-video';
import CallToActionTwoColumns from '@/components/features/cta/callToAction-two-columns';

/**
 * Props for `CallToAction`.
 */
export type CallToActionProps = SliceComponentProps<Content.CallToActionSlice>;

/**
 * Component for "CallToAction" Slices.
 */
const CallToAction = ({ slice }: CallToActionProps): JSX.Element => {

  if(slice.variation === 'ctaTwoColumns') {
    return (
        <CallToActionTwoColumns
            heading={slice.primary.heading}
            body={slice.primary.body}
            links={slice.primary.links}
            image={slice.primary.image}
            hasBooking={slice.primary.has_booking}
            bookingLabel={slice.primary.booking_label}
        />
    );
  }


  if (slice.variation === 'embedVideo') {
    return (
      <CallToActionVideo
        heading={slice.primary.heading}
        video={slice.primary.video}
        body={slice.primary.body}
        links={slice.primary.links}
      />
    );
  }

  return (
      <CallToActionComponent
          heading={slice.primary.heading}
          body={slice.primary.body}
          links={slice.primary.links}
          hasBooking={slice.primary.has_booking}
          bookingLabel={slice.primary.booking_label}
      />
  );
};

export default CallToAction;
