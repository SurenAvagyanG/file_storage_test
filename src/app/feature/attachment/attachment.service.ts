import { Inject, Injectable } from '@nestjs/common';
import { AttachmentEntity } from '@feature/attachment/entities/attachment.entity';
import {
  BaseService,
  DBConnection,
  IDBTransactionRunner,
} from '@infrastructure/common';
import { StorageService } from '@shared/storage';
import { UploadLinkService } from '@feature/upload-link/upload-link.service';
import { FileService } from '@feature/file/file.service';
import { FileType } from '@domain/constants';
import { AttachmentConnection } from '@feature/attachment/constants/tokens.const';
import {
  getAttachmentType,
  getFileExtension,
  getFileName,
} from '@shared/utils';
import { CreateAttachmentInput } from '@feature/attachment/dto/create-attachment.input';
import { AttachmentResizeService } from '@feature/attachment/attachment-resize.service';

@Injectable()
export class AttachmentService extends BaseService<AttachmentEntity> {
  constructor(
    @Inject(AttachmentConnection)
    protected repository: DBConnection<AttachmentEntity>,
    private storageService: StorageService,
    private uploadLinkService: UploadLinkService,
    private fileService: FileService,
    private attachmentResizeService: AttachmentResizeService,
  ) {
    super(repository);
  }

  async createAttachment(
    createAttachmentInput: CreateAttachmentInput,
    runner: IDBTransactionRunner,
  ): Promise<AttachmentEntity> {
    const uploadProcess = await this.uploadLinkService.findOrFailBy({
      signedUrl: createAttachmentInput.signedUrl,
    });

    const extension = getFileExtension(createAttachmentInput.name);

    const attachment = await this.create(
      {
        name: getFileName(createAttachmentInput.name),
        type: getAttachmentType(createAttachmentInput.name),
        extension,
        //@TODO fill correct information after auth service implementation
        creator_id: 'test_user_id',
        creator_type: 'test_user_type',
        description: createAttachmentInput.description,
      },
      runner,
    );

    const originalFileMeta = await this.storageService.getFileMeta(
      uploadProcess.staticUrl,
    );

    const originalFile = await this.fileService.create(
      {
        url: uploadProcess.staticUrl,
        attachment,
        size: originalFileMeta.size,
        type: FileType.Default,
      },
      runner,
    );

    const resizedFiles = await this.attachmentResizeService.uploadResizedImages(
      attachment,
      extension,
      uploadProcess.staticUrl,
      runner,
    );

    attachment.files = [originalFile, ...resizedFiles];

    await this.uploadLinkService.delete(uploadProcess.id, runner);

    return attachment;
  }
}
