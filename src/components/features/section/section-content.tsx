import React from 'react';
import cn from 'clsx';
import {isFilled, type KeyTextField, type RichTextField, SelectField} from '@prismicio/client';
import SectionBody from '@/components/features/section/section-body';
import {Heading} from '@/components/ui/text';
import {PrismicRichText} from '@prismicio/react';
import SectionColumns from '@/components/features/section/section-columns';

interface SectionContentProps {
  heading?: KeyTextField | RichTextField | string;
  body?: RichTextField;
  color?: string;
  className?: string;
}

export const SectionContent = ({heading, body, color, className }: SectionContentProps) => {

  return (<SectionColumns heading={heading} color={color}>
        {isFilled.richText(body) && (
          <SectionBody body={body} color={color} className={className} />
        )}
      </SectionColumns>
  )
}

export default SectionContent;
