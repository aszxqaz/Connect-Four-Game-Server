import { GameLogic } from "./BoardLogic";

export type FindGameOpts =
  | {
      userId: string;
    }
  | {
      gameId: string;
    };

export type ActiveGameState = {
  userId1: string;
  username1: string;
  userId2: string;
  username2: string;
  turn: string;
  first: string;
};

export type CreateGameArgs = {
  gameId: string;
  userId1: string;
  username1: string;
  userId2: string;
  username2: string;
};

export type PlayerInfo = {
  points?: number;
  username: string;
};

export type GameplayResponse = {
  board: string[];
  hero: PlayerInfo;
  opponent: PlayerInfo;
  isTurn: boolean;
  isFirst: boolean;
  last?: number;
  winner?: GameLogic['winner']
};
