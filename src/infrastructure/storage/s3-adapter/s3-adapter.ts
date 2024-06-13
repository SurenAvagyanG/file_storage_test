import { S3, config } from 'aws-sdk';
import {
  FileUploadResponse,
  UrlParams,
  IStorage,
  UploadUrlResponse,
  FileMeta,
} from '../storage.interface';
import { S3Credentials } from './s3-credentials';
import { generateRandomStr } from 'expiaa-common';
import { Logger } from '@nestjs/common';
import { capitalizeParams, getFileExtension } from '@shared/utils';

const filenameCharacterCount = 40;

export class S3Adapter implements IStorage {
  private s3: S3;
  // @TODO find nice way to solve issue with expiration
  private expiresIn: 1209600;

  constructor(private credentials: S3Credentials) {
    config.update({
      credentials: {
        accessKeyId: credentials.accessKeyId,
        secretAccessKey: credentials.accessKeySecret,
      },
    });
    this.s3 = new S3();
  }

  async upload(
    file: Buffer,
    name: string,
    contentType: string,
  ): Promise<FileUploadResponse> {
    const params = this.getS3UploadParams(file, name, contentType);

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

    const transformedParams = capitalizeParams(params);

    const payload = {
      Bucket: this.credentials.bucket,
      ...transformedParams,
      Key: `attachments/${staticUrl}`,
      Expires: this.expiresIn,
    };

    const signedUrl = await this.s3.getSignedUrlPromise('putObject', payload);

    return {
      staticUrl: `attachments/${staticUrl}`,
      signedUrl,
    };
  }

  async getDownloadUrl(key: string, params?: UrlParams): Promise<string> {
    const payload = {
      Key: key,
      Bucket: this.credentials.bucket,
      Expires: this.expiresIn,
      ...params,
    };

    const url = await this.s3.getSignedUrlPromise('getObject', payload);

    return url;
  }

  async getFileBufferByUrl(url: string): Promise<Buffer> {
    const params = {
      Bucket: this.credentials.bucket,
      Key: url,
    };

    try {
      return (await this.s3.getObject(params).promise()).Body as Buffer;
    } catch (error) {
      Logger.error('Error getting file from S3:', error);
      throw error;
    }
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
    fileBuffer: Buffer,
    fileName: string,
    contentType: string,
  ): S3.Types.PutObjectRequest {
    return {
      Bucket: this.credentials.bucket,
      Key: `attachments/${this.generateFileName(fileName)}`,
      Body: fileBuffer,
      ContentType: contentType,
    };
  }

  private getS3DuplicateParams(url: string): S3.Types.CopyObjectRequest {
    const fileName = url.split('/').pop() || '';
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
