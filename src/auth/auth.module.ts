import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { SessionSerializer } from './session.serializer';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule.register({
      session: true,
    }),
  ],
  providers: [SessionSerializer, LocalStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
