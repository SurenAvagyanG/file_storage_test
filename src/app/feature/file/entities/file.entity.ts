import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FileType } from '@domain/constants';
import { AttachmentEntity } from '@feature/attachment/entities/attachment.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class FileEntity extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  @Field()
  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => AttachmentEntity, (attachment) => attachment.files, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'attachment_id' })
  attachment: AttachmentEntity;
}
