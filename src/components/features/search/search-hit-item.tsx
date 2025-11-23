'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import {
  Activity,
  BookMarked,
  FileDown,
  FileIcon,
  FileQuestionIcon,
  Footprints,
  HeartPulse,
  Newspaper,
  SquareArrowOutUpRight,
} from 'lucide-react';
import { Highlight, Snippet } from 'react-instantsearch';
import { type HitProps } from '@/types';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { useSearch } from '@/components/features/search/search-context';

export const SearchHitItem = ({ hit }: HitProps) => {
  const { openSearchDialog, setSearchDialog } = useSearch();
  const imageUrl: string | null = hit.image?.url as string | null;

  useEffect(() => {
    console.log(openSearchDialog);
  }, [openSearchDialog]);

  return (
    <div
      className={
        'group relative flex w-full flex-col items-start justify-between space-y-3 rounded-md px-2 py-2 hover:bg-gray-200/5 md:space-x-3 lg:flex-row'
      }>
      <div className={'relative'}>
        {imageUrl ? (
          <div className={'relative w-full md:w-[200px]'}>
            <div className={'relative h-fit w-fit rounded-md bg-accent/60 p-2 md:absolute md:left-2 md:top-2'}>
              {hit.type === 'condition' && <Activity className={'h-5 w-5 text-white'} />}
              {hit.type === 'article' && <Newspaper className={'h-5 w-5 text-white'} />}
              {hit.type === 'page' && <FileIcon className={'h-5 w-5 text-white'} />}
              {hit.type === 'guide' && <FileDown className={'h-5 w-5 text-white'} />}
              {hit.type === 'service' && <HeartPulse className={'h-5 w-5 text-white'} />}
              {hit.type === 'case study' && <BookMarked className={'h-5 w-5 text-white'} />}
              {hit.type === 'faq' && <FileQuestionIcon className={'h-5 w-5 text-white'} />}
              {hit.type === 'orthotics' && <Footprints className={'h-5 w-5 text-white'} />}
            </div>

            <Image
              src={imageUrl}
              alt={hit.title}
              width={300}
              height={169}
              className={'aspect-[16/9] hidden h-full w-full rounded-md object-cover object-center sm:hidden md:block'}
            />
          </div>
        ) : (
          <div className={'h-fit w-fit rounded-md bg-accent/60 p-2 md:p-3'}>
            {hit.type === 'condition' && <Activity className={'h-5 w-5 text-white sm:h-5 sm:w-5 md:h-7 md:w-7'} />}
            {hit.type === 'article' && <Newspaper className={'h-5 w-5 text-white md:h-7 md:w-7'} />}
            {hit.type === 'page' && <FileIcon className={'h-5 w-5 text-white sm:h-5 sm:w-5 md:h-7 md:w-7'} />}
            {hit.type === 'guide' && <FileDown className={'h-5 w-5 text-white sm:h-5 sm:w-5 md:h-7 md:w-7'} />}
            {hit.type === 'service' && <HeartPulse className={'h-5 w-5 text-white sm:h-5 sm:w-5 md:h-7 md:w-7'} />}
            {hit.type === 'case study' && <BookMarked className={'h-5 w-5 text-white sm:h-5 sm:w-5 md:h-7 md:w-7'} />}
            {hit.type === 'faq' && <FileQuestionIcon className={'h-5 w-5 text-white sm:h-5 sm:w-5 md:h-7 md:w-7'} />}
            {hit.type === 'orthotics' && <Footprints className={'h-5 w-5 text-white sm:h-5 sm:w-5 md:h-7 md:w-7'} />}
          </div>
        )}
      </div>
      <div className={'flex grow flex-col'}>
        <div className={'mb-3 flex origin-left scale-90 flex-wrap items-center gap-1'}>
          {hit?.category && <Badge className={'w-fit'}>{hit.category.toUpperCase()}</Badge>}
          <Badge className={'w-fit bg-accent capitalize'}>{hit.type.toUpperCase()}</Badge>
        </div>
        <div className={'flex gap-2'}>
          <div className={'flex flex-col'}>
            <Highlight
              hit={hit}
              attribute="title"
              classNames={{ root: 'mb-2 text-base font-medium text-gray-700 group-hover:text-accent' }}
            />
            <Snippet
              hit={hit}
              attribute="text"
              classNames={{
                root: 'text-gray-600t',
              }}
            />
          </div>
        </div>
      </div>
      <div>
        <Link href={hit.slug ?? ''} className={''} onClick={() => setSearchDialog(false)}>
          <span className="absolute inset-0" />
          <SquareArrowOutUpRight className={'h-5 w-5 text-black group-hover:text-pink-600'} />
        </Link>
      </div>
    </div>
  );
};

export default SearchHitItem;
