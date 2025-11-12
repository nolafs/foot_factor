import { type FC } from 'react';
import { type Content } from '@prismicio/client';
import { type SliceComponentProps } from '@prismicio/react';
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
