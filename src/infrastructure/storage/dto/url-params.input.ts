import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UrlParamsInput {
  @Field({ nullable: true })
  expires?: number;

  @Field({ nullable: true })
  contentType?: string;
}
