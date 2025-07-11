import { type FC } from 'react';
import { type Content } from '@prismicio/client';
import { type SliceComponentProps } from '@prismicio/react';
import FeatureTickerList from '@/components/features/feature-ticker-list/feature-ticker-list';
import LogoTickerList from '@/components/features/feature-ticker-list/logo-ticker-list';
import {Container} from '@/components/ui/container';

/**
 * Props for `IconNavList`.
 */
export type IconNavListProps = SliceComponentProps<Content.IconNavListSlice>;

/**
 * Component for "IconNavList" Slices.
 */
const IconNavList: FC<IconNavListProps> = ({ slice }) => {

  if( slice.variation === 'logoTicker') {
    return <Container as={'section'} color={'primary'} fullWidth={true} data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
      <LogoTickerList data={slice.primary.items}/>
    </Container>;
  }

  return (
    <section data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
     <FeatureTickerList data={slice.primary.items} />
    </section>
  );
};

export default IconNavList;
