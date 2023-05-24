import { Test } from '@nestjs/testing';
import { ProvinceService } from './province.service';
import { GeonamesService } from './geonames.service';
import { ProvinceResponse } from '../entities/ProvinceResponse.entity';
import { GeoCity, GeoProvince } from '../entities/geoPlace.entity';

describe('ProvinceService', () => {
  let provinceService: ProvinceService;
  let geonamesService: GeonamesService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ProvinceService,
        {
          provide: GeonamesService,
          useValue: {
            getGeoEntities: jest.fn(),
          },
        },
      ],
    }).compile();

    provinceService = moduleRef.get<ProvinceService>(ProvinceService);
    geonamesService = moduleRef.get<GeonamesService>(GeonamesService);
  });

  describe('getProvinces', () => {
    it('should retrieve provinces with associated cities', async () => {
      // Mock the external calls to getGeoEntities
      const mockCountryId = 100;
      const mockProvinces: GeoProvince[] = [
        new GeoProvince('Province 1', 1, 1, 1, []),
        new GeoProvince('Province 2', 2, 2, 2, []),
      ];
      const mockCities: GeoCity[] = [
        new GeoCity('City 1', 11, 11, 11),
        new GeoCity('City 2', 22, 22, 22),
      ];

      jest
        .spyOn(geonamesService, 'getGeoEntities')
        .mockImplementation((geonameId: number) => {
          if (geonameId === mockCountryId) {
            return Promise.resolve(mockProvinces);
          } else {
            return Promise.resolve(mockCities);
          }
        });

      const result: ProvinceResponse = await provinceService.getProvinces(
        mockCountryId,
      );

      expect(result).toBeDefined();
      expect(result.provinces).toHaveLength(2);
      expect(result.provinces[0].toponymName).toBe('Province 1');
      expect(result.provinces[0].geonameId).toBe(1);
      expect(result.provinces[0].lat).toBe(1);
      expect(result.provinces[0].lng).toBe(1);
      expect(result.provinces[0].cities).toHaveLength(2);
      expect(result.provinces[0].cities![0].toponymName).toBe('City 1');
      expect(result.provinces[0].cities![0].geonameId).toBe(11);
      expect(result.provinces[0].cities![0].lat).toBe(11);
      expect(result.provinces[0].cities![0].lng).toBe(11);
      // Additional assertions for the other province and cities

      // Ensure the getGeoEntities method was called with the correct parameters
      expect(geonamesService.getGeoEntities).toHaveBeenCalledWith(
        mockCountryId,
      );
      expect(geonamesService.getGeoEntities).toHaveBeenCalledTimes(3);
    });
  });
});
