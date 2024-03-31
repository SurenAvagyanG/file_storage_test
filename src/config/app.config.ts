import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
  port: process.env.APP_PORT ? Number(process.env.APP_PORT) : 3030,
  host: process.env.APP_HOST ?? '0.0.0.0',
  version: process.env.APP_VERSION,
  environment: process.env.APP_ENVIRONMENT ?? 'LOCAL',
  global_prefix: 'file_prefix',
}));
