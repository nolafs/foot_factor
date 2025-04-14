import { type Content } from '@prismicio/client';
import { type SliceComponentProps } from '@prismicio/react';
import { Hero as HeroComponent } from '@/components/features/hero/hero';
import { Heading, Lead, Subheading } from '@/components/ui/text';
import React from 'react';
import { Container } from '@/components/ui/container';
import { Wave } from '@/components/wave';


/**
 * Props for `Hero`.
 */
export type HeroProps = SliceComponentProps<Content.HeroSlice>;

/**
 * Component for "Hero" Slices.
 */
const Hero = ({ slice }: HeroProps): JSX.Element => {


  if (slice.variation === 'simple') {
    return (<div className={'relative isolate bg-gradient-to-r from-primary-300 to-primary-300/0  pb-24 pt-24 md:pb-40 md:pt-52 mb-24 overflow-hidden'}>
      <div className={'absolute w-full h-full top-0 left-0 flex items-center justify-center'}>
        <Wave
            waveType={
              slice.primary.wave_type === 'default'
                  ? 'type_1'
                  : (['1', '2', '3', '4', '5', '6', '7', '8'] as const).includes(slice.primary.wave_type)
                      ? `type_${slice.primary.wave_type}`
                      : undefined
            }
        />
      </div>
          <div className={'absolute z-1 bg-gradient-to-r from-primary-300 to-primary-300/0  w-full h-full top-0 left-0'} />


      <Container className={'relative z-20'}>
        {slice.primary.label?.length && (
            <Subheading className="mt-16">{slice.primary.label}</Subheading>
        )}
        <Heading as="h1" className="mt-2">
          {slice.primary.heading}
        </Heading>
        <Lead className="mt-6 max-w-3xl">{slice.primary.subheading}</Lead>
      </Container>
        </div>
    );
  }


  if (slice.variation === 'heroMaster') {
    return (<HeroComponent
        heading={slice.primary.heading}
        lead={slice.primary.lead}
        image={slice.primary.image}
        links={slice.primary.links}
        hasBooking={slice.primary.has_booking}
        rating={slice.primary.google_rating}
    />)
  }

  return (
    <HeroComponent
      heading={slice.primary.heading}
      subheading={slice.primary.subheading}
      lead={slice.primary.lead}
      image={slice.primary.image}
      links={slice.primary.links}
    />
  );
};

export default Hero;
