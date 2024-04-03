import { Inject, Injectable } from '@nestjs/common';
import { StorageService } from '@shared/storage';
import { UploadLinkEntity } from '@feature/upload-link/entity/upload-link.entity';
import {
  DBConnection,
  DBTransactionService,
  IDBTransactionRunner,
  IDBTransactionService,
} from '@shared/database';
import { UploadLinkConnection } from '@feature/upload-link/constants/tokens.const';
import { CreateUploadLinkInput } from '@feature/upload-link/dto/create-upload-link.input';

@Injectable()
export class UploadLinkService {
  constructor(
    private storageService: StorageService,
    @Inject(UploadLinkConnection)
    private repository: DBConnection<UploadLinkEntity>,
    @Inject(DBTransactionService) private transaction: IDBTransactionService,
  ) {}

  async create(
    createUploadLinkInput: CreateUploadLinkInput,
  ): Promise<UploadLinkEntity> {
    const data = await this.storageService.getUploadUrl(
      createUploadLinkInput.extension,
    );

    const transaction = await this.transaction.startTransaction();

    const uploadLink = await this.repository.createWithTransaction(
      data,
      transaction,
    );

    await transaction.commitTransaction();

    return uploadLink;
  }
  //@TODO fix me
  async findBySignedUrl(signedUrl: string): Promise<UploadLinkEntity | null> {
    return this.repository.findBy('signedUrl', signedUrl);
  }

  async remove(id: string, transaction?: IDBTransactionRunner): Promise<void> {
    await this.repository.removeWithTransaction(id, transaction);
  }
}
