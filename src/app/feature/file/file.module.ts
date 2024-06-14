import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { StorageModule } from '@shared/storage';
import { FileEntity } from '@feature/file/entities/file.entity';
import { FileRepository } from '@feature/file/entities/file.repository';
import { FileConnection } from '@feature/file/constants/tokens.const';
import { FileResolver } from '@feature/file/file.resolver';
import { DatabaseModule } from '@fifth/expia-common';

@Module({
  imports: [DatabaseModule.forFeature([FileEntity]), StorageModule],
  providers: [
    FileService,
    FileResolver,
    {
      provide: FileConnection,
      useClass: FileRepository,
    },
  ],
  exports: [FileService, FileResolver],
})
export class FileModule {}
