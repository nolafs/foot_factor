'use client';
import {type ImageField, isFilled, type KeyTextField, type RichTextField, type SelectField} from '@prismicio/client';
import React from 'react';
import {Container} from '@/components/ui/container';
import {PrismicNextImage} from '@prismicio/next';
import cn from 'clsx';
import SectionContent from '@/components/features/section/section-content';
import {SectionSliceContentTwoColumnIconListPrimaryItemsItem} from '@/prismic-types';
import {PrismicRichText} from '@prismicio/react';
import {Heading} from '@/components/ui/text';


interface SectionDefaultProps {
  as?: 'section' | 'div';
  heading?: KeyTextField | RichTextField | string;
  items?: SectionSliceContentTwoColumnIconListPrimaryItemsItem[],
  image?: ImageField;
  color?: SelectField;
  variation?: 'contentTwoColumnIconList' ;
  slice_type?: string;
}

export const SectionContentColumnListImage = ({as = 'section',heading, items, image, color,  variation, slice_type}: SectionDefaultProps) => {
  const Tag = as; //
    return (
      <Tag data-slice-type={slice_type} data-slice-variation={variation} className={cn('w-full', color === 'default' && 'bg-background', color === 'Accent' && 'bg-accent-50' , color === 'Primary' && 'bg-primary')}>
        <Container className={cn( 'lg:py-28 py-16 md:py-24')}>
            <div className={'grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10'}>
              <div>{Array.isArray(heading) && isFilled.richText(heading) ? (
                    <PrismicRichText field={heading}/>
              ) : (heading && (

                        <Heading as={'h2'} color={
                          color?.toString() === 'Primary' ? 'Light' : color?.toString()
                        } className={cn('text-2xl md:text-3xl lg:text-4xl'
                        )}>{heading}</Heading>

              ))}</div>
              <div>
                <ul>
                  {items && items.map((item, index) => (
                    <li key={index} className={'flex items-start gap-4 mb-6 border-b border-primary-200 pb-6 last:border-0'}>
                      {isFilled.image(item.icon) && (
                        <div className={'shrink-0 w-20 h-20'}>
                          <PrismicNextImage field={item.icon} className={'w-full h-full object-cover'}/>
                        </div>
                      )}
                      <div>
                        {isFilled.keyText(item.heading) && (
                          <Heading as={'h3'} color={
                            color?.toString() === 'Primary' ? 'Light' : color?.toString()
                          } className={'text-lg font-semibold'}>{item.heading}</Heading>
                        )}
                        {isFilled.richText(item.body) && (
                          <p className={cn(color === 'Primary' ? 'text-gray-400' : 'text-gray-700', 'mt-2')}>
                            <PrismicRichText field={item.body}/>
                          </p>
                        )}
                      </div>
                    </li>)
                  )}
                </ul>
              </div>
            </div>
        </Container>
      </Tag>
  )
}

export default SectionContentColumnListImage;
