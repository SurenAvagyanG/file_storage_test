import { Controller, Get, Logger } from '@nestjs/common';
import { MainService } from './main.service';

@Controller()
export class MainController {
  constructor(private readonly appService: MainService) {}

  @Get('health')
  healthCheck(): string {
    return this.appService.getHealthMessage();
  }

  @Get('version')
  version(): string {
    return this.appService.getVersion();
  }

  @Get('test')
  test(): string {
    Logger.log('This is test logger');
    return 'Test is Ok';
  }
}
