import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import { SliceZone } from '@prismicio/react';
import { createClient } from '@/prismicio';
import { components } from '@/slices';
import type { OGImage } from '@/types';
import type { ResolvedOpenGraph } from 'next/dist/lib/metadata/types/opengraph-types';
import React from 'react';

type Params = { uid: string };

export async function generateMetadata(
  { params }: { params: Promise<Params> },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const client = createClient();
  const { uid } = await params;
  const page = await client.getByUID('page', uid).catch(() => notFound());

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
    metadataBase: new URL(
        `${process.env.NEXT_PUBLIC_BASE_URL}/${page.uid}`
    ),
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/${page.uid}`,
      types: {
        'application/rss+xml': `${process.env.NEXT_PUBLIC_BASE_URL}/feed.xml`,
      },
    },
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

export default async function Page({ params }: { params: Promise<Params> }) {
  const client = createClient();
  const { uid } = await params;
  const page = await client.getByUID('page', uid).catch(() => notFound());

  return (
    <main className={'w-full overflow-hidden'}>
        <SliceZone slices={page.data.slices} components={components} />
    </main>
  );
}

export async function generateStaticParams() {
  const client = createClient();

  const pages = await client.getAllByType('page');

  return pages.map(page => {
    return { uid: page.uid };
  });
}
