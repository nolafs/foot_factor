
import { Container } from '@/components/ui/container';
import { Heading, Subheading } from '@/components/ui/text';
import { createClient } from '@/prismicio';
import { ChevronLeftIcon } from '@heroicons/react/16/solid';
import { PrismicNextImage } from '@prismicio/next';
import dayjs from 'dayjs';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {PrismicRichText, SliceZone} from '@prismicio/react';

import { GradientBackground } from '@/components/ui/gradient';
import React from 'react';
import {asText, type ImageFieldImage, isFilled, type LinkField, type RichTextField} from '@prismicio/client';
import {type Author, type CustomLinkToMediaField} from '@/types';
import PostAside from '@/components/features/blog/postAside';
import { type WithContext, type Article } from 'schema-dts';
import {Button, buttonVariants} from '@/components/ui/button';
import Link from 'next/link';
import {components} from '@/slices';
import {Hero as HeroComponent} from '@/components/features/hero/hero';
import {DownloadLink} from '@/components/ui/downloadLink';
import cn from 'clsx';
import {FolderDownIcon} from 'lucide-react';


type Props = {
  params: Promise<{ uid: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = (await params).uid;
  const client = createClient();
  const post = await client
    .getByUID('guide', id, {
      fetchLinks: [
        'condition_category.name',
        'post_category.uid',
        'post_tags',
        'post_tags.name',
        'author.name',
        'author.description',
        'author.profile_image',
        'author.link',
        'author',
      ],
    })
    .catch(() => notFound());

  let tags = post.data.tags.map(item => {
    const tag = item && 'tag' in item && (item.tag as { data: { name: string } }).data?.name;
    return tag ?? '';
  });

  if (post.data.keywords) {
    const postKeywords: string[] = post.data.keywords.map(item => {
      const keyword = item;
      return keyword.word! ?? '';
    });
    if (postKeywords.length) {
      tags = [...tags, ...postKeywords];
    }
  }

  let author = null;

  if (post.data.author && 'data' in post.data.author) {
    const authorData = post.data.author.data as {
      name: string;
      description: RichTextField;
      link: LinkField;
      profile_image: ImageFieldImage;
    };

    author = {
      name: authorData.name,
      description: authorData.description,
      link: authorData.link,
      profile_image: authorData.profile_image,
    };
  }

  let description =
    typeof post.data.meta_description === 'string'
      ? post.data.meta_description
      : (asText(post.data.meta_description ?? post.data.description).toString() ?? '');

  if (description.length > 160) {
    description = description.substring(0, 160) + '...';
  }

  return {
    metadataBase: new URL(
        `${process.env.NEXT_PUBLIC_BASE_URL}/resources/guides/${id}`
    ),
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/resources/guides/${id}`,
      types: {
        'application/rss+xml': `${process.env.NEXT_PUBLIC_BASE_URL}/feed.xml`,
      },
    },
    title: post.data.name,
    description: description,
    authors: [{ name: author?.name ?? '' }],
    creator: author?.name,
    publisher: author?.name,
    keywords: tags.filter(tag => tag !== false).length ? tags.filter(tag => tag !== false) : null,
    openGraph: {
      title: post.data.meta_title ?? undefined,
      description: description,
      images: [{ url: post.data.meta_image.url ?? post.data.feature_image.url ?? '' }],
    },
  };
}

export default async function Page({ params }: Props) {
  const client = createClient();
  const id = (await params).uid;
  let author: Author | null = null;
  const post = await client
    .getByUID('guide', id, {
      fetchLinks: [
        'condition_category.name',
        'author.name',
        'author.description',
        'author.profile_image',
        'author.link',
        'condition_category.uid',
        'post_tags.name',
      ],
    })
    .then(response => response.data)
    .catch(() => notFound());

  if (post.author && 'data' in post.author) {
    const authorData = post.author.data as {
      name: string;
      description: RichTextField;
      link: LinkField;
      profile_image: ImageFieldImage;
    };

    author = {
      name: authorData.name,
      description: authorData.description,
      link: authorData.link,
      profile_image: authorData.profile_image,
    };
  }

  const jsonLd: WithContext<Article> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${process.env.NEXT_PUBLIC_BASE_UR}/resources/guides/${id}` || '', // Ensure this links to the actual article URL
    },
    headline: post.name ?? '',
    image: post.feature_image?.url ? [post.feature_image.url] : [], // Make image an array
    author: {
      '@type': 'Person',
      name: author?.name,
      url: author?.profile_image?.url ?? '', // Use a valid author profile URL
    },
    publisher: {
      '@type': 'Organization',
      name: 'MyAnkle.co.uk', // Replace with your site name
      logo: {
        '@type': 'ImageObject',
        url: 'https://myankle.co.uk/share-img.png', // Add your actual logo URL
      },
    },
    description: asText(post.description) || '',
    datePublished: post.publishing_date ?? '',
    dateModified: post.publishing_date ?? '',
  };

  return (
    <main className={'w-full'}>
      <HeroComponent
          heading={post.name}
          subheading={dayjs(post.publishing_date).format('dddd, MMMM D, YYYY')}
          image={post.feature_image}
      >
        <div className={'w-full flex justify-between space-x-5 bg-white rounded-2xl p-5'}>
          <div className={'grow max-w-4xl'}>
          <PostAside
              as={'aside'}
              uid={id}
              post={post}
              author={author!}
          />
          </div>
          <div className={'shrink'}>
          {isFilled.linkToMedia(post.file) && (
              <DownloadLink
                  href={(post.file as CustomLinkToMediaField)?.url}
                  className={cn(buttonVariants({size: 'icon'}))}>
                <FolderDownIcon className={'h-6 w-6'}/>
              </DownloadLink>
          )}
          </div>
        </div>

      </HeroComponent>

      <SliceZone slices={post.slices} components={components}/>

      <Container className="mb-16">
        <div className="mt-10 flex items-center justify-between">
          <Button variant="outline" asChild ><Link href="/resources/guides">
            <ChevronLeftIcon className="size-4" />
            Back to all guides
          </Link>
          </Button>
          {isFilled.linkToMedia(post.file) && (
              <DownloadLink
                  href={(post.file as CustomLinkToMediaField)?.url}
                  className={cn(buttonVariants({size: 'default'}))}>
                Download now <FolderDownIcon className={'h-6 w-6'}/>
              </DownloadLink>
          )}
        </div>


      </Container>
      {/* Add JSON-LD to your page */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
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
