'use client';
import {type FC, useEffect, useState} from 'react';
import {type Content} from '@prismicio/client';
import {PrismicRichText, type SliceComponentProps} from '@prismicio/react';
import {Container} from '@/components/ui/container';
import {Heading} from '@/components/ui/text';
import {createClient} from '@/prismicio';
import Slider from '@/components/features/slider/slider';
import {PrismicNextImage} from '@prismicio/next';
import cn from 'clsx';
import {buttonVariants} from '@/components/ui/button';
import {ArrowRight} from 'lucide-react';
import Link from 'next/link';
import BentoWrapper from '@/components/features/bento/bento-wrapper';
import BentoCard from '@/components/features/bento/bento-card';
import {SliderCard} from '@/components/features/slider/slider-card';

/**
 * Props for `CaseStudies`.
 */
export type CaseStudiesProps = SliceComponentProps<Content.CaseStudiesSlice>;

/**
 * Component for "CaseStudies" Slices.
 */
const CaseStudies: FC<CaseStudiesProps> = ({slice}) => {
  const [caseStudies, setCaseStudies] = useState<Content.CaseStudiesDocument<string>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCaseStudies = async () => {
      try {
        const client = createClient();
        const data = await client.getAllByType('case_studies', {
          pageSize: 50,
          fetchLinks: ['condition.title']
        });
        setCaseStudies(data);
      } catch (err) {
        setError('Failed to fetch case studies');
        console.error('Error fetching case studies:', err);
      } finally {
        setLoading(false);
      }
    };

    void fetchCaseStudies();
  }, []);

  const controlsData = caseStudies.map((caseStudy: any) => ({
    title: caseStudy.data.client_name,
  }));

  if (loading) {
    return (
        <section data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
          <Container className={'lg:py-28 py-16 md:py-24'}>
            <div className="text-center">Loading case studies...</div>
          </Container>
        </section>
    );
  }

  if (error) {
    return (
        <section data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
          <Container className={'lg:py-28 py-16 md:py-24'}>
            <div className="text-center text-red-500">{error}</div>
          </Container>
        </section>
    );
  }

  if (slice.variation === 'bento') {
    return (
        <section data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
          <Container className={'lg:py-28 py-16 md:py-24'}>
            <Heading as={'h2'}>
              <PrismicRichText field={slice.primary.heading}/>
            </Heading>


            <BentoWrapper>
            {caseStudies && caseStudies.length > 0 ? (
                caseStudies.map((caseStudy: any, idx: number) => (
                    <BentoCard key={'case_studies_' + idx} columns={Math.floor(idx / 2) % 2 === 0 ? (idx % 2 === 0 ? 4 : 2) : (idx % 2 === 0 ? 2 : 4)}>
                      <div
                          key={'case_studies_' + idx}
                          className="relative bg-secondary w-full h-full flex overflow-hidden rounded-3xl max-lg:rounded-4xl lg:rounded-4xl"
                      >
                        <PrismicNextImage
                            field={caseStudy.data.feature_image}
                            className="h-full w-full object-cover"
                        />
                        <div
                            className="absolute inset-0 rounded-lg bg-gradient-to-t from-primary-950/90 to-transparent max-lg:rounded-4xl lg:rounded-4xl overflow-hidden"/>
                          <div className={'absolute bottom-0 w-full p-7 md:p-10 lg:p-10 flex flex-col z-10'}>
                            <div className={'text-white text-3xl'}>{caseStudy.data.client_name}</div>
                            <div className={'text-primary-300 text-2xl'}>
                              {caseStudy.data.activity}{' '}
                              {caseStudy.data?.client_age && <span>({caseStudy.data.client_age})</span>}
                            </div>
                            <div className={'text-white text-xl'}>{caseStudy.data.condition.data?.title}</div>
                           <div className={'flex justify-end'}>
                                  <Link href={'/resources/case-studies/' + caseStudy.uid}
                                        className={cn(buttonVariants({variant: 'default', size: 'icon'}))}>
                                    <ArrowRight className={'h-4 w-4'} strokeWidth={4}/>
                                  </Link>
                                </div>
                          </div>
                      </div>
                    </BentoCard>
                ))
            ) : (
                <div className="text-center mt-10">No Case Studies found</div>
            )}
            </BentoWrapper>
          </Container>
        </section>
    );
  }

  if (slice.variation === 'default') {

    return (
        <Container as={'section'} padding={'lg'} fullWidth={true} data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
          <Container  className={'max-w-3xl mx-auto'}>
            <Heading as={'h2'} size={'xl'} className={'text-center content-master'}>
              <PrismicRichText field={slice.primary.heading}/>
            </Heading>
          </Container>

          <div className={'w-full'}>
            <Slider data={controlsData} size={'large'}>
              {caseStudies && caseStudies.length > 0 ? (
                  caseStudies.map((caseStudy: any, idx: number) => (
                      <SliderCard
                          index={idx}
                          key={`${caseStudy.uid}_${idx}`}
                          keyPrefix="case_studies"
                          aspectRatio={'portrait'}
                          size={'large'}
                          imageField={caseStudy.data.feature_image}
                          href={`/resources/case-studies/${caseStudy.uid}`}
                          title={caseStudy.data.client_name}
                          subtitle={`${caseStudy.data.activity}${
                              caseStudy.data?.client_age ? ` (${caseStudy.data.client_age})` : ''
                          }`}
                          description={caseStudy.data.condition.data?.title}
                      />
                  ))
              ) : (
                  <div className="text-center mt-10">No Case Studies found</div>
              )}
            </Slider>
          </div>
        </Container>
    );
  }

  return null;
};

export default CaseStudies;
