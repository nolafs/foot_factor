import {Body, Heading} from '@/components/ui/text';
import { type Cta } from '@/types';
import { PrismicRichText } from '@prismicio/react';
import {Container} from '@/components/ui/container';
import ButtonRow from '@/components/ui/button-row';
import React from 'react';

export function CallToAction({ heading, body, links, hasBooking = false, bookingLabel = 'Book now', wave, comp = 'section', padding = 'lg' }: Cta) {
  return (
      <Container as={comp} padding={padding} color={'primary'} className={'text-center'} wave={wave}>
        <Heading as={'header'} primary={true} dark={true} className={'content-master primary text-white text-animation'}>
          {typeof heading === 'string' ? (
              <h2>{heading}</h2>
          ) : (
              <PrismicRichText field={heading} />
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
  );
}
