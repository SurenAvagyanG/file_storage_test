import {
  FileMeta,
  FileUploadResponse,
  IStorage,
  StorageFactory,
  UploadUrlResponse,
  UrlParams,
} from '@infrastructure/storage';
import { NotFoundException } from '@nestjs/common';

export class StorageService {
  constructor(protected driver: string) {}

  protected get storage(): IStorage {
    return StorageFactory.getStorage(this.driver);
  }

  upload(
    file: Buffer,
    name: string,
    contentType: string,
  ): Promise<FileUploadResponse> {
    return this.storage.upload(file, name, contentType);
  }

  duplicate(url: string): Promise<FileUploadResponse> {
    return this.storage.duplicate(url);
  }

  delete(key: string): Promise<void> {
    return this.storage.delete(key);
  }

  getUploadUrl(key: string, params?: UrlParams): Promise<UploadUrlResponse> {
    return this.storage.getUploadUrl(key, params);
  }

  getDownloadUrl(key: string, params?: UrlParams): Promise<string> {
    return this.storage.getDownloadUrl(key, params);
  }

  async getFileMeta(key: string, params?: UrlParams): Promise<FileMeta> {
    const meta = await this.storage.getFileMeta(key, params);

    if (!meta) {
      throw new NotFoundException('File upload with signed url not finished');
    }

    return meta;
  }
}
