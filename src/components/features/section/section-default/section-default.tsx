'use client';
import {type KeyTextField, type RichTextField} from '@prismicio/client';
import React ,{useRef} from 'react';
import {Container} from '@/components/ui/container';
import {PrismicRichText} from '@prismicio/react';
import {useTextAnimation} from '@/lib/hooks/use-text-animation';


interface SectionDefaultProps {
    heading?: KeyTextField | string;
    body?: RichTextField;
    animated?: boolean;
    variation?: 'default';
    slice_type?: string;
}

export const SectionDefault = ({heading, body, animated, slice_type, variation}: SectionDefaultProps) => {

  const {containerRef, triggerRef} = useTextAnimation({enabled: true, refreshDelay: 200});


    return (
        <Container as={'section'} ref={triggerRef} padding={'lg'} data-slice-type={slice_type}
                   data-slice-variation={variation}>
            <div className={'flex flex-col md:flex-row gap-5 md:gap-8'}>
                <div className={'w-full md:w-1/4 lg:w-5/12'}>
                    <h2 className={'font-heading font-medium text-2xl md:text-3xl lg:text-4xl'}>{heading}</h2>
                </div>
                <div ref={containerRef} className={'w-full content-master text-animation font-medium font-heading text-3xl sm:text-4xl md:text-5xl leading-normal lg:text-6xl lg:leading-[72px]'}>
                    <PrismicRichText field={body} />
                </div>
            </div>
        </Container>
  )
}

export default SectionDefault;
