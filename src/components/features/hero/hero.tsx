import { Container } from '@/components/ui/container';
import { Gradient } from '@/components/ui/gradient';
import { type ImageField, type KeyTextField, type LinkField } from '@prismicio/client';
import { PrismicNextImage } from '@prismicio/next';
import ButtonSliceVariation from '@/components/ui/button-slice-variation';
import React from 'react';
import cn from 'clsx';

export interface HeroProps {
  heading: KeyTextField | string;
  subheading: KeyTextField | string;
  links?: LinkField[];
  image?: ImageField;
  fullWidthImage?: boolean
  rating?: ImageField;
}

export function Hero({ heading, subheading, links, image, rating, fullWidthImage = true }: HeroProps) {



  return (
      <div className="relative isolate overflow-hidden">
        {!fullWidthImage ? (
            <>
              <Gradient className="absolute inset-2 bottom-0 rounded-4xl ring-1 ring-inset ring-black/5"/>
              {image && (
                  <div className="absolute inset-2 bottom-0 z-0 overflow-hidden rounded-4xl">
                    <div
                        className={
                          'flex w-full flex-col items-center justify-start sm:items-center md:items-center lg:items-end'
                        }>
                      <PrismicNextImage
                          loading={'lazy'}
                          field={image}
                          className="block h-auto w-full max-w-[860px] object-contain opacity-50 sm:w-full md:opacity-100 lg:w-1/2"
                      />
                    </div>
                  </div>
              )}
            </>
        ) : (
            <>
              <div
                  className="absolute top-0 z-10 h-full w-full bg-[linear-gradient(180deg,var(--tw-gradient-stops))] from-[#ffffffE6] from-[5%] via-[#00FAFE1a] via-[50%] to-[#2E5F9A1A] ring-1 sm:bg-[linear-gradient(180deg,var(--tw-gradient-stops))]"/>
              {image && (
                  <div className="z-1 absolute inset-0 overflow-hidden rounded-b-4xl">
                    <PrismicNextImage
                        loading={'lazy'}
                        field={image}
                        fallbackAlt={heading ? '' : undefined}
                        className="relative h-full w-full max-w-full object-cover object-center"
                    />
                  </div>
              )}
            </>
        )}

        <Container className="relative z-20">
          <div className="pb-22 pt-32 sm:pb-24 sm:pt-32 md:pb-52 md:pt-64 w-full sm:w-full lg:max-w-3xl">
            <h1
                className={cn(
                    'font-display text-balance text-5xl/[0.9] font-medium tracking-tight text-secondary sm:text-6xl/[0.8] md:text-6xl/[0.8] lg:text-7xl/[0.8]'
                )}>
              {heading}
            </h1>
            <p
                className={cn(
                    'mt-8 max-w-2xl text-xl/7 font-medium text-gray-950/75 drop-shadow-[0px_0px_10px_rgba(255,255,255,1)] sm:text-xl/7'
                )}>
              {subheading}
            </p>


            <div className="mt-12 flex flex-col gap-x-3 gap-y-4 sm:flex-row">
              {links?.map(link => (
                  <ButtonSliceVariation
                      key={
                        link.text ? link?.text.toLowerCase().replace(/ /g, '-') : Math.random().toString(36).substring(2, 15)
                      }
                      link={link}
                  />
              ))}
            </div>

            {rating && (<div className={'mt-10'}><PrismicNextImage field={rating} /></div>)}
            <div>

            </div>
          </div>
        </Container>
      </div>
  );
}
