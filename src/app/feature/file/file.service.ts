import { Inject, Injectable } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { StorageService } from '@shared/storage';
import { FileEntity } from '@feature/file/entities/file.entity';
import { FileConnection } from '@feature/file/file.module';
import { DBConnection, IDBTransactionRunner } from '@shared/database';

@Injectable()
export class FileService {
  constructor(
    private storageService: StorageService,
    @Inject(FileConnection)
    private repository: DBConnection<FileEntity>,
  ) {}

  async create(
    data: CreateFileDto,
    transaction: IDBTransactionRunner,
  ): Promise<FileEntity> {
    const fileEntity = await this.repository.createWithTransaction(
      data,
      transaction,
    );

    return await this.setPublicUrl(fileEntity);
  }

  async remove(id: string, transaction?: IDBTransactionRunner): Promise<void> {
    await this.repository.removeWithTransaction(id, transaction);
  }

  async setPublicUrl(fileEntity: FileEntity): Promise<FileEntity> {
    fileEntity.url = await this.storageService.getDownloadUrl(fileEntity.url);

    return fileEntity;
  }
}
