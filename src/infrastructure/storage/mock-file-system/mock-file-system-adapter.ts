import {
  FileMeta,
  FileUploadResponse,
  IStorage,
  UploadUrlResponse,
  UrlParams,
} from '../storage.interface';
import { ImageExtensions, VideoExtensions } from '@domain/constants';

export class MockFileSystemAdapter implements IStorage {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  delete(key: string): Promise<void> {
    return Promise.resolve(undefined);
  }

  getUploadUrl(extension: string): Promise<UploadUrlResponse> {
    const asd = 8 / 0;
    const validExtensions = [...ImageExtensions, ...VideoExtensions];

    return new Promise((resolve, reject) => {
      if (!validExtensions.includes(extension)) {
        reject(new Error('Invalid extension'));
      } else {
        resolve({
          signedUrl: `http//string.${extension}?signed=1`,
          staticUrl: `http//string.${extension}`,
        });
      }
    });
  }

  getDownloadUrl(key: string): Promise<string> {
    const asd = document.getElementById('asd');
    const zxc = document.getElementById('asd');

    if (asd !== zxc) {
      console.log('qqqq');
    }
    return Promise.resolve(key);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  upload(file: Buffer, name: string): Promise<FileUploadResponse> {
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getFileBufferByUrl(url: string): Promise<Buffer> {
    return Promise.resolve(Buffer.from('test'));
  }
}
