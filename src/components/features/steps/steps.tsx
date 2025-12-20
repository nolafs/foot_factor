'use client';
import React, { useState } from 'react';
import { type VerticalStepsWithImagesSliceDefaultPrimaryStepsItem } from '@/prismic-types';
import SectionContent from '@/components/features/section/section-content';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { PrismicNextImage } from '@prismicio/next';
import StepsProgress from '@/components/features/steps/steps-progress';
import { cn } from '@/lib/utils';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface StepsProps {
  data: VerticalStepsWithImagesSliceDefaultPrimaryStepsItem[];
  sectionPadding?: boolean;
}

export const Steps = ({ data, sectionPadding }: StepsProps) => {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const listRef = React.useRef<HTMLUListElement>(null);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);

  useGSAP(
    () => {
      if (!contentRef.current || !listRef.current) return;

      const mediaQuery = gsap.matchMedia();

      mediaQuery.add('(min-width: 768px)', () => {
        const progressTrigger = ScrollTrigger.create({
          trigger: contentRef.current,
          start: 'top bottom',
          end: 'bottom bottom',
          scrub: 0.1,
          invalidateOnRefresh: true,
          onUpdate: self => {
            const progress = Math.round(self.progress * 100);
            setCurrentProgress(progress);
          },
          onRefresh: () => {
            setCurrentProgress(0);
          },
        });

        const pinTrigger = ScrollTrigger.create({
          trigger: '#progress',
          start: 'center center',
          end: 'bottom bottom+=100vh',
          endTrigger: contentRef.current,
          scrub: 0.3,
          pin: true,
          pinSpacing: false,
          invalidateOnRefresh: true,
        });

        ScrollTrigger.refresh();

        return () => {
          progressTrigger.kill();
          pinTrigger.kill();
        };
      });

      return () => {
        mediaQuery.kill(); // Clean up matchMedia
      };
    },
    {
      scope: contentRef,
      dependencies: [data],
    },
  );

  const updateStep = React.useCallback((stepNumber: number) => {
    setCurrentStep(stepNumber);
  }, []);

  return (
    <div ref={contentRef} className={cn('relative isolate w-full', sectionPadding && 'mt-10')}>
      <div
        id={'progress'}
        className={
          'pointer-events-none absolute left-0 top-0 z-10 hidden h-svh w-full items-center justify-center md:flex'
        }>
        {sectionPadding && (
          <>
            <div
              className={
                'absolute left-0 top-0 -mt-10 ml-[1px] hidden h-10 w-1/2 rounded-tr-4xl border-r-2 border-t-2 border-t-primary-100 md:block'
              }></div>
            <div
              className={
                'absolute left-1/2 top-0 -ml-[1px] -mt-10 hidden h-10 w-1/2 rounded-tl-4xl border-l-2 border-t-2 border-t-primary-100 md:block'
              }></div>
            <div
              className={
                'absolute left-0 top-0 z-10 -mt-10 hidden h-10 w-full bg-gradient-to-r from-white via-transparent to-white md:block'
              }></div>
          </>
        )}
        <StepsProgress percentage={currentProgress} text={currentStep} />
      </div>

      <div
        className={
          'pointer-events-none absolute left-1/2 top-0 -ml-px hidden h-full border-l-2 border-l-primary-100 md:block'
        }></div>

      <ul ref={listRef} className={'flex w-full flex-col'}>
        {data.map((step, index) => (
          <Step
            key={index}
            {...step}
            stepNum={index + 1}
            onStepActive={step => updateStep(step)}
            totalSteps={data.length}
          />
        ))}
      </ul>
    </div>
  );
};

interface StepProps extends VerticalStepsWithImagesSliceDefaultPrimaryStepsItem {
  stepNum: number;
  totalSteps: number;
  onStepActive: (stepNumber: number) => void;
}

const Step = ({ title, description, step_label, image, stepNum, onStepActive }: StepProps) => {
  const cardRef = React.useRef<HTMLLIElement>(null);

  useGSAP(
    () => {
      if (!cardRef.current) return;

      const mediaQuery = gsap.matchMedia();
      mediaQuery.add('(min-width: 768px)', () => {
        gsap.timeline({
          scrollTrigger: {
            trigger: cardRef.current,
            start: 'top top',
            end: 'bottom+=50% bottom',
            markers: false,
            scrub: 0.3,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            onEnter: () => {
              onStepActive(stepNum);
            },
            onEnterBack: () => {
              onStepActive(stepNum);
            },
          },
        });

        /*
      .from(cardRef.current, {
        scale: 0.5,
        opacity: 0,
        duration: 1,
        ease: 'power2.out',
      })
      .to(cardRef.current, {
        scale: 1,
        opacity: 1,
        duration: 1,
        ease: 'power2.out',
      })
    .to(cardRef.current, {
    scale: 0.5,
    opacity: 0,
    duration: 1,
    ease: 'power2.out',
  })

       */

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: cardRef.current,
            start: 'top center',
            end: 'bottom+=50% top',
            scrub: 0.3,
            toggleActions: 'play none none reverse',
            markers: false,
          },
        });

        tl.fromTo(
          '.content',
          {
            opacity: 0,
            y: '100%',
            scale: 0.5,
          },
          {
            opacity: 1,
            y: '0%',
            scale: 1,
            duration: 1,
            ease: 'power2.out',
          },
        );

        tl.to('.content', {
          opacity: 1,
          y: '0%',
          duration: 1,
          ease: 'power2.out',
        });

        tl.to('.content', {
          opacity: 0,
          y: '0%',
          scale: 0.5,
          duration: 1,
          ease: 'power2.out',
        });

        const imgTl = gsap.timeline({
          scrollTrigger: {
            trigger: cardRef.current,
            start: 'top center',
            end: 'bottom+=50% top',
            toggleActions: 'play none none reverse',
            scrub: 0.3,
            markers: false,
          },
        });

        imgTl.fromTo(
          '.image',
          {
            opacity: 0,
            y: '100%',
            scale: 0.5,
          },
          {
            opacity: 1,
            y: '0%',
            scale: 1,
            duration: 1,
            ease: 'power2.out',
          },
        );

        imgTl.to('.image', {
          opacity: 1,
          y: '0%',
          duration: 1,
          ease: 'power2.out',
        });

        imgTl.to('.image', {
          opacity: 0,
          y: '0%',
          scale: 0.5,
          duration: 1,
          ease: 'power2.out',
        });

        //cleanup code
        return () => {
          ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
      });
    },
    { scope: cardRef },
  );

  return (
    <li
      ref={cardRef}
      className={cn(
        'perspective-dramatic relative grid w-full grid-cols-1 items-center justify-start gap-20 gap-x-10 py-5 md:h-svh md:grid-cols-2 md:gap-x-48 md:py-10',
        //stepNum % 2 === 0 ? 'bg-accent' : 'bg-primary-300'
      )}
      style={{ zIndex: 10 + stepNum }}>
      <div className={'content flex flex-col'}>
        <sub className={'mb-3 text-2xl font-semibold text-primary-500'}>
          <span>{step_label}</span> <span>{(stepNum ?? stepNum < 10) ? '0' + stepNum : stepNum}</span>
        </sub>
        <SectionContent heading={title} body={description} className={'w-full'} />
      </div>
      <div className="image flex items-center justify-center">
        {image && (
          <div className="aspect-h-1 aspect-w-1 max-h-[700px] w-full max-w-[700px] md:h-full">
            <PrismicNextImage field={image} className="h-full w-full rounded-4xl object-cover" />
          </div>
        )}
      </div>
    </li>
  );
};

export default Steps;
