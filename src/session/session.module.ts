import { Module } from '@nestjs/common';
import { sessionProvider } from './session.provider';

@Module({ providers: [sessionProvider], exports: [sessionProvider] })
export class SessionModule {}
