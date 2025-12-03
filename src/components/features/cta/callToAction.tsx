import { Body, Heading } from '@/components/ui/text';
import { type Cta } from '@/types';
import { PrismicRichText } from '@prismicio/react';
import { Container } from '@/components/ui/container';
import ButtonRow from '@/components/ui/button-row';
import React, { type ElementType } from 'react';

export function CallToAction({
  heading,
  body,
  links,
  hasBooking = false,
  bookingLabel = 'Book now',
  wave,
  comp = 'section',
  padding = 'lg',
}: Cta) {
  return (
    <Container as={comp as ElementType} padding={padding} color={'primary'} className={'text-center'} wave={wave}>
      <div className="mx-auto max-w-4xl">
        <Heading
          as={'header'}
          primary={true}
          dark={true}
          className={'content-master primary text-animation text-white'}>
          {typeof heading === 'string' ? <h2>{heading}</h2> : <PrismicRichText field={heading} />}
        </Heading>

        <Body>
          <PrismicRichText field={body} />
        </Body>
        {links && (
          <div className="mx-auto mt-6 flex flex-col items-center justify-center gap-2 md:flex-row">
            <ButtonRow
              hasBooking={hasBooking}
              bookingLabel={bookingLabel ?? 'Book Now'}
              hasArrow={true}
              links={links}
            />
          </div>
        )}
      </div>
    </Container>
  );
}
