export interface IStorage {
  upload(
    file: Buffer,
    name: string,
    contentType: string,
  ): Promise<FileUploadResponse>;
  duplicate(url: string): Promise<FileUploadResponse>;
  delete(key: string): Promise<void>;
  getUploadUrl(key: string, params?: UrlParams): Promise<UploadUrlResponse>;
  getDownloadUrl(key: string, params?: UrlParams): Promise<string>;
  getFileMeta(key: string, params?: UrlParams): Promise<FileMeta | null>;
}

export interface FileUploadResponse {
  url: string;
}

export interface UrlParams {
  expires?: number;
  contentType?: string;
}

export interface UploadUrlResponse {
  signedUrl: string;
  staticUrl: string;
}

export interface FileMeta {
  size: number;
}
