import { Field, InputType } from '@nestjs/graphql';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { ImageExtensions } from '@domain/constants';
import { UrlParamsInput } from '@infrastructure/storage/dto';

@InputType()
export class CreateUploadLinkInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  @IsIn(ImageExtensions)
  extension: string;

  @Field(() => UrlParamsInput, { nullable: true })
  params?: UrlParamsInput;
}
