import {
  FileMeta,
  FileUploadResponse,
  IStorage,
  UploadUrlResponse,
  UrlParams,
} from '../storage.interface';

export class MockFileSystemAdapter implements IStorage {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  delete(key: string): Promise<void> {
    return Promise.resolve(undefined);
  }

  getUploadUrl(extension: string): Promise<UploadUrlResponse> {
    return Promise.resolve({
      signedUrl: `http//string.${extension}?signed=1`,
      staticUrl: `http//string.${extension}`,
    });
  }

  getDownloadUrl(key: string): Promise<string> {
    return Promise.resolve(key);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  upload(file: Express.Multer.File): Promise<FileUploadResponse> {
    return Promise.resolve({ url: 'testfile.png' });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  duplicate(url: string): Promise<FileUploadResponse> {
    return Promise.resolve({ url: 'testfile.png' });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getFileMeta(key: string, params?: UrlParams): Promise<FileMeta> {
    return Promise.resolve({ size: 1 });
  }
}
