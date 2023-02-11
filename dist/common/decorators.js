"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DUser = void 0;
const common_1 = require("@nestjs/common");
exports.DUser = (0, common_1.createParamDecorator)((data, ctx) => {
    var _a;
    const request = ctx.switchToHttp().getRequest();
    const socket = ctx.switchToWs().getClient();
    if ((_a = socket.request) === null || _a === void 0 ? void 0 : _a.user)
        return socket.request.user;
    return request.user;
});
//# sourceMappingURL=decorators.js.map