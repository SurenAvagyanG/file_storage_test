import { Repository, BaseEntity, In } from 'typeorm';
import { QueryRunner } from 'typeorm/query-runner/QueryRunner';
import { DBConnection } from '../db.connection';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { ObjectLiteral } from 'typeorm/common/ObjectLiteral';
import { NotFoundException } from '@nestjs/common';
import { Criteria } from 'infrastructure/common/database/types';

export abstract class BaseTypeOrmRepository<T extends ObjectLiteral>
  implements DBConnection<T>
{
  protected abstract entityClass: typeof BaseEntity;

  protected constructor(protected repository: Repository<T>) {}

  createWithTransaction(entity: T, queryRunner?: QueryRunner): Promise<T> {
    if (queryRunner) {
      return queryRunner.manager
        .getRepository(this.entityClass)
        .save(entity as T);
    } else {
      return this.repository.save(entity) as Promise<T>;
    }
  }

  async removeWithTransaction(
    entityId: string,
    queryRunner?: QueryRunner,
  ): Promise<boolean> {
    const repo = queryRunner
      ? queryRunner.manager.getRepository(this.entityClass)
      : this.repository;

    const result = await repo.delete(entityId);

    return Boolean(result.affected);
  }

  getAll(): Promise<T[]> {
    return this.repository.find();
  }

  findManyBy(criteria: Criteria<T>): Promise<T[]> {
    const where = Object.entries(criteria).reduce((acc, [key, value]) => {
      acc[key] = Array.isArray(value) ? In(value) : value;
      return acc;
    }, {});

    return this.repository.find({ where });
  }

  findBy(data: Partial<T>): Promise<T | null> {
    return this.repository.findOne({
      where: data,
    });
  }

  async findOrFailBy(data: Partial<T>): Promise<T> {
    const item = await this.findBy(data);

    if (!item) {
      throw new NotFoundException('Entity not found');
    }

    return item;
  }

  async updateWithTransaction(
    id: string,
    payload: T,
    queryRunner?: QueryRunner,
  ): Promise<boolean> {
    const repo = queryRunner
      ? queryRunner.manager.getRepository(this.entityClass)
      : this.repository;

    const result = await repo.update(id, payload as QueryDeepPartialEntity<T>);

    return Boolean(result.affected);
  }
}
