import { INestApplication } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions, Server } from 'socket.io';
export declare class SocketIOAdapter extends IoAdapter {
    private app;
    private logger;
    constructor(app: INestApplication);
    createIOServer(port: number, options: ServerOptions): Server<import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, any>;
}
