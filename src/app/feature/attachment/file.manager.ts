import { Injectable } from '@nestjs/common';
import {
  AttachmentType,
  ImageExtensions,
  VideoExtensions,
} from '@domain/constants';

@Injectable()
export class FileManager {
  getFileExtension(name: string): string {
    return name.split('.').pop().toLowerCase();
  }

  getFileName(name: string): string {
    const data = name.split('.');
    data.pop();

    return data.join('.');
  }

  getAttachmentType(name: string): AttachmentType {
    const extension = this.getFileExtension(name);

    if (ImageExtensions.includes(extension)) {
      return AttachmentType.Image;
    }

    if (VideoExtensions.includes(extension)) {
      return AttachmentType.Video;
    }

    return AttachmentType.Other;
  }
}
