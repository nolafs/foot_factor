import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import { SliceZone } from '@prismicio/react';
import { createClient } from '@/prismicio';
import { components } from '@/slices';
import React from 'react';
import HeroSimple from '@/components/features/hero/hero-simple';
import SearchConditions from '@/components/features/search/search-conditions';
import {asImageSrc, isFilled} from '@prismicio/client';
import type {ResolvedOpenGraph} from 'next/dist/lib/metadata/types/opengraph-types';

type Params = { uid: string };

export async function generateMetadata(
  { params }: { params: Promise<Params> },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const client = createClient();
  const page = await client.getSingle('conditions',).catch(() => notFound());

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
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/conditions`,
      types: {
        'application/rss+xml': `${process.env.NEXT_PUBLIC_BASE_URL}/feed.xml`,
      },
    },
    openGraph: {
      title: isFilled.keyText(page.data.meta_title) ? page.data.meta_title : pageTitle,
      description: isFilled.keyText(page.data.meta_description) ? page.data.meta_description : '',
      images: isFilled.image(page.data.meta_image) ? [asImageSrc(page.data.meta_image)] : parentOpenGraph?.images ? parentOpenGraph.images : [],
    },
  };
}

export default async function Page() {
  const client = createClient();
  const page = await client.getSingle('conditions', ).catch(() => notFound());
  const conditions = await client.getAllByType('condition').catch(() => notFound());
  const conditionCategories = await client.getAllByType('condition_category', {
    orderings: {
      field: 'my.condition_category.weight',
      direction: 'asc',
    },
  }).catch(() => notFound());


  console.log('conditions', conditions)

  return (
    <main className={'w-full overflow-hidden'}>
      <HeroSimple wave_type={'2'} heading={page.data.title} subheading={page.data.lead}  />

      <SearchConditions conditionCategories={conditionCategories} />

      <SliceZone slices={page.data.slices} components={components} />
    </main>
  );
}

export async function generateStaticParams() {
  const client = createClient();

  const pages = await client.getAllByType('condition');

  return pages.map(page => {
    return { uid: page.uid };
  });
}
