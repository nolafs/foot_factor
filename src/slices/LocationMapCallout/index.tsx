import { FC } from 'react';
import { Content } from '@prismicio/client';
import {PrismicRichText, SliceComponentProps} from '@prismicio/react';
import {Container} from '@/components/ui/container';
import GoogleMapWrapper from '@/components/features/google-map/google-map-wrapper';
import GoogleMap from '@/components/features/google-map/google-map';
import {Heading} from '@/components/ui/text';

/**
 * Props for `LocationMapCallout`.
 */
export type LocationMapCalloutProps = SliceComponentProps<Content.LocationMapCalloutSlice>;

/**
 * Component for "LocationMapCallout" Slices.
 */
const LocationMapCallout: FC<LocationMapCalloutProps> = ({ slice }) => {
  return (
    <Container fullWidth={true}  data-slice-type={slice.slice_type} data-slice-variation={slice.variation} className={'relative'}>
      <GoogleMapWrapper>
        <GoogleMap data={slice.primary.map_center ?? {
          latitude: 0,
          longitude: 0,
        }} zoom={slice.primary.zoom ?? 7} />
      </GoogleMapWrapper>

      <div className={'absolute max-w-[694px] w-full bg-white rounded-xl shadow-lg p-6 top-4 right-4 z-10'}>
        <Heading as="h2" className={'content-master'}>
          <PrismicRichText field={slice.primary.heading} />
        </Heading>
      </div>
    </Container>
  );
};

export default LocationMapCallout;
