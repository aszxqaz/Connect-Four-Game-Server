import { OnGatewayConnection } from '@nestjs/websockets';
import { SocketWithUser } from 'src/common/types';
import { GameService } from './game.service';
import { GameLogic } from './BoardLogic';
import { UserService } from './user.service';
import { PendingGameService } from './pending-game.service';
export declare class GameGateway implements OnGatewayConnection {
    private readonly gameService;
    private readonly pendingService;
    private readonly userService;
    private io;
    private logger;
    constructor(gameService: GameService, pendingService: PendingGameService, userService: UserService);
    handleConnection(socket: SocketWithUser): Promise<void>;
    createGame(socket: SocketWithUser, callback: Function): Promise<void>;
    action(socket: SocketWithUser, position: number): Promise<{
        error: string;
    }>;
    sendGameToPlayers(game: GameLogic): void;
}
