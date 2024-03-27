import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { BaseTypeOrmRepository } from '@shared/database';
import { UploadProcessEntity } from '@feature/upload-process/entities/upload-process.entity';

@Injectable()
export class UploadProcessRepository extends BaseTypeOrmRepository<UploadProcessEntity> {
  protected entityClass = UploadProcessEntity;
  constructor(
    @InjectRepository(UploadProcessEntity)
    protected repository: Repository<UploadProcessEntity>,
  ) {
    super(repository);
  }
}
