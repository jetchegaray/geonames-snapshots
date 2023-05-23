import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { throws } from 'assert';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  private logger = new Logger(RedisService.name);
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async set(key: string, value: unknown): Promise<void> {
    try {
      await this.cacheManager.set(`geonames::${key}`, value);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async get<T>(key: string): Promise<T | undefined> {
    try {
      const jsonData: string | undefined = await this.cacheManager.get<string>(
        `geonames::${key}`,
      );
      return jsonData ? JSON.parse(jsonData!) : undefined;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
