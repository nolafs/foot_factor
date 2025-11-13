'use client';
import React, {useEffect, useRef} from 'react';
import {type GeoPointField} from '@prismicio/client';
import {addSingleMarkers} from '@/components/features/google-map/addSingleMaker';
import {type LocationMapCalloutSliceMapWithCalloutRightPrimaryMapMarkersItem} from '@/prismic-types';
import {useMediaQuery} from '@/lib/hooks/useMediaQuery';


interface GoogleMapProps {
    data: GeoPointField;
    markers?: LocationMapCalloutSliceMapWithCalloutRightPrimaryMapMarkersItem[];
    zoom?: number;
}

export const GoogleMap = ({data, markers, zoom = 7 }: GoogleMapProps) => {

    const ref = useRef<HTMLDivElement | null>(null);
    const isMobile = useMediaQuery('(max-width: 768px)');

    useEffect(() => {
        if (ref.current) {

            if (markers && markers.length > 0 && isMobile && markers[0]?.marker_location) {
                // If markers are provided and it's a mobile view, use the first marker's location
                data.latitude = markers[0]?.marker_location.latitude;
                data.longitude = markers[0]?.marker_location.longitude;
            }


            const map = new window.google.maps.Map(ref.current, {
                center: {
                    lat:  data.latitude,
                    lng: data.longitude,
                },
                zoom: zoom,
            });

            if (markers && markers.length > 0) {
                markers?.map((marker) => {
                    const locations = [{
                        lat: marker.marker_location.latitude,
                        lng: marker.marker_location.longitude,
                    }];

                    addSingleMarkers({locations, map, label: marker.name ?? 'Location'});

                });
            } else {
                const locations = [{
                    lat: data.latitude,
                    lng: data.longitude,
                }];
                addSingleMarkers({locations, map});
            }




        }

    }, [ref, isMobile, markers, zoom, data]);

  return (
      <div
          ref={ref}
          style={{width: "100%", height: "90vh"}}
      />
  )
}

export default GoogleMap;
