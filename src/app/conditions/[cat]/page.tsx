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
import {filter} from '@prismicio/client';
import {PrismicNextImage} from '@prismicio/next';
import {Badge} from '@/components/ui/badge';


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
  const filters = [];
  const client = createClient();
  const page = await client.getSingle('conditions').catch(() => notFound());
  const categoryDocs = await client
      .getAllByType('condition_category', {
        filters: [filter.at('my.condition_category.uid', cat)],
      })
      .catch(() => notFound());

  const categoryIds = categoryDocs?.map(doc => doc.id);
  const categoryNames = categoryDocs?.map(doc => doc.data.name);
  const currentCategory = categoryNames && categoryNames.length > 0 ? categoryNames[0] : 'All Conditions';

  if (categoryIds && categoryIds.length > 0) {
    const categoryId = categoryIds[0];
    if (categoryId) {
      filters.push(filter.at('my.condition.category', categoryId));
    }
  }

  const conditions = await client
      .getAllByType('condition', {
        fetchLinks: ['my.condition.category'],
        filters: [...filters],
      })
      .catch((e) => {
        console.error('Error fetching conditions for category:', e);
        notFound()}
      );

  console.log('conditions', conditions);

  return (
    <main className={'w-full overflow-hidden'}>
      <HeroSimple wave_type={'2'} heading={currentCategory} subheading={page.data.lead} label={page.data.title}  />

      <Container as={'section'}  padding={'lg'}>
      <ul className={'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'}>
        {conditions.map((item, idx)=> (
            <li key={idx}>
              <Link href={`/conditions/${(item.data?.category as { uid: string }).uid}/${item.uid}`} className={'flex flex-col gap-4 p-4 bg-white rounded-lg group  hover:shadow-lg transition-shadow duration-300'}>
                {item.data.feature_image && (
                    <PrismicNextImage
                        field={item.data.feature_image}
                        className={'w-full h-48 object-cover rounded-lg'}/>
                )}
                <div><Badge variant={'secondary'}>{(item.data?.category as {data: {name: string}}).data.name}</Badge></div>
                <div>
                  <h3 className={'text-lg font-semibold mb-3 group-hover:text-accent'}>{item.data.title}</h3>
                  <p className={'text-sm text-gray-600'}>{item.data.excerpt}</p>
                </div>
              </Link>
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

  const pages = await client.getAllByType('condition');

  return pages.map(page => {
    return { uid: page.uid };
  });
}
