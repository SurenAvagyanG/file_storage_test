import { Test, TestingModule } from '@nestjs/testing';
import { MainController } from './main.controller';
import { MainService, HEALTH_MESSAGE } from './main.service';
import { ConfigModule } from '@nestjs/config';
import { appConfig } from '@config/app.config';
import { dbConfig } from '@config/db.config';
import { fileSystemConfig } from '@config/file-system.config';

describe('MainController', () => {
  let appController: MainController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MainController],
      providers: [MainService],
      imports: [
        ConfigModule.forRoot({
          load: [appConfig, dbConfig, fileSystemConfig],
          isGlobal: true,
        }),
      ],
    }).compile();

    appController = app.get<MainController>(MainController);
  });

  describe('root', () => {
    it(`should return ${HEALTH_MESSAGE}`, () => {
      expect(appController.healthCheck()).toBe(HEALTH_MESSAGE);
    });
  });
});
