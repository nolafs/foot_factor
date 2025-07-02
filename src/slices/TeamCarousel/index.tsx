import { FC } from 'react';
import { Content } from '@prismicio/client';
import {PrismicRichText, SliceComponentProps} from '@prismicio/react';
import {Heading, Lead} from '@/components/ui/text';
import {Container} from '@/components/ui/container';
import TeamSlider from '@/components/features/slider/team-slider/team-slider';

/**
 * Props for `TeamCarousel`.
 */
export type TeamCarouselProps = SliceComponentProps<Content.TeamCarouselSlice>;

/**
 * Component for "TeamCarousel" Slices.
 */
const TeamCarousel: FC<TeamCarouselProps> = ({ slice }) => {
  return (
    <section data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
      <div className="pt-16 md:pt-24 lg:pt-32">
        <Container className={'mb-16'}>
         <Heading as="div">
           {slice.primary.heading}
          </Heading>
          <Lead className="mt-4 max-w-3xl">
            {slice.primary.lead}
          </Lead>
        </Container>
        <TeamSlider data={slice.primary.members} />
      </div>
    </section>
  );
};

export default TeamCarousel;
