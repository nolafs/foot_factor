'use client';
import React, {useEffect, useRef} from 'react';
import {GeoPointField} from '@prismicio/client';
import {addSingleMarkers} from '@/components/features/google-map/addSingleMaker';


interface GoogleMapProps {
    data: GeoPointField;
    zoom?: number;
}

export const GoogleMap = ({data, zoom = 7 }: GoogleMapProps) => {

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

            const locations = [
                {
                    lat: data.latitude,
                    lng: data.longitude,
                }
            ];

            addSingleMarkers({locations, map});
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
