import { Injectable, Inject } from '@nestjs/common';
import { GeoCountry } from '../interfaces/geocountry.interface';
import { Logger } from '@nestjs/common';
import { FirebaseService } from '../../database/firebase.service';
import { FullCountryDTO } from '../dto/FullCountry';

@Injectable()
export class CountryService {
  private readonly DB_COUNTRY_NAME = 'Countries';
  private readonly logger = new Logger(CountryService.name);

  constructor(private readonly firebasService: FirebaseService) {}

  findAllCountries = async (): Promise<GeoCountry[]> => {
    const countriesSnapshot: Record<string, GeoCountry> =
      await this.firebasService.getSnapshot<GeoCountry>(this.DB_COUNTRY_NAME);

    const countries: GeoCountry[] = Object.keys(countriesSnapshot).map(
      (key) => countriesSnapshot[key],
    );
    return countries;
  };

  findCountryByISO = async (ISO: string): Promise<FullCountryDTO> => {
    const countrySnapshot: Record<string, FullCountryDTO> =
      await this.firebasService.getCountry<FullCountryDTO>(
        this.DB_COUNTRY_NAME,
        ISO,
      );

    const [country] = Object.keys(countrySnapshot).map(
      (key) => countrySnapshot[key],
    );
    this.logger.debug(country);
    return country;
  };
}
