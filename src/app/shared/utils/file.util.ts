import {
  AttachmentType,
  ImageExtensions,
  VideoExtensions,
} from '@domain/constants';

export const getFileExtension = (name: string): string => {
  const parts = name.split('.');
  return parts.pop() || '';
};

export const getFileName = (name: string): string => {
  const data = name.split('.');
  data.pop();

  return data.join('.');
};

export const getAttachmentType = (name: string): AttachmentType => {
  const extension = getFileExtension(name);

  if (ImageExtensions.includes(extension)) {
    return AttachmentType.Image;
  }

  if (VideoExtensions.includes(extension)) {
    return AttachmentType.Video;
  }

  return AttachmentType.Other;
};
