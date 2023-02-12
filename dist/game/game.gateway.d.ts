import { OnGatewayConnection } from '@nestjs/websockets';
import { SocketWithUser } from 'src/common/types';
import { GameService } from './game.service';
export declare class GameGateway implements OnGatewayConnection {
    private readonly gameService;
    private io;
    private logger;
    constructor(gameService: GameService);
    handleConnection(socket: SocketWithUser): void;
    handleMessage(socket: SocketWithUser, callback: Function): Promise<void>;
}
