import { Container } from '@/components/ui/container';
import { ChevronRightIcon } from '@heroicons/react/16/solid';
import dayjs from 'dayjs';
import type { Metadata, ResolvingMetadata } from 'next';
import { createClient } from '@/prismicio';

import { PrismicRichText } from '@prismicio/react';
import { asText, filter } from '@prismicio/client';
import React from 'react';
import { FeaturedPosts } from './_components/postsFeatured';

import { Badge } from '@/components/ui/badge';
import { Pagination } from '@/components/ui/pagination';
import type { ResolvedOpenGraph } from 'next/dist/lib/metadata/types/opengraph-types';
import type { Author, OGImage } from '@/types';
import Filter from '../../../components/features/blog/postsFilter';
import AuthorLink from '@/components/features/author/author-link';
import { type PostCategoryDocument, type PostTagsDocument } from '@/prismic-types';
import Link from 'next/link';
import HeroSimple from '@/components/features/hero/hero-simple';

type Props = {
  params: Promise<{ uid: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

type Params = { uid: string };

export async function generateMetadata(
  { params }: { params: Promise<Params> },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const client = createClient();

  const posts = await client
    .getByType('posts', {
      pageSize: 1,
      page: 0,
      filters: [filter.at('my.posts.featured', true)],
      fetchLinks: ['author.name', 'author.profile_image', 'post_category.name'],
      orderings: [
        {
          field: 'my.posts.publishing_date',
          direction: 'desc',
        },
      ],
    })
    .then(response => {
      return response.results;
    });

  const page = posts[0];
  let image = null;

  const parentMeta = await parent;
  const parentOpenGraph: ResolvedOpenGraph | null = parentMeta.openGraph ?? null;

  if (page?.data?.feature_image) {
    image = `${page?.data.feature_image.url}?w=1200&h=630&fit=crop&fm=webp&q=80`;
  }

  return {
    title: 'Foot Factor - Articles',
    description: asText(page?.data.excerpt)! ?? "Looking for resources on foot health? You're in the right place.",
    openGraph: {
      title: 'Foot Factor',
      images: [
        {
          url: image ?? (parentOpenGraph?.images ? (parentOpenGraph.images[0] as OGImage).url : ''),
        },
      ],
    },
  };
}

async function Posts({ page, category, tags }: { page: number; category?: string[]; tags?: string[] }) {
  const client = createClient();
  let categories: PostCategoryDocument[] = [];
  let tagList: PostTagsDocument[] = [];

  if (category) {
    categories = await client.getAllByUIDs('post_category', [...category]);
  }

  if (tags) {
    tagList = await client.getAllByUIDs('post_tags', [...tags]);
  }

  const posts = await client
    .getByType('posts', {
      pageSize: 10,
      page: page,
      filters:
        categories.length || tagList.length
          ? [
              filter.any(
                'my.posts.category',
                categories.map(cat => cat.id),
              ),
              filter.any(
                'my.posts.tags.tag',
                tagList.map(tag => tag.id),
              ),
            ]
          : [],

      fetchLinks: [
        'author.name',
        'author.profile_image',
        'author.description',
        'author.link',
        'post_category.name',
        'post_category.uid',
        'post_tags',
      ],
      orderings: [
        {
          field: 'my.posts.publishing_date',
          direction: 'desc',
        },
        {
          field: 'my.posts.last_publication_date',
          direction: 'desc',
        },
      ],
    })
    .then(response => {
      return response.results;
    })
    .catch(() => []);

  if (posts.length === 0) {
    return <p className="mt-6 text-gray-500">No posts found.</p>;
  }

  return (
    <div className="mt-6">
      {posts.map(post => (
        <div
          key={post.uid}
          className="relative grid grid-cols-1 border-b border-b-gray-100 py-10 first:border-t first:border-t-gray-200 max-sm:gap-3 sm:grid-cols-3">
          <div>
            <div className="text-sm/5 max-sm:text-gray-700 sm:font-medium">
              {dayjs(post.data.publishing_date ?? post.last_publication_date).format('dddd, MMMM D, YYYY')}
            </div>

            {post.data.category && 'data' in post.data.category && (
              <div className="mt-3">
                <Badge>{(post.data.category.data as { name: string }).name}</Badge>
              </div>
            )}

            {post.data.author && 'data' in post.data.author && (
              <div className="z-2 relative mt-6 flex items-center gap-3">
                <AuthorLink author={post.data.author.data as Author} />
              </div>
            )}
          </div>
          <div className="group relative sm:col-span-2 sm:max-w-2xl">
            <h2 className="text-md/5 font-medium group-hover:text-gray-700">{post.data.title}</h2>
            <div className="mt-3 text-sm/6 text-gray-500">
              <PrismicRichText field={post.data.excerpt} />
            </div>
            <div className="mt-4">
              <Link
                href={`/resources/blog/${post.uid}`}
                className="flex items-center gap-1 text-sm/5 font-medium group-hover:text-accent">
                <span className="absolute inset-0" />
                Read more <span className={'sr-only'}>About {post.data.title}</span>
                <ChevronRightIcon className="size-4 fill-gray-400 group-hover:fill-accent" />
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function Blog({ searchParams }: Props) {
  const params = await searchParams;
  const page = params.page && typeof params.page === 'string' && parseInt(params.page) > 1 ? parseInt(params.page) : 1;

  //
  let categories = typeof params.category === 'string' ? params.category.split(',') : undefined;
  let tags = typeof params.tags === 'string' ? params.tags.split(',') : undefined;

  if (categories?.length === 0) {
    categories = undefined;
  }

  if (tags?.length === 0) {
    tags = undefined;
  }

  return (
    <main className={'min-h-svh w-full overflow-hidden'}>

      <HeroSimple wave_type={'3'}
      label={'Blog'}
      heading={'What’s happening at Foot Factor.'}
      subheading={'Looking for resources on foot health? You\'re in the right place.'}
      />
      {page === 1 && !categories && !tags && <FeaturedPosts />}
      <Container className="mt-16 pb-24">
        <Filter categorySelected={categories ? categories[0] : undefined} tagSelected={tags ? tags[0] : undefined} />
        <Posts page={page} category={categories} tags={tags} />
        <Pagination contentType={'posts'} slug={'resources/blog'} page={page} category={categories} tags={tags} />
      </Container>
    </main>
  );
}

export async function generateStaticParams() {
  const client = createClient();

  const pages = await client.getAllByType('posts');

  return pages.map(page => {
    return { uid: page.uid };
  });
}
