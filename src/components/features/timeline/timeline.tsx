import React from 'react';
import {type TimelineSliceVerticalWithImagesPrimaryEventsItem} from '@/prismic-types';
import TimelineListItem from '@/components/features/timeline/timeline-item';
import {Container} from '@/components/ui/container';

interface TimelineProps {
    data: TimelineSliceVerticalWithImagesPrimaryEventsItem[]
}

export const TimelineList = ({data}: TimelineProps) => {

  return (
      <Container className={'mb-16 md:mb-24 lg:mb-32'}>
        <ul className="relative pb-[65px] pt-8">
          <li className="left-3.8 border-l-secondary/50 absolute top-0 -ml-px h-full border-l-2 md:left-1/2"/>
          {data.map((item, idx) => (<TimelineListItem data={item} key={'timeline-item'+idx} isEven={idx % 2 === 0}/>))}
        </ul>
      </Container>
  )
}

export default TimelineList;
