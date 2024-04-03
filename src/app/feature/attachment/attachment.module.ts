import { Module } from '@nestjs/common';
import { AttachmentService } from './attachment.service';
import { AttachmentResolver } from './attachment.resolver';
import { AttachmentEntity } from '@feature/attachment/entities/attachment.entity';
import { AttachmentRepository } from '@feature/attachment/entities/attachment.repository';
import { DatabaseModule } from '@shared/database';
import { StorageModule } from '@shared/storage';
import { UploadLinkModule } from '@feature/upload-link/upload-link.module';
import { FileModule } from '@feature/file/file.module';
import { AttachmentConnection } from '@feature/attachment/constants/tokens.const';

@Module({
  imports: [
    DatabaseModule.forFeature([AttachmentEntity]),
    StorageModule,
    UploadLinkModule,
    FileModule,
  ],
  providers: [
    AttachmentResolver,
    AttachmentService,
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
