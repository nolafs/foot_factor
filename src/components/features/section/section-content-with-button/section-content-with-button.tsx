'use client';
import {type KeyTextField, type LinkField, type RichTextField} from '@prismicio/client';
import React from 'react';
import {Container} from '@/components/ui/container';
import {PrismicRichText} from '@prismicio/react';
import ButtonRow from '@/components/ui/button-row';
import SectionColumns from '@/components/features/section/section-columns';


interface SectionDefaultProps {
    heading?: KeyTextField | string;
    subheading?: RichTextField;
    body?: RichTextField;
    hasBooking?: boolean;
    bookingLabel?: KeyTextField | string
    links?: LinkField[];
    variation?: 'contentWithLeadButtons'
    slice_type?: string;
}

export const SectionContentWithButton = ({heading, body, subheading, links, hasBooking, bookingLabel, variation, slice_type}: SectionDefaultProps) => {

    return (
        <Container as={'section'} padding={'lg'} data-slice-type={slice_type} data-slice-variation={variation}>
          <SectionColumns heading={heading}  classNames={''}>
            <div
                className={'content-master text-animation font-medium font-heading text-3xl sm:text-4xl md:text-5xl leading-normal lg:text-6xl lg:leading-[72px]'}>
              <PrismicRichText field={subheading}/>
            </div>

            <div className={'lg:text-2xl text-primary-600 mt-5'}>
              <PrismicRichText field={body}/>
            </div>
            <div className="flex flex-col gap-x-3 gap-y-4 sm:flex-row">
              <ButtonRow hasBooking={hasBooking} bookingLabel={bookingLabel ?? 'Book Now'} hasArrow={true}
                         links={links}/>
            </div>
          </SectionColumns>
        </Container>
  )
}

export default SectionContentWithButton;
