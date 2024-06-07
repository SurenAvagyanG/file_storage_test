import { Field, InputType } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';

@InputType()
export class PaginationInput {
  @Field()
  @IsNumber()
  skip: number;

  @Field()
  @IsNumber()
  take: number;
}
