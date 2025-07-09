import { Container } from '@/components/ui/container';import { Heading, Lead, Subheading } from '@/components/ui/text';
import dayjs from 'dayjs';
import type { Metadata, ResolvingMetadata } from 'next';
import { createClient } from '@/prismicio';
import { PrismicNextImage } from '@prismicio/next';
import { PrismicRichText } from '@prismicio/react';
import {asText, filter, type ImageFieldImage, isFilled} from '@prismicio/client';
import React from 'react';
import { FeaturedPosts } from './_components/guideFeatured';
import { Badge } from '@/components/ui/badge';
import { FolderDownIcon } from 'lucide-react';
import { Pagination } from '@/components/ui/pagination';
import { DownloadLink } from '@/components/ui/downloadLink';
import { type CustomLinkToMediaField, type OGImage } from '@/types';
import { type ResolvedOpenGraph } from 'next/dist/lib/metadata/types/opengraph-types';
import Filter from '@/components/features/blog/postsFilter';
import {type ConditionCategoryDocument, type PostTagsDocument} from '@/prismic-types';
import HeroSimple from '@/components/features/hero/hero-simple';
import Link from 'next/link';

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
    .getByType('guide', {
      pageSize: 1,
      page: 0,
      filters: [filter.at('my.guide.featured', true)],
      fetchLinks: ['author.name', 'author.profile_image', 'post_category.name'],
      orderings: [
        {
          field: 'my.guide.publishing_date',
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
    title: 'Foot Factor - Guides & Downloads',
    description:
      asText(page?.data.description)! ??
      'Download expert-written guides and brochures on conditions, treatments, and recovery. Get the latest information in easy-to-read PDFs, available anytime you need them.',
    openGraph: {
      title: 'Foot Factor - Guides & Downloads',
      images: [
        {
          url: image ?? (parentOpenGraph?.images ? (parentOpenGraph.images[0] as OGImage).url : ''),
        },
      ],
    },
  };
}

async function Posts({ page, category, tags : Tags }: { page: number; category?: string[]; tags?: string[] }) {
  const client = createClient();
  let categories: ConditionCategoryDocument[] = [];
  let tags: PostTagsDocument[] = [];
  if (category) {
    categories = await client.getAllByUIDs('condition_category', [...category]);
  }

  if (Tags) {
    tags = await client.getAllByUIDs('post_tags', [...Tags]);
  }

  const posts = await client
    .getByType('guide', {
      pageSize: 10,
      page: page,
      filters:
        categories.length || tags.length
          ? [
              filter.any(
                'my.guide.category',
                categories.map(cat => cat.id),
              ),
              filter.any(
                'my.guide.tags.tag',
                  tags.map(tag => tag.id),
              ),
            ]
          : [],
      fetchLinks: [
        'author.name',
        'author.profile_image',
        'author.description',
        'author.link',
        'condition_category.name',
        'condition_category.uid',
        'post_tags',
      ],
      orderings: [
        {
          field: 'my.download.published_date',
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
  // TODO: Generate JSON-LD for the posts
  //const JSONLD = DOWNLOADS_JSONLD(posts);

  return (
    <div className="mt-6">
      {posts.map(post => (
        <div
          key={post.uid}
          className="relative grid grid-cols-1 border-b border-b-gray-100 py-10 first:border-t first:border-t-gray-200 max-sm:gap-3 sm:grid-cols-3">
          <div>
            <div className="text-sm/5 max-sm:text-gray-700 sm:font-medium">
              {dayjs(post.data.publishing_date).format('dddd, MMMM D, YYYY')}
            </div>

            {post.data.category && 'data' in post.data.category && (
              <div className="mt-3">
                <Badge>{(post.data.category.data as { name: string }).name}</Badge>
              </div>
            )}

            {post.data.author && 'data' in post.data.author && (
              <div className="mt-6 flex items-center gap-3">
                {post.data.author && (
                  <PrismicNextImage
                    alt=""
                    width={64}
                    height={64}
                    field={(post.data.author.data as { profile_image: ImageFieldImage }).profile_image}
                    className="aspect-square size-6 rounded-full object-cover"
                  />
                )}
                <div className="text-sm/5 text-gray-700">
                  {(post.data.author.data as { name: string }).name || 'Foot Factor'}
                </div>
              </div>
            )}
          </div>
          <div className="sm:col-span-2 sm:max-w-2xl">
            <h2 className="text-sm/5 font-medium">
              <Link href={`/resources/guides/${post.uid}`}>
                {post.data.name}
              </Link>
            </h2>
            <div className="mt-3 text-sm/6 text-gray-500">
              <PrismicRichText field={post.data.description} />
            </div>

            <div className="mt-4">
              {isFilled.linkToMedia(post.data.file) && (
              <DownloadLink
                className={'flex items-center gap-1 text-sm/5 font-medium'}
                href={(post.data.file as CustomLinkToMediaField)?.url}>
                <FolderDownIcon className={'h-6 w-6'} />
                {post.data.file.text}
              </DownloadLink>
                  )}
            </div>
          </div>
        </div>
      ))}
      {/* TODO: See Ankle Add JSON-LD to your page */}
    </div>

  );
}

export default async function Guide({ searchParams }: Props) {
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
      <HeroSimple wave_type={'4'}
                  label={'Guides'}
                  heading={'Free Guides'}
                  subheading={'Download expert-written guides and brochures on ankle conditions, treatments, and recovery. Get the latest\n' +
                      '          information in easy-to-read PDFs, available anytime you need them.'}
      />
      {page === 1 && !categories && !tags && <FeaturedPosts />}
      <Container className="mt-24 pb-24">
        <Filter
          url={'downloads'}
          hasRss={false}
          categorySelected={categories ? categories[0] : undefined}
          tagSelected={tags ? tags[0] : undefined}
        />
        <Posts page={page} category={categories} tags={tags} />
        <Pagination slug={'downloads'} contentType={'guide'} page={page} category={categories} tags={tags} />
      </Container>
    </main>
  );
}

export async function generateStaticParams() {
  const client = createClient();

  const pages = await client.getAllByType('guide');

  return pages.map(page => {
    return { uid: page.uid };
  });
}
