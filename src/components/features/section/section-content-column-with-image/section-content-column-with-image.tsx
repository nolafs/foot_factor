'use client';
import {type ImageField, type KeyTextField,  type RichTextField, type SelectField} from '@prismicio/client';
import React from 'react';
import {Container} from '@/components/ui/container';
import {PrismicNextImage} from '@prismicio/next';
import cn from 'clsx';
import SectionContent from '@/components/features/section/section-content';


interface SectionDefaultProps {
  as?: 'section' | 'div';
  heading?: KeyTextField | string;
  subheading?: RichTextField;
  body?: RichTextField;
  image?: ImageField;
  color?: SelectField;
  style?: 'framed' | 'full'
  variation?: 'contentWithImageColumnList' | 'contentWithImageFull' | 'contentWithImageColumn' ;
  slice_type?: string;
}

export const SectionContentColumnWithImage = ({as = 'section',heading, body, image, color, style='framed', variation, slice_type}: SectionDefaultProps) => {
  const Tag = as; //
    return (
      <Tag data-slice-type={slice_type} data-slice-variation={variation} className={cn('w-full', color === 'default' && 'bg-background', color === 'Accent' && 'bg-accent-50' , color === 'Primary' && 'bg-primary')}>
        {style === 'full' && (
            <div className={'w-full flex justify-center aspect-w-16 aspect-h-9 '}>
              <PrismicNextImage field={image}
                                className={cn('w-full h-full object-center object-cover')}/>
            </div>
        )}
        <Container className={cn(style === 'framed' && 'lg:py-28 py-16 md:py-24')}>
          {style === 'framed' && (
            <div className={'flex flex-col gap-5 md:gap-8 lg:gap-10'}>
                {image && (
                    <div className={'w-full flex justify-center aspect-w-16 aspect-h-9 '}>
                        <PrismicNextImage field={image} className={cn('w-full h-full object-center object-cover rounded-4xl overflow-hidden')} />
                    </div>
                )}
            </div>)}
            <div className={'flex flex-col md:flex-row pt-16 md:pt-24 lg:py-32'}>
                <SectionContent body={body} heading={heading} color={color?.toString()}/>
            </div>
        </Container>
      </Tag>
  )
}

export default SectionContentColumnWithImage;
