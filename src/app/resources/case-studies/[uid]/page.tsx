import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import { SliceZone } from '@prismicio/react';
import { createClient } from '@/prismicio';
import { components } from '@/slices';
import React from 'react';
import {Hero} from '@/components/features/hero/hero';
import {asImageSrc, isFilled} from '@prismicio/client';
import type {ResolvedOpenGraph} from 'next/dist/lib/metadata/types/opengraph-types';

type Params = { uid: string };

export async function generateMetadata(
  { params }: { params: Promise<Params> },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const client = createClient();
  const { uid } = await params;
  const page = await client.getByUID('case_studies', uid).catch(() => notFound());

  let pageTitle = '';
  const parentMeta = await parent;
  const parentOpenGraph: ResolvedOpenGraph | null = parentMeta.openGraph ?? null;

  if (parentMeta?.title) {
    pageTitle = parentMeta.title.absolute;
  }


  return {
    metadataBase: new URL(
        `${process.env.NEXT_PUBLIC_BASE_URL}/resources/case-studies/${page.uid}`
    ),
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/resources/case-studies/${page.uid}`,
      types: {
        'application/rss+xml': `${process.env.NEXT_PUBLIC_BASE_URL}/feed.xml`,
      },
    },
    title: `${isFilled.keyText(page.data.meta_title) ? page.data.meta_title : pageTitle}`,
    description: page.data.meta_description ?? parentMeta.description,
    openGraph: {
      title: isFilled.keyText(page.data.meta_title) ? page.data.meta_title : pageTitle,
      description: isFilled.keyText(page.data.meta_description) ? page.data.meta_description : '',
      images: isFilled.image(page.data.meta_image) ? [asImageSrc(page.data.meta_image)] : parentOpenGraph?.images ? parentOpenGraph.images : [],
    },
  };
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const client = createClient();
  const { uid } = await params;

  const page = await client.getByUID('case_studies', uid).catch(() => notFound());

  return (
    <main className={'w-full overflow-hidden'}>
        <Hero heading={page.data.client_name}
              subheading={`${page.data.activity}`}
              image={page.data.feature_image}
              vAlign={'bottom'}
              imagePosition={'center'} />
        <SliceZone slices={page.data.slices} components={components} />
    </main>
  );
}

export async function generateStaticParams() {
  const client = createClient();

  const pages = await client.getAllByType('case_studies');

  return pages.map(page => {
    return { uid: page.uid };
  });
}
