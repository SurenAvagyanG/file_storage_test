import { Column, Entity } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { CommonEntity } from 'expiaa-common';

@ObjectType()
@Entity()
export class UploadLinkEntity extends CommonEntity {
  @Field()
  @Column({ type: 'varchar' })
  signedUrl: string;

  @Field()
  @Column({ type: 'varchar' })
  staticUrl: string;
}
