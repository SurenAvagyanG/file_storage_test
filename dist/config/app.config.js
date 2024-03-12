"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appConfig = void 0;
const config_1 = require("@nestjs/config");
exports.appConfig = (0, config_1.registerAs)('app', () => ({
    port: process.env.APP_PORT ? Number(process.env.APP_PORT) : 3030,
    host: process.env.APP_HOST ?? '0.0.0.0',
    version: process.env.APP_VERSION,
    environment: process.env.APP_ENVIRONMENT ?? 'LOCAL',
}));
//# sourceMappingURL=app.config.js.map