"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConfig = void 0;
const config_1 = require("@nestjs/config");
exports.dbConfig = (0, config_1.registerAs)('db', () => ({
    host: process.env.DB_HOST ?? 'localhost',
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
    database: process.env.DB_DATABASE ?? 'file_storage',
}));
//# sourceMappingURL=db.config.js.map