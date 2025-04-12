import React, { type FC} from 'react';
import {Content, filter} from '@prismicio/client';
import {PrismicImage, PrismicRichText, SliceComponentProps} from '@prismicio/react';
import cn from 'clsx';
import {PrismicNextLink} from '@prismicio/next';
import {NavigationElementDocumentDataSubsItem} from '../../../prismicio-types';
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
}

/**
 * Component for "Megamenu" Slices.
 */
const Megamenu: FC<MegaMenuProps> = ({slice, context}) => {
  // Access the context here.

  if(slice.variation === 'megaVideo') {

    return (
    <div className={cn('relative shrink')}>
      <div className={'flex flex-col space-y-3'}>
        <h2 className={'font-bold'}>{slice.primary.header}</h2>
        <div> {slice.primary?.video?.html ? (
          <div
              dangerouslySetInnerHTML={{__html: slice.primary.video.html}}
              className={
                'g:rounded-3xl aspect-h-9 aspect-w-16 w-full overflow-hidden rounded-xl md:rounded-2xl'
              }></div>) : ('Sorry, no video found')}
        </div>
        <div className={'text-sm'}><PrismicRichText field={slice.primary.description}/></div>
        <div>
          <ButtonSliceVariation link={slice.primary.link}   />
        </div>
      </div>
    </div>
    )
  }

  if(slice.variation === 'blog') {

    return (<BlogArticle />)

  }

  if (slice.variation === 'imageButtonRow') {

    return (<div><div className={'flex flex-col w-full h-full flex-1 justify-items-stretch'}>
       <div className={`grid grid-cols-${slice.primary.links.length} gap-x-2 h-full`}>
          {slice.primary.links.map((item, idx) => (
              <div key={`main-nav-item-${idx}`} className={'group h-full'}>
                <PrismicNextLink field={item.link} className={'relative isolate block w-full h-full overflow-hidden rounded-xl text-shadow text-shadow-blur-5   text-shadow-cyan-950/50'}>
                  <PrismicImage field={item.image}

                                className={'w-full h-full object-cover object-center transition duration-300 ease-in-out group-hover:scale-110'}
                  />
                  <div className={'absolute top-0 left-0 h-full w-full bg-gradient-to-b from-cyan-950/0 to-cyan-950 z-1 transition duration-300 ease-in-out  group-hover:opacity-60'}></div>
                  <div className={' absolute bottom-0 left-0 p-5 z-2 text-white overflow-hidden'}>
                    <span className={'text-base md:text-xl lg:text-2xl  text-white font-bold font-heading'}>{item.link.text}</span>
                    {item.description &&
                    <div className={'max-h-0  group-hover:max-h-[300px] text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out'}>
                      {item.description}
                    </div>
                    }
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

  return (context?.subs && context?.subs.length > 0) ? (

        chunkedArray.map((item, idx) => (
              <div id={'nav-content'} key={'nav-content-sub' + idx} className={cn('flex w-full xl:max-w-[512px]')}>
              <div className={cn("flex flex-col  w-full h-full gap-y-2", (largestChunkSize === item.length) ? 'justify-between' : 'justify-start')}>
                {item.map((item, idx) => (
                    <div
                        key={`main-nav-item-${idx}`}
                        className="group relative flex item-center justify-center  gap-x-5 rounded-lg p-5 transition-all duration-500 ease-in-out hover:bg-primary">
                      <div className={'flex w-2/12 h-full items-center justify-center'}>
                        <PrismicImage
                            field={item.icon}
                            className="size-10 invert-0 transition-all duration-300 ease-in-out group-hover:invert"
                        />
                      </div>
                      <PrismicNextLink
                          field={item.link}
                          className={'flex flex-col w-10/12  space-y-1'}
                      >
                        <div
                            className={'text-xl md:text-2xl lg:text-3xl font-medium leading-9 text-primary transition-all group-hover:text-accent'}>{item.label}</div>
                        <div className={'text-secondary text-sm/6 transition-all group-hover:text-white'}>{item.subtitle}</div>
                      </PrismicNextLink>
                    </div>
                ))}
              </div>
              </div>
          ))

  ): null;
};

export default Megamenu;
