import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';
import { UserService } from './user.service';
import { PendingGameService } from './pending-game.service';

@Module({
  providers: [GameGateway, GameService, UserService, PendingGameService],
})
export class GameModule {}
