import { Injectable } from '@nestjs/common';
import IORedis from 'ioredis';

enum KeyPrefix {
  challenge = 'challenge',
  userId = 'user_id',
}

const challengeEx = 180;
const userIdEx = 180;

@Injectable()
export class RedisService {
  private redis = new IORedis();

  setChallenge(id: string, value: string): Promise<'OK'> {
    return this.redis.set(
      `${KeyPrefix.challenge}:${id}`,
      value,
      'EX',
      challengeEx,
    );
  }

  getChallenge(id: string): Promise<string | null> {
    return this.redis.get(`${KeyPrefix.challenge}:${id}`);
  }

  setUserId(id: string, value: string): Promise<'OK'> {
    return this.redis.set(`${KeyPrefix.userId}:${id}`, value, 'EX', userIdEx);
  }

  getUserId(id: string): Promise<string | null> {
    return this.redis.get(`${KeyPrefix.userId}:${id}`);
  }

  close(): void {
    this.redis.disconnect(false);
  }
}
