'use client';
import { type ImageField, isFilled, type KeyTextField, type LinkField, type RichTextField } from '@prismicio/client';
import React from 'react';
import { Container } from '@/components/ui/container';
import { PrismicRichText } from '@prismicio/react';
import ButtonRow from '@/components/ui/button-row';
import { PrismicNextImage } from '@prismicio/next';
import cn from 'clsx';
import { Body, Heading } from '@/components/ui/text';
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
  bookingLabel?: KeyTextField | string;
  variation?: 'contentImageFloatText' | 'contentImageFloatRight';
  slice_type?: string;
}

export const SectionContentImageFloatText = ({
  as = 'section',
  heading,
  body,
  float = 'left',
  image,
  links,
  hasBooking,
  bookingLabel,
  variation,
  slice_type,
}: SectionDefaultProps) => {
  //const parallax = useParallax(0.8, true);

  return (
    <Container
      as={as}
      fullWidth={true}
      data-slice-type={slice_type}
      color={'default'}
      data-slice-variation={variation}
      className={cn('isolated relative h-full w-full overflow-hidden')}>
      <div className={'relative left-0 top-0 z-10 mb-10 w-full md:absolute md:mb-0'}>
        <Container>
          <div
            className={cn(
              'flex flex-col gap-5 md:gap-8 lg:gap-10',
              float === 'left' ? 'md:flex-row' : 'md:flex-row-reverse',
            )}>
            <div className={cn('flex w-full flex-col pt-16 md:w-6/12 md:pt-24 lg:w-6/12 lg:py-32 xl:w-5/12')}>
              {isFilled.richText(heading) && (
                <Heading as={'h2'} primary={true} className={'content-master text-animation'}>
                  <PrismicRichText field={heading} />
                </Heading>
              )}
              {isFilled.richText(body) && (
                <Body color={'Dark'}>
                  <PrismicRichText field={body} />
                </Body>
              )}
              <div className="flex flex-col gap-x-3 gap-y-4 sm:flex-row">
                <ButtonRow
                  hasBooking={hasBooking}
                  bookingLabel={bookingLabel ?? 'Book Now'}
                  hasArrow={true}
                  links={links}
                />
              </div>
            </div>
          </div>
        </Container>
      </div>
      <div className={'flex h-full w-full justify-center'}>
        <PrismicNextImage field={image} className={cn('h-full w-full object-cover object-center')} />
      </div>
    </Container>
  );
};

export default SectionContentImageFloatText;
