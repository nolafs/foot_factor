import { createClient } from '@/prismicio';
import { filter } from '@prismicio/client';
import type { ImageFieldImage } from '@prismicio/client';
import { Container } from '@/components/ui/container';
import { PrismicNextImage } from '@prismicio/next';
import dayjs from 'dayjs';
import { Link } from '@/components/ui/link';
import { PrismicRichText } from '@prismicio/react';
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { BLOGJSONLD } from '@/types/schema';
import PostFeatureCard from '@/components/features/blog/postFeatureCard';

export async function FeaturedPosts() {
  const client = createClient();
  const featuredPosts = await client
    .getByType('posts', {
      pageSize: 3,
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

  if (featuredPosts.length === 0) {
    return;
  }

  const JSONLD = BLOGJSONLD(featuredPosts);

  return (
    <div className="mt-24 bg-gradient-to-t from-gray-100 pb-14">
      <Container>
        <h2 className="text-3xl font-medium tracking-tight">Featured</h2>
        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {featuredPosts.map(post => (
            <PostFeatureCard key={post.uid} post={post} />
          ))}
        </div>
        {/* Add JSON-LD to your page */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD) }} />
      </Container>
    </div>
  );
}
