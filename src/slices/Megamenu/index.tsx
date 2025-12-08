import React, { type FC } from 'react';
import { type Content } from '@prismicio/client';
import { PrismicImage, PrismicRichText, type SliceComponentProps } from '@prismicio/react';
import cn from 'clsx';
import { PrismicNextLink } from '@prismicio/next';
import { type NavigationElementDocumentDataSubsItem } from '@/prismic-types';
import ButtonSliceVariation from '@/components/ui/button-slice-variation';
import BlogArticle from '@/slices/Megamenu/component/blog-article';

/**
 * Props for `Megamenu`.
 */
export type MegaMenuProps = SliceComponentProps<
  Content.MegamenuSlice,
  { subs: NavigationElementDocumentDataSubsItem[] } // Typing the context
>;

const splitArray = (array: NavigationElementDocumentDataSubsItem[], chunkSize: number) => {
  const result: NavigationElementDocumentDataSubsItem[][] = [];
  const length = array.length;
  const sliceSize = Math.ceil(length / chunkSize);
  for (let i = 0; i < array.length; i += sliceSize) {
    result.push(array.slice(i, i + sliceSize));
  }
  return result;
};

/**
 * Component for "Megamenu" Slices.
 */
const Megamenu: FC<MegaMenuProps> = ({ slice, context }) => {
  // Access the context here.

  if (slice.variation === 'megaVideo') {
    return (
      <div className={cn('relative shrink')}>
        <div className={'flex flex-col space-y-3'}>
          <h2 className={'font-bold'}>{slice.primary.header}</h2>
          <div>
            {' '}
            {slice.primary?.video?.html ? (
              <div
                dangerouslySetInnerHTML={{ __html: slice.primary.video.html }}
                className={
                  'g:rounded-3xl aspect-h-9 aspect-w-16 w-full overflow-hidden rounded-xl md:rounded-2xl'
                }></div>
            ) : (
              'Sorry, no video found'
            )}
          </div>
          <div className={'text-sm'}>
            <PrismicRichText field={slice.primary.description} />
          </div>
          <div>
            <ButtonSliceVariation link={slice.primary.link} />
          </div>
        </div>
      </div>
    );
  }

  if (slice.variation === 'blog') {
    return (
      <div className={'hidden h-full w-full 2xl:block'}>
        <h2 className="text-3xl font-medium tracking-tight">Featured Article</h2>
        <BlogArticle size={2} />
      </div>
    );
  }

  if (slice.variation === 'imageButtonRow') {
    return (
      <div>
        <div className={'flex h-full w-full flex-1 flex-col justify-items-stretch'}>
          <div className={`grid grid-cols-1 lg:grid-cols-${slice.primary.links.length} h-full gap-x-2`}>
            {slice.primary.links.map((item, idx) => (
              <div key={`main-nav-item-${idx}`} className={'group h-full'}>
                <PrismicNextLink
                  field={item.link}
                  className={
                    'text-shadow relative isolate block h-full w-full overflow-hidden rounded-xl text-shadow-blur-5 text-shadow-cyan-950/50'
                  }>
                  <PrismicImage
                    field={item.image}
                    className={
                      'h-full w-full object-cover object-center transition duration-300 ease-in-out group-hover:scale-110'
                    }
                  />
                  <div
                    className={
                      'z-1 absolute left-0 top-0 h-full w-full bg-gradient-to-b from-cyan-950/0 to-cyan-950 transition duration-300 ease-in-out group-hover:opacity-60'
                    }></div>
                  <div className={'z-2 absolute bottom-0 left-0 overflow-hidden p-5 text-white'}>
                    <span className={'font-heading text-base font-bold text-white md:text-xl lg:text-2xl'}>
                      {item.link.text}
                    </span>
                    {item.description && (
                      <div
                        className={
                          'max-h-0 text-sm opacity-0 transition-all duration-300 ease-in-out group-hover:max-h-[300px] group-hover:opacity-100'
                        }>
                        {item.description}
                      </div>
                    )}
                  </div>
                </PrismicNextLink>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const numberOfColumns = slice.primary.columns ?? 1;
  const chunkedArray = splitArray(context?.subs || [], numberOfColumns);
  const largestChunkSize = Math.max(...chunkedArray.map(chunk => chunk.length));

  return context?.subs && context?.subs.length > 0
    ? chunkedArray.map((item, idx) => (
        <div
          id={'nav-content'}
          key={'nav-content-sub' + idx}
          className={cn('flex w-full min-w-[460px] xl:max-w-[512px]')}>
          <div
            className={cn(
              'flex h-full w-full flex-col gap-y-2',
              largestChunkSize === item.length ? 'justify-start' : 'justify-start',
            )}>
            {item.map((item, idx) => (
              <div
                key={`main-nav-item-${idx}`}
                className="item-center group relative flex justify-center gap-x-5 rounded-lg p-5 transition-all duration-500 ease-in-out hover:bg-primary">
                <div className={'flex h-full w-2/12 items-center justify-center'}>
                  <PrismicImage
                    field={item.icon}
                    className="size-10 invert-0 transition-all duration-300 ease-in-out group-hover:invert"
                  />
                </div>
                <PrismicNextLink field={item.link} className={'flex w-10/12 flex-col space-y-1'}>
                  <div
                    className={
                      'text-xl font-medium leading-9 text-primary transition-all group-hover:text-accent lg:text-2xl xl:text-3xl'
                    }>
                    {item.label}
                  </div>
                  <div className={'text-sm/6 text-secondary transition-all group-hover:text-white'}>
                    {item.subtitle}
                  </div>
                </PrismicNextLink>
              </div>
            ))}
          </div>
        </div>
      ))
    : null;
};

export default Megamenu;
