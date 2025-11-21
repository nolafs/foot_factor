import React from 'react';
import { RssIcon } from '@heroicons/react/16/solid';

import { Tags } from './postsTags';
import { Categories } from './postsCategories';
import { Button } from '@/components/ui/button';
import Link from 'next/link';


interface PostsFilterProps {
  categorySelected?: string;
  tagSelected?: string;
  hasRss?: boolean;
  url?: string;
}

export const Filter = ({ tagSelected, categorySelected, url = '/resources/blog', hasRss = true }: PostsFilterProps) => {
  return (
    <div className="relative flex flex-wrap items-center justify-between gap-2 z-20">
      <div className={'flex flex-wrap items-center gap-5'}>
        <Categories selected={categorySelected} url={url} />
        <Tags selected={tagSelected} url={url} />
      </div>
      {hasRss && (
        <Button variant="outline" asChild className="gap-1">
          <Link href="/feed.xml">
          <RssIcon className="size-4" />
          RSS Feed
          </Link>
        </Button>
      )}
    </div>
  );
};

export default Filter;
