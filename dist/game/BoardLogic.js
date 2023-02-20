"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameLogic = void 0;
class GameLogic {
    static from(board, state) {
        return new GameLogic(board, state);
    }
    constructor(board, state) {
        this.board = board;
        this.state = state;
        this.last = null;
        this.winner = null;
    }
    takeAction(position, heroId) {
        if (position > 6)
            return { error: 'Wrong position' };
        if (heroId !== this.state.turn)
            return { error: 'Wrong turn' };
        const endIndex = position + 35;
        const isFirst = heroId === this.state.first;
        for (let i = endIndex; i >= 0; i -= 7) {
            if (this.board[i] === '0') {
                this.board[i] = isFirst ? '1' : '-1';
                this.last = i;
                const indeces = this.checkWin(i);
                if (indeces) {
                    this.winner = {
                        indeces,
                        userId: heroId
                    };
                    return this;
                }
                this.nextTurn();
                return this;
            }
        }
        return {
            error: 'No space',
        };
    }
    nextTurn() {
        const { userId1, userId2, turn } = this.state;
        this.state.turn = turn === userId1 ? userId2 : userId1;
    }
    checkWin(index) {
        const COLS = 7;
        const matrix = [
            [-COLS - 1, COLS + 1],
            [-1, 1],
            [-COLS, COLS],
        ];
        for (const directions of matrix) {
            const resarr = [index];
            for (const offset of directions) {
                let i = index;
                while ((i += offset) in this.board &&
                    this.board[i] === this.board[index])
                    resarr.push(i);
                if (resarr.length == 4)
                    return resarr.sort((a, b) => a - b);
            }
        }
        return null;
    }
    transformTo(userId) {
        const { username1, username2, userId1, userId2 } = this.state;
        const heroUsername = userId === userId1 ? username1 : username2;
        return {
            board: this.board,
            hero: {
                username: heroUsername,
                points: 0,
            },
            opponent: {
                username: heroUsername === username1 ? username2 : username1,
                points: 0,
            },
            isTurn: this.state.turn === userId,
            isFirst: this.state.first === userId,
            last: this.last,
            winner: this.winner
        };
    }
}
exports.GameLogic = GameLogic;
//# sourceMappingURL=BoardLogic.js.map