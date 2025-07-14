import React from 'react';
import cn from 'clsx';
import {PrismicRichText} from '@prismicio/react';
import {type RichTextField, SelectField } from '@prismicio/client';
import {Body} from '@/components/ui/text';

interface SectionBodyProps {
    color?: string;
    body: RichTextField;
    className?: string;
}

export const SectionBody = ({body, color, className}: SectionBodyProps) => {

  return (
      <Body color={color} className={cn('w-full flex flex-col', className)}>
          <PrismicRichText field={body}/>
      </Body>
  )
}

export default SectionBody;
