import { Inject, Injectable } from '@nestjs/common';
import { StorageService } from '@shared/storage';
import { UploadLinkEntity } from '@feature/upload-link/entity/upload-link.entity';
import {
  BaseService,
  DBConnection,
  IDBTransactionRunner,
} from '@infrastructure/common';
import { UploadLinkConnection } from '@feature/upload-link/constants/tokens.const';
import { CreateUploadLinkInput } from '@feature/upload-link/dto/create-upload-link.input';

@Injectable()
export class UploadLinkService extends BaseService<UploadLinkEntity> {
  constructor(
    private storageService: StorageService,
    @Inject(UploadLinkConnection)
    protected repository: DBConnection<UploadLinkEntity>,
  ) {
    super(repository);
  }

  async createUploadLink(
    createUploadLinkInput: CreateUploadLinkInput,
    runner?: IDBTransactionRunner,
  ): Promise<UploadLinkEntity> {
    const data = await this.storageService.getUploadUrl(
      createUploadLinkInput.extension,
      createUploadLinkInput.params,
    );

    return this.create(data, runner);
  }
}
