import { Repository } from 'typeorm';
import { AttachmentEntity } from '@feature/attachment/entities/attachment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { BaseTypeOrmRepository } from '@shared/database';

@Injectable()
export class AttachmentRepository extends BaseTypeOrmRepository<AttachmentEntity> {
  protected entityClass = AttachmentEntity;
  constructor(
    @InjectRepository(AttachmentEntity)
    protected repository: Repository<AttachmentEntity>,
  ) {
    super(repository);
  }
}
