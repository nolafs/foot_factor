import { type Content } from '@prismicio/client';
import { type SliceComponentProps } from '@prismicio/react';
import { Hero as HeroComponent } from '@/components/features/hero/hero';
import { Heading, Lead, Subheading } from '@/components/ui/text';
import React from 'react';
import { Container } from '@/components/ui/container';


/**
 * Props for `Hero`.
 */
export type HeroProps = SliceComponentProps<Content.HeroSlice>;

/**
 * Component for "Hero" Slices.
 */
const Hero = ({ slice }: HeroProps): JSX.Element => {


  if (slice.variation === 'simple') {
    return (<div className={'bg-[#f9f8ed] pb-24 pt-24 md:pb-24 md:pt-40 mb-24'}>
      <Container>
        <Subheading className="mt-16">{slice.primary.label}</Subheading>
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
