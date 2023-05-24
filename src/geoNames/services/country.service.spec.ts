import { Test, TestingModule } from '@nestjs/testing';
import { CountryService } from './country.service';
import { FirebaseService } from '../../database/firebase.service';

describe('CountryService', () => {
  let countryService: CountryService;
  let firebaseService: FirebaseService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        CountryService,
        {
          provide: FirebaseService,
          useValue: {
            getSnapshot: jest.fn(),
            getCountry: jest.fn(),
          },
        },
      ],
    }).compile();

    countryService = moduleRef.get<CountryService>(CountryService);
    firebaseService = moduleRef.get<FirebaseService>(FirebaseService);
  });

  describe('findAllCountries', () => {
    it('should return an array of countries', async () => {
      // Mocking the response of getSnapshot method
      const mockCountriesSnapshot = {
        ISO: { name: 'Country 1', iso: 'ISO', geonameId: 12123 },
        ISO2: { name: 'Country 2', iso: 'ISO', geonameId: 3242342 },
      };
      jest
        .spyOn(firebaseService, 'getSnapshot')
        .mockResolvedValue(mockCountriesSnapshot);

      const result = await countryService.findAllCountries();

      expect(result).toEqual([
        // Asserting the result
        { name: 'Country 1', iso: 'ISO', geonameId: 12123 },
        { name: 'Country 2', iso: 'ISO', geonameId: 3242342 },
      ]);
      expect(firebaseService.getSnapshot).toHaveBeenCalledWith('Countries');
    });
  });

  describe('findCountryByISO', () => {
    it('should return a country by ISO', async () => {
      const mockCountrySnapshot = {
        ISO: { name: 'Country 1', iso: 'ISO', geonameId: 12123 },
      };
      jest
        .spyOn(firebaseService, 'getCountry')
        .mockResolvedValue(mockCountrySnapshot);
      const loggerDebugSpy = jest
        .spyOn(countryService['logger'], 'debug')
        .mockImplementation();

      const result = await countryService.findCountryByISO('ISO');

      expect(result).toEqual({
        name: 'Country 1',
        iso: 'ISO',
        geonameId: 12123,
      });
      expect(firebaseService.getCountry).toHaveBeenCalledWith(
        'Countries',
        'ISO',
      );
      expect(loggerDebugSpy).toHaveBeenCalledWith({
        name: 'Country 1',
        iso: 'ISO',
        geonameId: 12123,
      });
    });
  });
});
