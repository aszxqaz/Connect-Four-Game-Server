import { ConfigService } from '@nestjs/config';
import { ServerOptions, Socket, Server } from 'socket.io';
import { getClientUrl } from 'src/helpers';

export const getServerOptions = (
  defaultOptions: ServerOptions,
  configService: ConfigService,
): ServerOptions => ({
  ...defaultOptions,
  cors: {
    origin: getClientUrl(configService),
    credentials: true,
  },
  pingInterval: 1000,
});
