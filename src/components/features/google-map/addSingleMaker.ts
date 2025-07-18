export const addSingleMarkers = ({
                                   locations,
                                   map,
                                   label = 'Location',
                                 }: {
  locations: ReadonlyArray<google.maps.LatLngLiteral>;
  map: google.maps.Map | null | undefined;
  label?: string;
}) =>
    locations.map(
        position => new google.maps.Marker({
          position,
          map,
          label
        }),
    );
