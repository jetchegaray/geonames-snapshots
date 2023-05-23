import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { GeonamesModule } from './geoNames/geonames.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { loggerMiddeware } from './logger/logger.middleware';
import helmet from 'helmet';

@Module({
  imports: [
    GeonamesModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
