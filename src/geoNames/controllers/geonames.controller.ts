import {
  Controller,
  Get,
  Logger,
  NotFoundException,
  Param,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { GeoCountry } from '../entities/geocountry.entity';
import { CountryService } from '../services/country.service';
import { ProvinceResponse } from '../entities/province-response.entity';
import { RedisService } from '../../cache-redis/redis.service';
import { Response } from 'express';

import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FullCountryDTO } from '../dto/Fullcountry';
import { FullCountryService } from '../services/fullcountry.service';
import { CountryResponse } from '../entities/country-response.entity';
import { LoggingInterceptor } from '../../interceptors/logging.interceptor';
import { NoResponseInterceptor } from '../../interceptors/no-response.interceptor';

@ApiTags('geoPlaces')
@UseInterceptors(LoggingInterceptor)
@Controller('geonames')
export class GeonamesController {
  private logger = new Logger(GeonamesController.name);

  constructor(
    private readonly fullCountryService: FullCountryService,
    private readonly countryService: CountryService,
    private readonly redisService: RedisService,
  ) {}

  @ApiOkResponse({ type: ProvinceResponse })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @Get('provinces/:ISO/cities')
  @UseInterceptors(
    new NoResponseInterceptor(
      'Entity not found! you may want to populate first the country you need',
    ),
  )
  async getProvincesAndCitiesByCountry(
    @Param('ISO')
    countryISO: string,
  ): Promise<ProvinceResponse | undefined> {
    const localKey = `fullCountries::get::one::${countryISO}`;

    const provinceResponse: ProvinceResponse | undefined =
      await this.redisService.get<ProvinceResponse>(localKey);

    this.logger.debug(
      `${
        provinceResponse
          ? '::::Comming from cache'
          : '::::Comming from database'
      }`,
    );
    //if cache does not have results --> I will look at the DB
    if (!provinceResponse) {
      const dbFullCountry: FullCountryDTO | undefined =
        await this.fullCountryService.findFullCountry(countryISO);

      // cached by the interceptor
      if (!dbFullCountry) {
        return undefined;
      }

      const provinceResponseDB: ProvinceResponse = new ProvinceResponse(
        dbFullCountry.provinces,
      );

      await this.redisService.set(localKey, JSON.stringify(provinceResponseDB));
      return provinceResponseDB;
    }

    return provinceResponse;
  }

  @ApiOkResponse({ type: CountryResponse })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @Get('countries')
  async getAllCountries(): Promise<CountryResponse> {
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
      return new CountryResponse(dbCountries);
    }

    return new CountryResponse(countries);
  }
}
