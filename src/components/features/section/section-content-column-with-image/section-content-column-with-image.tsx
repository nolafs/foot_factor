'use client';
import {type ImageField, isFilled, type KeyTextField, type RichTextField, type SelectField} from '@prismicio/client';
import React from 'react';
import {Container} from '@/components/ui/container';
import {PrismicNextImage} from '@prismicio/next';
import cn from 'clsx';
import SectionContent from '@/components/features/section/section-content';
import SectionColumns from '@/components/features/section/section-columns';
import SectionBody from '@/components/features/section/section-body';


interface SectionDefaultProps {
  as?: 'section' | 'div';
  heading?: KeyTextField | string;
  subheading?: RichTextField;
  body?: RichTextField;
  image?: ImageField;
  color?: SelectField;
  style?: 'framed' | 'full'
  variation?:  'contentWithImageColumn' | 'contentNoImageColumn' | 'contentWithImageFull' | 'contentWithImageColumnList' | 'contentColumnList';
  slice_type?: string;
}

export const SectionContentColumnWithImage = ({as = 'section',heading, body, image, color, style='framed', variation, slice_type}: SectionDefaultProps) => {
  const Tag = as; //
    return (
      <Tag data-slice-type={slice_type} data-slice-variation={variation} className={cn('w-full', color === 'default' && 'bg-background', color === 'Accent' && 'bg-accent-50' , color === 'Primary' && 'bg-primary')}>
        {image && isFilled.image(image) && style === 'full' && (
              <div className={'w-full flex justify-center'}>
                <PrismicNextImage field={image}
                                  className={cn('w-full h-auto object-center object-fit')}/>
              </div>
          )
        }
        <Container className={cn(style === 'framed' && 'py-16 md:py-24 lg:py-28')}>
          {image && isFilled.image(image) &&
          style === 'framed' && (
            <div className={'flex flex-col gap-5 md:gap-8 lg:gap-10'}>
                {image && (
                    <div className={'w-full flex justify-center'}>
                        <PrismicNextImage field={image} className={cn('w-full h-auto object-center object-fit rounded-4xl overflow-hidden')} />
                    </div>
                )}
            </div>)
          }
          <div className={style === 'full' ? 'my-8 md:my-16 lg:my-20' : isFilled.image(image) ? 'mt-8 md:mt-16 lg:mt-20' : 'mt-0'}>
          <SectionColumns heading={heading}  color={color?.toString()} classNames={''} >
            {isFilled.richText(body) && <SectionBody body={body}  color={color?.toString()}/> }
          </SectionColumns>
          </div>
        </Container>
      </Tag>
  )
}

export default SectionContentColumnWithImage;
