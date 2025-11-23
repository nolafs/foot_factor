'use client';
import React, { useEffect, useRef, useMemo } from 'react';
import { type GeoPointField } from '@prismicio/client';
import { addSingleMarkers } from '@/components/features/google-map/addSingleMaker';
import { type LocationMapCalloutSliceMapWithCalloutRightPrimaryMapMarkersItem } from '@/prismic-types';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';

interface GoogleMapProps {
  data: GeoPointField;
  markers?: LocationMapCalloutSliceMapWithCalloutRightPrimaryMapMarkersItem[];
  zoom?: number;
}

export const GoogleMap = ({ data, markers, zoom = 7 }: GoogleMapProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Use local variable instead of mutating props
  const mapCenter = useMemo(() => {
    if (markers && markers.length > 0 && isMobile && markers[0]?.marker_location) {
      return {
        lat: markers[0].marker_location.latitude,
        lng: markers[0].marker_location.longitude,
      };
    }
    return {
      lat: data.latitude,
      lng: data.longitude,
    };
  }, [markers, isMobile, data.latitude, data.longitude]);

  useEffect(() => {
    if (ref.current) {
      const map = new window.google.maps.Map(ref.current, {
        center: mapCenter,
        zoom: zoom,
      });

      if (markers && markers.length > 0) {
        markers.forEach(marker => {
          const locations = [
            {
              lat: marker.marker_location.latitude,
              lng: marker.marker_location.longitude,
            },
          ];

          addSingleMarkers({ locations, map, label: marker.name ?? 'Location' });
        });
      } else {
        const locations = [mapCenter];
        addSingleMarkers({ locations, map });
      }
    }
  }, [ref, mapCenter, markers, zoom]);

  return <div ref={ref} style={{ width: '100%', height: '90vh' }} />;
};

export default GoogleMap;
