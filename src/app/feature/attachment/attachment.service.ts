import { Inject, Injectable } from '@nestjs/common';
import { AttachmentEntity } from '@feature/attachment/entities/attachment.entity';
import {
  DBConnection,
  HttpService,
  IDBTransactionRunner,
  ImageManagerService,
} from '@infrastructure/common';
import { StorageService } from '@shared/storage';
import { UploadLinkService } from '@feature/upload-link/upload-link.service';
import { FileService } from '@feature/file/file.service';
import { FileType } from '@domain/constants';
import { AttachmentConnection } from '@feature/attachment/constants/tokens.const';
import {
  getAttachmentType,
  getFileExtension,
  getFileName,
} from '@shared/utils';
import { CreateAttachmentInput } from '@feature/attachment/dto/create-attachment.input';
import { UpdateAttachmentInput } from '@feature/attachment/dto/update-attachment.input';

@Injectable()
export class AttachmentService {
  private sizes = [
    { size: 300, label: FileType.Small },
    { size: 600, label: FileType.Medium },
    { size: 900, label: FileType.High },
  ];
  constructor(
    @Inject(AttachmentConnection)
    private repository: DBConnection<AttachmentEntity>,
    private storageService: StorageService,
    private uploadLinkService: UploadLinkService,
    private fileService: FileService,
    private httpService: HttpService,
    private imageManagerService: ImageManagerService,
  ) {}

  async create(
    createAttachmentInput: CreateAttachmentInput,
    runner: IDBTransactionRunner,
  ): Promise<AttachmentEntity> {
    const uploadProcess = await this.uploadLinkService.findOrFailBy({
      signedUrl: createAttachmentInput.signedUrl,
    });

    const fileBuffer = await this.fetchFile(
      await this.storageService.getDownloadUrl(uploadProcess.staticUrl),
    );

    const resizedBuffers = await this.resizeFile(fileBuffer);

    const extension = getFileExtension(createAttachmentInput.name);

    const attachment = await this.repository.createWithTransaction(
      {
        name: getFileName(createAttachmentInput.name),
        type: getAttachmentType(createAttachmentInput.name),
        extension,
        //@TODO fill correct information after auth service implementation
        creator_id: 'test_user_id',
        creator_type: 'test_user_type',
        description: createAttachmentInput.description,
      },
      runner,
    );

    const originalFileMeta = await this.storageService.getFileMeta(
      uploadProcess.staticUrl,
    );

    const originalFile = await this.fileService.create(
      {
        url: uploadProcess.staticUrl,
        attachment,
        size: originalFileMeta.size,
        type: FileType.Default,
      },
      runner,
    );

    const resizedFiles = await Promise.all(
      this.sizes.map(async (sizeInfo, index) => {
        const contentType = `image/${extension}`;

        const uploadUrl = await this.storageService.getUploadUrl(extension, {
          contentType,
        });

        await this.uploadResizedFile(
          uploadUrl.signedUrl,
          resizedBuffers[index],
          contentType,
        );

        const fileMeta = await this.storageService.getFileMeta(
          uploadUrl.staticUrl,
        );

        return this.fileService.create(
          {
            url: uploadUrl.staticUrl,
            attachment,
            size: fileMeta.size,
            type: this.sizes[index].label,
          },
          runner,
        );
      }),
    );

    attachment.files = [originalFile, ...resizedFiles];

    await this.uploadLinkService.remove(uploadProcess.id, runner);

    return attachment;
  }

  async getById(id: string): Promise<AttachmentEntity> {
    return await this.repository.findOrFailBy({ id });
  }

  async getByIds(ids: string[]): Promise<AttachmentEntity[]> {
    return this.repository.findManyBy({ id: ids });
  }

  async updateById(
    id: string,
    updateAttachmentInput: UpdateAttachmentInput,
  ): Promise<AttachmentEntity> {
    await this.repository.updateWithTransaction(id, updateAttachmentInput);
    return this.getById(id);
  }

  async removeById(id: string): Promise<boolean> {
    return await this.repository.removeWithTransaction(id);
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
    url: string,
    buffer: Buffer,
    contentType: string,
  ): Promise<void> {
    await this.httpService.put(url, buffer, {
      headers: {
        'Content-Type': contentType,
      },
    });
  }
}
