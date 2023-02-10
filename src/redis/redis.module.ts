import { Module, DynamicModule, Logger, ModuleMetadata, FactoryProvider, Global } from '@nestjs/common'
import IORedis, { Redis, RedisOptions } from 'ioredis'
import { ConfigModule, ConfigService } from '@nestjs/config'

export const REDIS = Symbol('REDIS')

@Global()
@Module({})
class RedisModule {
  static async registerAsync({ useFactory, imports, inject }: RedisAsyncModuleOptions): Promise<DynamicModule> {
    const redisProvider = {
      provide: REDIS,
      useFactory: async (...args: any[]) => {
        const { connectionOptions, onClientReady } = await useFactory(...args)
        const client = new IORedis(connectionOptions)
        onClientReady?.(client)
        return client
      },
      inject,
    }

    return {
      module: RedisModule,
      imports,
      providers: [redisProvider],
      exports: [redisProvider],
    }
  }
}

export const redisModule = RedisModule.registerAsync({
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => {
    const logger = new Logger('RedisModule')
    return {
      connectionOptions: {
        host: configService.get('REDISHOST'),
        port: configService.get('REDISPORT'),
        username: configService.get('REDISUSER'),
        password: configService.get('REDISPASSWORD'),
      },
      onClientReady: (client) => {
        client.on('error', (err) => {
          logger.error('Redis Client Error: ', err)
        })
        client.on('connect', async () => {
          logger.log(`Connected to Redis on ${client.options.host}:${client.options.port}`)
          // await client.flushdb()
          // await client.call('JSON.SET', GAMES_CREATED_KEY, '$', "{}")
          // logger.log(`Cleared database`)
        })
      },
    }
  },
  inject: [ConfigService],
})


type RedisModuleOptions = {
  connectionOptions: RedisOptions,
  onClientReady?: (client: Redis) => void
}

type RedisAsyncModuleOptions = {
  useFactory: (...args: any[]) => Promise<RedisModuleOptions> | RedisModuleOptions
} & Pick<ModuleMetadata, 'imports'> & Pick<FactoryProvider, 'inject'>

export const enum Json {
  GET = 'JSON.GET',
  SET = 'JSON.SET',
  DEL = 'JSON.DEL'
}