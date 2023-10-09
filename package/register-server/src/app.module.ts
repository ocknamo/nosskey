import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisService } from './store/redis.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, RedisService],
})
export class AppModule {}
