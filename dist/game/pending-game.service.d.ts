import Redis from 'ioredis';
export declare class PendingGameService {
    private readonly redisClient;
    constructor(redisClient: Redis);
    create(userId: string): Promise<{
        gameId: string;
    }>;
    pop(): Promise<{
        gameId: string;
        userId: string;
    }>;
}
