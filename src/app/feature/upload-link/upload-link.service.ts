import { Inject, Injectable, Logger } from '@nestjs/common';
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
  private readonly logger: Logger = new Logger(this.constructor.name);
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
    this.logger.log('Creating upload-link', createUploadLinkInput);

    this.logger.log(
      `Getting upload url with extension ${createUploadLinkInput.extension} and params ${createUploadLinkInput.params}`,
      createUploadLinkInput,
    );
    const data = await this.storageService.getUploadUrl(
      createUploadLinkInput.extension,
      createUploadLinkInput.params,
    );
    this.logger.log('Upload url ', data);

    const uploadLink = this.repository.createWithTransaction(data, runner);
    this.logger.log('Upload link created successfully ', uploadLink);
    return uploadLink;
  }
}
