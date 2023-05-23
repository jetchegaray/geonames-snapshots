import { GeoProvince } from '../interfaces/geoPlace.interface';

export class FullCountryDTO {
  name: string;
  iso: string;
  geonameId: number;

  provinces: GeoProvince[];

  constructor(
    name: string,
    iso: string,
    geonameId: number,
    provinces: GeoProvince[],
  ) {
    this.name = name;
    this.iso = iso;
    this.geonameId = geonameId;
    this.provinces = provinces;
  }
}
