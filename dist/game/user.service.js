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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const ioredis_1 = require("ioredis");
const redis_module_1 = require("../redis/redis.module");
let UserService = class UserService {
    constructor(redisClient) {
        this.redisClient = redisClient;
    }
    setUserData(userId, data) {
        return this.redisClient.hset(`user:${userId}`, data);
    }
    setPendingGame(userId, gameId) {
        return this.redisClient.hset(`user:${userId}`, 'pendingGameId', gameId);
    }
    setActiveGame(userId, gameId) {
        return this.redisClient.hset(`user:${userId}`, 'activeGameId', gameId);
    }
    getUserData(userId) {
        return this.redisClient.hgetall(`user:${userId}`);
    }
    getUsername(userId) {
        return this.redisClient.hget(`user:${userId}`, 'username');
    }
    getActiveGame(userId) {
        return this.redisClient.hget(`user:${userId}`, 'activeGameId');
    }
    deletePendingGame(userId) {
        return this.redisClient.hdel(`user:${userId}`, 'pendingGameId');
    }
    deleteActiveGame(userId) {
        return this.redisClient.hdel(`user:${userId}`, 'activeGameId');
    }
};
UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(redis_module_1.RedisToken)),
    __metadata("design:paramtypes", [ioredis_1.default])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map