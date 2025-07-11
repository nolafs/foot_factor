import {type KeyTextField, type RichTextField, isFilled} from '@prismicio/client';
import FaqItem from './faq-item';
import {Heading} from '@/components/ui/text';
import {PrismicRichText} from '@prismicio/react';
import {FaqDocument} from '@/prismic-types';




interface SectionFagsProps {
  data: {
    headings: RichTextField | null | undefined;
    faqs: FaqDocument[];
  };

  color?: 'A' | 'B' | 'C';
}

export function SectionFaqs({ data: { headings, faqs }, color = 'C' }: SectionFagsProps) {

  if(faqs.length === 0) {
    return null;
  }

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
              (isFilled.keyText(faq.data?.heading) && isFilled.richText(faq.data.body)) && <FaqItem key={`${faq.id}-${idx}`} heading={faq.data.heading} body={faq.data.body} />
          ))}
        </dl>
      </div>
    </div>
  );
}

export default SectionFaqs;
