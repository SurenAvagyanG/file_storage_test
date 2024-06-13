import { Inject, Injectable, Logger } from '@nestjs/common';
import { StorageService } from '@shared/storage';
import { FileEntity } from '@feature/file/entities/file.entity';
import { BaseService, DBConnection } from 'expiaa-common';
import { FileConnection } from '@feature/file/constants/tokens.const';

@Injectable()
export class FileService extends BaseService<FileEntity> {
  private readonly logger: Logger = new Logger(this.constructor.name);

  constructor(
    private storageService: StorageService,
    @Inject(FileConnection)
    protected repository: DBConnection<FileEntity>,
  ) {
    super(repository);
  }

  async getPublicUrl(fileEntity: FileEntity): Promise<string> {
    this.logger.log('Getting download url ', fileEntity.url);
    const downloadUrl = await this.storageService.getDownloadUrl(
      fileEntity.url,
    );
    this.logger.log('Download url', downloadUrl);
    return downloadUrl;
  }
}
