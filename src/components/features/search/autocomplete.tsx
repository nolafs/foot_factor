'use client';

import {liteClient as algoliasearch} from 'algoliasearch/lite';
import React, {useState, useEffect, useRef} from 'react';
import {InstantSearchNext} from 'react-instantsearch-nextjs';
import {useSearchBox, useHits, useStats, Configure, PoweredBy} from 'react-instantsearch';
import type {HitBaseItem} from '@/types/hit.type';
import Link from 'next/link';
import {Activity, SquareArrowOutUpRight, Search, X} from 'lucide-react';
import {Heading} from '@/components/ui/text';
import {Badge} from '@/components/ui/badge';
import Image from 'next/image';

const AutocompleteItem = ({item}: { item: HitBaseItem }) => {
  const trimmedText =
      item.text.length > 100 ? item.text.substring(0, 200) + '...' : item.text;

  const imageUrl: string | null = item.image?.url as string | null;

  return (
      <div
          className="group relative flex w-full items-center justify-between space-x-4 p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors">
        <div className={'relative isolate'}>
          {imageUrl ? (<>
                <div className={'relative h-fit w-fit rounded-md bg-accent/60 p-2 md:absolute md:left-2 md:top-2'}>
                  <Activity className="h-3 w-3 text-white"/>
                </div>
                <Image
                    src={imageUrl}
                    alt={item.title}
                    width={120}
                    height={68}
                    className={'hidden aspect-[16/9] h-full w-full rounded-md object-cover object-center sm:hidden md:block'}
                /></>
          ) : (
              <div className={'h-fit w-fit rounded-md bg-accent/60 p-2 md:p-3'}>
                <Activity className={'h-5 w-5 text-white sm:h-5 sm:w-5 md:h-7 md:w-7'}/>
              </div>
          )}
        </div>

        <div className="flex grow flex-col space-y-2">
          <Badge className={'w-fit bg-accent capitalize text-[9px]'}>{item.category}</Badge>
          <div className="font-semibold group-hover:text-accent">{item.title}</div>
          <p className="mt-2 text-sm text-gray-600">{trimmedText}</p>
        </div>
        <div>
          <Link href={`/conditions/${item.category}/${item.slug}`}>
            <span className="absolute inset-0"/>
            <SquareArrowOutUpRight className="h-5 w-5 text-black group-hover:text-accent"/>
          </Link>
        </div>
      </div>
  );
};


// Custom search component using React InstantSearch hooks
const SearchComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const {query, refine, clear} = useSearchBox();
  const {hits} = useHits<HitBaseItem>();
  const {nbHits, processingTimeMS} = useStats();

  // Sync input value with search query
  useEffect(() => {
    setInputValue(query);
  }, [query]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    refine(value);
    setIsOpen(value.length > 0);
  };

  const handleInputFocus = () => {
    if (inputValue.length > 0) {
      setIsOpen(true);
    }
  };

  const handleInputBlur = () => {
    // Delay to allow for clicks on results
    setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  const handleClear = () => {
    setInputValue('');
    clear();
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
      <div className="w-full flex flex-col relative z-10 mb-10">
        <Heading as="h2" className="mb-0">Search Conditions</Heading>

        {/* Search Input */}
        <div className="relative mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"/>
            <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                placeholder="Search conditions…"
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {inputValue && (
                <button
                    onClick={handleClear}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4"/>
                </button>
            )}
          </div>
        </div>

        {/* Results */}
        {isOpen && inputValue && (
            <div className="mt-4 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
              {/* Stats */}
              {inputValue && (
                  <div className="px-4 py-3 text-sm text-gray-500 bg-gray-50 border-b border-gray-200">
                    {nbHits} result{nbHits !== 1 ? 's' : ''} found in {processingTimeMS}ms
                  </div>
              )}

              {/* Results List */}
              {hits.length > 0 ? (
                  <div className="max-h-96 overflow-y-auto">
                    {hits.map((item, index) => (
                        <AutocompleteItem key={`${item.objectID}-${index}`} item={item}/>
                    ))}
                  </div>
              ) : inputValue ? (
                  <div className="px-4 py-8 text-center text-gray-500">
                    <p>No results found for "{inputValue}"</p>
                    <p className="text-sm mt-2">Try adjusting your search terms</p>
                  </div>
              ) : null}

              {/* Powered by Algolia */}
              <div className="flex justify-center px-4 py-3 border-t border-gray-200 bg-gray-50">
                <PoweredBy/>
              </div>
            </div>
        )}
      </div>
  );
};

export const AutoComplete = () => {
  const searchClient = algoliasearch(
      process.env.NEXT_PUBLIC_ALGOLIA_APPLICATION_ID!,
      process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_ONLY_API_KEY!,
  );

  return (
      <InstantSearchNext searchClient={searchClient} indexName="conditions">
        <Configure
            hitsPerPage={8}
            analytics={true}
            clickAnalytics={true}
        />
        <SearchComponent/>
      </InstantSearchNext>
  );
};
