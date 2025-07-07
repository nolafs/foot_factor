import React from 'react';
import cn from 'clsx';
import {isFilled, type KeyTextField, RichTextField, SelectField} from '@prismicio/client';
import SectionBody from '@/components/features/section/section-body';
import {Heading} from '@/components/ui/text';

interface SectionContentProps {
  heading?: KeyTextField | string;
  body?: RichTextField;
  color?: string;
  className?: string;
}

export const SectionContent = ({heading, body, color, className }: SectionContentProps) => {

  return (<>
        {isFilled.keyText(heading) && (
          <div className={cn( className ?? 'w-full sm:w-full md:w-1/4 lg:w-5/12')}>
              <Heading as={'h2'} className={cn('text-2xl md:text-3xl lg:text-4xl'
              )}>{heading}</Heading>
          </div>
        )}
        {isFilled.richText(body) && (
          <SectionBody body={body} color={color} className={className} />
        )}
      </>
  )
}

export default SectionContent;
