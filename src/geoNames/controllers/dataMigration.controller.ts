import {
  Controller,
  Logger,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { GeoCountry } from '../entities/geocountry.entity';
import { CountryService } from '../services/country.service';
import { ProvinceResponse } from '../entities/ProvinceResponse.entity';
import { ProvinceService } from '../services/province.service';

import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { FullCountryService } from '../services/fullCountry.service';
import { FullCountryDTO } from '../dto/FullCountry';
import { LoggingInterceptor } from '../../interceptors/logging.interceptor';

@ApiTags('populateFullCountry')
@UseInterceptors(LoggingInterceptor)
@Controller('populate')
export class DataMigrationController {
  private logger = new Logger(DataMigrationController.name);

  constructor(
    private readonly provinceService: ProvinceService,
    private readonly countryService: CountryService,
    private readonly fullCountryService: FullCountryService,
  ) {}

  @ApiCreatedResponse({ type: FullCountryDTO })
  @Post('provinces/:ISO/cities')
  async populateProvincesAndCitiesByCountry(
    @Param('ISO')
    countryISO: string,
  ): Promise<void> {
    const dbCountry: GeoCountry = await this.countryService.findCountryByISO(
      countryISO,
    );
    const apiProvinces: ProvinceResponse =
      await this.provinceService.getProvinces(dbCountry.geonameId);

    const fullCountryDTO: FullCountryDTO = new FullCountryDTO(
      dbCountry.name,
      dbCountry.iso,
      dbCountry.geonameId,
      apiProvinces.provinces,
    );

    return this.fullCountryService.saveFullCountry(fullCountryDTO);
  }
}
