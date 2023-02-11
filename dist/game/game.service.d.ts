import { Redis } from 'ioredis';
export declare class GameService {
    private readonly redisClient;
    constructor(redisClient: Redis);
    createGame(userId: string): Promise<void>;
    private getPendingGameKey;
    private getPendingUserKey;
}
