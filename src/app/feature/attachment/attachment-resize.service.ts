import { Injectable } from '@nestjs/common';
import { AttachmentEntity } from '@feature/attachment/entities/attachment.entity';
import {
  HttpService,
  IDBTransactionRunner,
  ImageManagerService,
} from '@infrastructure/common';
import { StorageService } from '@shared/storage';
import { FileService } from '@feature/file/file.service';
import { FileType } from '@domain/constants';
import { FileEntity } from '@feature/file/entities/file.entity';
import { generateRandomStr } from '@infrastructure/utils';

@Injectable()
export class AttachmentResizeService {
  private sizes = [
    { size: 300, label: FileType.Small },
    { size: 600, label: FileType.Medium },
    { size: 900, label: FileType.High },
  ];

  constructor(
    private storageService: StorageService,
    private fileService: FileService,
    private httpService: HttpService,
    private imageManagerService: ImageManagerService,
  ) {}

  async uploadResizedImages(
    attachment: AttachmentEntity,
    extension: string,
    staticUrl: string,
    runner: IDBTransactionRunner,
  ): Promise<FileEntity[]> {
    const fileBuffer = await this.fetchFile(
      await this.storageService.getDownloadUrl(staticUrl),
    );

    const resizedBuffers = await this.resizeFile(fileBuffer);

    return await Promise.all(
      this.sizes.map(async (sizeInfo, index): Promise<FileEntity> => {
        const url = await this.uploadResizedFile(
          resizedBuffers[index],
          extension,
        );

        const fileMeta = await this.storageService.getFileMeta(url);

        return this.fileService.create(
          {
            url: url,
            attachment,
            size: fileMeta.size,
            type: this.sizes[index].label,
          },
          runner,
        );
      }),
    );
  }

  private async fetchFile(url: string): Promise<Buffer> {
    const response = await this.httpService.get(url, {
      responseType: 'arraybuffer',
    });
    return Buffer.from(response.data);
  }

  private async resizeFile(fileBuffer: Buffer): Promise<Buffer[]> {
    return Promise.all(
      this.sizes.map(({ size }) =>
        this.imageManagerService.resize(fileBuffer, size),
      ),
    );
  }

  private async uploadResizedFile(
    buffer: Buffer,
    extension: string,
  ): Promise<string> {
    return (
      await this.storageService.upload(
        buffer,
        `${generateRandomStr(10)}.${extension}`,
        `image/${extension}`,
      )
    ).url;
  }
}
