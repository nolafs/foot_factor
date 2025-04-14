'use client';
import {KeyTextField, RichTextField} from '@prismicio/client';
import React from 'react';
import {Container} from '@/components/ui/container';
import {PrismicRichText} from '@prismicio/react';

interface SectionDefaultProps {
    heading?: KeyTextField | string;
    body?: RichTextField;
    animated?: boolean;
}

export const SectionDefault = ({heading, body, animated}: SectionDefaultProps) => {

  return (
      <section className={'w-full'}>
      <Container className={'lg:py-28 py-16 md:py-24'}>
          <div className={'flex gap-5 md:gap-8'}>
              <div className={'w-full sm:w-full md:w-1/4 lg:w-5/12'}>
                  <h2 className={'font-heading font-medium text-2xl md:text-3xl lg:text-4xl'}>{heading}</h2>
              </div>
              <div className={'w-full content-master font-medium font-heading text-3xl sm:text-4xl md:text-5xl leading-normal lg:text-6xl lg:leading-[72px]'}>
                  <PrismicRichText field={body} />
              </div>
          </div>
      </Container>

      </section>
  )
}

export default SectionDefault;
