'use client';
import {type ImageField, isFilled, type KeyTextField, type RichTextField, type SelectField} from '@prismicio/client';
import React from 'react';
import {Container} from '@/components/ui/container';
import {PrismicNextImage} from '@prismicio/next';
import cn from 'clsx';
import SectionContent from '@/components/features/section/section-content';
import {Body, Heading} from '@/components/ui/text';
import {PrismicRichText} from '@prismicio/react';


interface SectionDefaultProps {
  as?: 'section' | 'div';
  heading?: KeyTextField | string;
  subheading?: RichTextField;
  body?: RichTextField;
  image?: ImageField;
  color?: SelectField;
  variation: 'contentImageTwoColumns';
  slice_type?: string;
}

export const SectionContentImageTwoColumns = ({as = 'section',heading, body, image, color, variation, slice_type}: SectionDefaultProps) => {
  const Tag = as; //
    return (
      <Tag data-slice-type={slice_type} data-slice-variation={variation} className={cn('w-full', color === 'default' && 'bg-background', color === 'Accent' && 'bg-accent-50' , color === 'Primary' && 'bg-primary')}>
        <Container className={cn( 'lg:py-28 py-16 md:py-24')}>
            <div className={'grid grid-cols-1 md:grid-cols-2 justify-center item-center  gap-5 md:gap-8 lg:gap-10'}>
              <div className={'order-first md:order-last flex flex-col justify-center'}>
                {image && (
                    <div className={'aspect-w-16 aspect-h-9 '}>
                        <PrismicNextImage field={image} className={cn('w-full h-full object-center object-cover rounded-4xl overflow-hidden')} />
                    </div>
                )}
              </div>
              <div className={'flex flex-col justify-center'}>
                <Heading as="h2" color={color?.toString()} className={'text-2xl md:text-3xl lg:text-4xl'}>
                  {heading}
                </Heading>
                {isFilled.richText(body) && (
                    <Body className={'mt-4'} color={color?.toString()}>
                      <PrismicRichText field={body} />
                    </Body>
                )}
              </div>
            </div>
        </Container>
      </Tag>
  )
}

export default SectionContentImageTwoColumns;
