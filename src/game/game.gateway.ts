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
import { Logger } from '@nestjs/common';

@WebSocketGateway()
export class GameGateway implements OnGatewayConnection {
  @WebSocketServer() private io!: Server;
  private logger = new Logger(GameGateway.name);

  constructor(private readonly gameService: GameService) {}

  handleConnection(socket: SocketWithUser) {
    const user = socket.request.user;
    if (user) {
      socket.join(socket.request.user.id)
    }
    console.log(`User in Socket: ${socket.request.user}`);
  }
  @SubscribeMessage(Messages.CREATE_GAME)
  async handleMessage(socket: SocketWithUser, callback: Function) {
    this.logger.log(`Searching for pending game`);
    const pending = await this.gameService.findFirstPendingGame();
    this.logger.log(`Found: ${JSON.stringify(pending, null, 2)}`);
    if (pending) {
      this.logger.log(`Removing game`);
      await this.gameService.removeGame(pending.gameId, 'pending');
      this.logger.log(`Creating active game`);
      const gameState = await this.gameService.createActiveGame(
        pending.gameId,
        pending.userId,
        socket.request.user.id,
      );
      this.logger.log(`Created: ${JSON.stringify(gameState, null, 2)}`);
      this.io.to([socket.request.user.id, pending.userId]).emit('gameState', {
        ...gameState,
      });
    } else {
      this.logger.log(`Creating pending game`);
      this.gameService.createPendingGame(socket.request.user.id).then((ok) => {
        socket.emit('gameCreated', { ok: true });
        console.log(callback);
        callback?.();
      });
    }
  }
}
