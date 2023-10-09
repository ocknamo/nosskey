import { Injectable } from '@nestjs/common';
import IORedis from 'ioredis';

enum KeyPrefix {
  challenge = 'challenge',
}

const challengeEx = 180;

@Injectable()
export class RedisService {
  private redis = new IORedis();

  setChallenge(id: string, value: string): Promise<'OK'> {
    return this.redis.set(`${KeyPrefix.challenge}:${id}`, value, 'EX', challengeEx);
  }

  getChallenge(id: string): Promise<string> {
    return this.redis.get(`${KeyPrefix.challenge}:${id}`);
  }
}
