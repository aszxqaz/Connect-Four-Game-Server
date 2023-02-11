import {
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { SocketWithUser } from 'src/common/types';
import { GameService } from './game.service';
import { Messages } from './messages';

@WebSocketGateway()
export class GameGateway implements OnGatewayConnection {
  @WebSocketServer() private io!: Server;

  constructor(private readonly gameService: GameService) {}

  handleConnection(socket: SocketWithUser) {
    console.log(socket.request.user);
  }
  @SubscribeMessage(Messages.CREATE_GAME)
  handleMessage(socket: SocketWithUser, callback: Function) {
    this.gameService.createGame(socket.request.user.id).then((ok) => {
      socket.emit('gameCreated', { ok: true });
      console.log(callback);
      callback?.();
    });
  }
}
