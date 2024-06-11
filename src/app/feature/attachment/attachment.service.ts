import { Inject, Injectable, Logger } from '@nestjs/common';
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
import { CreateFileDto } from '@feature/file/dto/create-file.dto';

@Injectable()
export class AttachmentService extends BaseService<AttachmentEntity> {
  private readonly logger: Logger = new Logger(this.constructor.name);
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
    this.logger.log('Creating attachment', createAttachmentInput);

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

    await this.uploadLinkService.delete(uploadProcess.id, runner);

    this.logger.log('Upload link removed', uploadProcess.id);

    return attachment;
  }
}
