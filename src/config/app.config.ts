import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
  service_name: process.env.APP_SERVICE_NAME ?? 'file-storage',
  port: process.env.APP_PORT ? Number(process.env.APP_PORT) : 3030,
  host: process.env.APP_HOST ?? '0.0.0.0',
  version: '0.0.0.0',
  environment: process.env.APP_ENVIRONMENT ?? 'LOCAL',
}));
