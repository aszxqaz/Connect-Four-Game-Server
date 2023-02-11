import { ConfigService } from '@nestjs/config';
import { ServerOptions } from 'socket.io';
export declare const getServerOptions: (defaultOptions: ServerOptions, configService: ConfigService) => ServerOptions;
