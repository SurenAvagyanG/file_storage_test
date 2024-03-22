import { Test, TestingModule } from '@nestjs/testing';
import { MainController } from './main.controller';
import { MainService, HEALTH_MESSAGE } from './main.service';
import { ConfigModule } from '@nestjs/config';

describe('MainController', () => {
  let appController: MainController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MainController],
      providers: [MainService],
      imports: [ConfigModule],
    }).compile();

    appController = app.get<MainController>(MainController);
  });

  describe('root', () => {
    it(`should return ${HEALTH_MESSAGE}`, () => {
      expect(appController.healthCheck()).toBe(HEALTH_MESSAGE);
    });
  });
});
