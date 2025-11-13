'use client';
import {type ImageField, isFilled, type KeyTextField, type LinkField, type RichTextField} from '@prismicio/client';
import React from 'react';
import {Container} from '@/components/ui/container';
import {PrismicRichText} from '@prismicio/react';
import ButtonRow from '@/components/ui/button-row';
import {PrismicNextImage} from '@prismicio/next';
import cn from 'clsx';
import {Body, Heading} from '@/components/ui/text';
//import useParallax from '@/lib/hooks/use-parallax';

//TODO: ADD PARALLAX BACK

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

    //const parallax = useParallax(0.8, true);


  return (
      <Container as={as} fullWidth={true} data-slice-type={slice_type} color={'default'} data-slice-variation={variation} className={cn('relative w-full h-full isolated overflow-hidden')}>


        <div className={'relative mb-10 md:mb-0 md:absolute z-10 top-0 left-0 w-full'}>
          <Container>
            <div className={cn('flex flex-col gap-5 md:gap-8 lg:gap-10', float === 'left' ? 'md:flex-row' : 'md:flex-row-reverse')}>
              <div className={cn('flex flex-col w-full md:w-6/12 lg:w-6/12 xl:w-5/12  pt-16 md:pt-24 lg:py-32')}>
                {isFilled.richText(heading) && (
                    <Heading as={'h2'} primary={true} className={'content-master text-animation'}>
                      <PrismicRichText field={heading}/>
                    </Heading>
                )}
                {isFilled.richText(body) && (
                    <Body>
                      <PrismicRichText field={body}/>
                    </Body>
                )}
                <div className="flex flex-col gap-x-3 gap-y-4 sm:flex-row">
                  <ButtonRow hasBooking={hasBooking} bookingLabel={bookingLabel ?? 'Book Now'} hasArrow={true}
                             links={links}/>
                </div>
              </div>
            </div>
          </Container>
        </div>
        <div className={'w-full h-full flex justify-center'}>
          <PrismicNextImage field={image}
                            className={cn('w-full h-full object-center object-cover')}/>
        </div>
      </Container>
  )
}

export default SectionContentImageFloatText;
