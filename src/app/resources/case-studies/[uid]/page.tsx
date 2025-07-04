import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import { SliceZone } from '@prismicio/react';
import { createClient } from '@/prismicio';
import { components } from '@/slices';
import type { OGImage } from '@/types';
import type { ResolvedOpenGraph } from 'next/dist/lib/metadata/types/opengraph-types';
import React from 'react';
import {Hero} from '@/components/features/hero/hero';

type Params = { uid: string };

export async function generateMetadata(
  { params }: { params: Promise<Params> },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const client = createClient();
  const { uid } = await params;
  const page = await client.getByUID('case_studies', uid).catch(() => notFound());

  let image = null;
  let pageTitle = '';
  const parentMeta = await parent;
  const parentOpenGraph: ResolvedOpenGraph | null = parentMeta.openGraph ?? null;

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

export default async function Page({ params }: { params: Promise<Params> }) {
  const client = createClient();
  const { uid } = await params;

  const page = await client.getByUID('case_studies', uid).catch(() => notFound());

  return (
    <main className={'w-full overflow-hidden'}>
        <Hero heading={page.data.client_name}
              subheading={`${page.data.activity}`}
              image={page.data.feature_image}
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
