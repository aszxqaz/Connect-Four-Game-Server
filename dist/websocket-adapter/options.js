"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServerOptions = void 0;
const helpers_1 = require("../helpers");
const getServerOptions = (defaultOptions, configService) => (Object.assign(Object.assign({}, defaultOptions), { cors: {
        origin: (0, helpers_1.getClientUrl)(configService),
        credentials: true,
    }, pingInterval: 1000 }));
exports.getServerOptions = getServerOptions;
//# sourceMappingURL=options.js.map