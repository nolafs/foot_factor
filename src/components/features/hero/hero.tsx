'use client';
import { Container } from '@/components/ui/container';
import { type ImageField, isFilled, type KeyTextField, type LinkField, type RichTextField } from '@prismicio/client';
import { PrismicNextImage } from '@prismicio/next';
import React, { useEffect, useRef, useState } from 'react';
import cn from 'clsx';
import { PrismicRichText } from '@prismicio/react';
import { Badge } from '@/components/ui/badge';
import ButtonRow from '@/components/ui/button-row';
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';
import ReviewSliderElfsight from '@/components/features/reviews/review-slider-elfsight';

export interface HeroProps {
  heading: RichTextField | KeyTextField | string;
  subheading?: KeyTextField | string | null | undefined;
  lead?: RichTextField | KeyTextField | string;
  links?: LinkField[];
  image?: ImageField;
  hasBooking?: boolean;
  vAlign?: 'top' | 'center' | 'bottom';
  rating?: ImageField;
  widget?: string | null | undefined;
  imagePosition?: 'left' | 'right' | 'center' | 'top' | 'bottom';
  children?: React.ReactNode;
}

export function Hero({
  heading,
  subheading,
  lead,
  links,
  image,
  hasBooking,
  rating,
  widget,
  imagePosition = 'center',
  vAlign = 'center',
  children,
}: HeroProps) {
  const heroRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLDivElement | null>(null);

  const defaultScrollProgress = useMotionValue(0);

  // Track scroll progress relative to the hero section

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const progress = scrollYProgress ?? defaultScrollProgress;
  // Transform values for different elements
  const textY = useTransform(progress, [0, 1], ['0%', '-100%']);
  const imageY = useTransform(progress, [0, 1], [`0%`, `50%`]);
  const imageScale = useTransform(progress, [0, 1], [1.2, 1.2]);

  const smoothY = useSpring(textY, {
    stiffness: 100, // lower = gentler
    damping: 30, // higher = less wobble
    mass: 1,
    restSpeed: 0.01, // stop micro jiggle
    restDelta: 0.001,
  });

  return (
    <div className="relative isolate h-svh max-h-[1080px] overflow-hidden">
      <>
        <div ref={heroRef} className="absolute top-0 z-10 h-full w-full bg-primary opacity-40" />
        {image && (
          <motion.div
            ref={imageRef}
            className="z-1 absolute inset-0 h-full w-full overflow-hidden"
            style={{ y: imageY, scale: imageScale, transform: 'translateZ(0)' }}>
            <PrismicNextImage
              loading={'lazy'}
              field={image}
              fallbackAlt={heading ? '' : undefined}
              className={cn(
                'relative h-full w-full max-w-full object-cover object-center',
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

      <motion.div className="absolute top-0 z-20 w-full sm:bottom-0 sm:top-auto" style={{ y: smoothY }}>
        <Container className="relative z-20 flex h-svh flex-col justify-end">
          <div
            className={cn(
              'flex h-svh w-full flex-col justify-stretch pb-5 pt-20 sm:w-full sm:pt-32 md:pt-64 lg:max-w-3xl',
            )}>
            <div
              className={cn(
                'flex grow flex-col',
                vAlign === 'top' && 'justify-start',
                vAlign === 'center' && 'justify-center',
                vAlign === 'bottom' && 'justify-end',
              )}>
              <div>
                {subheading && <Badge>{subheading}</Badge>}
                <header
                  className={cn(
                    'text-balance font-heading text-5xl/[1.1] font-medium text-white sm:text-6xl/[1.1] md:text-6xl/[0.8] lg:text-7xl/[1.1]',
                  )}>
                  {Array.isArray(heading) && isFilled.richText(heading) ? (
                    <PrismicRichText field={heading} />
                  ) : (
                    <h1>{heading}</h1>
                  )}
                </header>
                <div className={cn('mt-8 max-w-2xl text-xl/7 font-medium text-primary-300 sm:text-xl/7')}>
                  {Array.isArray(lead) && isFilled.richText(lead) ? <PrismicRichText field={lead} /> : <p>{lead}</p>}
                </div>
                <ButtonRow hasBooking={hasBooking} links={links} />
              </div>
            </div>
            <div className={'shrink'}>
              {!widget && rating && (
                <div>
                  <PrismicNextImage field={rating} />
                </div>
              )}
              {widget && (
                <div className={'py-5'}>
                  <ReviewSliderElfsight share_link={widget} width={'auto'} />
                </div>
              )}
              {children && (
                <div className={'relative z-20 mt-2 flex md:absolute md:bottom-10 md:left-0 md:right-0'}>
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
