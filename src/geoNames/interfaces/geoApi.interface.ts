import { GeoPlace } from './geoPlace.interface';

export interface GeoApi {
  geonames: GeoPlace[];
  totalResultsCount: number;
}
