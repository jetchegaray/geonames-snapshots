import {
  Controller,
  Get,
  HttpStatus,
  Logger,
  Param,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { GeoCountry } from '../entities/geocountry.entity';
import { RedisService } from '../../cache-redis/redis.service';
import { Response } from 'express';

import { ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ZipService } from '../services/zip.service';
import { ProvinceResponse } from '../entities/ProvinceResponse.entity';
import { FullCountryDTO } from '../dto/FullCountry';
import { FullCountryService } from '../services/fullCountry.service';
import { CountryService } from '../services/country.service';
import { LoggingInterceptor } from '../../interceptors/logging.interceptor';
import { NoResponseInterceptor } from '../../interceptors/noResponse.interceptor';

@ApiTags('downloadSnapshot')
@UseInterceptors(LoggingInterceptor)
@Controller('download/snapshot')
export class GeonamesSnapshotController {
  private logger = new Logger(GeonamesSnapshotController.name);

  constructor(
    private readonly zipService: ZipService,
    private readonly fullCountryService: FullCountryService,
    private readonly countryService: CountryService,
    private readonly redisService: RedisService,
  ) {}

  @ApiResponse({
    schema: {
      type: 'string',
      format: 'binary',
    },
    status: HttpStatus.OK,
  })
  @ApiProduces('application/zip')
  @Get('countries')
  async getAllCountries(@Res() response: Response): Promise<void> {
    const localKey: string = 'countries::get::all';
    let countries: GeoCountry[] | undefined = await this.redisService.get<
      GeoCountry[]
    >(localKey);

    this.logger.debug(
      `${countries ? '::::Comming from cache' : '::::Comming from database'}`,
    );
    if (!countries) {
      const dbCountries = await this.countryService.findAllCountries();
      await this.redisService.set(localKey, JSON.stringify(dbCountries));
      countries = [...dbCountries];
    }

    response.setHeader('Content-Type', 'application/zip');
    response.setHeader(
      'Content-Disposition',
      `attachment; filename=${this.zipService.getFileName('countries')}.zip`,
    );

    (await this.zipService.getArchiver(JSON.stringify(countries))).pipe(
      response,
    );
  }

  @ApiResponse({
    schema: {
      type: 'string',
      format: 'binary',
    },
    status: HttpStatus.OK,
  })
  @ApiProduces('application/zip')
  @UseInterceptors(
    new NoResponseInterceptor(
      'Entity not found! you may want to populate first the country you need',
    ),
  )
  @Get('provinces/:ISO/cities')
  async getProvincesAndCitiesByCountry(
    @Param('ISO')
    countryISO: string,
    @Res() response: Response,
  ): Promise<void> {
    const localKey = `fullCountries::get::one::${countryISO}`;

    let provinceResponse: ProvinceResponse | undefined =
      await this.redisService.get<ProvinceResponse>(localKey);

    this.logger.debug(
      `${
        provinceResponse
          ? '::::Comming from cache'
          : '::::Comming from database'
      }`,
    );

    //if cache does not have any results --> It will look at the DB
    if (!provinceResponse) {
      const dbCountry: FullCountryDTO | undefined =
        await this.fullCountryService.findFullCountry(countryISO);
      this.logger.debug('leggo aca');
      if (!dbCountry) {
        return undefined;
      }

      const provinceResponseDB: ProvinceResponse = new ProvinceResponse(
        dbCountry.provinces,
      );

      await this.redisService.set(localKey, JSON.stringify(provinceResponseDB));

      provinceResponse = { ...provinceResponseDB };
    }

    response.setHeader('Content-Type', 'application/zip');
    response.setHeader(
      'Content-Disposition',
      `attachment; filename=${this.zipService.getFileName(
        'fullcountries',
      )}.zip`,
    );
    this.logger.debug(JSON.stringify(provinceResponse));
    (await this.zipService.getArchiver(JSON.stringify(provinceResponse))).pipe(
      response,
    );
  }
}
