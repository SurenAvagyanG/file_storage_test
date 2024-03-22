import { registerAs } from '@nestjs/config';

export const dbConfig = registerAs('db', () => ({
  driver: process.env.DB_DRIVER ?? 'postgres',
  postgres: {
    type: 'postgres',
    host: process.env.DB_HOST ?? 'localhost',
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
    password: process.env.DB_PASSWORD,
    username: process.env.DB_USERNAME,
    database: process.env.DB_DATABASE ?? 'file_storage',
    logging: Boolean(process.env.DB_LOGGING),
    synchronize: true,
    entities: [],
  },
}));
