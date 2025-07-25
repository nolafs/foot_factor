import { type SliceComponentProps } from '@prismicio/react';
import { SectionFaqs } from '@/components/features/faqs/section-faqs/section-faqs';
import { Container } from '@/components/ui/container';
import {type Content, KeyTextField, RichTextField} from '@prismicio/client';
import {CallToAction as CallToActionComponent} from '@/components/features/cta/callToAction';
import React from 'react';
import SectionFaqsByCategory from '@/components/features/faqs/section-faqs-by-category/section-faqs-by-category';
import {FaqDocument} from '@/prismic-types';


/**
 * Props for `Faqs`.
 */
export type FaqsProps = SliceComponentProps<Content.FaqsSlice>;

/**
 * Component for "Faqs" Slices.
 */
const Faqs = async ({ slice }: FaqsProps) => {


  if (slice.variation === 'columnCollapsible') {

    if(!slice.primary.category) {
      return (
          <Container as={'section'} padding={'lg'} color={slice.primary.color} data-slice-type={slice.slice_type}
                     data-slice-variation={slice.variation}>
            No category selected for this FAQ section.
          </Container>
      );
    }

    return (
        <Container as={'section'} padding={'lg'} color={slice.primary.color} data-slice-type={slice.slice_type}
                   data-slice-variation={slice.variation}>
          <SectionFaqsByCategory heading={slice.primary.heading} subtitle={slice.primary.subtitle} category={(slice.primary.category as unknown as {
            id: string
          })?.id } />
        </Container>
    );
  }


  return (
    <Container as={'section'} padding={'lg'} color={'accent'} data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>

      <SectionFaqs
        data={{
          headings: slice.primary.heading,
          faqs: slice.primary.faqs.map(item => item.faq as unknown as FaqDocument),
        }}
      />


    {slice.primary.has_cta && (<div className={'mt-20 md:mt-28 lg:mt-32 rounded-4xl overflow-hidden'}>
        <CallToActionComponent
            heading={slice.primary.cta_heading}
            body={slice.primary.cta_body}
            links={slice.primary.cta_links}
            wave={'default'}
            padding={'md'}
        />
          </div>
      )}

    </Container>
  );
};

export default Faqs;
