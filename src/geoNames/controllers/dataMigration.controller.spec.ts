import { Test } from '@nestjs/testing';
import { DataMigrationController } from './dataMigration.controller';
import { ProvinceService } from '../services/province.service';
import { CountryService } from '../services/country.service';
import { FullCountryService } from '../services/fullCountry.service';
import { ProvinceResponse } from '../entities/ProvinceResponse.entity';
import { FullCountryDTO } from '../dto/FullCountry';
import { GeoCountry } from '../entities/geocountry.entity';
import { GeoProvince } from '../entities/geoPlace.entity';
import { GeonamesService } from '../services/geonames.service';
import { LoggingInterceptor } from '../../interceptors/logging.interceptor';
import { LoggerModule } from '../../logger/logger.module';

describe('DataMigrationController', () => {
  let dataMigrationController: DataMigrationController;
  let provinceService: ProvinceService;
  let countryService: CountryService;
  let fullCountryService: FullCountryService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [LoggerModule],
      controllers: [DataMigrationController],
      providers: [
        ProvinceService,
        {
          provide: GeonamesService,
          useValue: {
            getGeoEntities: jest.fn(),
          },
        },
        {
          provide: FullCountryService,
          useValue: {
            saveFullCountry: jest.fn(),
            findFullCountry: jest.fn(),
          },
        },
        {
          provide: CountryService,
          useValue: {
            findAllCountries: jest.fn(),
            findCountryByISO: jest.fn(),
          },
        },
        {
          provide: LoggingInterceptor,
          useValue: {
            intercept: jest.fn().mockImplementation((_, next) => next.handle()),
          },
        },
      ],
    }).compile();

    dataMigrationController = moduleRef.get<DataMigrationController>(
      DataMigrationController,
    );
    provinceService = moduleRef.get<ProvinceService>(ProvinceService);
    countryService = moduleRef.get<CountryService>(CountryService);
    fullCountryService = moduleRef.get<FullCountryService>(FullCountryService);
  });

  describe('populateProvincesAndCitiesByCountry', () => {
    it('should populate provinces and cities for the given country', async () => {
      const mockCountryISO = 'US';
      const mockCountry: GeoCountry = new GeoCountry(
        'United States',
        mockCountryISO,
        1,
      );

      const mockProvinces: GeoProvince[] = [
        {
          toponymName: 'Province 1',
          geonameId: 1,
          lat: 1,
          lng: 1,
          cities: [],
        },
        {
          toponymName: 'Province 2',
          geonameId: 2,
          lat: 2,
          lng: 2,
          cities: [],
        },
      ];
      const mockProvincesResponse: ProvinceResponse = new ProvinceResponse(
        mockProvinces,
      );

      jest
        .spyOn(countryService, 'findCountryByISO')
        .mockResolvedValue(mockCountry);
      jest
        .spyOn(provinceService, 'getProvinces')
        .mockResolvedValue(mockProvincesResponse);
      jest.spyOn(fullCountryService, 'saveFullCountry').mockResolvedValue();

      await dataMigrationController.populateProvincesAndCitiesByCountry(
        mockCountryISO,
      );

      expect(countryService.findCountryByISO).toHaveBeenCalledWith(
        mockCountryISO,
      );
      expect(provinceService.getProvinces).toHaveBeenCalledWith(
        mockCountry.geonameId,
      );
      expect(fullCountryService.saveFullCountry).toHaveBeenCalledWith(
        new FullCountryDTO(
          mockCountry.name,
          mockCountry.iso,
          mockCountry.geonameId,
          mockProvinces,
        ),
      );
    });
  });
});
