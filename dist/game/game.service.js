"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameService = void 0;
const common_1 = require("@nestjs/common");
const ioredis_1 = require("ioredis");
const redis_module_1 = require("../redis/redis.module");
const uuid_1 = require("uuid");
let GameService = class GameService {
    constructor(redisClient) {
        this.redisClient = redisClient;
    }
    async createPendingGame(userId) {
        const gameId = (0, uuid_1.v4)();
        console.log(gameId);
        await this.redisClient.set(this.getUserToGameKey(userId, 'pending'), gameId);
        await this.redisClient.set(this.getGameToUserKey(gameId, 'pending'), userId);
    }
    async removeGame(gameId, state) {
        const gameKey = this.getGameToUserKey(gameId, state);
        const userId = await this.redisClient.get(gameKey);
        const userKey = this.getUserToGameKey(userId, state);
        await this.redisClient.del(gameKey, gameKey, userKey);
    }
    async findGameByUser(userId, state) {
        return this.redisClient.get(this.getUserToGameKey(userId, state));
    }
    async findFirstPendingGame() {
        const games = await this.redisClient.keys(this.getGameToUserKey('*', 'pending'));
        if (!games.length)
            return null;
        const gameId = games[0].replace(this.getGameToUserKey('', 'pending'), '');
        const userId = await this.redisClient.get(games[0]);
        return {
            gameId,
            userId,
        };
    }
    async createActiveGame(gameId, userId1, userId2) {
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
    setGameToUser(gameId, userId, state) {
        this.redisClient.set(this.getGameToUserKey(gameId, state), userId);
    }
    setUserToGame(userId, gameId, state) {
        this.redisClient.set(this.getUserToGameKey(userId, state), gameId);
    }
    getGameToUserKey(gameId, state) {
        return `${state}:${gameId}`;
    }
    getUserToGameKey(userId, state) {
        return `${state}:${userId}`;
    }
    getActiveGameToUserKey(gameId) {
        return `act-game:${gameId}`;
    }
    getActiveGameStateKey(gameId) {
        return `gamestate:${gameId}`;
    }
};
GameService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(redis_module_1.RedisToken)),
    __metadata("design:paramtypes", [ioredis_1.Redis])
], GameService);
exports.GameService = GameService;
//# sourceMappingURL=game.service.js.map