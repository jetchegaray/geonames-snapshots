import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { GeoCountry } from '../entities/geocountry.entity';
import { GeoApi } from '../interfaces/geoApi.interface';
import { catchError, firstValueFrom, map } from 'rxjs';
import { Logger } from '@nestjs/common';
import { AxiosError, AxiosResponse } from 'axios';
import { GeoPlace } from '../entities/geoPlace.entity';

@Injectable()
export class GeonamesService {
  private readonly logger = new Logger(GeonamesService.name);

  private readonly URL_BASE: string = 'http://api.geonames.org/childrenJSON?';
  private readonly PARAM_NAME_USERNAME: string = 'username';
  private readonly PARAM_NAME_ID: string = 'geonameId';
  private readonly PARAM_USERNAME = 'javimetal';

  constructor(private readonly httpService: HttpService) {}

  async getGeoEntities(geonameId: number): Promise<GeoPlace[]> {
    const entities: GeoPlace[] = await firstValueFrom(
      this.httpService
        .get<GeoApi>(
          `${this.URL_BASE}${this.PARAM_NAME_ID}=${geonameId}&${this.PARAM_NAME_USERNAME}=${this.PARAM_USERNAME}`,
        )
        .pipe(
          map((response: AxiosResponse<GeoApi>) => {
            const places: GeoPlace[] =
              <GeoPlace[]>response?.data?.geonames || [];

            return places.map(({ toponymName, geonameId, lat, lng }) => ({
              toponymName,
              geonameId,
              lat,
              lng,
            }));
          }),
        )
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error?.response?.data);
            throw `An error happened ::: ${error}`;
          }),
        ),
    );
    return entities;
  }
}
