'use client';

import { useState } from 'react';
import { asText } from '@prismicio/client';
import type { RichTextField, KeyTextField, ImageField, ContentRelationshipField } from '@prismicio/client';
import { PrismicImage } from '@prismicio/react';
import { PrismicNextLink } from '@prismicio/next';
import cn from 'clsx';
import { type NavigationElementDocumentDataSubsItem } from '@/prismic-types';

export type ResolvedLink = {
  linkField: ContentRelationshipField;
  heading: KeyTextField;
  lead: RichTextField | KeyTextField;
  thumb: ImageField;
};

export type ResolvedPanel = ResolvedLink[];

interface MegaContextProps {
  subs: NavigationElementDocumentDataSubsItem[];
  panels: ResolvedPanel[];
}

function resolveLead(lead: RichTextField | KeyTextField | null | undefined): string | null {
  if (!lead) return null;
  if (Array.isArray(lead)) return asText(lead) || null;
  return lead;
}

const MegaContext = ({ subs, panels }: MegaContextProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div data-slice-type="megamenu" data-slice-variation="megaContext" className={'flex w-full gap-x-2'}>
      <div className={cn('flex w-full min-w-[460px] xl:max-w-[512px]')}>
        {/* Column 1: Navigation items — hover controls which panel shows in column 2 */}
        <div className={cn('flex h-full w-full flex-col justify-start gap-y-2')}>
          {subs.map((item, idx) => (
            <div
              id={`main-nav-item-${idx}`}
              key={`main-nav-item-${idx}`}
              onMouseEnter={() => setActiveIndex(idx)}
              className={cn(
                'item-center group relative flex justify-center gap-x-2 rounded-lg p-2 transition-all duration-300 ease-in-out lg:gap-x-3 lg:p-4 2xl:gap-x-5 2xl:p-5',
                activeIndex === idx ? 'bg-primary' : 'hover:bg-primary',
              )}>
              <div className={'flex h-full w-2/12 items-center justify-center'}>
                <PrismicImage
                  field={item.icon}
                  className={cn(
                    'size-10 transition-all duration-300 ease-in-out',
                    activeIndex === idx ? 'invert' : 'invert-0 group-hover:invert',
                  )}
                />
              </div>
              <PrismicNextLink field={item.link} className={'flex w-10/12 flex-col space-y-1'}>
                <div
                  className={cn(
                    'font-medium leading-9 transition-all lg:text-lg xl:text-xl',
                    activeIndex === idx ? 'text-accent' : 'text-primary group-hover:text-accent',
                  )}>
                  {item.label}
                </div>
                <div
                  className={cn(
                    'text-sm/6 transition-all',
                    activeIndex === idx ? 'text-white' : 'text-secondary group-hover:text-white',
                  )}>
                  {item.subtitle}
                </div>
              </PrismicNextLink>
            </div>
          ))}
        </div>
      </div>

      {/* Column 2: One panel per sub item, fades in when its nav item is active */}
      <div className={'relative flex h-full w-full flex-1 flex-col justify-items-stretch'}>
        {panels.map((links, panelIdx) => (
          <div
            key={`panel-${panelIdx}`}
            className={cn(
              'absolute inset-0 grid h-full auto-cols-fr grid-flow-col gap-x-2 transition-opacity duration-300 ease-in-out',
              //links.length > 1 ? 'grid-cols-2' : 'grid-cols-1',
              activeIndex === panelIdx ? 'opacity-100' : 'pointer-events-none opacity-0',
            )}>
            {links.map((resolved, linkIdx) => {
              const leadText = resolveLead(resolved.lead);
              return (
                <div key={`link-${linkIdx}`} className="group relative h-full min-h-0 overflow-hidden">
                  <PrismicNextLink
                    field={resolved.linkField}
                    className="text-shadow relative isolate block h-full w-full overflow-hidden rounded-xl text-shadow-blur-5 text-shadow-cyan-950/50">
                    <PrismicImage
                      field={resolved.thumb}
                      className="h-full w-full object-cover object-center transition duration-300 ease-in-out group-hover:scale-110"
                    />
                    <div className="z-1 absolute left-0 top-0 h-full w-full bg-gradient-to-b from-cyan-950/0 to-cyan-950 transition duration-300 ease-in-out group-hover:opacity-60" />
                    <div className="z-2 absolute bottom-0 left-0 overflow-hidden p-5 text-white">
                      <span className="font-heading text-base font-bold text-white md:text-lg lg:text-xl">
                        {resolved.heading}
                      </span>
                      {leadText && (
                        <div className="max-h-0 text-xs opacity-0 transition-all duration-300 ease-in-out group-hover:max-h-[300px] group-hover:opacity-100 xl:text-sm">
                          {leadText}
                        </div>
                      )}
                    </div>
                  </PrismicNextLink>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MegaContext;
