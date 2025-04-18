'use client';
import {ImageField, isFilled, KeyTextField, LinkField, RichTextField} from '@prismicio/client';
import React from 'react';
import {Container} from '@/components/ui/container';
import {PrismicRichText} from '@prismicio/react';
import ButtonRow from '@/components/ui/button-row';
import {PrismicNextImage} from '@prismicio/next';
import cn from 'clsx';


interface SectionDefaultProps {
  as?: 'section' | 'div';
  heading?: RichTextField;
  body?: RichTextField;
  image?: ImageField;
  hasBooking?: boolean;
  links?: LinkField[];
  float: 'left' | 'right';
  bookingLabel?: KeyTextField | string
  variation?: 'contentImageFloatText' | 'contentImageFloatRight';
  slice_type?: string;
}

export const SectionContentImageFloatText = ({as = 'section',heading, body, float = 'left', image, links, hasBooking, bookingLabel, variation, slice_type}: SectionDefaultProps) => {
  const Tag = as; //
    return (
      <Tag data-slice-type={slice_type} data-slice-variation={variation} className={cn('relative w-full h-full max-h-svh isolated overflow-hidden')}>

            <div className={'w-full h-full flex justify-center'}>
              <PrismicNextImage field={image}
                                className={cn('w-full h-full object-center object-cover')}/>
            </div>
        <div className={'absolute z-10 top-0 left-0 w-full'}>
          <Container className={'lg:py-28 py-16 md:py-24'}>
            <div className={cn('flex flex-col gap-5 md:gap-8 lg:gap-10', float === 'left' ? 'md:flex-row' : 'md:flex-row-reverse')}>
              <div className={cn('flex flex-col w-full md:w-6/12 lg:w-6/12 xl:w-5/12  pt-16 md:pt-24 lg:py-32')}>
                {isFilled.richText(heading) && (
                <div
                    className={'content-master text-animation font-medium font-heading text-3xl sm:text-4xl md:text-5xl mb-10 leading-normal lg:text-5xl xl:text-6xl  lg:leading-[72px]'}>
                  <PrismicRichText field={heading}/>
                </div>
                )}
                  <div className={cn('w-full flex flex-col  prose prose-sm md:prose-base lg:prose-lg max-w-none',
                      'prose-a:text-accent prose-a:no-underline hover:prose-a:underline',
                      'prose-strong:text-primary-950 prose-headings:!text-primary-500 prose-headings:mt-0 text-primary-500 '
                      )}>
                      <PrismicRichText field={body}/>
                  </div>
                <div className="flex flex-col gap-x-3 gap-y-4 sm:flex-row">
                  <ButtonRow hasBooking={hasBooking} bookingLabel={bookingLabel ?? 'Book Now'} hasArrow={true}
                             links={links}/>
                </div>
              </div>
            </div>
          </Container>
        </div>
      </Tag>
  )
}

export default SectionContentImageFloatText;
