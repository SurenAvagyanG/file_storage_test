import { Module } from '@nestjs/common';
import { AttachmentService } from './attachment.service';
import { AttachmentResolver } from './attachment.resolver';
import { AttachmentEntity } from '@feature/attachment/entities/attachment.entity';
import { AttachmentRepository } from '@feature/attachment/entities/attachment.repository';
import { StorageModule } from '@shared/storage';
import { UploadLinkModule } from '@feature/upload-link/upload-link.module';
import { FileModule } from '@feature/file/file.module';
import { AttachmentConnection } from '@feature/attachment/constants/tokens.const';
import { DatabaseModule } from 'expiaa-common';
import { AttachmentResizeService } from '@feature/attachment/attachment-resize.service';
import { ImageResizerModule } from '@feature/image-resizer';

@Module({
  imports: [
    DatabaseModule.forFeature([AttachmentEntity]),
    StorageModule,
    UploadLinkModule,
    FileModule,
    ImageResizerModule,
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
