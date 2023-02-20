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
import { GameLogic } from './BoardLogic';
import { UserService } from './user.service';
import { PendingGameService } from './pending-game.service';

@WebSocketGateway()
export class GameGateway implements OnGatewayConnection {
  @WebSocketServer() private io!: Server;
  private logger = new Logger(GameGateway.name);

  constructor(
    private readonly gameService: GameService,
    private readonly pendingService: PendingGameService,
    private readonly userService: UserService,
  ) {}

  async handleConnection(socket: SocketWithUser) {
    const user = socket.request.user;
    if (user) {
      this.logger.log(
        `Socket [userId: ${user.id}; username: ${user.username}] connected.`,
      );
      socket.join(user.id);
      const result = await this.userService.setUserData(user.id, {
        socketId: socket.id,
        username: user.username,
      });
      this.logger.log(`Tried to save user data in Redis. Result: ${result}.`);
    } else {
      this.logger.error(`Connected socket not recognized.`);
    }
    console.log(`User in Socket: ${socket.request.user}`);
  }

  @SubscribeMessage(Messages.CREATE_GAME)
  async createGame(socket: SocketWithUser, callback: Function) {
    const heroId = socket.request.user.id;
    const heroUsername = socket.request.user.username;
    this.logger.log(
      `Message "CREATE_GAME" received from socket [userId:${heroId}; username: ${heroUsername}].`,
    );

    this.logger.log(`Searching for pending game`);
    const pendingGame = await this.pendingService.pop();
    this.logger.log(`Found: ${JSON.stringify(pendingGame, null, 2)}`);

    if (pendingGame) {
      const { gameId, userId } = pendingGame;

      const username1 = await this.userService.getUsername(pendingGame.userId);

      const gameState = await this.gameService.createActiveGame({
        gameId: gameId,
        userId1: userId,
        userId2: heroId,
        username1,
        username2: heroUsername,
      });

      await Promise.all([
        this.userService.deletePendingGame(userId),
        this.userService.setActiveGame(userId, gameId),
        this.userService.setActiveGame(heroId, gameId),
      ]);

      this.logger.log(`Created: ${JSON.stringify(gameState, null, 2)}`);
      const game = GameLogic.from(gameState.board, gameState);
      this.sendGameToPlayers(game);
    } else {
      this.logger.log(`Creating pending game`);
      const { gameId } = await this.pendingService.create(heroId);
      await this.userService.setPendingGame(heroId, gameId);

      socket.emit('gameCreated', { ok: true });
      console.log(callback);
      callback?.();
    }
  }

  @SubscribeMessage(Messages.ACTIVE_GAME_ACTION)
  async action(socket: SocketWithUser, position: number) {
    const heroId = socket.request.user.id;
    const gameId = await this.userService.getActiveGame(heroId)
    const gameState = await this.gameService.getGameState(gameId);

    const newGameState = GameLogic.from(gameState.board, gameState).takeAction(
      position,
      heroId,
    );
    if ('error' in newGameState) {
      return { error: newGameState.error };
    }

    await this.gameService.applyChanges(gameId, newGameState)

    this.sendGameToPlayers(newGameState);
  }

  sendGameToPlayers(game: GameLogic) {
    const { userId1, userId2 } = game.state;
    this.io.to(userId1).emit('gameState', game.transformTo(userId1));
    this.io.to(userId2).emit('gameState', game.transformTo(userId2));
  }
}
