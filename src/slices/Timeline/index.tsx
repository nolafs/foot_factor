import { type FC } from 'react';
import { type Content } from '@prismicio/client';
import { type SliceComponentProps} from '@prismicio/react';
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
    <Container as={'section'} fullWidth={true} padding={'lg'} data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
      <Container className={'mb-16 text-center'} >
        <Heading as="h2">
          {slice.primary.heading}
        </Heading>
        <Lead className="mt-4 max-w-3xl mx-auto">
         {slice.primary.lead}
        </Lead>
      </Container>

      <TimelineList data={slice.primary.events} />
    </Container>
  );
};

export default Timeline;
