'use client';
import React, {useEffect, useRef} from 'react';
import {GeoPointField} from '@prismicio/client';
import {addSingleMarkers} from '@/components/features/google-map/addSingleMaker';
import {LocationMapCalloutSliceMapWithCalloutRightPrimaryMapMarkersItem} from '@/prismic-types';


interface GoogleMapProps {
    data: GeoPointField;
    markers?: LocationMapCalloutSliceMapWithCalloutRightPrimaryMapMarkersItem[];
    zoom?: number;
}

export const GoogleMap = ({data, markers, zoom = 7 }: GoogleMapProps) => {

    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (ref.current) {
            const map = new window.google.maps.Map(ref.current, {
                center: {
                    lat: data.latitude,
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

    }, [ref]);

  return (
      <div
          ref={ref}
          style={{width: "100%", height: "90vh"}}
      />
  )
}

export default GoogleMap;
