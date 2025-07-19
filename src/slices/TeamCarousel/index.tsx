import { type FC } from 'react';
import { type Content } from '@prismicio/client';
import {type SliceComponentProps} from '@prismicio/react';
import {Heading, Lead} from '@/components/ui/text';
import {Container} from '@/components/ui/container';
import TeamSlider from '@/components/features/slider/team-slider/team-slider';
import TeamAccordion from '@/components/features/slider/team-accordion/team-accordion';

/**
 * Props for `TeamCarousel`.
 */
export type TeamCarouselProps = SliceComponentProps<Content.TeamCarouselSlice>;

/**
 * Component for "TeamCarousel" Slices.
 */
const TeamCarousel: FC<TeamCarouselProps> = ({ slice }) => {
  return (
    <Container padding={'lg'} fullWidth={true} data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
        <Container className={'mb-16'}>
         <Heading as="div">
           {slice.primary.heading}
          </Heading>
          <Lead className="mt-4 max-w-3xl">
            {slice.primary.lead}
          </Lead>
        </Container>
       <div className={'hidden md:block'}>
        <TeamSlider data={slice.primary.members} />
       </div>
      <div className={'block md:hidden'}>
        <TeamAccordion data={slice.primary.members} />
      </div>
    </Container>
  );
};

export default TeamCarousel;
