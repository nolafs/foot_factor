import type { Metadata} from 'next';
import { notFound } from 'next/navigation';
import { SliceZone } from '@prismicio/react';
import { createClient } from '@/prismicio';
import { components } from '@/slices';
import React from 'react';
import {asImageSrc, isFilled} from '@prismicio/client';

type Params = { uid: string };

export async function generateMetadata({params}: { params: Promise<Params> }): Promise<Metadata> {
  const {uid} = await params;
  const client = createClient();
  const page = await client.getByUID('condition', uid).catch(() => notFound());

  return {
    title: page.data.meta_title,
    description: page.data.meta_description,
    openGraph: {
      title: isFilled.keyText(page.data.meta_title) ? page.data.meta_title : undefined,
      description: isFilled.keyText(page.data.meta_description) ? page.data.meta_description : undefined,
      images: isFilled.image(page.data.meta_image) ? [asImageSrc(page.data.meta_image)] : undefined,
    },
  };
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const {uid} = await params;
  const client = createClient();
  const page = await client.getByUID('condition', uid).catch(() => notFound());

  return (
    <main className={'w-full overflow-hidden'}>
      <SliceZone slices={page.data.slices} components={components} />
    </main>
  );
}

export async function generateStaticParams() {
  const client = createClient();
  const pages = await client.getAllByType('condition');

  return pages.map(page => {
    return {uid: page.uid};
  });
}
