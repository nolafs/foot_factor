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
      <Tag data-slice-type={slice_type} data-slice-variation={variation} className={cn('w-full relative', color === 'default' && 'bg-background', color === 'Accent' && 'bg-accent-50' , color === 'Primary' && 'bg-primary')}>

        {isFilled.image(image) && (
            <div className={'hidden lg:block absolute bottom-0 w-1/2'}>
              <PrismicNextImage field={image}
                                className={cn('w-full h-full object-cover object-center rounded-4xl overflow-hidden')}/>
            </div>
        )}


        <Container className={cn( 'py-16 md:py-24 lg:py-28')}>
            <div className={'grid grid-cols-1 lg:grid-cols-2 gap-y-20 lg:gap-x-10'}>
              <div className={'relative'}>{Array.isArray(heading) && isFilled.richText(heading) ? (
                    <PrismicRichText field={heading}/>
              ) : (heading && (

                        <Heading as={'h2'} color={
                          color?.toString() === 'Primary' ? 'Light' : color?.toString()
                        } className={cn('text-2xl md:text-3xl lg:text-4xl'
                        )}>{heading}</Heading>

              ))}
              </div>
              <div>
                <ul className={'flex flex-col'}>
                  {items && items.map((item, index) => (
                    <li key={index} className={'flex flex-col  py-14 first:pt-0 border-b border-primary-500 last:border-0'}>
                      <div className={'flex space-x-4 mb-2 items-center'}>
                      {isFilled.image(item.icon) && (
                        <div className={'shrink-0 w-20 h-20'}>
                          <PrismicNextImage field={item.icon} className={'w-full h-full object-cover'}/>
                        </div>
                      )}
                        {isFilled.keyText(item.heading) && (
                            <Heading as={'h3'} color={
                              color?.toString() === 'Primary' ? 'Light' : color?.toString()
                            } className={'text-3xl md:text-4xl lg:text-5xl'}>{item.heading}</Heading>
                        )}
                      </div>
                      <div>

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
