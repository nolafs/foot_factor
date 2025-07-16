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

        <SoleDeconstructor data={slice.primary.items} />
  );
};

export default SoleDeconstruct;
