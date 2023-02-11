"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClientUrl = void 0;
const getClientUrl = (configService) => {
    const clientUrl = configService.get('NODE_ENV') === 'production'
        ? configService.get('CLIENT_URL_PROD')
        : configService.get('CLIENT_URL_DEV');
    return clientUrl;
};
exports.getClientUrl = getClientUrl;
//# sourceMappingURL=index.js.map