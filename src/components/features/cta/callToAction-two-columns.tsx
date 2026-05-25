import React from 'react';
import CallToActionWaveWrapper from '@/components/features/cta/cta-wave-wrapper';
import {
  type ImageFieldImage,
  isFilled,
  type KeyTextField,
  type LinkField,
  type Repeatable,
  type RichTextField,
} from '@prismicio/client';
import { PrismicNextImage } from '@prismicio/next';
import ButtonRow from '@/components/ui/button-row';
import { Body, Heading } from '@/components/ui/text';
import { PrismicRichText } from '@prismicio/react';

interface callToActionTwoColumnsProps {
  heading?: KeyTextField | RichTextField | string;
  body?: RichTextField;
  links: Repeatable<LinkField>;
  image?: ImageFieldImage;
  hasBooking?: boolean;
  bookingLabel?: KeyTextField | string;
}

export const callToActionTwoColumns = ({
  heading,
  body,
  links,
  image,
  hasBooking,
  bookingLabel,
}: callToActionTwoColumnsProps) => {
  return (
    <CallToActionWaveWrapper textAlign={'left'}>
      <div className={'grid grid-cols-1 gap-10 md:grid-cols-5'}>
        <div className={'md:col-span-3'}>
          <Heading
            as={'header'}
            primary={true}
            dark={true}
            className={'content-master primary text-animation text-white'}>
            {typeof heading === 'string' ? <h2>{heading}</h2> : <PrismicRichText field={heading} />}
          </Heading>
          {isFilled.richText(body) && (
            <Body className={'mt-4 !text-gray-300'} color={'Light'}>
              <PrismicRichText field={body} />
            </Body>
          )}
        </div>
        <div className={'flex items-center justify-center md:col-span-2 md:justify-end'}>
          <div className={'flex h-full flex-col items-center justify-stretch'}>
            <div className={'mt-5 grow'}>
              <PrismicNextImage field={image} />
            </div>
            <div className={'shrink'}>
              <ButtonRow
                hasBooking={hasBooking}
                bookingLabel={bookingLabel ?? 'Book Now'}
                hasArrow={true}
                links={links}
              />
            </div>
          </div>
        </div>
      </div>
    </CallToActionWaveWrapper>
  );
};

export default callToActionTwoColumns;
