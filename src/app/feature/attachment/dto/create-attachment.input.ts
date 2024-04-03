import { InputType, Field } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
} from 'class-validator';
import { ImageExtensions } from '@domain/constants';
@InputType()
export class CreateAttachmentInput {
  @Field()
  @Field()
  @IsString()
  @IsNotEmpty()
  @Matches(new RegExp(`^.+\\.(${ImageExtensions.join('|')})$`, 'i'), {
    message:
      'Invalid file name. It should have a valid extension ' + ImageExtensions,
  })
  name: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  signedUrl: string;

  @Field()
  @IsString()
  @IsOptional()
  description: string;
}
