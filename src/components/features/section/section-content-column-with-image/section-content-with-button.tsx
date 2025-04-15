'use client';
import {ImageField, KeyTextField, LinkField, RichTextField, SelectField} from '@prismicio/client';
import React from 'react';
import {Container} from '@/components/ui/container';
import {PrismicRichText} from '@prismicio/react';
import ButtonRow from '@/components/ui/button-row';
import {PrismicNextImage} from '@prismicio/next';
import cn from 'clsx';


interface SectionDefaultProps {
  as?: 'section' | 'div';
  heading?: KeyTextField | string;
  subheading?: RichTextField;
  body?: RichTextField;
  image?: ImageField;
  color?: SelectField;
}

export const SectionContentColumnWithImage = ({as = 'section',heading, body, image, color}: SectionDefaultProps) => {
  const Tag = as; //
    return (
      <Tag className={cn('w-full', color === 'default' && 'bg-background', color === 'Accent' && 'bg-accent-50')}>
        <Container className={'lg:py-28 py-16 md:py-24'}>
            <div className={'flex flex-col gap-5 md:gap-8 lg:gap-10'}>
                {image && (
                    <div className={'w-full flex justify-center aspect-w-16 aspect-h-9 '}>
                        <PrismicNextImage field={image} className={'w-full h-full object-center object-cover rounded-4xl overflow-hidden'} />
                    </div>
                )}
            </div>
            <div className={'flex flex-col md:flex-row pt-16 md:pt-24 lg:py-32'}>
                <div className={'w-full sm:w-full md:w-1/4 lg:w-5/12'}>
                    <h2 className={'font-heading mb-5 font-medium text-2xl md:text-3xl lg:text-4xl'}>{heading}</h2>
                </div>

                <div className={'w-full flex flex-col lg:w-8/12 prose prose-sm md:prose-base lg:prose-lg prose-strong:text-primary-950 prose-headings:!text-primary-500 prose-headings:mt-0 text-primary-500 max-w-none'}>
                    <PrismicRichText field={body}/>
                </div>
            </div>
        </Container>
      </Tag>
  )
}

export default SectionContentColumnWithImage;
