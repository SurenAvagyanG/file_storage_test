import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { DatabaseModule } from '@shared/database';
import { StorageModule } from '@shared/storage';
import { FileEntity } from '@feature/file/entities/file.entity';
import { FileRepository } from '@feature/file/entities/file.repository';
import { FileConnection } from '@feature/file/constants/tokens.const';

@Module({
  imports: [DatabaseModule.forFeature([FileEntity]), StorageModule],
  providers: [
    FileService,
    {
      provide: FileConnection,
      useClass: FileRepository,
    },
  ],
  exports: [FileService],
})
export class FileModule {}
