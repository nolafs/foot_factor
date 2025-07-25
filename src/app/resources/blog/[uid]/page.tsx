
import { Container } from '@/components/ui/container';
import { createClient } from '@/prismicio';
import { ChevronLeftIcon } from '@heroicons/react/16/solid';
import { PrismicNextImage } from '@prismicio/next';
import dayjs from 'dayjs';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PrismicRichText } from '@prismicio/react';
import React from 'react';
import {asText, type ImageFieldImage, isFilled, type LinkField, type RichTextField} from '@prismicio/client';
import { type Author } from '@/types';
import PostAside from '@/components/features/blog/postAside';
import { type WithContext, type Article } from 'schema-dts';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import HeroSimple from '@/components/features/hero/hero-simple';
import Image from 'next/image';
import Placeholder  from '@/assets/placeholder-img.png';



type Props = {
  params: Promise<{ uid: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = (await params).uid;
  const client = createClient();
  const post = await client
    .getByUID('posts', id, {
      fetchLinks: [
        'post_category.name',
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
      : (asText(post.data.meta_description ?? post.data.excerpt).toString() ?? '');

  if (description.length > 160) {
    description = description.substring(0, 160) + '...';
  }

  return {
    metadataBase: new URL(
        `${process.env.NEXT_PUBLIC_BASE_URL}/resources/blog/${id}`
    ),
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/resources/blog/${id}`,
      types: {
        'application/rss+xml': `${process.env.NEXT_PUBLIC_BASE_URL}/feed.xml`,
      },
    },
    title: post.data.title,
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
    .getByUID('posts', id, {
      fetchLinks: [
        'post_category.name',
        'author.name',
        'author.description',
        'author.profile_image',
        'author.link',
        'post_category.uid',
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
      '@id': `${process.env.NEXT_PUBLIC_BASE_UR}/blog/${id}` || '', // Ensure this links to the actual article URL
    },
    headline: post.title ?? '',
    image: post.feature_image?.url ? [post.feature_image.url] : [], // Make image an array
    author: {
      '@type': 'Person',
      name: author?.name,
      url: author?.profile_image?.url ?? '', // Use a valid author profile URL
    },
    publisher: {
      '@type': 'Organization',
      name: 'footfactor.com', // Replace with your site name
      logo: {
        '@type': 'ImageObject',
        url: 'https://footfactor.com/share-img.png', // Add your actual logo URL
      },
    },
    description: asText(post.excerpt) || '',
    datePublished: post.publishing_date ?? '',
    dateModified: post.publishing_date ?? '',
  };

  return (
    <main className={'w-full'}>
      <HeroSimple wave_type={'5'}
        heading={post.title}
        subheading={dayjs(post.publishing_date).format('dddd, MMMM D, YYYY')}
      />
      <Container>
        <div className="mt-10 grid min-h-svh grid-cols-1 gap-8 pb-24 sm:mt-10 md:mt-16 lg:grid-cols-[15rem_1fr] xl:grid-cols-[15rem_1fr_15rem]">
          <PostAside
            as={'aside'}
            uid={id}
            post={post}
            author={author!}
            classNames={'hidden lg:flex h-full max-h-[800px] lg:sticky lg:top-28 lg:flex-col lg:!justify-start lg:divide-x-0   lg:items-start'}
          />

          <div className="text-gray-700">
            <div className="max-w-2xl xl:mx-auto">

              {isFilled.image(post.feature_image) ? (
              <PrismicNextImage
                field={post.feature_image}
                width={672}
                height={448}
                priority={true}
                className="mb-10 aspect-[3/2] w-full rounded-2xl object-cover shadow-xl"
                imgixParams={{ fm: 'webp', fit: 'crop', crop: ['focalpoint'], q: 70 }}
              />
                  ) : (

              <Image
                  src={Placeholder}
                  width={672}
                  height={448}
                  alt="Placeholder image"
                  className="mb-10 aspect-[3/2] w-full rounded-2xl object-cover shadow-xl"
              />
              )}


              <div className={'prose md:prose-lg'}>{post.content && <PrismicRichText field={post.content}  />}</div>

              <PostAside
                as="aside"
                uid={id}
                post={post}
                author={author!}
                classNames={'lg:hidden border-y mt-10 border-gray-600 py-5'}
              />

              <div className="mt-10">
                <Button variant="outline" asChild ><Link href="/resources/blog">
                  <ChevronLeftIcon className="size-4" />
                  Back to blog
                </Link>
                </Button>
              </div>
            </div>
          </div>
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
