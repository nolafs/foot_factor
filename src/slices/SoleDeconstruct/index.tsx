import { FC } from 'react';
import { Content } from '@prismicio/client';
import { SliceComponentProps } from '@prismicio/react';
import {Container} from '@/components/ui/container';
import SoleDeconstructor from '@/components/features/sole-deconstruct/sole-decontruct';

/**
 * Props for `SoleDeconstruct`.
 */
export type SoleDeconstructProps = SliceComponentProps<Content.SoleDeconstructSlice>;

/**
 * Component for "SoleDeconstruct" Slices.
 */
const SoleDeconstruct: FC<SoleDeconstructProps> = ({ slice }) => {
  return (
    <Container as={'section'} padding={'lg'} data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
        <SoleDeconstructor data={slice.primary.items} />
    </Container>
  );
};

export default SoleDeconstruct;
