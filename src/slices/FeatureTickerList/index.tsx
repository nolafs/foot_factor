import { FC } from 'react';
import { Content } from '@prismicio/client';
import { SliceComponentProps } from '@prismicio/react';
import FeatureTickerList from '@/components/features/feature-ticker-list/feature-ticker-list';

/**
 * Props for `IconNavList`.
 */
export type IconNavListProps = SliceComponentProps<Content.IconNavListSlice>;

/**
 * Component for "IconNavList" Slices.
 */
const IconNavList: FC<IconNavListProps> = ({ slice }) => {
  return (
    <section data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
     <FeatureTickerList data={slice.primary.items} />
    </section>
  );
};

export default IconNavList;
