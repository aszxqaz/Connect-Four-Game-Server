"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionProvider = exports.SessionToken = void 0;
const config_1 = require("@nestjs/config");
const session = require("express-session");
const redis_module_1 = require("../redis/redis.module");
const RedisStore = require("connect-redis");
exports.SessionToken = Symbol('Session');
exports.sessionProvider = {
    provide: exports.SessionToken,
    useFactory: (redis, configService) => {
        return session({
            store: new (RedisStore(session))({
                client: redis,
                logErrors: true,
            }),
            name: 'connect-four',
            secret: configService.get('SESSION_COOKIE_SECRET'),
            resave: false,
            saveUninitialized: false,
            cookie: {
                maxAge: 1000 * 60 * 60 * 24,
                httpOnly: true,
                sameSite: false,
            },
            rolling: true,
        });
    },
    inject: [redis_module_1.RedisToken, config_1.ConfigService],
};
//# sourceMappingURL=session.provider.js.map