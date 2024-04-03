import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AttachmentEntity } from '@feature/attachment/entities/attachment.entity';
import {
  DBConnection,
  DBTransactionService,
  IDBTransactionService,
} from '@shared/database';
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

@Injectable()
export class AttachmentService {
  constructor(
    @Inject(AttachmentConnection)
    private repository: DBConnection<AttachmentEntity>,
    @Inject(DBTransactionService) private transaction: IDBTransactionService,
    private storageService: StorageService,
    private uploadLinkService: UploadLinkService,
    private fileService: FileService,
  ) {}
  async create(
    createAttachmentInput: CreateAttachmentInput,
  ): Promise<AttachmentEntity> {
    const uploadProcess = await this.uploadLinkService.findBySignedUrl(
      createAttachmentInput.signedUrl,
    );

    if (!uploadProcess) {
      throw new NotFoundException('Signed url is incorrect');
    }

    const meta = await this.storageService.getFileMeta(uploadProcess.staticUrl);

    if (!meta) {
      throw new NotFoundException('File upload with signed url not finished');
    }

    const transaction = await this.transaction.startTransaction();
    const attachment = await this.repository.createWithTransaction(
      {
        name: getFileName(createAttachmentInput.name),
        type: getAttachmentType(createAttachmentInput.name),
        extension: getFileExtension(createAttachmentInput.name),
        //@TODO fill correct information after auth service implementation
        creator_id: 'test_user_id',
        creator_type: 'test_user_type',
        description: createAttachmentInput.description,
      },
      transaction,
    );

    attachment.files = [
      await this.fileService.create(
        {
          url: uploadProcess.staticUrl,
          attachment: attachment,
          size: meta.size,
          type: FileType.Default,
        },
        transaction,
      ),
    ];

    await this.uploadLinkService.remove(uploadProcess.id, transaction);
    await transaction.commitTransaction();
    return attachment;
  }

  async getById(id: string): Promise<AttachmentEntity> {
    const attachment = await this.repository.findBy('id', id);
    if (!attachment) {
      throw new NotFoundException('Attachment Id is incorrect');
    }
    return attachment;
  }

  async updateById(
    id: string,
    updateAttachmentInput: UpdateAttachmentInput,
  ): Promise<AttachmentEntity> {
    await this.repository.update(id, updateAttachmentInput);
    return this.getById(id);
  }

  async removeById(id: string): Promise<boolean> {
    return await this.repository.removeWithTransaction(id);
  }
}
