import { GeoPlace } from '../entities/geoPlace.entity';

export interface GeoApi {
  geonames: GeoPlace[];
  totalResultsCount: number;
}
