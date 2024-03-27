import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AttachmentEntity } from '@feature/attachment/entities/attachment.entity';
import {
  DBConnection,
  DBTransactionService,
  IDBTransactionService,
} from '@shared/database';
import { StorageService } from '@shared/storage';
import { UploadProcessService } from '@feature/upload-process/upload-process.service';
import { CreateAttachmentDto } from '@feature/attachment/dto/create-attachment.dto';
import { FileService } from '@feature/file/file.service';
import { FileType } from '@domain/constants';
import { AttachmentModel } from '@domain/models/attachment.model';
import { FileEntity } from '@feature/file/entities/file.entity';
import { FileManager } from '@feature/attachment/file.manager';
import { UpdateAttachmentDto } from '@feature/attachment/dto/update-attachment.dto';
import { AttachmentConnection } from '@feature/attachment/attachment.module';

@Injectable()
export class AttachmentService {
  constructor(
    @Inject(AttachmentConnection)
    private repository: DBConnection<AttachmentEntity>,
    @Inject(DBTransactionService) private transaction: IDBTransactionService,
    private storageService: StorageService,
    private uploadProcessService: UploadProcessService,
    private fileService: FileService,
    private fileManager: FileManager,
  ) {}
  async create(dto: CreateAttachmentDto): Promise<AttachmentModel> {
    const uploadProcess = await this.uploadProcessService.findBySignedUrl(
      dto.signedUrl,
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
        name: this.fileManager.getFileName(dto.name),
        type: this.fileManager.getAttachmentType(dto.name),
        extension: this.fileManager.getFileExtension(dto.name),
        creator_id: 'test_user_id',
        creator_type: 'test_user_type',
        description: dto.description,
      },
      transaction,
    );

    const file = await this.fileService.create(
      {
        url: uploadProcess.staticUrl,
        attachment: attachment,
        size: meta.size,
        type: FileType.Default,
      },
      transaction,
    );

    await this.uploadProcessService.remove(uploadProcess.id, transaction);

    await transaction.commitTransaction();

    return {
      ...attachment,
      url: (await this.fileService.setPublicUrl(file)).url,
    };
  }

  async getById(id: string): Promise<AttachmentModel> {
    const attachment = await this.repository.findBy('id', id);
    if (!attachment) {
      throw new NotFoundException('Attachment Id is incorrect');
    }

    return {
      ...attachment,
      url: (await this.getDefaultFile(attachment)).url,
    };
  }

  async updateById(
    id: string,
    dto: UpdateAttachmentDto,
  ): Promise<AttachmentModel> {
    await this.repository.update(id, dto);
    return this.getById(id);
  }

  async removeById(id: string): Promise<boolean> {
    return await this.repository.removeWithTransaction(id);
  }

  private getDefaultFile(attachment: AttachmentEntity): Promise<FileEntity> {
    return this.fileService.setPublicUrl(
      attachment.files.filter((it) => it.type === FileType.Default)[0],
    );
  }
}
