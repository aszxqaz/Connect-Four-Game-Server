"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var RedisModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisModule = exports.RedisToken = void 0;
const common_1 = require("@nestjs/common");
const ioredis_1 = require("ioredis");
const config_1 = require("@nestjs/config");
exports.RedisToken = Symbol('Redis');
let RedisModule = RedisModule_1 = class RedisModule {
    static async registerAsync({ useFactory, imports, inject, }) {
        const logger = new common_1.Logger('RedisModule');
        const redisProvider = {
            provide: exports.RedisToken,
            useFactory: async (...args) => {
                const { connectionOptions, onClientReady } = await useFactory(...args);
                const client = new ioredis_1.default(connectionOptions);
                try {
                    await client.connect();
                    logger.log(`Connected to Redis on ${client.options.host}:${client.options.port}`);
                }
                catch (e) {
                    logger.error('Redis Client Error: ', e);
                }
                return client;
            },
            inject,
        };
        return {
            module: RedisModule_1,
            imports,
            providers: [redisProvider],
            exports: [redisProvider],
        };
    }
};
RedisModule = RedisModule_1 = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({})
], RedisModule);
exports.redisModule = RedisModule.registerAsync({
    imports: [config_1.ConfigModule],
    useFactory: async (configService) => {
        return {
            connectionOptions: {
                host: configService.get('REDISHOST'),
                port: configService.get('REDISPORT'),
                username: configService.get('REDISUSER'),
                password: configService.get('REDISPASSWORD'),
                lazyConnect: true,
            },
            onClientReady: (client) => {
            },
        };
    },
    inject: [config_1.ConfigService],
});
//# sourceMappingURL=redis.module.js.map