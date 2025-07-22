'use client';
import {type KeyTextField, type RichTextField} from '@prismicio/client';
import React ,{useRef} from 'react';
import {Container} from '@/components/ui/container';
import {PrismicRichText} from '@prismicio/react';
import {useTextAnimation} from '@/lib/hooks/use-text-animation';
import SectionColumns from '@/components/features/section/section-columns';


interface SectionDefaultProps {
    heading?: KeyTextField | string;
    body?: RichTextField;
    variation?: 'default';
    slice_type?: string;
}

export const SectionDefault = ({heading, body, slice_type, variation}: SectionDefaultProps) => {

  const {containerRef, triggerRef} = useTextAnimation({enabled: true, refreshDelay: 200});


    return (
        <Container as={'section'} ref={triggerRef} padding={'lg'} data-slice-type={slice_type}
                   data-slice-variation={variation}>
          <SectionColumns heading={heading} contentRef={containerRef} columnSize={'small'} >
            <PrismicRichText field={body}/>
          </SectionColumns>

        </Container>
  )
}

export default SectionDefault;
