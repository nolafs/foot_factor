import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import { SliceZone } from '@prismicio/react';
import { createClient } from '@/prismicio';
import { components } from '@/slices';
import React from 'react';
import {asImageSrc, asText, isFilled} from '@prismicio/client';
import {Hero} from '@/components/features/hero/hero';


type Params = { uid: string };

export async function generateMetadata({params}: { params: Promise<Params> }): Promise<Metadata> {
  const {uid} = await params;
  const client = createClient();
  const page = await client.getByUID('orthotics', uid).catch(() => notFound());

  return {
    title: page.data.meta_title,
    description: page.data.meta_description ?? asText(page.data.lead),
    openGraph: {
      title: isFilled.keyText(page.data.meta_title) ? page.data.meta_title : undefined,
      description: isFilled.keyText(page.data.meta_description) ? page.data.meta_description :  asText(page.data.lead),
      images: isFilled.image(page.data.meta_image) ? [asImageSrc(page.data.meta_image)] : page.data.image.url ? [page.data.image.url] : [],
    },
  };
}


export default async function Page({ params }: { params: Promise<Params> }) {
  const client = createClient();
  const { uid } = await params;
  const page = await client.getByUID('orthotics', uid).catch(() => notFound());

  return (
    <main className={'w-full overflow-hidden'}>
        <Hero
          subheading={page.data.subheading}
          heading={page.data.heading}
          lead={page.data.lead}
          image={page.data.image}
        />
        <SliceZone slices={page.data.slices} components={components} />
    </main>
  );
}

export async function generateStaticParams() {
  const client = createClient();

  const pages = await client.getAllByType('orthotics');

  return pages.map(page => {
    return { uid: page.uid };
  });
}
