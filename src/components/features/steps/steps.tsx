'use client';
import React, {useState} from 'react';
import {type VerticalStepsWithImagesSliceDefaultPrimaryStepsItem} from '@/prismic-types';
import SectionContent from '@/components/features/section/section-content';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import {useGSAP} from '@gsap/react';
import {PrismicNextImage} from '@prismicio/next';
import {Container} from '@/components/ui/container';
import StepsProgress from '@/components/features/steps/steps-progress';

if(typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface StepsProps {
    data: VerticalStepsWithImagesSliceDefaultPrimaryStepsItem[]
}

export const Steps = ({data}: StepsProps) => {

  const contentRef = React.useRef<HTMLDivElement>(null);
  const listRef = React.useRef<HTMLUListElement>(null);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);

  useGSAP(() => {

    if (!contentRef.current || !listRef.current) return;

    // Overall progress based on scroll through entire steps section
    gsap.to({}, {
      ease: 'none',
      scrollTrigger: {
        trigger: contentRef.current,
        start: 'top bottom',
        end: 'bottom bottom',
        scrub: 0.3,
        onUpdate: (self) => {
          const progress = Math.round(self.progress * 100);
          setCurrentProgress(progress);
        },
        onRefresh: () => {
          setCurrentProgress(0);
        }
      }
    });

    gsap.to({}, {
      scrollTrigger: {
        trigger: '#progress',
        start: 'center center',
        end: 'bottom bottom',
        endTrigger: contentRef.current,
        scrub: 0.3,
        pin: true,
        pinSpacing: false,
        //markers: true,
      }
    });

    // Force a refesh of ScrollTrigger to ensure it picks up the correct heights
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 1000)

  }, {scope: contentRef, dependencies: [data]});

  const updateStep = React.useCallback((stepNumber: number) => {
    setCurrentStep(stepNumber);
  }, []);


  return (
      <Container>
       <div ref={contentRef} className={'relative w-full isolate'}>

         <div id={'progress'} className={'hidden absolute top-0 left-0 w-full z-10 md:flex h-svh  justify-center items-center pointer-events-none'}>
           <StepsProgress percentage={currentProgress} text={currentStep}/>
         </div>

         <div className={'hidden md:block absolute top-0 left-1/2 -ml-px h-full border-l-2 border-l-primary-100 pointer-events-none'}></div>

          <ul ref={listRef} className={'w-full flex flex-col'}>
              {data.map((step, index) => (
                  <Step key={index} {...step} stepNum={index + 1} onStepActive={(step) => updateStep(step)} totalSteps={data.length} />
              ))}
          </ul>
       </div>
      </Container>
  )
}

interface StepProps extends VerticalStepsWithImagesSliceDefaultPrimaryStepsItem {
  stepNum: number;
  totalSteps: number;
  onStepActive: (stepNumber: number) => void;
}

const Step = ({title, description, step_label, image, stepNum, onStepActive}: StepProps) => {

  const cardRef = React.useRef<HTMLLIElement>(null);

  useGSAP(() => {
    if (!cardRef.current) return;


    ScrollTrigger.create({
      trigger: cardRef.current,
      start: 'top top',
      end: '+=50%',
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
      onEnter: () => {
        onStepActive(stepNum);
      },
      onEnterBack: () => {
        onStepActive(stepNum);
      }
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: cardRef.current,
        start: 'top center',
        end: 'bottom top',
        scrub: 0.3,
        toggleActions: 'play none none reverse',
        //markers: true
      }
    });

    tl.fromTo('.content', {
      opacity: 0,
      y: '100%'
    }, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power2.out',
    });

    tl.to('.content', {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power2.out',
    });

    tl.to('.content',{
      opacity: 0,
      y: '-100%',
      ease: 'power2.in',
    })


    const imgTl = gsap.timeline({
      scrollTrigger: {
        trigger: cardRef.current,
        start: 'top center',
        end: 'bottom top',
        scrub: 0.3,
        toggleActions: 'play none none reverse',
        //markers: true
      }
    });

    imgTl.fromTo('.image', {
      opacity: 0,
      x: '100%'
    }, {
      opacity: 1,
      x: 0,
      duration: 1,
      ease: 'power2.out',
    });

    imgTl.to('.image', {
      opacity: 1,
      duration: 2,
      y: 0,
      ease: 'power2.out',
    })

    imgTl.to('.image',  {
      opacity: 0,
      duration: 2,
      y: '-100%',
      ease: 'power2.in',
    })

  }, {scope: cardRef});

  return (
      <li ref={cardRef} className="w-full h-svh grid grid-cols-1 gap-20 py-20 md:py-10 md:grid-cols-2 gap-x-10 md:gap-x-48 justify-center items-center">
        <div className={'content flex flex-col'}>
          <sub className={'text-primary-500 font-semibold mb-3 text-2xl'}>
            <span>{step_label}</span> <span>{stepNum ?? stepNum < 10 ? '0' + stepNum : stepNum}</span>
          </sub>
         <SectionContent heading={title} body={description} className={'w-full'} />
        </div>
        <div className="image flex justify-center items-center">
        {image && (
          <div className="aspect-h-1 aspect-w-1 w-full h-full max-h-[700px] max-w-[700px]">
            <PrismicNextImage field={image}  className="w-full h-full object-cover rounded-4xl" />
          </div>
        )}
        </div>
      </li>
  );
}

export default Steps;
