import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { FileEntity } from '@feature/file/entities/file.entity';
import { BaseTypeOrmRepository } from '@fifth/expia-common';

@Injectable()
export class FileRepository extends BaseTypeOrmRepository<FileEntity> {
  protected entityClass = FileEntity;
  constructor(
    @InjectRepository(FileEntity)
    protected repository: Repository<FileEntity>,
  ) {
    super(repository);
  }
}
