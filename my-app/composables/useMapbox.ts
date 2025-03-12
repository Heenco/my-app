import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

export const useMapbox = () => {
  const MAPBOX_TOKEN = 'pk.eyJ1Ijoia2hlcmFkbWFuZGkiLCJhIjoiY2l4aXF5Ym5lMDAwbzJ6cHA0cWw4OWRkNyJ9.pbe17ldY9KRsNZQRwfkRFA';

  const createGeocoder = () => {
    return new MapboxGeocoder({
      accessToken: MAPBOX_TOKEN,
      countries: 'au',
      bbox: [152.7, -27.7, 153.3, -27.3], // Brisbane bounding box
      types: 'address',
      placeholder: 'Search for your dream home...',
    });
  };

  return {
    createGeocoder
  };
};
