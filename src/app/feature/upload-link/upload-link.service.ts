import { Inject, Injectable } from '@nestjs/common';
import { StorageService } from '@shared/storage';
import { UploadLinkEntity } from '@feature/upload-link/entity/upload-link.entity';
import { DBConnection, IDBTransactionRunner } from '@infrastructure/common';
import { UploadLinkConnection } from '@feature/upload-link/constants/tokens.const';
import { CreateUploadLinkInput } from '@feature/upload-link/dto/create-upload-link.input';

@Injectable()
export class UploadLinkService {
  constructor(
    private storageService: StorageService,
    @Inject(UploadLinkConnection)
    private repository: DBConnection<UploadLinkEntity>,
  ) {}

  async create(
    createUploadLinkInput: CreateUploadLinkInput,
    runner?: IDBTransactionRunner,
  ): Promise<UploadLinkEntity> {
    const data = await this.storageService.getUploadUrl(
      createUploadLinkInput.extension,
    );

    return this.repository.createWithTransaction(data, runner);
  }

  async findOrFailBy(
    data: Partial<UploadLinkEntity>,
  ): Promise<UploadLinkEntity> {
    return this.repository.findOrFailBy(data);
  }

  async remove(id: string, runner?: IDBTransactionRunner): Promise<void> {
    await this.repository.removeWithTransaction(id, runner);
  }
}
