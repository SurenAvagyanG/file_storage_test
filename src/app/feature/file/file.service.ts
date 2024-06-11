import { Inject, Injectable } from '@nestjs/common';
import { StorageService } from '@shared/storage';
import { FileEntity } from '@feature/file/entities/file.entity';
import { BaseService, DBConnection } from '@infrastructure/common';
import { FileConnection } from '@feature/file/constants/tokens.const';

@Injectable()
export class FileService extends BaseService<FileEntity> {
  constructor(
    private storageService: StorageService,
    @Inject(FileConnection)
    protected repository: DBConnection<FileEntity>,
  ) {
    super(repository);
  }

  async getPublicUrl(fileEntity: FileEntity): Promise<string> {
    return await this.storageService.getDownloadUrl(fileEntity.url);
  }
}
