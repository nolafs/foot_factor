import React from 'react';
import { GradientBackground } from '@/components/ui/gradient';
import { type OGImage } from '@/types';

import type { Metadata, ResolvingMetadata } from 'next';
import { type ResolvedOpenGraph } from 'next/dist/lib/metadata/types/opengraph-types';
import { Heading, Lead, Subheading } from '@/components/ui/text';
import { Container } from '@/components/ui/container';
import { SearchInput } from '@/components/features/search/search-input';
import HeroSimple from '@/components/features/hero/hero-simple';

type Params = { uid: string };

export const dynamic = 'force-dynamic';

export async function generateMetadata(
  { params }: { params: Promise<Params> },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const parentMeta = await parent;
  const parentOpenGraph: ResolvedOpenGraph | null = parentMeta.openGraph ?? null;

  return {
    title: 'Foot Factor - Search',
    description: 'Search for more information',
    openGraph: {
      title: 'Foot Factor - Search',
      images: [
        {
          url: parentOpenGraph?.images ? (parentOpenGraph.images[0] as OGImage).url : '',
        },
      ],
    },
  };
}

export default async function Page() {
  return (
    <main className={'w-full overflow-hidden'}>
      <HeroSimple
          wave_type={'default'}
        heading={'Search Foot Factor'}
        subheading={'Explore expert advice, treatment insights, and recovery tips through our curated articles, video and other\n' +
            '          resources. Stay informed and take charge of your ankle health journey.'}
        label={'search'}
      />
      <div className="mb-24 mt-5 md:mb-24 md:mt-10">
        <SearchInput isSearchPage={true} />
      </div>
    </main>
  );
}
