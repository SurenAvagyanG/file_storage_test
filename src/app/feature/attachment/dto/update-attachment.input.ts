import { InputType, PartialType, OmitType } from '@nestjs/graphql';
import { CreateAttachmentInput } from '@feature/attachment/dto/create-attachment.input';

@InputType()
export class UpdateAttachmentInput extends PartialType(
  OmitType(CreateAttachmentInput, ['signedUrl']),
) {}
