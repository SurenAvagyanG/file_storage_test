import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UrlParamsInput {
  @Field({ nullable: true })
  Expires?: number;

  @Field({ nullable: true })
  ContentType?: string;
}
