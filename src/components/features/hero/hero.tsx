'use client';
import { Container } from '@/components/ui/container';
import {type ImageField, isFilled, type KeyTextField, type LinkField, type RichTextField} from '@prismicio/client';
import { PrismicNextImage } from '@prismicio/next';
import React, {useRef} from 'react';
import cn from 'clsx';
import {PrismicRichText} from '@prismicio/react';
import {Badge} from '@/components/ui/badge';
import ButtonRow from '@/components/ui/button-row';
import {motion, useScroll, useSpring, useTransform} from 'framer-motion';

export interface HeroProps {
  heading: RichTextField | KeyTextField | string;
  subheading?: KeyTextField | string | null | undefined;
  lead?: RichTextField | KeyTextField | string;
  links?: LinkField[];
  image?: ImageField;
  hasBooking?: boolean;
  vAlign?: 'top' | 'center' | 'bottom';
  rating?: ImageField;
  imagePosition?: 'left' | 'right' | 'center' | 'top' | 'bottom';
  children?: React.ReactNode;
}

export  function Hero({ heading, subheading, lead,  links, image, hasBooking, rating, imagePosition = 'center', vAlign = 'center', children }: HeroProps) {
  const heroRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLDivElement | null>(null);
  const speed = 0.8;
  // Track scroll progress relative to the hero section
  const {scrollYProgress} = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });


  // Transform values for different elements
  const textY = useTransform(scrollYProgress, [0, 1], ["0vh", "-200vh"]);
  const imageY = useTransform(scrollYProgress, [0, 1], [`0vh`, `${200 * speed}vh`]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.2, 2]);

  const smoothY = useSpring(imageY, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });



  return (
      <div className="relative isolate overflow-hidden h-svh max-h-[1080px]">
          <>
            <div
                className="absolute top-0 z-10 h-full w-full bg-primary opacity-40"/>
            {image && (
                <motion.div
                    ref={imageRef}
                    className="z-1 absolute inset-0 overflow-hidden w-full h-full"
                    style={{y: smoothY, scale: imageScale, transform: 'translateZ(0)'}}
                >
                  <PrismicNextImage
                      loading={'lazy'}
                      field={image}
                      fallbackAlt={heading ? '' : undefined}
                      className={cn("relative h-full w-full max-w-full object-cover object-center",
                      imagePosition === 'left' && 'object-left',
                      imagePosition === 'right' && 'object-right',
                      imagePosition === 'top' && 'object-top',
                      imagePosition === 'bottom' && 'object-bottom',
                      imagePosition === 'center' && 'object-center',
                      )}
                  />
                </motion.div>
            )}
          </>

        <motion.div
            className="absolute top-0 sm:bottom-0 sm:top-auto w-full z-20"
            style={{y: textY}}
        >
        <Container className="relative z-20 flex flex-col justify-end h-svh">
          <div className={cn("flex flex-col justify-stretch pb-5 pt-20 sm:pb-16 sm:pt-32 md:pb-32 md:pt-64 w-full h-svh sm:w-full lg:max-w-3xl"
          )}>
            <div className={cn('grow flex flex-col',
              vAlign === 'top' && 'justify-start',
              vAlign === 'center' && 'justify-center',
              vAlign === 'bottom' && 'justify-end',
            )}>
             <div>
            { subheading &&  <Badge >{subheading}</Badge>}
            <header
                className={cn(
                    'font-heading  text-balance text-5xl/[1.1] font-medium text-white sm:text-6xl/[1.1] md:text-6xl/[0.8] lg:text-7xl/[1.1]'
                )}>
              {Array.isArray(heading) && isFilled.richText(heading) ? (
                  <PrismicRichText field={heading}/>
              ) : (
                  <h1>{heading}</h1>
              )}
            </header>
            <div
                className={cn(
                    'mt-8 max-w-2xl text-xl/7 font-medium text-primary-300 sm:text-xl/7'
                )}>
              {Array.isArray(lead) && isFilled.richText(lead) ? (
                  <PrismicRichText field={lead}/>
              ) : (
                  <p>{lead}</p>
              )}
            </div>
            <ButtonRow hasBooking={hasBooking} links={links}/>
             </div>
            </div>
            <div className={'shrink'}>
            {rating && (<div><PrismicNextImage field={rating} /></div>)}
            {children && (
                <div className={'absolute bottom-10 left-0 right-0 z-20 flex'}>
                  {children}
                </div>
            )}
            </div>
          </div>
        </Container>
        </motion.div>
      </div>
  );
}
