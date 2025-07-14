import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import { SliceZone } from '@prismicio/react';
import { createClient } from '@/prismicio';
import { components } from '@/slices';
import type { OGImage } from '@/types';
import type { ResolvedOpenGraph } from 'next/dist/lib/metadata/types/opengraph-types';
import React from 'react';
import HeroSimple from '@/components/features/hero/hero-simple';
import {Container} from '@/components/ui/container';
import Link from 'next/link';
import SearchConditions from '@/components/features/search/search-conditions';

type Params = { uid: string };

export async function generateMetadata(
  { params }: { params: Promise<Params> },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const client = createClient();
  const page = await client.getSingle('conditions',).catch(() => notFound());

  let image = null;
  let pageTitle = '';
  const parentMeta = await parent;
  const parentOpenGraph: ResolvedOpenGraph | null = parentMeta.openGraph ?? null;

  if (page.data.social_cards && page.data.social_cards.length > 0 && page.data.social_cards[0]?.social_card_image) {

    image = `${page.data.social_cards[0]?.social_card_image.url}?w=1200&h=630&fit=crop&fm=webp&q=80`;
  }

  if (parentMeta?.title) {
    pageTitle = parentMeta.title.absolute;
  }


  return {
    title: `Foot Factor - ${pageTitle}`,
    description: page.data.meta_description ?? parentMeta.description,
    openGraph: {
      title: page.data.meta_title ?? parentMeta.title ?? undefined,
      images: [
        {
          url: image ?? (parentOpenGraph?.images ? (parentOpenGraph.images[0] as OGImage).url : ''),
        },
      ],
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
