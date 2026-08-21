import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisService {
  private readonly redis: Redis

  constructor(private configService: ConfigService) {
    this.redis = new Redis({
      host: this.configService.get<string>('REDIS_HOST'),
      port: this.configService.get<number>('REDIS_PORT'),
    })

    this.redis.on('connect', () => {
      console.log('Redis connected');
    })

    this.redis.on('error', (error) => {
      console.log(error);
    })
  }

  async set(
    key: string,
    value: unknown,
    ttl?: number,
  ): Promise<void> {
    const data = JSON.stringify(value);
    if (ttl) {
      await this.redis.set(key, data, 'EX', ttl);
      return;
    }

    await this.redis.set(key, data)
  }

  async get<T>(key: string): Promise<T | null> {
    const data = await this.redis.get(key);
    if (!data) {
      return null;
    }

    return JSON.parse(data) as T;
  }

  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }
}
