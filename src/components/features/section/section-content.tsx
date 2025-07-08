import React from 'react';
import cn from 'clsx';
import {isFilled, type KeyTextField, RichTextField, SelectField} from '@prismicio/client';
import SectionBody from '@/components/features/section/section-body';
import {Heading} from '@/components/ui/text';
import {PrismicRichText} from '@prismicio/react';

interface SectionContentProps {
  heading?: KeyTextField | RichTextField | string;
  body?: RichTextField;
  color?: string;
  className?: string;
}

export const SectionContent = ({heading, body, color, className }: SectionContentProps) => {

  return (<>
        {Array.isArray(heading) && isFilled.richText(heading) ? (
            <div className={cn(className ?? 'w-full sm:w-full md:w-1/4 lg:w-5/12', 'mb-3')}>
              <PrismicRichText field={heading}/>
            </div>
        ) : ( heading && (
            <div className={cn(className ?? 'w-full sm:w-full md:w-1/4 lg:w-5/12', 'mb-3')}>
              <Heading as={'h2'} className={cn('text-2xl md:text-3xl lg:text-4xl'
              )}>{heading}</Heading>
            </div>)
        )}
        {isFilled.richText(body) && (
          <SectionBody body={body} color={color} className={className} />
        )}
      </>
  )
}

export default SectionContent;
