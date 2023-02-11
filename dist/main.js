"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const app_module_1 = require("./app.module");
const helpers_1 = require("./helpers");
const session_provider_1 = require("./session/session.provider");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    const session = app.get(session_provider_1.SessionToken);
    app.enableCors({
        origin: (0, helpers_1.getClientUrl)(configService),
        credentials: true,
    });
    app.use(cookieParser(configService.get('SESSION_COOKIE_SECRET')));
    app.use(session);
    app.use(passport.initialize());
    app.use(passport.session());
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
    }));
    await app.listen(process.env.PORT || 4000);
}
bootstrap();
//# sourceMappingURL=main.js.map