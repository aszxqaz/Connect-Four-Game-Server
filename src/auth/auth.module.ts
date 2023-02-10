import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { SessionSerializer } from './session.serializer';
import { LocalStrategy } from './local.strategy';

@Module({
  providers: [SessionSerializer, LocalStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
