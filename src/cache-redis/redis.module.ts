import { Module } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisService } from './redis.service';

const redisModuleFactory = CacheModule.registerAsync({
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    ttl: configService.get('CACHE_TTL'),
    store: redisStore,
    host: configService.get('CACHE_HOST'),
    port: configService.get('CACHE_PORT'),
    username: configService.get('CACHE_USERNAME'),
    password: configService.get('CACHE_PASSWORD'),
  }),
  inject: [ConfigService],
});

@Module({
  imports: [redisModuleFactory],
  controllers: [],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
