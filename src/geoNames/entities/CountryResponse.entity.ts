import { ApiProperty } from '@nestjs/swagger';
import { GeoCountry } from './geocountry.entity';

export class CountryResponse {
  @ApiProperty({ type: () => [GeoCountry] })
  countries: GeoCountry[];

  constructor(countries: GeoCountry[]) {
    this.countries = countries;
  }
}
