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

type Params = { cat: string };

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

export default async function Page({params}: { params: Promise<Params> }) {
  const { cat } = await params;
  const client = createClient();
  const page = await client.getSingle('conditions', ).catch(() => notFound());
  const conditions = await client.getAllByType('condition').catch(() => notFound());
  const conditionCategories = await client.getAllByType('condition_category').catch(() => notFound());



  return (
    <main className={'w-full overflow-hidden'}>
      <HeroSimple wave_type={'2'} heading={page.data.title} subheading={page.data.lead}  />

      <Container as={'section'}>
      <ul>
        {conditionCategories.map((category) => (
          <li key={category.id} className={'mb-8'}>
            <h2 className={'text-2xl font-bold mb-4'}>{category.data.name}</h2>
            <ul className={'list-disc pl-5'}>
              {conditions
                .filter(condition => (condition.data.category as {id: string})?.id === category.id)
                .map(condition => (
                  <li key={condition.id}>
                    <Link href={`/conditions/${(condition.data.category as { id: string}).id}/${condition.uid}`} className={'text-blue-600 hover:underline'}>
                      {condition.data.title}
                    </Link>
                  </li>
                ))}
            </ul>
          </li>
        ))}
      </ul>
      </Container>


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
