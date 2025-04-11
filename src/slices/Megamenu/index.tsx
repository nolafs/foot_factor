import React, {FC} from 'react';
import {Content} from '@prismicio/client';
import {PrismicImage, PrismicRichText, SliceComponentProps} from '@prismicio/react';
import cn from 'clsx';
import {PrismicNextLink} from '@prismicio/next';
import {NavigationElementDocumentDataSubsItem} from '../../../prismicio-types';
import Linķ from 'next/link';
import ButtonSliceVariation from '@/components/ui/button-slice-variation';

/**
 * Props for `Megamenu`.
 */
export type MegaMenuProps = SliceComponentProps<
    Content.MegamenuSlice,
    { subs: NavigationElementDocumentDataSubsItem[] } // Typing the context
>;

/**
 * Component for "Megamenu" Slices.
 */
const Megamenu: FC<MegaMenuProps> = ({slice, context}) => {
  // Access the context here.
  console.log('MEGA SLICE', slice);
  console.log('CONTEXT', context );

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

  if (slice.variation === 'imageButtonRow') {

    return (<div className={'flex flex-col w-full h-full'}>
       <div className={`grid grid-cols-${slice.primary.links.length} gap-x-2 h-full`}>
          {slice.primary.links.map((item, idx) => (
              <div key={`main-nav-item-${idx}`} className={'group'}>
                <PrismicNextLink field={item.link} className={'relative isolate block w-full overflow-hidden rounded-xl text-shadow text-shadow-blur-5   text-shadow-cyan-950/50'}>
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
    );

  }

  return (
      <div id={'nav-content'} className={cn('flex flex-col w-full h-full max-w-[512px]')}>
              <div className="grid grid-cols-1 gap-4 ">
                {context.subs.map((item, idx) => (
                    <div
                        key={`main-nav-item-${idx}`}
                        className="group relative flex item-center gap-x-5 mb-2 rounded-lg p-2 text-sm/6 transition-all duration-500 ease-in-out hover:bg-black">
                      <div
                          className="aspect-1 flex size-8 items-center justify-center">
                        <PrismicImage
                            field={item.icon}
                            className="size-8 invert-0 transition-all duration-300 ease-in-out group-hover:invert"
                        />
                      </div>
                      <PrismicNextLink
                          field={item.link}
                          className={'flex flex-col space-y-1'}
                      >
                        <div
                            className={'text-base font-medium text-gray-800 transition-all group-hover:text-white'}>{item.label}</div>
                        <div className={'text-gray-400 transition-all group-hover:text-white'}>{item.subtitle}</div>
                        <span className="absolute inset-0"/>
                      </PrismicNextLink>
                    </div>
                ))}
              </div>
      </div>
  );
};

export default Megamenu;
