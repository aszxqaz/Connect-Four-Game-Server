import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { RedisToken } from 'src/redis/redis.module';
import {v4} from 'uuid'

@Injectable()
export class GameService {
  constructor(@Inject(RedisToken) private readonly redisClient: Redis) {}

  public async createGame(userId: string) {
    const gameId = v4()
    console.log(gameId)
    await this.redisClient.set(this.getPendingUserKey(userId), gameId)
    await this.redisClient.set(this.getPendingGameKey(gameId), userId)
  }

  private getPendingGameKey(gameId: string) {
    return `pg:${gameId}`
  }

  private getPendingUserKey(userId: string) {
    return `pu:${userId}`
  }
}
