import { Injectable } from '@nestjs/common';
import { AttachmentEntity } from '@feature/attachment/entities/attachment.entity';
import { IDBTransactionRunner, generateRandomStr } from 'expiaa-common';
import { StorageService } from '@shared/storage';
import { FileService } from '@feature/file/file.service';
import { FileType } from '@domain/constants';
import { FileEntity } from '@feature/file/entities/file.entity';
import { ImageResizerService } from '@feature/image-resizer';

@Injectable()
export class AttachmentResizeService {
  private sizes = [
    { size: 300, label: FileType.Small, name: 'small' },
    { size: 600, label: FileType.Medium, name: 'medium' },
    { size: 900, label: FileType.High, name: 'high' },
  ];

  constructor(
    private storageService: StorageService,
    private fileService: FileService,
    private imageManagerService: ImageResizerService,
  ) {}

  async uploadResizedImages(
    attachment: AttachmentEntity,
    extension: string,
    staticUrl: string,
    runner: IDBTransactionRunner,
  ): Promise<FileEntity[]> {
    const fileBuffer = await this.storageService.getFileBufferByUrl(staticUrl);

    const resizedBuffers = await this.resizeFile(fileBuffer);

    return await Promise.all(
      this.sizes.map(async (sizeInfo, index): Promise<FileEntity> => {
        const url = await this.uploadResizedFile(
          resizedBuffers[index],
          extension,
          sizeInfo.name,
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
    folderName: string,
  ): Promise<string> {
    return (
      await this.storageService.upload(
        buffer,
        `${folderName}/${generateRandomStr(10)}.${extension}`,
        `image/${extension}`,
      )
    ).url;
  }
}
