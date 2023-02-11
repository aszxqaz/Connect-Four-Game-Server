"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionSerializer = void 0;
const passport_1 = require("@nestjs/passport");
class SessionSerializer extends passport_1.PassportSerializer {
    constructor() {
        super();
    }
    serializeUser(user, done) {
        done(null, user);
    }
    deserializeUser(user, done) {
        if (user) {
            return done(null, user);
        }
        done(null, null);
    }
}
exports.SessionSerializer = SessionSerializer;
//# sourceMappingURL=session.serializer.js.map