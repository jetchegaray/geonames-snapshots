import { ApiProperty } from '@nestjs/swagger';

export class GeoCountry {
  @ApiProperty()
  name: string;
  @ApiProperty()
  iso: string;
  @ApiProperty()
  geonameId: number;

  constructor(name: string, iso: string, geonameId: number) {
    this.name = name;
    this.iso = iso;
    this.geonameId = geonameId;
  }
}
