import React from 'react';
import {components} from '@/slices';
import {SliceZone} from '@prismicio/react';
import {notFound} from 'next/navigation';
import {createClient} from '@/prismicio';
import {BentoSection} from '@/components/features/resources/bentoList';
import {filter} from '@prismicio/client';

import Animate from '@/lib/animation';
import JSONLD from '@/types/schema';
import Script from 'next/script';

export default async function HomePage() {
  const client = createClient();
  const page = await client.getSingle('home').catch(() => notFound());

  const resentPosts = await client
      .getByType('posts', {
        pageSize: 5,
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


  const jsonLd = JSONLD;

  return (
      <main className={'min-h-svh w-full overflow-hidden'}>
        {/* SliceZone 1 */}
        {page.data.slices2 && <SliceZone slices={page.data.slices2} components={components}/>}

        <div className="bg-gradient-to-b from-white from-50% to-gray-100 pb-24">
          {resentPosts.length && (
              <Animate>
                <BentoSection
                    heading={page.data.latest_articles_heading}
                    subheading={'Resent Articles'}
                    body={page.data.latest_articles_body}
                    links={page.data.latest_articles_links}
                    listings={resentPosts}
                    dark={false}
                />
              </Animate>
          )}
        </div>

        {/* SliceZone 2 */}
        {page.data.slices && <SliceZone slices={page.data.slices} components={components}/>}

        {/* Add JSON-LD to your page */}
        <Script id={'ld-json-home'} type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}/>
      </main>
  );
}
