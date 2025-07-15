import React, {RefObject} from 'react';
import {isFilled, KeyTextField, RichTextField} from '@prismicio/client';
import {Heading} from '@/components/ui/text';
import cn from 'clsx';
import {PrismicRichText} from '@prismicio/react';

interface SectionColumnsProps {
  heading?: KeyTextField | RichTextField | string;
  color?: string;
  contentRef?: RefObject<HTMLDivElement>;
  children: React.ReactNode;
  classNames?: string;
  columnSize?: 'default' | 'small' | 'large';
}

export const SectionColumns = ({
                                   heading,
                                   color,
                                   contentRef,
                                   columnSize,
                                   classNames = 'content-master text-animation font-medium font-heading text-3xl sm:text-4xl lg:text-5xl leading-snug  lg:text-6xl lg:leading-[72px]',
                                   children}: SectionColumnsProps) => {

  const colSize = {
    left: 'w-full md:w-4/12 lg:w-5/12',
    right: 'w-full md:w-8/12 lg:w-7/12'
  };


  if(columnSize === 'small') {
    colSize.left = 'w-full md:w-2/12 lg:w-3/12';
    colSize.right = 'w-full md:w-10/12 lg:w-9/12';
  } else if(columnSize === 'large') {
    colSize.left = 'w-full md:w-5/12 lg:w-6/12';
    colSize.right = 'w-full md:w-7/12 lg:w-6/12';
  }


  return (
      <div className={'flex flex-col md:flex-row gap-5 md:gap-24 lg:gap-48'}>
          <div className={colSize.left}>
              {Array.isArray(heading) && isFilled.richText(heading) ? (
                  <div className={cn('content-master font-heading font-medium text-2xl md:text-3xl lg:text-4xl')}>
                  <PrismicRichText field={heading}/>
                  </div>
                  ) : (heading && typeof heading === 'string' && (
                  <Heading color={color} as={'h2'} className={cn('text-2xl md:text-3xl lg:text-4xl'
                  )}>{heading}</Heading>)
              )}
          </div>
          <div ref={contentRef}
               className={cn(colSize.right, classNames)}>
              {children}
          </div>
      </div>
  )
}

export default SectionColumns;
