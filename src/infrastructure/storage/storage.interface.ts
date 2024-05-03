export interface IStorage {
  upload(file: Express.Multer.File): Promise<FileUploadResponse>;
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
  Expires?: number;
  ContentType?: string;
}

export interface UploadUrlResponse {
  signedUrl: string;
  staticUrl: string;
}

export interface FileMeta {
  size: number;
}
