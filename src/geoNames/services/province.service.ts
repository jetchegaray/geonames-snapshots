import { Injectable, Logger } from '@nestjs/common';
import { ProvinceResponse } from '../interfaces/ProvinceResponse';
import { GeonamesService } from './geonames.service';
import { GeoCity, GeoProvince } from '../interfaces/geoPlace.interface';

@Injectable()
export class ProvinceService {
  private logger = new Logger(ProvinceService.name);

  constructor(private readonly geonameService: GeonamesService) {}

  async getProvinces(geonameCountryId: number): Promise<ProvinceResponse> {
    const provinces: GeoProvince[] = <GeoProvince[]>(
      await this.geonameService.getGeoEntities(geonameCountryId)
    );
    const updatedProvinces: Promise<GeoProvince>[] = provinces.map(
      async (province) => {
        this.logger.debug(province.geonameId);

        const cities: GeoCity[] =
          <GeoCity[]>(
            await this.geonameService.getGeoEntities(province.geonameId)
          ) || [];
        return { ...province, cities };
      },
    );

    const resultedProvinces = await Promise.all(updatedProvinces);

    return new Promise<ProvinceResponse>((resolve, reject) => {
      resolve(new ProvinceResponse(resultedProvinces));
      reject(new Error('Promise finally rejected'));
    });
  }
}
