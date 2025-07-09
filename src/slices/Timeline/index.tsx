import { type FC } from 'react';
import { type Content } from '@prismicio/client';
import {PrismicRichText, type SliceComponentProps} from '@prismicio/react';
import {Heading, Lead} from '@/components/ui/text';
import {Container} from '@/components/ui/container';
import TimelineList from '@/components/features/timeline/timeline';

/**
 * Props for `Timeline`.
 */
export type TimelineProps = SliceComponentProps<Content.TimelineSlice>;

/**
 * Component for "Timeline" Slices.
 */
const Timeline: FC<TimelineProps> = ({ slice }) => {
  return (
    <section data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
      <Container className={'mb-16 text-center pt-16 md:pt-24 lg:pt-32'}>
        <Heading as="h2">
          {slice.primary.heading}
        </Heading>
        <Lead className="mt-4 max-w-3xl mx-auto">
         {slice.primary.lead}
        </Lead>
      </Container>

      <TimelineList data={slice.primary.events} />
    </section>
  );
};

export default Timeline;
