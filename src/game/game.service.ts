import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { RedisToken } from 'src/redis/redis.module';
import { v4 } from 'uuid';
import { FindGameOpts } from './types';

@Injectable()
export class GameService {
  constructor(@Inject(RedisToken) private readonly redisClient: Redis) {}

  public async createPendingGame(userId: string) {
    const gameId = v4();
    console.log(gameId);
    await this.redisClient.set(
      this.getUserToGameKey(userId, 'pending'),
      gameId,
    );
    await this.redisClient.set(
      this.getGameToUserKey(gameId, 'pending'),
      userId,
    );
  }

  public async removeGame(gameId: string, state: 'pending' | 'active') {
    const gameKey = this.getGameToUserKey(gameId, state);
    const userId = await this.redisClient.get(gameKey);
    const userKey = this.getUserToGameKey(userId, state);
    await this.redisClient.del(gameKey, gameKey, userKey);
  }

  public async findGameByUser(userId: string, state: 'pending' | 'active') {
    return this.redisClient.get(this.getUserToGameKey(userId, state));
  }

  public async findFirstPendingGame() {
    const games = await this.redisClient.keys(
      this.getGameToUserKey('*', 'pending'),
    );
    if (!games.length) return null;
    const gameId = games[0].replace(this.getGameToUserKey('', 'pending'), '');
    const userId = await this.redisClient.get(games[0]);
    return {
      gameId,
      userId,
    };
  }

  public async createActiveGame(
    gameId: string,
    userId1: string,
    userId2: string,
  ) {
    const board = new Array(42).fill(0);
    const results = await Promise.all([
      this.setUserToGame(userId1, gameId, 'active'),
      this.setUserToGame(userId2, gameId, 'active'),
      this.redisClient.rpush(this.getActiveGameStateKey(gameId), ...board),
    ]);
    return {
      userId1,
      userId2,
      gameId,
    };
  }

  private setGameToUser(
    gameId: string,
    userId: string,
    state: 'pending' | 'active',
  ) {
    this.redisClient.set(this.getGameToUserKey(gameId, state), userId);
  }

  private setUserToGame(
    userId: string,
    gameId: string,
    state: 'pending' | 'active',
  ) {
    this.redisClient.set(this.getUserToGameKey(userId, state), gameId);
  }

  private getGameToUserKey(gameId: string, state: 'pending' | 'active') {
    return `${state}:${gameId}`;
  }

  private getUserToGameKey(userId: string, state: 'pending' | 'active') {
    return `${state}:${userId}`;
  }

  private getActiveGameToUserKey(gameId: string) {
    return `act-game:${gameId}`;
  }

  private getActiveGameStateKey(gameId: string) {
    return `gamestate:${gameId}`;
  }
}
