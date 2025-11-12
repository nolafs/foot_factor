'use client'
import React, {useEffect, useState} from 'react';
import {createClient} from '@/prismicio';
import {type FaqDocument} from '@/prismic-types';
import {filter, isFilled, type KeyTextField, type RichTextField} from '@prismicio/client';
import {Heading, Subheading} from '@/components/ui/text';
import {PrismicRichText} from '@prismicio/react';
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from '@/components/ui/accordion';



interface SectionFaqsByCategoryProps {
  heading: RichTextField;
  subtitle: KeyTextField | string;
  category: string;
  color?: string;
}

const getFaqsByCategory = async (category:string) => {
  const client = createClient();

  console.log('category', category)

  return await client.getByType('faq', {
    pageSize: 20,
    fetchLinks: ['faq_category.name'],
    filters: [
        filter.at('my.faq.show_on_faqs', true),
        filter.at('my.faq.category', category)
    ]
  })
}


export const SectionFaqsByCategory = ({heading, subtitle, category}: SectionFaqsByCategoryProps) => {

  const [faqItems, setFaqItems] = useState<FaqDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const data = await getFaqsByCategory(category)
        setFaqItems(data.results);
      } catch (err) {
        setError('Failed to fetch FAQs');
        console.error('Error fetching FAQs:', err);
      } finally {
        setLoading(false);
      }
    };

    void fetchFaqs();
  }, []);


  if (loading) {
    return (
        <div>
          <div className="text-center">Loading faqs...</div>
        </div>
    );
  }

  if (error) {
    return (
        <div>
          <div className="text-center text-red-500">{error}</div>
        </div>
    );
  }

  if(faqItems.length === 0) {
    return null
  }


  return (<>

        <div className={'text-center mb-10'}>
          {isFilled.keyText(subtitle) &&
					  <Subheading className="text-center">{subtitle}</Subheading>}
          {isFilled.richText(heading) && (
              <Heading as="h2">
                <PrismicRichText field={heading}/>
              </Heading>
          )}
        </div>


        <Accordion type="single" collapsible className={'px-0'}>
          {faqItems.map((faq, idx) => (
              <AccordionItem key={`faq-key-${idx}`} value={`faq-${idx}`}>
                <AccordionTrigger className={'text-left'}>{faq.data.heading}</AccordionTrigger>
                <AccordionContent>
                  <div className={'md:prose-md prose prose-sm prose-neutral'}>
                    <PrismicRichText field={faq.data.body}/>
                  </div>
                </AccordionContent>
              </AccordionItem>
          ))}
        </Accordion>
      </>
  )
}

export default SectionFaqsByCategory;
