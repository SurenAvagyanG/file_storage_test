import { ObjectType, Field } from '@nestjs/graphql';
import { Column, Entity, OneToMany } from 'typeorm';
import { FileEntity } from '@feature/file/entities/file.entity';
import { AttachmentType } from '@domain/constants';
import { CommonEntity } from '@fifth/expia-common';

@Entity()
@ObjectType()
export class AttachmentEntity extends CommonEntity {
  @Column({ type: 'varchar' })
  @Field()
  name: string;

  @Column({ type: 'varchar' })
  type: AttachmentType;

  @Column({ type: 'varchar' })
  @Field()
  extension: string;

  @Column({ type: 'varchar' })
  creator_id: string;

  @Column({ type: 'varchar' })
  creator_type: string;

  @Column({ type: 'varchar' })
  description: string;

  @OneToMany(() => FileEntity, (file) => file.attachment, {
    cascade: true,
    eager: true,
  })
  @Field(() => [FileEntity], { nullable: true })
  files: FileEntity[];
}
