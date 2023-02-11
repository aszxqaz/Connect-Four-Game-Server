"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketIOAdapter = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const platform_socket_io_1 = require("@nestjs/platform-socket.io");
const passport = require("passport");
const options_1 = require("./options");
const session_provider_1 = require("../session/session.provider");
class SocketIOAdapter extends platform_socket_io_1.IoAdapter {
    constructor(app) {
        super(app);
        this.app = app;
        this.logger = new common_1.Logger(SocketIOAdapter.name);
    }
    createIOServer(port, options) {
        const configService = this.app.get(config_1.ConfigService);
        const session = this.app.get(session_provider_1.SessionToken);
        const server = super.createIOServer(port, (0, options_1.getServerOptions)(options, configService));
        server.use(wrap(session));
        server.use(wrap(passport.initialize()));
        server.use(wrap(passport.session()));
        this.logger.log('SocketIO server middlewares applied.');
        return server;
    }
}
exports.SocketIOAdapter = SocketIOAdapter;
const wrap = (middleware) => (socket, next) => middleware(socket.request, {}, next);
//# sourceMappingURL=index.js.map