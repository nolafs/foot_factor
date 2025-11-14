import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import { SliceZone } from '@prismicio/react';
import { createClient } from '@/prismicio';
import { components } from '@/slices';
import React from 'react';
import HeroSimple from '@/components/features/hero/hero-simple';
import {Container} from '@/components/ui/container';
import Link from 'next/link';
import {asImageSrc, filter, isFilled} from '@prismicio/client';
import {PrismicNextImage} from '@prismicio/next';
import {Badge} from '@/components/ui/badge';
import {AutoComplete} from '@/components/features/search/autocomplete';
import Image from 'next/image';
import  PlaceholderImage  from '@/assets/placeholder-img.png';


type Params = { cat: string };

export async function generateMetadata(
  { params }: { params: Promise<Params> },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { cat } = await params;
  const client = createClient();
  const page = await client.getSingle('conditions',).catch(() => notFound());

  let pageTitle = '';
  const parentMeta = await parent;

  if (parentMeta?.title) {
    pageTitle = parentMeta.title.absolute;
  }

  return {
    metadataBase: new URL(
        `${process.env.NEXT_PUBLIC_BASE_URL}/conditions/${page.uid}`
    ),
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/conditions/${page.uid}`,
      types: {
        'application/rss+xml': `${process.env.NEXT_PUBLIC_BASE_URL}/feed.xml`,
      },
    },
    title: `${isFilled.keyText(page.data.meta_title) ? page.data.meta_title : pageTitle}`,
    description: page.data.meta_description ?? parentMeta.description,
    openGraph: {
      title: isFilled.keyText(page.data.meta_title) ? page.data.meta_title : isFilled.keyText(page.data.title) ? page.data.title : '',
      description: isFilled.keyText(page.data.meta_description) ? page.data.meta_description : '',
      images: isFilled.image(page.data.meta_image) ? [asImageSrc(page.data.meta_image)] :  [],
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

  return (
    <main className={'w-full overflow-hidden'}>
      <HeroSimple wave_type={'2'} heading={currentCategory} subheading={page.data.lead} label={page.data.title}  />


      <Container as={'section'}  padding={'lg'}>

        <AutoComplete/>


        <ul className={'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'}>
        {conditions.map((item, idx)=> (
            <li key={idx}>
              <Link href={`/conditions/${(item.data?.category as { uid: string }).uid}/${item.uid}`} className={'flex flex-col gap-4 p-4 bg-white rounded-lg group  hover:shadow-lg transition-shadow duration-300'}>
                {isFilled.image(item.data.feature_image) ? (
                    <PrismicNextImage
                        field={item.data.feature_image}
                        className={'w-full h-48 object-cover rounded-lg'}/>
                ) : (
                <Image src={PlaceholderImage} alt={item.data.title ?? 'placeholder image'}
                       className={'w-full h-48 object-cover rounded-lg'}/>)}
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
