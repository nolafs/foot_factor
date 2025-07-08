import React from 'react';
import CallToActionWaveWrapper from '@/components/features/cta/cta-wave-wrapper';
import SectionContent from '@/components/features/section/section-content';
import {type ImageFieldImage, KeyTextField, type LinkField, type Repeatable, RichTextField} from '@prismicio/client';
import {PrismicNextImage, PrismicNextLink} from '@prismicio/next';
import ButtonRow from '@/components/ui/button-row';

interface callToActionTwoColumnsProps {
    heading?: KeyTextField | RichTextField | string;
    body?: RichTextField;
    links: Repeatable<LinkField>;
    image?: ImageFieldImage,
    hasBooking?: boolean;
    bookingLabel?: KeyTextField | string;
}

export const callToActionTwoColumns = ({heading, body, links, image, hasBooking, bookingLabel}: callToActionTwoColumnsProps) => {

  return (
      <CallToActionWaveWrapper>
          <div className={'grid grid-cols-1 md:grid-cols-4'}>
              <div className={'md:col-span-3'}>
                  <SectionContent heading={heading} body={body} color={'primary'}/>
              </div>
              <div className={'md:col-span-1 flex items-center justify-center'}>
                  <div className={'flex flex-col justify-stretch items-center h-full'}>
                      <div className={'grow'}><PrismicNextImage field={image} /></div>
                      <div className={'shrink'}>
                          <ButtonRow hasBooking={hasBooking} bookingLabel={bookingLabel ?? 'Book Now'} hasArrow={true}
                                     links={links}/>
                      </div>
                  </div>
              </div>
          </div>
      </CallToActionWaveWrapper>
  )
}

export default callToActionTwoColumns;
