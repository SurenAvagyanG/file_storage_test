import {
  FileMeta,
  FileUploadResponse,
  IStorage,
  StorageFactory,
  UploadUrlResponse,
  UrlParams,
} from '@infrastructure/storage';

export class StorageService {
  constructor(protected driver: string) {}

  protected get storage(): IStorage {
    return StorageFactory.getStorage(this.driver);
  }

  upload(file: Express.Multer.File): Promise<FileUploadResponse> {
    return this.storage.upload(file);
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

  getFileMeta(key: string, params?: UrlParams): Promise<FileMeta | null> {
    return this.storage.getFileMeta(key, params);
  }
}
