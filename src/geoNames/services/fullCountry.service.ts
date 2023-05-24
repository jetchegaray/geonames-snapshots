import { Injectable, Inject } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { FirebaseService } from '../../database/firebase.service';
import { FullCountryDTO } from '../dto/FullCountry';

@Injectable()
export class FullCountryService {
  private readonly DB_FULL_COUNTRY_NAME = 'FullCountries';
  private readonly logger = new Logger(FullCountryService.name);

  constructor(private readonly firebasService: FirebaseService) {}

  saveFullCountry = async (fullCountryDTO: FullCountryDTO): Promise<void> => {
    return await this.firebasService.setFullCountry(
      this.DB_FULL_COUNTRY_NAME,
      fullCountryDTO,
    );
  };

  findFullCountry = async (
    ISO: string,
  ): Promise<FullCountryDTO | undefined> => {
    const fullCountrySnapshot: Record<string, FullCountryDTO> =
      await this.firebasService.getFullCountry<FullCountryDTO>(
        this.DB_FULL_COUNTRY_NAME,
        ISO,
      );

    if (!fullCountrySnapshot) {
      return undefined;
    }

    const [country] = Object.keys(fullCountrySnapshot).map(
      (key) => fullCountrySnapshot[key],
    );
    return country;
  };
}
