import { registerAs } from '@nestjs/config';
import * as packageJson from '../../package.json';

export const appConfig = registerAs('app', () => ({
  service_name: process.env.APP_SERVICE_NAME ?? 'file-storage',
  port: process.env.APP_PORT ? Number(process.env.APP_PORT) : 3030,
  host: process.env.APP_HOST ?? '0.0.0.0',
  version: process.env.npm_package_version ?? packageJson.version,
  environment: process.env.APP_ENVIRONMENT ?? 'LOCAL',
}));
