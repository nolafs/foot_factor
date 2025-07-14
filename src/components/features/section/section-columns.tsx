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
}

export const SectionColumns = ({
                                   heading,
                                   color,
                                   contentRef,
                                   classNames = 'w-full content-master text-animation font-medium font-heading text-3xl sm:text-4xl md:text-5xl leading-normal lg:text-6xl lg:leading-[72px]',
                                   children}: SectionColumnsProps) => {

  return (
      <div className={'flex flex-col md:flex-row gap-5 md:gap-8'}>
          <div className={'w-full md:w-1/4 lg:w-5/12'}>

              {Array.isArray(heading) && isFilled.richText(heading) ? (
                  <div className={cn('font-heading font-medium text-2xl md:text-3xl lg:text-4xl')}>
                  <PrismicRichText field={heading}/>
                  </div>
                  ) : (heading && typeof heading === 'string' && (
                  <Heading color={color} as={'h2'} className={cn('text-2xl md:text-3xl lg:text-4xl'
                  )}>{heading}</Heading>)
              )}
          </div>
          <div ref={contentRef}
               className={classNames}>
              {children}
          </div>
      </div>
  )
}

export default SectionColumns;
