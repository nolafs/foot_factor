'use client';
import React, { useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

import {
  type VerticalStepsWithImagesSliceVideoVerticalStepperPrimary,
  type VerticalStepsWithImagesSliceVideoVerticalStepperPrimaryStepsItem,
} from '@/prismic-types';
import { PrismicNextImage } from '@prismicio/next';
import cn from 'clsx';
import { isFilled } from '@prismicio/client';
import { Body, Heading } from '@/components/ui/text';
import { PrismicRichText } from '@prismicio/react';
import ButtonRow from '@/components/ui/button-row';
import type ReactPlayer from 'react-player';

import dynamic from 'next/dynamic';

const DynamicReactPlayer = dynamic(() => import('react-player/lazy'), {
  ssr: false,
});

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface StepsMediaProps {
  data: VerticalStepsWithImagesSliceVideoVerticalStepperPrimary;
}

export const StepsMedia = ({ data }: StepsMediaProps) => {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!contentRef.current || !listRef.current) return;

      gsap.to('.intro', {
        y: '-50%',
        scrollTrigger: {
          trigger: '.intro',
          start: 'top top',
          end: '+=200%',
          scrub: 0.3,
          pin: true,
          pinSpacing: false,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      gsap.fromTo(
        '.intro-text',
        { opacity: 0 },
        {
          opacity: 1,
          scrollTrigger: {
            trigger: '.intro-text',
            start: 'top center',
            end: 'bottom center+=20%',
            scrub: 0.5,
            invalidateOnRefresh: true,
            //markers: true,
          },
        },
      );
    },
    { scope: contentRef, dependencies: [data] },
  );

  useEffect(() => {
    ScrollTrigger.refresh();
  }, [data]);

  useEffect(() => {
    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div ref={contentRef} className={'relative isolate z-0 w-full overflow-hidden'}>
      <div ref={listRef} className={'flex w-full flex-col'}>
        <div>
          <div className={'intro z-5 isolated relative h-screen w-full overflow-hidden'}>
            <div className={'flex h-full w-full justify-center'}>
              <PrismicNextImage field={data.intro_image} className={cn('h-full w-full object-cover object-center')} />
            </div>
            <div className={'z-5 absolute left-0 top-0 h-full w-full bg-black/30'}></div>
            <div className={'absolute left-0 top-0 z-10 w-full'}>
              <div className={cn('flex h-svh w-full flex-col items-center justify-center')}>
                <div
                  className={cn(
                    'intro-text flex w-full flex-col pt-16 md:w-6/12 md:pt-24 lg:w-6/12 lg:py-32 xl:w-5/12',
                  )}>
                  {isFilled.richText(data.intro_body) && (
                    <Heading as={'h2'} primary={true} className={'content-master primary text-animation text-center'}>
                      <PrismicRichText field={data.intro_body} />
                    </Heading>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <ul className={'relative z-0 w-full'}>
          {data.steps.map((step, idx) => (
            <StepMedia key={'video_stepper' + idx} index={idx} totalItems={data.steps.length} data={step} />
          ))}
          <li className={'relative h-svh'}></li>
        </ul>
      </div>
    </div>
  );
};

interface StepMediaProps {
  data: VerticalStepsWithImagesSliceVideoVerticalStepperPrimaryStepsItem;
  index: number;
  totalItems: number;
}

const StepMedia = ({ data, index, totalItems }: StepMediaProps) => {
  const cardRef = React.useRef<HTMLLIElement | null>(null);
  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const imageRef = React.useRef<HTMLDivElement | null>(null);
  const videoRef = React.useRef<ReactPlayer | null>(null);

  useGSAP(
    ({ context }) => {
      if (!cardRef.current) return;

      const card = cardRef.current;
      const image = imageRef.current;
      const content = contentRef.current;

      const safePlay = () => {
        const player = videoRef.current?.getInternalPlayer?.();

        if (player && typeof (player as any).play === 'function') {
          (player as any).play();
        }
      };

      const safePause = () => {
        const player = videoRef.current?.getInternalPlayer?.();

        if (player && typeof (player as any).pause === 'function') {
          (player as any).pause();
        }
      };

      if (isFilled.linkToMedia(data.video)) {
        ScrollTrigger.create({
          trigger: card,
          start: 'top bottom',
          end: 'bottom+=100% top',
          markers: false,
          onEnter: safePlay,
          onLeave: safePause,
          onEnterBack: safePlay,
          onLeaveBack: safePause,
        });
      }

      if (index === 0) {
        ScrollTrigger.create({
          trigger: card,
          start: 'top top',
          end: `+=${200 * totalItems}%`,
          pin: true,
          pinSpacing: false,
          anticipatePin: 1,
        });
      } else {
        ScrollTrigger.create({
          trigger: card,
          start: 'top top',
          end: `+=${100 * totalItems}%`,
          pin: true,
          pinSpacing: false,
          anticipatePin: 1,
        });

        gsap.fromTo(
          image,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top top',
              end: `+=100%`,
              scrub: 0.3,
              invalidateOnRefresh: true,
            },
          },
        );
      }

      gsap
        .timeline({
          scrollTrigger: {
            trigger: content,
            start: 'top top',
            end: '+=100%',
            scrub: 0.5,
            pin: true,
            pinSpacing: false,
            invalidateOnRefresh: true,
          },
        })
        .fromTo(
          content,
          { opacity: 0 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out',
          },
        )
        .to(content, {
          opacity: 0,
          y: '-100%',
          duration: 1,
          ease: 'power2.in',
        });
    },
    { scope: cardRef, dependencies: [index, totalItems, videoRef] },
  );

  useEffect(() => {
    ScrollTrigger.refresh();
  }, [data]);

  return (
    <li ref={cardRef} className={cn('relative isolate')} style={{ zIndex: index }}>
      <div ref={imageRef} className={'absolute -z-0 flex h-screen w-full justify-center'} style={{ zIndex: index + 1 }}>
        <div className={'absolute left-0 top-0 z-20 h-full w-full bg-black/60'}></div>
        {isFilled.linkToMedia(data.video) && (
          <DynamicReactPlayer
            ref={videoRef}
            url={data.video.url}
            controls={false}
            muted={true}
            loop={true}
            autoPlay={true}
            playsinline={true}
            loading={'eager'}
            poster={data.image.url}
            width="100%"
            height="100%"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              minWidth: '100%',
              minHeight: '100%',
              width: 'auto',
              height: 'auto',
              zIndex: 1,
            }}
            config={{
              file: {
                attributes: {
                  style: {
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  },
                },
              },
            }}
          />
        )}
        <PrismicNextImage
          loading={'eager'}
          field={data.image}
          className={cn('h-full w-full object-cover object-center')}
        />
      </div>

      <div ref={contentRef} className={'container relative z-20 mx-auto flex h-screen w-full flex-col justify-center'}>
        <div className={cn('flex w-full', data.alignment === 'Left' ? 'md:justify-start' : 'md:justify-end')}>
          <div className={'flex flex-col px-4 md:w-1/2 md:px-8 lg:px-16 xl:px-24'}>
            {isFilled.keyText(data.title) && (
              <Heading as={'h2'} primary={true} color={'accent'} className={'content-master primary'}>
                {data.title}
              </Heading>
            )}
            {isFilled.richText(data.description) && (
              <Body className={'mt-4'} color={'Light'}>
                <PrismicRichText field={data.description} />
              </Body>
            )}
            <div className="flex flex-col gap-x-3 gap-y-4 sm:flex-row">
              <ButtonRow hasBooking={true} bookingLabel={'Book Now'} hasArrow={true} links={data.links} />
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

export default StepsMedia;
