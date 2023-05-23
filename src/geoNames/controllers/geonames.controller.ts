import {
  Controller,
  Get,
  Logger,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { GeoCountry } from '../interfaces/geocountry.interface';
import { CountryService } from '../services/country.service';
import { ProvinceResponse } from '../interfaces/ProvinceResponse';
import { ProvinceService } from '../services/province.service';
import { SnapshotInterceptor } from '../../interceptors/snapshot.interceptor';
import { RedisService } from '../../cache-redis/redis.service';

import {
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FullCountryDTO } from '../dto/FullCountry';

@ApiTags('geoPlaces')
@Controller('geonames')
export class GeonamesController {
  private logger = new Logger(GeonamesController.name);

  constructor(
    private readonly provinceService: ProvinceService,
    private readonly countryService: CountryService,
    private readonly redisService: RedisService,
  ) {}

  @ApiOperation({ summary: 'Get all the provinces/states for a country' })
  @ApiResponse({ status: 200, description: 'Successful response' })
  @ApiOkResponse({ type: ProvinceResponse })
  @Get('provinces/:ISO/cities')
  async getProvincesAndCitiesByCountry(
    @Param('ISO')
    countryISO: string,
  ): Promise<ProvinceResponse> {
    const localKey = `countries::get::one::${countryISO}`;

    const provinceResponse: ProvinceResponse | undefined =
      await this.redisService.get<ProvinceResponse>(localKey);

    this.logger.log(
      `${
        provinceResponse
          ? '::::Comming from cache'
          : '::::Comming from database'
      }`,
    );

    //if cache does not have results --> I will look at the DB
    if (!provinceResponse) {
      const dbCountry: FullCountryDTO =
        await this.countryService.findCountryByISO(countryISO);

      const provinceResponseDB: ProvinceResponse = new ProvinceResponse(
        dbCountry.provinces,
      );

      await this.redisService.set(localKey, JSON.stringify(provinceResponseDB));

      return provinceResponseDB;
    }

    return provinceResponse;
  }

  @ApiOperation({
    summary: 'Get All the countries of the world',
  })
  @ApiOkResponse({ type: [GeoCountry] })
  //@UseInterceptors(SnapshotInterceptor)
  @Get('countries')
  async getAllCountries(): Promise<GeoCountry[]> {
    const localKey: string = 'countries::get::all';
    const countries: GeoCountry[] | undefined = await this.redisService.get<
      GeoCountry[]
    >(localKey);
    this.logger.log(
      `${countries ? '::::Comming from cache' : '::::Comming from database'}`,
    );

    if (!countries) {
      const dbCountries = await this.countryService.findAllCountries();
      await this.redisService.set(localKey, JSON.stringify(dbCountries));
      return dbCountries;
    }

    return countries;
  }
}
