import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { GeonamesService } from './services/geonames.service';
import { GeonamesController } from './controllers/geonames.controller';
import { HttpModule } from '@nestjs/axios';
import { CountryService } from './services/country.service';
import { FirebaseModule } from '../database/firebase.module';
import { ProvinceService } from './services/province.service';
import { RedisModule } from 'src/cache-redis/redis.module';
import { FullCountryService } from './services/fullCountry.service';
import { DataMigrationController } from './controllers/dataMigration.controller';
import { LoggerModule } from '../logger/logger.module';

const httpModuleFactory = HttpModule.registerAsync({
  useFactory: () => ({
    timeout: 15000,
    maxRedirects: 5,
  }),
});

@Module({
  imports: [httpModuleFactory, FirebaseModule, RedisModule, LoggerModule],
  controllers: [GeonamesController, DataMigrationController],
  providers: [
    GeonamesService,
    CountryService,
    ProvinceService,
    FullCountryService,
  ],
})
export class GeonamesModule {}
