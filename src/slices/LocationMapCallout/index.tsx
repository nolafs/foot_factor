import { type FC } from 'react';
import { type Content } from '@prismicio/client';
import {PrismicRichText, type SliceComponentProps} from '@prismicio/react';
import {Container} from '@/components/ui/container';
import GoogleMapWrapper from '@/components/features/google-map/google-map-wrapper';
import GoogleMap from '@/components/features/google-map/google-map';
import {Body, Heading} from '@/components/ui/text';

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
        }} zoom={slice.primary.zoom ?? 7} markers={slice.primary.map_markers} />
      </GoogleMapWrapper>

      <div className={'container mx-auto lg:absolute lg:w-[40%] lg:top-1/2 lg:-translate-y-1/2 max-w-[600px] bg-white lg:rounded-[32px] shadow-lg p-16 right-4 z-10'}>
        <Heading as="div" className={'content-master'}>
          <PrismicRichText field={slice.primary.heading} />
        </Heading>
        <Body>
          <div className={'flex flex-col gap-2 pt-5'}>
            {slice.primary.address_lines.map((item, index) => (
              <div key={index} className={'pl-0'}>
                {item.line}
              </div>
            ))}
          </div>
        </Body>
      </div>
    </Container>
  );
};

export default LocationMapCallout;
