import { Environment } from '../constants';

export const isLocalMode = (): boolean => {
  return process.env.APP_ENVIRONMENT === Environment.LOCAL;
};

export const isProdMode = (): boolean => {
  return process.env.APP_ENVIRONMENT === Environment.PROD;
};
