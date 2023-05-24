import { Test, TestingModule } from '@nestjs/testing';
import { FullCountryService } from './fullCountry.service';
import { FirebaseService } from '../../database/firebase.service';
import { FullCountryDTO } from '../dto/FullCountry';
import { GeoCity, GeoProvince } from '../entities/geoPlace.entity';

describe('FullCountryService', () => {
  let fullCountryService: FullCountryService;
  let firebaseService: FirebaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FullCountryService,
        {
          provide: FirebaseService,
          useValue: {
            setFullCountry: jest.fn(),
            getFullCountry: jest.fn(),
          },
        },
      ],
    }).compile();

    fullCountryService = module.get<FullCountryService>(FullCountryService);
    firebaseService = module.get<FirebaseService>(FirebaseService);
  });

  describe('saveFullCountry', () => {
    it('should save the full country', async () => {
      // Arrange
      const fullCountryDTO: FullCountryDTO = new FullCountryDTO(
        'Country Name',
        'ISO',
        12345,
        [
          new GeoProvince('Province Name', 67890, 1.234, 5.678, [
            new GeoCity('City Name', 123, 9.876, 5.432),
          ]),
        ],
      );
      const setFullCountrySpy = jest
        .spyOn(firebaseService, 'setFullCountry')
        .mockResolvedValueOnce();

      // Act
      await fullCountryService.saveFullCountry(fullCountryDTO);

      // Assert
      expect(setFullCountrySpy).toHaveBeenCalledWith(
        'FullCountries',
        fullCountryDTO,
      );
    });
  });

  describe('findFullCountry', () => {
    it('should find the full country by ISO', async () => {
      // Arrange
      const ISO = 'ISO';
      const fullCountryDTO: FullCountryDTO = new FullCountryDTO(
        'Country Name',
        'ISO',
        12345,
        [
          new GeoProvince('Province Name', 67890, 1.234, 5.678, [
            new GeoCity('City Name', 123, 9.876, 5.432),
          ]),
        ],
      );
      const getFullCountrySpy = jest
        .spyOn(firebaseService, 'getFullCountry')
        .mockResolvedValueOnce({ [ISO]: fullCountryDTO });

      // Act
      const result = await fullCountryService.findFullCountry(ISO);

      // Assert
      expect(getFullCountrySpy).toHaveBeenCalledWith('FullCountries', ISO);
      expect(result).toEqual(fullCountryDTO);
    });
  });
});
