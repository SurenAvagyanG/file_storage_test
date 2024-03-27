import { S3, config } from 'aws-sdk';
import {
  FileUploadResponse,
  UrlParams,
  IStorage,
  UploadUrlResponse,
  FileMeta,
} from '../storage.interface';
import { S3Credentials } from './s3-credentials';
import { generateRandomStr } from '@infrastructure/utils';
import { Logger } from '@nestjs/common';
import { getFileExtension } from '@shared/utils';

const filenameCharacterCount = 40;

export class S3Adapter implements IStorage {
  private s3: S3;

  constructor(private credentials: S3Credentials) {
    config.update({
      credentials: {
        accessKeyId: credentials.accessKeyId,
        secretAccessKey: credentials.accessKeySecret,
      },
    });
    this.s3 = new S3();
  }

  async upload(file: Express.Multer.File): Promise<FileUploadResponse> {
    const params = this.getS3UploadParams(file);
    await this.s3.upload(params).promise();

    return {
      url: params.Key,
    };
  }

  async duplicate(url: string): Promise<FileUploadResponse> {
    const params = this.getS3DuplicateParams(url);
    await this.s3.copyObject(params).promise();

    return {
      url: params.Key,
    };
  }

  async delete(key: string): Promise<void> {
    const params = {
      Key: key,
      Bucket: this.credentials.bucket,
    };

    await this.s3.deleteObject(params).promise();
  }

  async getUploadUrl(
    key: string,
    params?: UrlParams,
  ): Promise<UploadUrlResponse> {
    const staticUrl = `${generateRandomStr(filenameCharacterCount)}.${key}`;

    const payload = {
      Bucket: this.credentials.bucket,
      ...params,
      Key: staticUrl,
    };

    const signedUrl = await this.s3.getSignedUrlPromise('putObject', payload);

    return {
      staticUrl,
      signedUrl,
    };
  }

  async getDownloadUrl(key: string, params?: UrlParams): Promise<string> {
    const payload = {
      Key: key,
      Bucket: this.credentials.bucket,
      ...params,
    };

    const url = await this.s3.getSignedUrlPromise('getObject', payload);

    return url;
  }

  async getFileMeta(key: string, params?: UrlParams): Promise<FileMeta | null> {
    const payload = {
      Key: key,
      Bucket: this.credentials.bucket,
      ...params,
    };
    try {
      const result = await this.s3.headObject(payload).promise();
      return {
        size: Number(result.ContentLength),
      };
    } catch (e) {
      Logger.log(e);
      return null;
    }
  }

  private getS3UploadParams(
    file: Express.Multer.File,
  ): S3.Types.PutObjectRequest {
    return {
      Bucket: this.credentials.bucket,
      Key: `attachments/${this.generateFileName(file.originalname)}`,
      Body: file.buffer,
    };
  }

  private getS3DuplicateParams(url: string): S3.Types.CopyObjectRequest {
    const fileName = url.split('/')[1];
    return {
      Bucket: this.credentials.bucket,
      Key: `attachments/${this.generateFileName(fileName)}`,
      CopySource: `${this.credentials.bucket}/${url}`,
    };
  }

  private generateFileName(fileName: string): string {
    return `${generateRandomStr(
      filenameCharacterCount,
    )}.${getFileExtension(fileName)}`;
  }
}
