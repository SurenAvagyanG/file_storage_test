import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export const HEALTH_MESSAGE = 'OK!';

@Injectable()
export class MainService {
  private readonly version: string;

  constructor(configService: ConfigService) {
    this.version = configService.get('app.version');
  }

  getHealthMessage(): string {
    return HEALTH_MESSAGE;
  }

  getVersion(): string {
    return this.version;
  }
}
