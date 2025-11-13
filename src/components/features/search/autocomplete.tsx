'use client';

import {liteClient as algoliasearch} from 'algoliasearch/lite';
import React, {useState, useEffect, useRef} from 'react';
import {
  InstantSearch,
  useSearchBox,
  useHits,
  useRefinementList,
  useClearRefinements,
  Configure,
  PoweredBy, Stats
} from 'react-instantsearch';
import type {HitBaseItem} from '@/types/hit.type';
import Link from 'next/link';
import {Activity, SquareArrowOutUpRight, Search, X, Filter} from 'lucide-react';
import {Heading} from '@/components/ui/text';
import {Badge} from '@/components/ui/badge';
import Image from 'next/image';
import {Button} from '@/components/ui/button';
import cn from 'clsx';

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
          <Link href={item.slug}>
            <span className="absolute inset-0"/>
            <SquareArrowOutUpRight className="h-5 w-5 text-black group-hover:text-accent"/>
          </Link>
        </div>
      </div>
  );
};

// Category refinement component
const CategoryRefinement = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {items, refine} = useRefinementList({
    attribute: 'category',
    limit: 10,
    sortBy: ['count:desc', 'name:asc'],
  });

  console.log('CategoryRefinement items', items);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Show selected categories count
  const selectedCount = items.filter(item => item.isRefined).length;

  if (items.length === 0) return null;

  return (
      <div className="relative" ref={dropdownRef}>
        <Button variant={'outline'} size={'icon'}
            onClick={() => setIsOpen(!isOpen)}
            className={cn(`flex rounded-lg  transition-colors relative`,
                selectedCount > 0
                    ? 'border-accent bg-white text-accent'
                    : 'border-gray-300 hover:border-gray-400'
            )}
        >
          <Filter className="h-4 w-4"/>
          {selectedCount > 0 && (
          <div className="text-[10px] flex justify-center items-center rounded-full h-4 w-4 bg-accent text-white absolute top-1 right-1">
            <span>{selectedCount}</span>
          </div>
          )}
        </Button>

        {isOpen && (
            <div
                className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
              <div className="p-2 border-b border-gray-100">
                <span className="text-xs text-gray-500 font-medium">Filter by Category</span>
              </div>
              {items.map((item) => (
                  <label
                      key={item.value}
                      className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-b-0"
                  >
                    <input
                        type="checkbox"
                        checked={item.isRefined}
                        onChange={() => refine(item.value)}
                        className="rounded border-gray-300 text-accent focus:ring-accent-400"
                    />
                    <span className="flex-1 text-sm capitalize">{item.label}</span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {item.count}
              </span>
                  </label>
              ))}
            </div>
        )}
      </div>
  );
};

// Clear refinements component
const ClearFilters = () => {
  const {canRefine, refine} = useClearRefinements();

  if (!canRefine) return null;

  return (
      <Button variant={'outline'} size={'icon'}
          onClick={() => refine()}
          className="px-3 py-2 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
      >
        <X className="h-4 w-4"/>
      </Button>
  );
};

// Main search component
const SearchComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const {query, refine, clear} = useSearchBox();
  const {hits} = useHits<HitBaseItem>();

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
        <div className="relative flex space-x-2 mt-4">
          <div className="relative grow">
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
          {/* Refinements */}
          <div className="flex space-x-2">
            <CategoryRefinement/>
            <ClearFilters/>
          </div>
        </div>

        <div className="flex items-center space-x-3 mt-4">
        </div>


        {/* Results */}
        {isOpen && inputValue && (
            <div className="absolute z-[999] w-full mt-28 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
              {/* Stats */}
              {inputValue && (
                  <div className="px-4 py-3 text-sm text-gray-500 bg-gray-50 border-b border-gray-200">
                   <Stats />
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
                    <p>No results found for {inputValue}</p>
                    <p className="text-sm mt-2">Try adjusting your search terms or filters</p>
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
      <InstantSearch searchClient={searchClient} indexName="conditions">
        <Configure
            hitsPerPage={8}
            analytics={true}
            clickAnalytics={true}
        />
        <SearchComponent/>
      </InstantSearch>
  );
};
