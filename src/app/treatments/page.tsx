import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import { SliceZone } from '@prismicio/react';
import { createClient } from '@/prismicio';
import { components } from '@/slices';
import React from 'react';
import HeroSimple, { type WaveType } from '@/components/features/hero/hero-simple';
import { Wave } from '@/components/wave';
import * as prismic from '@prismicio/client';
import { asImageSrc, isFilled } from '@prismicio/client';
import type { ResolvedOpenGraph } from 'next/dist/lib/metadata/types/opengraph-types';
import { Container } from '@/components/ui/container';
import BentoCard from '@/components/features/bento/bento-card';
import Link from 'next/link';
import { PrismicNextImage } from '@prismicio/next';
import { buttonVariants } from '@/components/ui/button';
import BentoWrapper from '@/components/features/bento/bento-wrapper';

type Params = { uid: string };

export async function generateMetadata(
  { params }: { params: Promise<Params> },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const client = createClient();
  const page = await client.getSingle('treatments').catch(() => notFound());

  let pageTitle = '';
  const parentMeta = await parent;
  const parentOpenGraph: ResolvedOpenGraph | null = parentMeta.openGraph ?? null;

  if (parentMeta?.title) {
    pageTitle = parentMeta.title.absolute;
  }

  return {
    title: `${isFilled.keyText(page.data.meta_title) ? page.data.meta_title : pageTitle}`,
    description: page.data.meta_description ?? parentMeta.description,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/treatments`,
      types: {
        'application/rss+xml': `${process.env.NEXT_PUBLIC_BASE_URL}/feed.xml`,
      },
    },
    openGraph: {
      title: isFilled.keyText(page.data.meta_title) ? page.data.meta_title : pageTitle,
      description: isFilled.keyText(page.data.meta_description) ? page.data.meta_description : '',
      images: isFilled.image(page.data.meta_image)
        ? [asImageSrc(page.data.meta_image)]
        : (parentOpenGraph?.images ?? []),
    },
  };
}

export default async function Page() {
  const client = createClient();
  const page = await client.getSingle('treatments').catch(() => notFound());
  const treatments = await client
    .getAllByType('treatment', {
      orderings: { field: 'my.treatment.weight', direction: 'asc' },
    })
    .catch(() => notFound());

  const featureTreatmentsByWeight = await client
    .getAllByType('treatment', {
      filters: [prismic.filter.at('my.treatment.featured', true)],
      limit: page.data.number_of_featured || 6,
      orderings: {
        field: 'my.treatment.weight',
        direction: 'asc',
      },
    })
    .catch(() => notFound());
  const treatmentsServices = await client
    .getAllByType('condition_category', {
      orderings: {
        field: 'my.condition_category.weight',
        direction: 'asc',
      },
    })
    .catch(() => notFound());

  return (
    <main className={'w-full overflow-hidden'}>
      <HeroSimple wave_type={'2'} heading={page.data.title} subheading={page.data.lead} />

      <Container as={'section'} className={'mb-8 mt-20'}>
        <BentoWrapper className={'isolate !mt-0'}>
          {featureTreatmentsByWeight?.map((treatment, idx) => (
            <BentoCard
              key={'condition_' + treatment.id}
              columns={Math.floor(idx / 2) % 2 === 0 ? (idx % 2 === 0 ? 4 : 2) : idx % 2 === 0 ? 2 : 4}>
              <Link href={'/treatments/' + treatment.uid} className={'group'}>
                <div
                  className={
                    'relative flex h-full w-full overflow-hidden rounded-3xl bg-secondary max-lg:rounded-4xl lg:rounded-4xl'
                  }>
                  {isFilled.image(treatment.data.feature_image) && (
                    <PrismicNextImage
                      field={treatment.data.feature_image}
                      className="h-full w-full object-cover transition-all ease-in-out group-hover:scale-125"
                    />
                  )}
                  {isFilled.image(treatment.data.feature_image) && (
                    <>
                      <div className="absolute inset-0 overflow-hidden rounded-lg bg-gradient-to-t from-primary-950/90 to-transparent max-lg:rounded-4xl lg:rounded-4xl" />
                      <div className={'absolute bottom-0 z-10 flex w-full flex-col p-7 md:p-10 lg:p-10'}>
                        <h3
                          className={
                            'mb-1 text-3xl font-semibold text-white transition-all ease-in-out group-hover:text-accent md:text-4xl lg:text-5xl'
                          }>
                          {treatment.data.heading}
                        </h3>
                        <p className={'text-sm !leading-tight text-primary-300 md:text-sm xl:text-lg'}>
                          {treatment.data.description}
                        </p>
                      </div>
                    </>
                  )}

                  {!isFilled.image(treatment.data.feature_image) && (
                    <>
                      <div
                        className={
                          'absolute left-0 top-0 z-10 flex h-full w-full flex-col justify-center p-7 text-center md:p-10 lg:p-10'
                        }>
                        <div className={'mb-4 flex justify-center'}>
                          <svg
                            width="101"
                            height="101"
                            viewBox="0 0 101 101"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <rect x="0.5" y="0.5" width="100" height="100" rx="50" fill="#00263E" />
                            <path
                              d="M47.6731 26.5C45.52 26.5 43.5908 28.1696 43.2911 30.2924L37.6464 70.2757C37.3231 72.5659 39.0114 74.4995 41.3344 74.4995C43.4875 74.4995 45.4167 72.8299 45.7164 70.7071L50.8257 34.5162H71.5783C73.7314 34.5162 75.6606 32.8466 75.9603 30.7238C76.2836 28.4336 74.5953 26.5 72.2723 26.5H47.6731Z"
                              fill="white"
                            />
                            <path
                              d="M52.3879 47.5624C52.6335 45.8223 54.2339 44.4372 55.999 44.4372H69.4578C71.3077 44.4372 72.6323 45.9543 72.3748 47.7781C72.1291 49.5182 70.5287 50.9033 68.7637 50.9033H58.4748L55.5847 71.3748C55.3391 73.1149 53.7386 74.5 51.9736 74.5C50.1237 74.5 48.7991 72.983 49.0566 71.1591L52.3879 47.5624Z"
                              fill="white"
                            />
                            <path
                              d="M28.3172 44.5534C26.4852 44.5534 25 46.032 25 47.8559C25 49.6798 26.4851 51.1584 28.3171 51.1584H33.6245C35.4566 51.1584 36.9417 49.6798 36.9417 47.8559C36.9418 46.032 35.4566 44.5534 33.6246 44.5534H28.3172Z"
                              fill="white"
                            />
                          </svg>
                        </div>
                        <h3
                          className={
                            'mb-5 text-2xl font-semibold leading-snug text-primary sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl'
                          }>
                          {treatment.data.heading}
                        </h3>
                        <Link
                          href={'/treatments/' + treatment.uid}
                          className={buttonVariants({ variant: 'default', size: 'sm' })}>
                          Find out more
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </Link>
            </BentoCard>
          ))}
        </BentoWrapper>
      </Container>

      <Container as={'section'}>
        <div className={'mb-20 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4'}>
          {treatments?.map(treatment => (
            <Link
              key={treatment.id}
              href={'/treatments/' + treatment.uid}
              className={
                'group relative flex min-h-40 flex-col justify-between overflow-hidden rounded-3xl bg-primary-300 p-7 transition-all duration-300 ease-in-out hover:bg-primary md:p-8'
              }>
              <div className={'absolute inset-0 flex items-center justify-center'}>
                <Wave
                  waveType={(treatment.data.wave as WaveType) ?? '1'}
                  className={'opacity-20 transition-opacity duration-300 group-hover:opacity-40'}
                />
              </div>
              <h3
                className={
                  'relative z-10 text-lg font-semibold leading-snug text-white transition-colors duration-300 group-hover:text-white md:text-xl lg:text-2xl'
                }>
                {treatment.data.heading}
              </h3>
              <div
                className={
                  'relative z-10 mt-4 flex items-center gap-1 text-sm font-bold text-accent opacity-0 transition-all duration-300 group-hover:opacity-100'
                }>
                Learn more
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </Container>

      <SliceZone slices={page.data.slices} components={components} />
    </main>
  );
}

export async function generateStaticParams() {
  const client = createClient();

  const pages = await client.getAllByType('treatments');

  return pages.map(page => {
    return { uid: page.uid };
  });
}
