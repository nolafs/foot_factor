import React from 'react';
import { type Repeatable, type RichTextField, type LinkField, type KeyTextField } from '@prismicio/client';
import { SliderResources } from '@/components/features/slider/slider-resources';


interface SliderProps {
  heading: KeyTextField | string;
  subheading: KeyTextField | string;
  listings: any[];
  body: RichTextField;
  links: Repeatable<LinkField>;
}

export const SliderResource = ({ heading, subheading, listings, body, links }: SliderProps) => {
  return (
    <SliderResources
      heading={heading}
      subheading={subheading}
      body={body}
      links={links}
      listings={listings}
      variation={'resource'}></SliderResources>
  );
};

export default SliderResource;
