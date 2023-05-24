import { ApiProperty } from '@nestjs/swagger';
import { GeoProvince } from './geoPlace.entity';

export class ProvinceResponse {
  @ApiProperty({ type: () => [GeoProvince] })
  provinces: GeoProvince[];

  constructor(provinces: GeoProvince[]) {
    this.provinces = provinces;
  }
}
