import React, {FC} from 'react';
import {Content} from '@prismicio/client';
import {PrismicImage, PrismicRichText, SliceComponentProps} from '@prismicio/react';
import cn from 'clsx';
import {PrismicNextLink} from '@prismicio/next';
import {motion} from 'framer-motion';
import {NavigationElementDocumentData, NavigationElementDocumentDataSubsItem} from '../../../prismicio-types';
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


  return (
      <div id={'nav-content'} className={cn('relative block w-full grow')}>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {context.subs.map((item, idx) => (
                    <div
                        key={`main-nav-item-${idx}`}
                        className="group relative flex item-center gap-x-5 mb-2 rounded-lg p-2 text-sm/6 transition-all duration-500 ease-in-out hover:bg-black">
                      <div
                          className="aspect-1 flex size-8 items-center justify-center rounded-lg bg-black transition-all duration-300 ease-in-out group-hover:bg-white">
                        <PrismicImage
                            field={item.icon}
                            className="size-6 invert transition-all duration-300 ease-in-out group-hover:invert-0"
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
