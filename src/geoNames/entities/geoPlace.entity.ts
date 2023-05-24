import { ApiProperty } from '@nestjs/swagger';

export class GeoPlace {
  @ApiProperty()
  toponymName: string;
  @ApiProperty()
  geonameId: number;
  @ApiProperty()
  lng: number;
  @ApiProperty()
  lat: number;

  constructor(
    toponomyName: string,
    geonameId: number,
    lng: number,
    lat: number,
  ) {
    this.toponymName = toponomyName;
    this.geonameId = geonameId;
    this.lng = lng;
    this.lat = lat;
  }
}

export class GeoCity extends GeoPlace {
  constructor(
    toponomyName: string,
    geonameId: number,
    lng: number,
    lat: number,
  ) {
    super(toponomyName, geonameId, lng, lat);
  }
}

export class GeoProvince extends GeoPlace {
  @ApiProperty({ type: () => [GeoCity] })
  cities?: GeoCity[];

  constructor(
    toponomyName: string,
    geonameId: number,
    lng: number,
    lat: number,
    cities: GeoCity[],
  ) {
    super(toponomyName, geonameId, lng, lat);
    this.cities = cities;
  }
}
