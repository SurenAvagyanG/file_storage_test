import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { FileType } from '@domain/constants';
import { AttachmentEntity } from '@feature/attachment/entities/attachment.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import { CommonEntity } from '@infrastructure/common';

@ObjectType()
@Entity()
export class FileEntity extends CommonEntity {
  @Field()
  @Column({ type: 'varchar' })
  url: string;

  @Field()
  @Column({ type: 'int' })
  size: number;

  @Field()
  publicUrl: string;

  @Field()
  @Column({ type: 'int' })
  type: FileType;

  @ManyToOne(() => AttachmentEntity, (attachment) => attachment.files, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'attachment_id' })
  attachment: AttachmentEntity;
}
