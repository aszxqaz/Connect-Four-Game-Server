import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisToken } from 'src/redis/redis.module';

@Injectable()
export class UserService {
  constructor(@Inject(RedisToken) private readonly redisClient: Redis) {}

  // CREATE

  public setUserData(
    userId: string,
    data: Pick<UserData, 'socketId' | 'username'>,
  ) {
    return this.redisClient.hset(`user:${userId}`, data);
  }

  public setPendingGame(userId: string, gameId: string) {
    return this.redisClient.hset(`user:${userId}`, 'pendingGameId', gameId);
  }

  public setActiveGame(userId: string, gameId: string) {
    return this.redisClient.hset(`user:${userId}`, 'activeGameId', gameId);
  }

  // READ

  public getUserData(userId: string) {
    return this.redisClient.hgetall(`user:${userId}`) as Promise<UserData>;
  }

  public getUsername(userId: string) {
    return this.redisClient.hget(`user:${userId}`, 'username');
  }

  public getActiveGame(userId: string) {
    return this.redisClient.hget(`user:${userId}`, 'activeGameId');
  }

  // DELETE

  public deletePendingGame(userId: string) {
    return this.redisClient.hdel(`user:${userId}`, 'pendingGameId');
  }

  public deleteActiveGame(userId: string) {
    return this.redisClient.hdel(`user:${userId}`, 'activeGameId');
  }
}

type UserData = {
  pendingGameId: string | null; // pending game
  activeGameId: string | null;
  username: string;
  socketId: string;
};
