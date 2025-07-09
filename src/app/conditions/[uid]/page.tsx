import type { Metadata} from 'next';
import { notFound } from 'next/navigation';
import { SliceZone } from '@prismicio/react';
import { createClient } from '@/prismicio';
import { components } from '@/slices';
import React from 'react';
import {asImageSrc, isFilled} from '@prismicio/client';
import {Hero} from '@/components/features/hero/hero';
import {Heading, Lead} from '@/components/ui/text';
import {buttonVariants} from '@/components/ui/button';
import {CircleArrowRight} from 'lucide-react';
import BlogArticle from '@/slices/Megamenu/component/blog-article';
import {Container} from '@/components/ui/container';
import Link from 'next/link';
type Params = { uid: string };

export async function generateMetadata({params}: { params: Promise<Params> }): Promise<Metadata> {
  const {uid} = await params;
  const client = createClient();
  const page = await client.getByUID('condition', uid).catch(() => notFound());

  return {
    title: page.data.meta_title,
    description: page.data.meta_description,
    openGraph: {
      title: isFilled.keyText(page.data.meta_title) ? page.data.meta_title : undefined,
      description: isFilled.keyText(page.data.meta_description) ? page.data.meta_description : undefined,
      images: isFilled.image(page.data.meta_image) ? [asImageSrc(page.data.meta_image)] : undefined,
    },
  };
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const {uid} = await params;
  const client = createClient();
  const page = await client.getByUID('condition', uid).catch(() => notFound());

  return (
    <main className={'w-full overflow-hidden'}>
      <Hero heading={page.data.title} image={page.data.feature_image} subheading={'Condition'} lead={page.data.excerpt} />
      <SliceZone slices={page.data.slices} components={components} />

      <Container as={'section'} color={'accent'} padding={'lg'}>
        <hgroup>
          <div className={'flex w-full justify-between items-center gap-5 md:gap-8 lg:gap-10'}>
            <Heading as="h2" className={'mb-8'}>
              Related Articles
            </Heading>
            <div>
              <Link href={'/resources/blog'} className={buttonVariants({variant: 'default'})}>
                All articles <CircleArrowRight className={'ml-2 h-4 w-4'}/>
              </Link>
            </div>
          </div>
          <div className={'w-full md:max-w-4xl lg:max-w-3xl'}>
            <Lead>
              Find expert tips, advice, and insights to support your foot health and active lifestyle.
            </Lead>
          </div>
        </hgroup>
        <div className={'mt-16'}>
          <BlogArticle size={3} tags={page.data.tags
              .map(item => (item.tag as unknown as { id: string }).id)
              .filter(Boolean)
          }/>
        </div>
      </Container>
    </main>
  );
}

export async function generateStaticParams() {
  const client = createClient();
  const pages = await client.getAllByType('condition');

  return pages.map(page => {
    return {uid: page.uid};
  });
}
