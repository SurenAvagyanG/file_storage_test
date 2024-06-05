import { Module } from '@nestjs/common';
import { AttachmentService } from './attachment.service';
import { AttachmentResolver } from './attachment.resolver';
import { AttachmentEntity } from '@feature/attachment/entities/attachment.entity';
import { AttachmentRepository } from '@feature/attachment/entities/attachment.repository';
import { StorageModule } from '@shared/storage';
import { UploadLinkModule } from '@feature/upload-link/upload-link.module';
import { FileModule } from '@feature/file/file.module';
import { AttachmentConnection } from '@feature/attachment/constants/tokens.const';
import {
  DatabaseModule,
  HttpModule,
  ImageManagerModule,
} from '@infrastructure/common';
import { AttachmentResizeService } from '@feature/attachment/attachment-resize.service';

@Module({
  imports: [
    DatabaseModule.forFeature([AttachmentEntity]),
    StorageModule,
    UploadLinkModule,
    FileModule,
    HttpModule,
    ImageManagerModule,
  ],
  providers: [
    AttachmentResolver,
    AttachmentService,
    AttachmentResizeService,
    {
      provide: AttachmentConnection,
      useClass: AttachmentRepository,
    },
  ],
  exports: [
    DatabaseModule,
    AttachmentResolver,
    AttachmentService,
    AttachmentConnection,
  ],
})
export class AttachmentModule {}
