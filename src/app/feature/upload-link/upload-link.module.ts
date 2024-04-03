import { Module } from '@nestjs/common';
import { UploadLinkService } from './upload-link.service';
import { DatabaseModule } from '@infrastructure/common';
import { UploadLinkEntity } from '@feature/upload-link/entity/upload-link.entity';
import { UploadLinkRepository } from '@feature/upload-link/entity/upload-link.repository';
import { StorageModule } from '@shared/storage';
import { UploadLinkConnection } from '@feature/upload-link/constants/tokens.const';
import { UploadLinkResolver } from '@feature/upload-link/upload-link.resolver';

@Module({
  imports: [DatabaseModule.forFeature([UploadLinkEntity]), StorageModule],
  providers: [
    UploadLinkService,
    UploadLinkResolver,
    {
      provide: UploadLinkConnection,
      useClass: UploadLinkRepository,
    },
  ],
  exports: [UploadLinkService],
})
export class UploadLinkModule {}
