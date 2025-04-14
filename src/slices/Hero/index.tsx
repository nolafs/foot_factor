import { type Content } from '@prismicio/client';
import { type SliceComponentProps } from '@prismicio/react';
import { Hero as HeroComponent } from '@/components/features/hero/hero';
import React from 'react';
import HeroSimple from '@/components/features/hero/hero-simple';


/**
 * Props for `Hero`.
 */
export type HeroProps = SliceComponentProps<Content.HeroSlice>;

/**
 * Component for "Hero" Slices.
 */
const Hero = ({ slice }: HeroProps): JSX.Element => {


  if (slice.variation === 'simple') {
    return (<HeroSimple {...slice.primary}  />);
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
