import { Inject, Injectable, Logger } from '@nestjs/common';
import { AttachmentEntity } from '@feature/attachment/entities/attachment.entity';
import { DBConnection, IDBTransactionRunner } from '@infrastructure/common';
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
import { UpdateAttachmentInput } from '@feature/attachment/dto/update-attachment.input';
import { AttachmentResizeService } from '@feature/attachment/attachment-resize.service';
import { CreateFileDto } from '@feature/file/dto/create-file.dto';

@Injectable()
export class AttachmentService {
  private readonly logger: Logger = new Logger(this.constructor.name);

  constructor(
    @Inject(AttachmentConnection)
    private repository: DBConnection<AttachmentEntity>,
    private storageService: StorageService,
    private uploadLinkService: UploadLinkService,
    private fileService: FileService,
    private attachmentResizeService: AttachmentResizeService,
  ) {}

  async create(
    createAttachmentInput: CreateAttachmentInput,
    runner: IDBTransactionRunner,
  ): Promise<AttachmentEntity> {
    this.logger.log('Creating attachment', createAttachmentInput);

    const uploadProcess = await this.uploadLinkService.findOrFailBy({
      signedUrl: createAttachmentInput.signedUrl,
    });

    const extension = getFileExtension(createAttachmentInput.name);

    const attachment = await this.repository.createWithTransaction(
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

    this.logger.log('Attachment created', attachment);

    const originalFileMeta = await this.storageService.getFileMeta(
      uploadProcess.staticUrl,
    );

    const createOriginalFileInput: CreateFileDto = {
      url: uploadProcess.staticUrl,
      attachment,
      size: originalFileMeta.size,
      type: FileType.Default,
    };
    this.logger.log('Creating original file', createOriginalFileInput);

    const originalFile = await this.fileService.create(
      createOriginalFileInput,
      runner,
    );

    this.logger.log('Original file created', originalFile);

    this.logger.log(
      `Uploading resized images for attachment: ${attachment} with an extension: ${extension} and url:${uploadProcess.staticUrl}`,
    );

    const resizedFiles = await this.attachmentResizeService.uploadResizedImages(
      attachment,
      extension,
      uploadProcess.staticUrl,
      runner,
    );

    attachment.files = [originalFile, ...resizedFiles];

    this.logger.log('Resized files', resizedFiles);

    this.logger.log('Removing upload link', uploadProcess.id);

    await this.uploadLinkService.remove(uploadProcess.id, runner);

    this.logger.log('Upload link removed', uploadProcess.id);

    return attachment;
  }

  async getById(id: string): Promise<AttachmentEntity> {
    this.logger.log('Getting an attachment with id', id);

    return await this.repository.findOrFailBy({ id });
  }

  async getByIds(ids: string[]): Promise<AttachmentEntity[]> {
    this.logger.log('Getting attachments with ids', ids);

    return this.repository.findManyBy({ id: ids });
  }

  async updateById(
    id: string,
    updateAttachmentInput: UpdateAttachmentInput,
  ): Promise<AttachmentEntity> {
    this.logger.log('Updating attachment', id);

    await this.repository.updateWithTransaction(id, updateAttachmentInput);
    this.logger.log('Attachment successfully updated', id);

    return this.getById(id);
  }

  async removeById(id: string): Promise<boolean> {
    this.logger.log('Removing attachment', id);
    const removedAttachment = await this.repository.removeWithTransaction(id);
    this.logger.log('Attachment successfully removed', id);
    return removedAttachment;
  }
}
