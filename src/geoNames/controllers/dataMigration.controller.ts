import { Controller, Get, Logger, Param } from '@nestjs/common';
import { GeoCountry } from '../interfaces/geocountry.interface';
import { CountryService } from '../services/country.service';
import { ProvinceResponse } from '../interfaces/ProvinceResponse';
import { ProvinceService } from '../services/province.service';

import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FullCountryService } from '../services/fullCountry.service';
import { FullCountryDTO } from '../dto/FullCountry';

@ApiTags('populateFullCountry')
@Controller('populateFullCountry')
export class DataMigrationController {
  private logger = new Logger(DataMigrationController.name);

  constructor(
    private readonly provinceService: ProvinceService,
    private readonly countryService: CountryService,
    private readonly fullCountryService: FullCountryService,
  ) {}

  @ApiOperation({
    summary:
      'Get all the provinces/states from the API for a country and save the data into the DB',
  })
  @ApiResponse({ status: 200, description: 'Successful response' })
  @Get('provinces/:ISO/cities')
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
    this.logger.log(fullCountryDTO);

    return this.fullCountryService.saveFullCountry(fullCountryDTO);
  }
}
