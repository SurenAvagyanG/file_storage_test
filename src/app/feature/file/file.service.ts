import { Inject, Injectable } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { StorageService } from '@shared/storage';
import { FileEntity } from '@feature/file/entities/file.entity';
import { DBConnection, IDBTransactionRunner } from '@shared/database';
import { FileConnection } from '@feature/file/constants/tokens.const';

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
    return await this.repository.createWithTransaction(data, transaction);
  }

  async remove(id: string, transaction?: IDBTransactionRunner): Promise<void> {
    await this.repository.removeWithTransaction(id, transaction);
  }
  async getPublicUrl(fileEntity: FileEntity): Promise<string> {
    return await this.storageService.getDownloadUrl(fileEntity.url);
  }
}
