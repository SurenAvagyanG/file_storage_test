import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
import { IOrder, SortOrder } from '@infrastructure/common/database/types';

@InputType()
export class SortInput implements IOrder {
  @Field()
  @IsString()
  @IsNotEmpty()
  field: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  type: SortOrder;
}
