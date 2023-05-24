import { GeoProvince } from '../entities/geoPlace.entity';
import { ApiProperty } from '@nestjs/swagger';

export class FullCountryDTO {
  @ApiProperty()
  name: string;
  @ApiProperty()
  iso: string;
  @ApiProperty()
  geonameId: number;
  @ApiProperty({ type: () => [GeoProvince] })
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
