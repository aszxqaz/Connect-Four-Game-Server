import Redis from 'ioredis';
export declare class UserService {
    private readonly redisClient;
    constructor(redisClient: Redis);
    setUserData(userId: string, data: Pick<UserData, 'socketId' | 'username'>): Promise<number>;
    setPendingGame(userId: string, gameId: string): Promise<number>;
    setActiveGame(userId: string, gameId: string): Promise<number>;
    getUserData(userId: string): Promise<UserData>;
    getUsername(userId: string): Promise<string>;
    getActiveGame(userId: string): Promise<string>;
    deletePendingGame(userId: string): Promise<number>;
    deleteActiveGame(userId: string): Promise<number>;
}
type UserData = {
    pendingGameId: string | null;
    activeGameId: string | null;
    username: string;
    socketId: string;
};
export {};
