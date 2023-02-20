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
exports.PendingGameService = void 0;
const common_1 = require("@nestjs/common");
const ioredis_1 = require("ioredis");
const redis_module_1 = require("../redis/redis.module");
const uuid_1 = require("uuid");
let PendingGameService = class PendingGameService {
    constructor(redisClient) {
        this.redisClient = redisClient;
    }
    async create(userId) {
        const gameId = (0, uuid_1.v4)();
        await this.redisClient.rpush(`pg-queue`, gameId);
        await this.redisClient.set(`pending-game:${gameId}`, userId);
        return {
            gameId,
        };
    }
    async pop() {
        const gameId = await this.redisClient.lpop(`pg-queue`);
        if (!gameId)
            return null;
        const userId = await this.redisClient.get(`pending-game:${gameId}`);
        await this.redisClient.del(`pending-game:${gameId}`);
        return {
            gameId,
            userId,
        };
    }
};
PendingGameService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(redis_module_1.RedisToken)),
    __metadata("design:paramtypes", [ioredis_1.default])
], PendingGameService);
exports.PendingGameService = PendingGameService;
//# sourceMappingURL=pending-game.service.js.map