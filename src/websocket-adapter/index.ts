import { INestApplication, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { IoAdapter } from '@nestjs/platform-socket.io'
import { NextFunction, Request, RequestHandler, Response } from 'express'
import * as passport from 'passport'
import { ServerOptions, Socket, Server } from 'socket.io'
import { getServerOptions } from './options'
import { SessionToken } from 'src/session/session.provider'

export class SocketIOAdapter extends IoAdapter {
  private logger = new Logger(SocketIOAdapter.name)
  constructor(
    private app: INestApplication,
  ) {
    super(app)
  }

  createIOServer(port: number, options: ServerOptions) {
    const configService = this.app.get(ConfigService)
    const session = this.app.get(SessionToken)
    
    const server: Server = super.createIOServer(port, getServerOptions(options, configService))

    server.use(wrap(session))
    server.use(wrap(passport.initialize()))
    server.use(wrap(passport.session()))

    this.logger.log('SocketIO server middlewares applied.')

    return server
  }
}

const wrap = (middleware: RequestHandler) => (socket: Socket, next: Function) =>
  middleware(socket.request as Request, {} as Response, next as NextFunction)
