import { Inject, Injectable } from '@nestjs/common';
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

@Injectable()
export class AttachmentService {
  constructor(
    @Inject(AttachmentConnection)
    private repository: DBConnection<AttachmentEntity>,
    private storageService: StorageService,
    private uploadLinkService: UploadLinkService,
    private fileService: FileService,
  ) {}
  async create(
    createAttachmentInput: CreateAttachmentInput,
    runner: IDBTransactionRunner,
  ): Promise<AttachmentEntity> {
    const uploadProcess = await this.uploadLinkService.findOrFailBy({
      signedUrl: createAttachmentInput.signedUrl,
    });

    const meta = await this.storageService.getFileMeta(uploadProcess.staticUrl);

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
      runner,
    );

    attachment.files = [
      await this.fileService.create(
        {
          url: uploadProcess.staticUrl,
          attachment: attachment,
          size: meta.size,
          type: FileType.Default,
        },
        runner,
      ),
    ];

    await this.uploadLinkService.remove(uploadProcess.id, runner);

    return attachment;
  }

  async getById(id: string): Promise<AttachmentEntity> {
    return await this.repository.findOrFailBy({ id });
  }

  async getByIds(ids: string[]): Promise<AttachmentEntity[]> {
    return this.repository.findManyByCriteria({ id: ids });
  }

  async updateById(
    id: string,
    updateAttachmentInput: UpdateAttachmentInput,
  ): Promise<AttachmentEntity> {
    await this.repository.updateWithTransaction(id, updateAttachmentInput);
    return this.getById(id);
  }

  async removeById(id: string): Promise<boolean> {
    return await this.repository.removeWithTransaction(id);
  }
}
