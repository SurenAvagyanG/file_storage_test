import { Module } from '@nestjs/common';
import { AttachmentService } from './attachment.service';
import { AttachmentResolver } from './attachment.resolver';
import { AttachmentEntity } from '@feature/attachment/entities/attachment.entity';
import { AttachmentController } from '@feature/attachment/attachment.controller';
import { AttachmentRepository } from '@feature/attachment/entities/attachment.repository';
import { DatabaseModule } from '@shared/database';
import { StorageModule } from '@shared/storage';
import { UploadProcessModule } from '@feature/upload-process/upload-process.module';
import { FileModule } from '@feature/file/file.module';
import { AttachmentConnection } from '@feature/attachment/constants/tokens.const';

@Module({
  imports: [
    DatabaseModule.forFeature([AttachmentEntity]),
    StorageModule,
    UploadProcessModule,
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
  controllers: [AttachmentController],
  exports: [
    DatabaseModule,
    AttachmentResolver,
    AttachmentService,
    AttachmentConnection,
  ],
})
export class AttachmentModule {}
