'use client';
import {KeyTextField, LinkField, RichTextField} from '@prismicio/client';
import React from 'react';
import {Container} from '@/components/ui/container';
import {PrismicRichText} from '@prismicio/react';
import ButtonRow from '@/components/ui/button-row';


interface SectionDefaultProps {
    heading?: KeyTextField | string;
    subheading?: RichTextField;
    body?: RichTextField;
    hasBooking?: boolean;
    bookingLabel?: KeyTextField | string
    links?: LinkField[];
}

export const SectionContentWithButton = ({heading, body, subheading, links, hasBooking, bookingLabel}: SectionDefaultProps) => {

    return (
      <section className={'w-full'}>
        <Container className={'lg:py-28 py-16 md:py-24'}>
            <div className={'flex gap-5 md:gap-8'}>
                <div className={'w-full sm:w-full md:w-1/4 lg:w-5/12'}>
                    <h2 className={'font-heading font-medium text-2xl md:text-3xl lg:text-4xl'}>{heading}</h2>
                </div>

                <div className={'w-full  flex flex-col gap-5 md:gap-8 lg:w-8/12'}>

                  <div className={'content-master text-animation font-medium font-heading text-3xl sm:text-4xl md:text-5xl leading-normal lg:text-6xl lg:leading-[72px]'}>
                    <PrismicRichText field={subheading} />
                  </div>

                  <div className={'lg:text-2xl text-primary-600'}>
                    <PrismicRichText field={body}/>
                  </div>
                  <div className="flex flex-col gap-x-3 gap-y-4 sm:flex-row">
                    <ButtonRow hasBooking={hasBooking} bookingLabel={bookingLabel ?? 'Book Now'} hasArrow={true} links={links}/>
                  </div>
                </div>

            </div>
        </Container>
      </section>
  )
}

export default SectionContentWithButton;
