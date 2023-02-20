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
let GameService = class GameService {
    constructor(redisClient) {
        this.redisClient = redisClient;
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
    async createActiveGame(data) {
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
    async getGameState(gameId) {
        const board = await this.getActiveGameBoard(gameId);
        const info = await this.getActiveGameInfo(gameId);
        return Object.assign({ board }, info);
    }
    setGameToUser(gameId, userId, state) {
        this.redisClient.set(this.getGameToUserKey(gameId, state), userId);
    }
    getPlayersByGame(gameId) {
        return this.redisClient.lrange(this.getKeyActiveGamePlayers(gameId), 0, -1);
    }
    getActiveGameBoard(gameId) {
        return this.redisClient.lrange(this.getKeyActiveGameBoard(gameId), 0, -1);
    }
    getGameTurn(gameId) {
        return this.redisClient.get(this.getKeyActiveGameTurn(gameId));
    }
    setPlayersToGame(gameId, userId1, userdId2) {
        this.redisClient.rpush(this.getKeyActiveGamePlayers(gameId), userId1, userdId2);
    }
    applyChanges(gameId, game) {
        return Promise.all([
            this.redisClient.lset(`gameboard:${gameId}`, game.last, game.board[game.last]),
            this.redisClient.hset(`gamestate:${gameId}`, 'turn', game.state.turn),
        ]);
    }
    setInitialBoardToGame(gameId) {
        const board = new Array(42).fill('0');
        const result = this.redisClient.rpush(this.getKeyActiveGameBoard(gameId), ...board);
        return {
            result,
            board,
        };
    }
    getGameToUserKey(gameId, state) {
        return `${state}:${gameId}`;
    }
    getUserToGameKey(userId, state) {
        return `${state}:${userId}`;
    }
    setActiveGameState(gameId, state) {
        return this.redisClient.hset(this.getKeyActiveGameState(gameId), state);
    }
    getActiveGameInfo(gameId) {
        return this.redisClient.hgetall(this.getKeyActiveGameState(gameId));
    }
    getKeyActiveGamePlayers(gameId) {
        return `gameplayers:${gameId}`;
    }
    getKeyActiveGameBoard(gameId) {
        return `gameboard:${gameId}`;
    }
    getKeyActiveGameTurn(gameId) {
        return `gameturn:${gameId}`;
    }
    getKeyActiveGameState(gameId) {
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