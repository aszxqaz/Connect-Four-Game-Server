import { ActiveGameState, GameplayResponse } from './types';
export declare class GameLogic {
    board: string[];
    state: ActiveGameState;
    last: number | null;
    winner: {
        userId: string;
        indeces: number[];
    } | null;
    static from(board: string[], state: ActiveGameState): GameLogic;
    constructor(board: string[], state: ActiveGameState);
    takeAction(position: number, heroId: string): this | {
        error: string;
    };
    private nextTurn;
    private checkWin;
    transformTo(userId: string): GameplayResponse;
}
