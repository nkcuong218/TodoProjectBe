import { Controller, Get } from '@nestjs/common';
import { RedisService } from './redis.service';

@Controller('redis')
export class RedisController {
  constructor(private readonly redisService: RedisService) { }

  @Get('test')
  async test() {
    await this.redisService.set('hello', {
      message: 'Hello Redis',
      time: new Date(),
    });

    return this.redisService.get('hello');
  }
}