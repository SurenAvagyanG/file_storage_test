import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import * as multer from 'multer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StorageService } from './storage.service';

@Module({
  imports: [
    MulterModule.register({
      storage: multer.memoryStorage(),
    }),
    ConfigModule,
  ],
  providers: [
    {
      provide: StorageService,
      useFactory: (configService: ConfigService): StorageService =>
        new StorageService(configService.getOrThrow('fileSystem.driver')),
      inject: [ConfigService],
    },
  ],
  exports: [StorageService],
})
export class StorageModule {}
