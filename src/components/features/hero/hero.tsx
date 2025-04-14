import { Container } from '@/components/ui/container';
import { type ImageField, type KeyTextField, type LinkField, type RichTextField } from '@prismicio/client';
import { PrismicNextImage } from '@prismicio/next';
import React from 'react';
import cn from 'clsx';
import {PrismicRichText} from '@prismicio/react';
import {Badge} from '@/components/ui/badge';
import ButtonRow from '@/components/ui/button-row';

export interface HeroProps {
  heading: RichTextField;
  subheading?: KeyTextField | string | null | undefined;
  lead?: RichTextField;
  links?: LinkField[];
  image?: ImageField;
  hasBooking?: boolean;
  rating?: ImageField;
}

export  function Hero({ heading, subheading, lead,  links, image, hasBooking, rating }: HeroProps) {



  return (
      <div className="relative isolate overflow-hidden">
          <>
            <div
                className="absolute top-0 z-10 h-full w-full bg-primary opacity-40"/>
            {image && (
                <div className="z-1 absolute inset-0 overflow-hidden h-full">
                  <PrismicNextImage
                      loading={'lazy'}
                      field={image}
                      fallbackAlt={heading ? '' : undefined}
                      className="relative h-full w-full max-w-full object-cover object-center"
                  />
                </div>
            )}
          </>


        <Container className="relative z-20">
          <div className="pb-22 pt-32 sm:pb-24 sm:pt-32 md:pb-52 md:pt-64 w-full sm:w-full lg:max-w-3xl">

            { subheading &&  <Badge>{subheading}</Badge>}
            <header
                className={cn(
                    'font-heading  text-balance text-5xl/[1.1] font-medium text-white sm:text-6xl/[1.1] md:text-6xl/[0.8] lg:text-7xl/[1.1]'
                )}>
                <PrismicRichText field={heading} />
            </header>
            <p
                className={cn(
                    'mt-8 max-w-2xl text-xl/7 font-medium text-gray-950/75 drop-shadow-[0px_0px_10px_rgba(255,255,255,1)] sm:text-xl/7'
                )}>
              <PrismicRichText field={lead}/>
            </p>


            <ButtonRow hasBooking={hasBooking} links={links}/>

            {rating && (<div className={'mt-48'}><PrismicNextImage field={rating} /></div>)}
            <div>

            </div>
          </div>
        </Container>
      </div>
  );
}
