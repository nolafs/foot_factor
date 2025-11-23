import cn from 'clsx';
import { PrismicImage, PrismicRichText } from '@prismicio/react';
import { PrismicNextLink } from '@prismicio/next';
import React, { useEffect, useMemo, useState } from 'react';
import { type NavigationElementDocumentData } from '@/prismic-types';
import { motion } from 'framer-motion';

export const NavigationMenuSubItem = ({ item }: { item: NavigationElementDocumentData }) => {
  // 1) Derive the default index from subs (NO state)
  const defaultActiveIndex = useMemo<number | null>(() => {
    const idx = item.subs.findIndex(sub => sub.default);
    return idx === -1 ? null : idx;
  }, [item.subs]);

  // 2) Only store what the user is currently hovering
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // 3) The effective active index:
  //    - hovered if available
  //    - otherwise the default
  const activeIndex = hoveredIndex ?? defaultActiveIndex;

  return (
    <div id={'nav-content'} className={cn('relative block w-full')}>
      <div className={'p-10'}>
        <div className={'grid w-full grid-cols-8 gap-5'}>
          <div className={'col-span-5'}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {item.subs.map((item, idx) => (
                <div
                  key={`main-nav-item-${idx}`}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="item-center group relative mb-2 flex gap-x-5 rounded-lg p-2 text-sm/6 transition-all duration-500 ease-in-out hover:bg-black">
                  <div className="aspect-1 flex size-8 items-center justify-center rounded-lg bg-black transition-all duration-300 ease-in-out group-hover:bg-white">
                    <PrismicImage
                      field={item.icon}
                      className="size-6 invert transition-all duration-300 ease-in-out group-hover:invert-0"
                    />
                  </div>
                  <PrismicNextLink field={item.link} className={'flex flex-col space-y-1'}>
                    <div className={'text-base font-medium text-gray-800 transition-all group-hover:text-white'}>
                      {item.label}
                    </div>
                    <div className={'text-gray-400 transition-all group-hover:text-white'}>{item.subtitle}</div>
                    <span className="absolute inset-0" />
                  </PrismicNextLink>
                </div>
              ))}
            </div>
          </div>
          <div className={'relative col-span-3'}>
            {item.subs.map((item, idx) => (
              <motion.div
                className={'absolute inset-0'}
                key={idx}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: activeIndex === idx ? 1 : 0, // Show/hide based on hover
                }}>
                <div className={'relative'}>
                  <div className={cn(`aspect-h-9 aspect-w-16 overflow-hidden rounded-xl outline-1 -outline-offset-1`)}>
                    <PrismicImage field={item.image} className={'block size-full object-cover object-center'} />
                  </div>
                </div>
                <div
                  className={cn(
                    'absolute bottom-0 right-2 w-3/4 rounded-md border border-transparent p-4 ' +
                      //'bg-[linear-gradient(115deg,var(--tw-gradient-stops))] from-[#baa2ecb3] from-[28%] via-[#00FAFEb3] via-[70%] to-[#2E5F9Ab3]' +
                      'bg-gray-100/40 shadow-md ring-1 ring-blue-950/15 backdrop-blur-lg',
                    'after:absolute after:inset-0 after:rounded-md after:shadow-[inset_0_0_2px_1px_#ffffff4d]',
                  )}>
                  <h3 className={'mb-2 flex space-x-2 text-lg font-bold text-black'}>
                    <div
                      className={
                        'aspect-1 left-2 top-2 z-20 flex size-6 items-center justify-center rounded-lg bg-black'
                      }>
                      <PrismicImage field={item.icon} className={'size-4 invert'} />
                    </div>

                    <span>{item.label}</span>
                  </h3>
                  <div className={'text-xs font-medium text-black/40'}>
                    <PrismicRichText field={item.description} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
