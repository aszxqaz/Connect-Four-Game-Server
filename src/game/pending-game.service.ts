import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisToken } from 'src/redis/redis.module';
import { v4 } from 'uuid';

@Injectable()
export class PendingGameService {
  constructor(@Inject(RedisToken) private readonly redisClient: Redis) {}

  public async create(userId: string) {
    const gameId = v4();
    await this.redisClient.rpush(`pg-queue`, gameId);
    await this.redisClient.set(`pending-game:${gameId}`, userId);
    return {
      gameId,
    };
  }

  public async pop() {
    const gameId = await this.redisClient.lpop(`pg-queue`);
    if (!gameId) return null;

    const userId = await this.redisClient.get(`pending-game:${gameId}`);
    await this.redisClient.del(`pending-game:${gameId}`);

    return {
      gameId,
      userId,
    };
  }
}
