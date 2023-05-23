import { partial } from 'lodash';

export interface GeoPlace {
  toponymName: string;
  geonameId: number;
  lng: number;
  lat: number;
}

export interface GeoCity extends GeoPlace {}

export interface GeoProvince extends GeoPlace {
  cities?: GeoCity[];
}
