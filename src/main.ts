import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import * as passport from 'passport';
import { AppModule } from './app.module';
import { getClientUrl } from './helpers';
import { SessionToken } from './session/session.provider';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const session = app.get(SessionToken);

  app.enableCors({
    origin: getClientUrl(configService),
    credentials: true,
  });

  app.use(cookieParser(configService.get('SESSION_COOKIE_SECRET')));
  app.use(session);
  app.use(passport.initialize());
  app.use(passport.session());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  await app.listen(process.env.PORT || 4000);
}
bootstrap();
