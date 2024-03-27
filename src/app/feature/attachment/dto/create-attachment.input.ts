import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateAttachmentInput {
  @Field()
  name: string;

  @Field()
  signedUrl: string;

  @Field()
  description: string;
}
