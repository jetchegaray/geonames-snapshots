import { Module } from '@nestjs/common';
import { GeonamesModule } from './geoNames/geonames.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    GeonamesModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
