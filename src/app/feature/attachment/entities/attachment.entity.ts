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

@Entity()
@ObjectType()
export class AttachmentEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

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

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}