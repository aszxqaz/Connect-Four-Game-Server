"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var GameGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const game_service_1 = require("./game.service");
const messages_1 = require("./messages");
const common_1 = require("@nestjs/common");
const BoardLogic_1 = require("./BoardLogic");
const user_service_1 = require("./user.service");
const pending_game_service_1 = require("./pending-game.service");
let GameGateway = GameGateway_1 = class GameGateway {
    constructor(gameService, pendingService, userService) {
        this.gameService = gameService;
        this.pendingService = pendingService;
        this.userService = userService;
        this.logger = new common_1.Logger(GameGateway_1.name);
    }
    async handleConnection(socket) {
        const user = socket.request.user;
        if (user) {
            this.logger.log(`Socket [userId: ${user.id}; username: ${user.username}] connected.`);
            socket.join(user.id);
            const result = await this.userService.setUserData(user.id, {
                socketId: socket.id,
                username: user.username,
            });
            this.logger.log(`Tried to save user data in Redis. Result: ${result}.`);
        }
        else {
            this.logger.error(`Connected socket not recognized.`);
        }
        console.log(`User in Socket: ${socket.request.user}`);
    }
    async createGame(socket, callback) {
        const heroId = socket.request.user.id;
        const heroUsername = socket.request.user.username;
        this.logger.log(`Message "CREATE_GAME" received from socket [userId:${heroId}; username: ${heroUsername}].`);
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
            const game = BoardLogic_1.GameLogic.from(gameState.board, gameState);
            this.sendGameToPlayers(game);
        }
        else {
            this.logger.log(`Creating pending game`);
            const { gameId } = await this.pendingService.create(heroId);
            await this.userService.setPendingGame(heroId, gameId);
            socket.emit('gameCreated', { ok: true });
            console.log(callback);
            callback === null || callback === void 0 ? void 0 : callback();
        }
    }
    async action(socket, position) {
        const heroId = socket.request.user.id;
        const gameId = await this.userService.getActiveGame(heroId);
        const gameState = await this.gameService.getGameState(gameId);
        const newGameState = BoardLogic_1.GameLogic.from(gameState.board, gameState).takeAction(position, heroId);
        if ('error' in newGameState) {
            return { error: newGameState.error };
        }
        await this.gameService.applyChanges(gameId, newGameState);
        this.sendGameToPlayers(newGameState);
    }
    sendGameToPlayers(game) {
        const { userId1, userId2 } = game.state;
        this.io.to(userId1).emit('gameState', game.transformTo(userId1));
        this.io.to(userId2).emit('gameState', game.transformTo(userId2));
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], GameGateway.prototype, "io", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)(messages_1.Messages.CREATE_GAME),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Function]),
    __metadata("design:returntype", Promise)
], GameGateway.prototype, "createGame", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(messages_1.Messages.ACTIVE_GAME_ACTION),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], GameGateway.prototype, "action", null);
GameGateway = GameGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)(),
    __metadata("design:paramtypes", [game_service_1.GameService,
        pending_game_service_1.PendingGameService,
        user_service_1.UserService])
], GameGateway);
exports.GameGateway = GameGateway;
//# sourceMappingURL=game.gateway.js.map