import { Redis } from 'ioredis';
export declare class GameService {
    private readonly redisClient;
    constructor(redisClient: Redis);
    createPendingGame(userId: string): Promise<void>;
    removeGame(gameId: string, state: 'pending' | 'active'): Promise<void>;
    findGameByUser(userId: string, state: 'pending' | 'active'): Promise<string>;
    findFirstPendingGame(): Promise<{
        gameId: string;
        userId: string;
    }>;
    createActiveGame(gameId: string, userId1: string, userId2: string): Promise<{
        userId1: string;
        userId2: string;
        gameId: string;
    }>;
    private setGameToUser;
    private setUserToGame;
    private getGameToUserKey;
    private getUserToGameKey;
    private getActiveGameToUserKey;
    private getActiveGameStateKey;
}
