import { registerAs } from '@nestjs/config';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJson = require('../../package.json');

// Get the version from package.json
const version = packageJson.version;
export const appConfig = registerAs('app', () => ({
  port: process.env.APP_PORT ? Number(process.env.APP_PORT) : 3030,
  host: process.env.APP_HOST ?? '0.0.0.0',
  version: version,
  environment: process.env.APP_ENVIRONMENT ?? 'LOCAL',
  global_prefix: 'file-storage',
}));
