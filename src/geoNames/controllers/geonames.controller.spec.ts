import { Test } from '@nestjs/testing';
import { GeonamesController } from './geonames.controller';
import { FullCountryService } from '../services/fullcountry.service';
import { CountryService } from '../services/country.service';
import { RedisService } from '../../cache-redis/redis.service';
import { ProvinceResponse } from '../entities/province-response.entity';
import { FullCountryDTO } from '../dto/Fullcountry';
import { GeoCountry } from '../entities/geocountry.entity';
import { CountryResponse } from '../entities/country-response.entity';
import { LoggingInterceptor } from '../../interceptors/logging.interceptor';
import { LoggerModule } from '../../logger/logger.module';
import { GeoCity, GeoProvince } from '../entities/geoplace.entity';
import { HttpStatus } from '@nestjs/common';

describe('GeonamesController', () => {
  let geonamesController: GeonamesController;
  let fullCountryService: FullCountryService;
  let countryService: CountryService;
  let redisService: RedisService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [LoggerModule],
      controllers: [GeonamesController],
      providers: [
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
          provide: RedisService,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
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

    geonamesController = moduleRef.get<GeonamesController>(GeonamesController);
    fullCountryService = moduleRef.get<FullCountryService>(FullCountryService);
    countryService = moduleRef.get<CountryService>(CountryService);
    redisService = moduleRef.get<RedisService>(RedisService);
  });

  describe('getProvincesAndCitiesByCountry', () => {
    it('should retrieve provinces and cities for the given country from cache if available', async () => {
      const mockProvinces: GeoProvince[] = [
        new GeoProvince('Province 1', 1, 1, 1, [
          new GeoCity('City 1', 11, 11, 11),
        ]),
        new GeoProvince('Province 2', 2, 2, 2, [
          new GeoCity('City 2', 22, 22, 22),
        ]),
      ];

      jest
        .spyOn(redisService, 'get')
        .mockResolvedValue(new ProvinceResponse(mockProvinces));

      const result = await geonamesController.getProvincesAndCitiesByCountry(
        'US',
      );

      expect(redisService.get).toHaveBeenCalledWith(
        'fullCountries::get::one::US',
      );
      expect(fullCountryService.findFullCountry).not.toHaveBeenCalled();
      expect(redisService.set).not.toHaveBeenCalled();
      expect(result).toEqual(new ProvinceResponse(mockProvinces));
    });

    it('should retrieve provinces and cities for the given country from the database if not available in cache', async () => {
      const mockProvinces: GeoProvince[] = [
        new GeoProvince('Province 1', 1, 1, 1, [
          new GeoCity('City 1', 11, 11, 11),
        ]),
        new GeoProvince('Province 2', 2, 2, 2, [
          new GeoCity('City 2', 22, 22, 22),
        ]),
      ];
      const mockFullCountryDTO: FullCountryDTO = new FullCountryDTO(
        'United States',
        'US',
        213123,
        mockProvinces,
      );

      jest.spyOn(redisService, 'get').mockResolvedValue(undefined);
      jest.spyOn(redisService, 'set').mockResolvedValue(undefined);

      jest
        .spyOn(fullCountryService, 'findFullCountry')
        .mockResolvedValue(mockFullCountryDTO);

      const result: ProvinceResponse | undefined =
        await geonamesController.getProvincesAndCitiesByCountry('US');

      expect(redisService.get).toHaveBeenCalledWith(
        `fullCountries::get::one::US`,
      );
      expect(redisService.set).toHaveBeenCalledWith(
        `fullCountries::get::one::US`,
        JSON.stringify(new ProvinceResponse(mockProvinces)),
      );
      expect(fullCountryService.findFullCountry).toHaveBeenCalledWith('US');
      expect(result).toEqual(new ProvinceResponse(mockProvinces));
    });
  });

  describe('getAllCountries', () => {
    it('should retrieve all countries from cache if available', async () => {
      const mockCountryResponse: CountryResponse = new CountryResponse([
        new GeoCountry('United States', 'US', 2222),
      ]);

      jest
        .spyOn(redisService, 'get')
        .mockResolvedValue([new GeoCountry('United States', 'US', 2222)]);
      jest.spyOn(countryService, 'findAllCountries');

      const result = await geonamesController.getAllCountries();

      expect(redisService.get).toHaveBeenCalledWith('countries::get::all');
      expect(countryService.findAllCountries).not.toHaveBeenCalled();
      expect(result).toEqual(mockCountryResponse);
    });

    it('should retrieve all countries from the database if not available in cache', async () => {
      const mockCountries: GeoCountry[] = [
        new GeoCountry('United States', 'US', 1),
      ];
      const mockCountryResponse: CountryResponse = new CountryResponse(
        mockCountries,
      );

      jest.spyOn(redisService, 'get').mockResolvedValue(undefined);
      jest.spyOn(redisService, 'set').mockResolvedValue(undefined);
      jest
        .spyOn(countryService, 'findAllCountries')
        .mockResolvedValue(mockCountries);

      const result = await geonamesController.getAllCountries();

      expect(redisService.get).toHaveBeenCalledWith('countries::get::all');
      expect(redisService.set).toHaveBeenCalledWith(
        'countries::get::all',
        JSON.stringify(mockCountries),
      );
      expect(countryService.findAllCountries).toHaveBeenCalled();
      expect(result).toEqual(mockCountryResponse);
    });
  });
});
