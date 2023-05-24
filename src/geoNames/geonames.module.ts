import { Module } from '@nestjs/common';
import { GeonamesService } from './services/geonames.service';
import { GeonamesController } from './controllers/geonames.controller';
import { HttpModule } from '@nestjs/axios';
import { CountryService } from './services/country.service';
import { FirebaseModule } from '../database/firebase.module';
import { ProvinceService } from './services/province.service';
import { RedisModule } from '../cache-redis/redis.module';
import { FullCountryService } from './services/fullCountry.service';
import { DataMigrationController } from './controllers/dataMigration.controller';
import { LoggerModule } from '../logger/logger.module';
import { GeonamesSnapshotController } from './controllers/geonamesSnapshot.controller';
import { ZipService } from './services/zip.service';

const httpModuleFactory = HttpModule.registerAsync({
  useFactory: () => ({
    timeout: 15000,
    maxRedirects: 5,
  }),
});

@Module({
  imports: [httpModuleFactory, FirebaseModule, RedisModule, LoggerModule],
  controllers: [
    GeonamesController,
    DataMigrationController,
    GeonamesSnapshotController,
  ],
  providers: [
    GeonamesService,
    CountryService,
    ProvinceService,
    FullCountryService,
    ZipService,
  ],
})
export class GeonamesModule {}
