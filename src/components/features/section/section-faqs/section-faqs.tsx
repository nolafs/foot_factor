import { type KeyTextField, type RichTextField } from '@prismicio/client';
import FaqItem from './faq-item';
import type {FAQ} from '@/types/faq.type';
import {Heading} from '@/components/ui/text';
import {PrismicRichText} from '@prismicio/react';

interface SectionFagsProps {
  data: {
    headings: RichTextField | null | undefined;
    faqs: FAQ[];
  };

  color?: 'A' | 'B' | 'C';
}

export function SectionFaqs({ data: { headings, faqs }, color = 'C' }: SectionFagsProps) {
  return (
    <div className="lg:grid lg:grid-cols-12 lg:gap-8">
      <div className="lg:col-span-5">
        <Heading as="h2" >
          <PrismicRichText field={headings} />
        </Heading>
      </div>
      <div className="mt-10 lg:col-span-7 lg:mt-0">
        <dl className="space-y-5">
          {faqs.map((faq, idx) => (
            <FaqItem key={`${faq.id}-${idx}`} heading={faq.data.heading} body={faq.data.body} />
          ))}
        </dl>
      </div>
    </div>
  );
}

export default SectionFaqs;
