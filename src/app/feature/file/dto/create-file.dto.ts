import { FileType } from '@domain/constants';
import { AttachmentEntity } from '@feature/attachment/entities/attachment.entity';

export class CreateFileDto {
  url: string;
  attachment: AttachmentEntity;
  size: number;
  type: FileType;
}
