import { ObjectType, Field } from '@nestjs/graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FileEntity } from '@feature/file/entities/file.entity';
import { AttachmentType } from '@domain/constants';

@ObjectType()
@Entity()
export class AttachmentEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  @Field()
  name: string;

  @Column({ type: 'varchar' })
  @Field()
  type: AttachmentType;

  @Column({ type: 'varchar' })
  @Field()
  extension: string;

  @Column({ type: 'varchar' })
  @Field()
  creator_id: string;

  @Column({ type: 'varchar' })
  @Field()
  creator_type: string;

  @Column({ type: 'varchar' })
  @Field()
  description: string;

  @OneToMany(() => FileEntity, (file) => file.attachment, {
    cascade: true,
    eager: true,
  })
  files: FileEntity[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
