import { Inject, Injectable } from '@nestjs/common';
import { CreateUploadProcessDto } from './dto/create-upload-process.dto';
import { StorageService } from '@shared/storage';
import { UploadProcessEntity } from '@feature/upload-process/entities/upload-process.entity';
import {
  DBConnection,
  DBTransactionService,
  IDBTransactionRunner,
  IDBTransactionService,
} from '@shared/database';
import { UploadProcessConnection } from '@feature/upload-process/constants/tokens.const';

@Injectable()
export class UploadProcessService {
  constructor(
    private storageService: StorageService,
    @Inject(UploadProcessConnection)
    private repository: DBConnection<UploadProcessEntity>,
    @Inject(DBTransactionService) private transaction: IDBTransactionService,
  ) {}

  async create(
    createUploadProcessDto: CreateUploadProcessDto,
  ): Promise<UploadProcessEntity> {
    const data = await this.storageService.getUploadUrl(
      createUploadProcessDto.extension,
    );

    const transaction = await this.transaction.startTransaction();

    const uploadProcess = await this.repository.createWithTransaction(
      data,
      transaction,
    );

    await transaction.commitTransaction();

    return uploadProcess;
  }

  async findBySignedUrl(
    signedUrl: string,
  ): Promise<UploadProcessEntity | null> {
    return this.repository.findBy('signedUrl', signedUrl);
  }

  async remove(id: string, transaction?: IDBTransactionRunner): Promise<void> {
    await this.repository.removeWithTransaction(id, transaction);
  }
}
