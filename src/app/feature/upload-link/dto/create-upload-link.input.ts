import { Field, InputType } from '@nestjs/graphql';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { ImageExtensions } from '@domain/constants';
@InputType()
export class CreateUploadLinkInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  @IsIn(ImageExtensions)
  extension: string;
}
