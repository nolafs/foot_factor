'use client';

import '@algolia/autocomplete-theme-classic';
import {liteClient as algoliasearch} from 'algoliasearch/lite';
import type {SearchQuery} from 'algoliasearch';
import {autocomplete, getAlgoliaResults} from '@algolia/autocomplete-js';
import {type BaseItem} from '@algolia/autocomplete-core';
import {createRoot, type Root} from 'react-dom/client';
import React, {
  useEffect,
  useRef,
  createElement,
  Fragment,
} from 'react';
import type {HitBaseItem} from '@/types/hit.type';
import Link from 'next/link';
import {Activity, SquareArrowOutUpRight} from 'lucide-react';
import {Heading} from '@/components/ui/text';
import {Badge} from '@/components/ui/badge';
import Image from 'next/image';

const AutocompleteItem = ({item}: { item: HitBaseItem }) => {
  const trimmedText =
      item.text.length > 100 ? item.text.substring(0, 200) + '...' : item.text;

  const imageUrl: string | null = item.image?.url as string | null;

  return (
      <div className="group relative flex w-full items-center justify-between space-x-4 p-4 border-b border-gray-200">

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

export const AutoComplete = () => {
  const searchRef = useRef(null);
  const panelRootRef = useRef<Root | null>(null);
  const rootRef = useRef<HTMLElement | null>(null);

  const searchClient = algoliasearch(
      process.env.NEXT_PUBLIC_ALGOLIA_APPLICATION_ID!,
      process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_ONLY_API_KEY!,
  );

  useEffect(() => {
    if (!searchRef.current) return;

    const container = searchRef.current as HTMLElement;

    // Skip if already initialized
    if (container.dataset.autocompleteInitialized === 'true') return;

    container.dataset.autocompleteInitialized = 'true';

    autocomplete<BaseItem>({
      container,
      openOnFocus: true,
      placeholder: 'Search conditions…',
      renderer: {
        createElement,
        Fragment,
        render: () => {
          console.log('Rendering autocomplete');
        },
      },
      render({children}, root) {
        if (!panelRootRef.current || rootRef.current !== root) {
          rootRef.current = root;
          panelRootRef.current?.unmount();
          panelRootRef.current = createRoot(root);
        }

        panelRootRef.current.render(children);
      },
      getSources({query}) {
        return [
          {
            sourceId: 'hits',
            getItems() {
              return getAlgoliaResults({
                searchClient,
                queries: [
                  {
                    indexName: 'conditions',
                    query,
                    params: {hitsPerPage: 8},
                  } as SearchQuery
                ],
              });
            },
            templates: {
              item({item}) {
                return <AutocompleteItem item={item as HitBaseItem}/>;
              },
            },
          },
        ] ;
      },
    });
  }, [searchClient]);

  return (<div  className={'w-full flex flex-col relative z-10 mb-10'}>
        <Heading as={'h2'} className={'mb-0'}>Search Conditions</Heading>
      <div
          ref={searchRef}
          id="autocomplete"
          className="w-full z-50  mx-auto mt-4"
      />
      </div>
  );
};
