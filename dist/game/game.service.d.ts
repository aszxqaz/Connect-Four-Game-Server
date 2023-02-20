import { Redis } from 'ioredis';
import { GameLogic } from './BoardLogic';
import { CreateGameArgs } from './types';
export declare class GameService {
    private readonly redisClient;
    constructor(redisClient: Redis);
    removeGame(gameId: string, state: 'pending' | 'active'): Promise<void>;
    findGameByUser(userId: string, state: 'pending' | 'active'): Promise<string>;
    createActiveGame(data: CreateGameArgs): Promise<{
        board: any[];
        turn: string;
        first: string;
        userId1: string;
        userId2: string;
        username1: string;
        username2: string;
        gameId: string;
    }>;
    getGameState(gameId: string): Promise<{
        userId1: string;
        username1: string;
        userId2: string;
        username2: string;
        turn: string;
        first: string;
        board: string[];
    }>;
    private setGameToUser;
    private getPlayersByGame;
    private getActiveGameBoard;
    private getGameTurn;
    private setPlayersToGame;
    applyChanges(gameId: string, game: GameLogic): Promise<["OK", number]>;
    private setInitialBoardToGame;
    private getGameToUserKey;
    private getUserToGameKey;
    private setActiveGameState;
    private getActiveGameInfo;
    private getKeyActiveGamePlayers;
    private getKeyActiveGameBoard;
    private getKeyActiveGameTurn;
    private getKeyActiveGameState;
}
