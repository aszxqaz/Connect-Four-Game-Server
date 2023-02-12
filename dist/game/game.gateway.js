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
let GameGateway = GameGateway_1 = class GameGateway {
    constructor(gameService) {
        this.gameService = gameService;
        this.logger = new common_1.Logger(GameGateway_1.name);
    }
    handleConnection(socket) {
        const user = socket.request.user;
        if (user) {
            socket.join(socket.request.user.id);
        }
        console.log(`User in Socket: ${socket.request.user}`);
    }
    async handleMessage(socket, callback) {
        this.logger.log(`Searching for pending game`);
        const pending = await this.gameService.findFirstPendingGame();
        this.logger.log(`Found: ${JSON.stringify(pending, null, 2)}`);
        if (pending) {
            this.logger.log(`Removing game`);
            await this.gameService.removeGame(pending.gameId, 'pending');
            this.logger.log(`Creating active game`);
            const gameState = await this.gameService.createActiveGame(pending.gameId, pending.userId, socket.request.user.id);
            this.logger.log(`Created: ${JSON.stringify(gameState, null, 2)}`);
            this.io.to([socket.request.user.id, pending.userId]).emit('gameState', Object.assign({}, gameState));
        }
        else {
            this.logger.log(`Creating pending game`);
            this.gameService.createPendingGame(socket.request.user.id).then((ok) => {
                socket.emit('gameCreated', { ok: true });
                console.log(callback);
                callback === null || callback === void 0 ? void 0 : callback();
            });
        }
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
], GameGateway.prototype, "handleMessage", null);
GameGateway = GameGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)(),
    __metadata("design:paramtypes", [game_service_1.GameService])
], GameGateway);
exports.GameGateway = GameGateway;
//# sourceMappingURL=game.gateway.js.map