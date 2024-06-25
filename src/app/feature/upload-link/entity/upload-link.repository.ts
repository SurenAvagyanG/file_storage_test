import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { BaseTypeOrmRepository } from '@fifth/expia-common';
import { UploadLinkEntity } from '@feature/upload-link/entity/upload-link.entity';

@Injectable()
export class UploadLinkRepository extends BaseTypeOrmRepository<UploadLinkEntity> {
  protected entityClass = UploadLinkEntity;
  constructor(
    @InjectRepository(UploadLinkEntity)
    protected repository: Repository<UploadLinkEntity>,
  ) {
    super(repository);
  }
}
