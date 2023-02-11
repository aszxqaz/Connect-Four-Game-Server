import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { RequestWithUser, SocketWithUser } from './types';

export const DUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    const socket = ctx.switchToWs().getClient<SocketWithUser>();
    if (socket.request?.user) return socket.request.user;
    return request.user;
  },
);
