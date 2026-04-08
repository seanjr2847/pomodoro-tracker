export interface LatLngLiteral {
  lat: number;
  lng: number;
}

export interface MapMarker {
  id: string;
  position: LatLngLiteral;
  title?: string;
}

export interface GoogleMapProps {
  center?: LatLngLiteral;
  zoom?: number;
  markers?: MapMarker[];
  className?: string;
  onMarkerClick?: (marker: MapMarker) => void;
}
