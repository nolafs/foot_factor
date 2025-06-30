import {Body, Heading} from '@/components/ui/text';
import { type Cta } from '@/types';
import { PrismicRichText } from '@prismicio/react';
import {Container} from '@/components/ui/container';
import ButtonRow from '@/components/ui/button-row';
import React from 'react';

export function CallToAction({ heading, body, links, hasBooking = false, bookingLabel = 'Book now' }: Cta) {
  return (
    <section className="flex justify-center text-center bg-primary">
      <Container className={'max-w-4xl lg:py-28 py-16 md:py-24 lg:pb-32'}>

        <Heading as={'h2'} primary={true} dark={true} className={'content-master text-animation'}>
          {typeof heading === 'string' ? (
              heading
          ) : (
              <PrismicRichText field={heading}/>
          )}
        </Heading>

      <Body>
        <PrismicRichText field={body} />
      </Body>
      {links && (
        <div className="mx-auto mt-6 flex flex-col items-center justify-center gap-2 md:flex-row">
          <ButtonRow hasBooking={hasBooking} bookingLabel={bookingLabel ?? 'Book Now'} hasArrow={true} links={links}/>
        </div>
      )}
      </Container>
    </section>
  );
}
