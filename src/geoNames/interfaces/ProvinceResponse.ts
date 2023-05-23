import { GeoProvince } from './geoPlace.interface';

export class ProvinceResponse {
  provinces: GeoProvince[];

  constructor(provinces: GeoProvince[]) {
    this.provinces = provinces;
  }
}
