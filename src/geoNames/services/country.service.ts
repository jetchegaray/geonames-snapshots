import { Injectable, Inject } from '@nestjs/common';
import { GeoCountry } from '../entities/geocountry.entity';
import { Logger } from '@nestjs/common';
import { FirebaseService } from '../../database/firebase.service';

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

  findCountryByISO = async (ISO: string): Promise<GeoCountry> => {
    const countrySnapshot: Record<string, GeoCountry> =
      await this.firebasService.getCountry<GeoCountry>(
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
