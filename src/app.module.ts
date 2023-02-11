import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { redisModule } from './redis/redis.module';
import { SessionModule } from './session/session.module';
import { AppController } from './app.controller';
import { GameModule } from './game/game.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    redisModule,
    SessionModule,
    GameModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
