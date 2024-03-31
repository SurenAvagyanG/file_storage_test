import { Controller, Get } from '@nestjs/common';
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
}
