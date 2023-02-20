import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { RedisToken } from 'src/redis/redis.module';
import { GameLogic } from './BoardLogic';
import { ActiveGameState, CreateGameArgs } from './types';

@Injectable()
export class GameService {
  constructor(@Inject(RedisToken) private readonly redisClient: Redis) {}

  public async removeGame(gameId: string, state: 'pending' | 'active') {
    const gameKey = this.getGameToUserKey(gameId, state);
    const userId = await this.redisClient.get(gameKey);
    const userKey = this.getUserToGameKey(userId, state);
    await this.redisClient.del(gameKey, gameKey, userKey);
  }

  public async findGameByUser(userId: string, state: 'pending' | 'active') {
    return this.redisClient.get(this.getUserToGameKey(userId, state));
  }

  public async createActiveGame(data: CreateGameArgs) {
    const { gameId, userId1, userId2, username1, username2 } = data;
    const first = Math.random() < 0.5 ? userId1 : userId2;

    const results = await Promise.all([
      this.setInitialBoardToGame(gameId),
      this.setActiveGameState(data.gameId, {
        first,
        turn: first,
        userId1,
        userId2,
        username1,
        username2,
      }),
    ]);

    return {
      board: results[0].board,
      turn: first,
      first,
      userId1,
      userId2,
      username1,
      username2,
      gameId,
    };
  }

  public async getGameState(gameId: string) {
    const board = await this.getActiveGameBoard(gameId);
    const info = await this.getActiveGameInfo(gameId);
    return {
      board,
      ...info,
    };
  }

  private setGameToUser(
    gameId: string,
    userId: string,
    state: 'pending' | 'active',
  ) {
    this.redisClient.set(this.getGameToUserKey(gameId, state), userId);
  }

  private getPlayersByGame(gameId: string) {
    return this.redisClient.lrange(this.getKeyActiveGamePlayers(gameId), 0, -1);
  }

  private getActiveGameBoard(gameId: string) {
    return this.redisClient.lrange(this.getKeyActiveGameBoard(gameId), 0, -1);
  }

  private getGameTurn(gameId: string) {
    return this.redisClient.get(this.getKeyActiveGameTurn(gameId));
  }

  private setPlayersToGame(gameId: string, userId1: string, userdId2: string) {
    this.redisClient.rpush(
      this.getKeyActiveGamePlayers(gameId),
      userId1,
      userdId2,
    );
  }

  public applyChanges(gameId: string, game: GameLogic) {
    return Promise.all([
      this.redisClient.lset(
        `gameboard:${gameId}`,
        game.last,
        game.board[game.last],
      ),
      this.redisClient.hset(`gamestate:${gameId}`, 'turn', game.state.turn),
    ]);
  }

  private setInitialBoardToGame(gameId: string) {
    const board = new Array(42).fill('0');
    const result = this.redisClient.rpush(
      this.getKeyActiveGameBoard(gameId),
      ...board,
    );
    return {
      result,
      board,
    };
  }

  private getGameToUserKey(gameId: string, state: 'pending' | 'active') {
    return `${state}:${gameId}`;
  }

  private getUserToGameKey(userId: string, state: 'pending' | 'active') {
    return `${state}:${userId}`;
  }

  private setActiveGameState(gameId: string, state: ActiveGameState) {
    return this.redisClient.hset(this.getKeyActiveGameState(gameId), state);
  }

  private getActiveGameInfo(gameId: string) {
    return this.redisClient.hgetall(
      this.getKeyActiveGameState(gameId),
    ) as Promise<ActiveGameState>;
  }

  private getKeyActiveGamePlayers(gameId: string) {
    return `gameplayers:${gameId}`;
  }

  private getKeyActiveGameBoard(gameId: string) {
    return `gameboard:${gameId}`;
  }

  private getKeyActiveGameTurn(gameId: string) {
    return `gameturn:${gameId}`;
  }

  private getKeyActiveGameState(gameId: string) {
    return `gamestate:${gameId}`;
  }
}
