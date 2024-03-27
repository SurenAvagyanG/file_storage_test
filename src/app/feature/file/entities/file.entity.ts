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

@Entity()
export class FileEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  url: string;

  @Column({ type: 'int' })
  size: number;

  @Column({ type: 'int' })
  type: FileType;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => AttachmentEntity, (attachment) => attachment.files, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'attachment_id' })
  attachment: AttachmentEntity;
}
