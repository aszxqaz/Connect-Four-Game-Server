import { Provider } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Redis from "ioredis";
import * as session from 'express-session'
import { RedisToken } from "src/redis/redis.module";
import * as RedisStore from "connect-redis";

export const SessionToken = Symbol('Session');

export const sessionProvider: Provider = {
    provide: SessionToken,
    useFactory: (redis: Redis, configService: ConfigService) => {
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
    inject: [RedisToken, ConfigService],
  };
  