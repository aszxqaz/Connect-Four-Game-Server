import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { redisModule } from './redis/redis.module';
import { SessionModule } from './session/session.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    redisModule,
    SessionModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
