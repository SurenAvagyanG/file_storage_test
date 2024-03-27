import { Module } from '@nestjs/common';
import { UploadProcessService } from './upload-process.service';
import { UploadProcessController } from './upload-process.controller';
import { DatabaseModule } from '@shared/database';
import { UploadProcessEntity } from '@feature/upload-process/entities/upload-process.entity';
import { UploadProcessRepository } from '@feature/upload-process/entities/upload-process.repository';
import { StorageModule } from '@shared/storage';

export const UploadProcessConnection = 'UploadProcessConnection';

@Module({
  imports: [DatabaseModule.forFeature([UploadProcessEntity]), StorageModule],
  controllers: [UploadProcessController],
  providers: [
    UploadProcessService,
    {
      provide: UploadProcessConnection,
      useClass: UploadProcessRepository,
    },
  ],
  exports: [UploadProcessService],
})
export class UploadProcessModule {}
