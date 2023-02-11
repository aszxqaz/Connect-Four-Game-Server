import { DynamicModule } from '@nestjs/common';
export declare const RedisToken: unique symbol;
export declare const redisModule: Promise<DynamicModule>;
export declare const enum Json {
    GET = "JSON.GET",
    SET = "JSON.SET",
    DEL = "JSON.DEL"
}
