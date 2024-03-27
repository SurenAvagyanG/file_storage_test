import { Repository, BaseEntity, FindOptionsWhere } from 'typeorm';
import { QueryRunner } from 'typeorm/query-runner/QueryRunner';
import { DBConnection } from '../db.connection';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export abstract class BaseTypeOrmRepository<T> implements DBConnection<T> {
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

  findBy(field: keyof T, value: unknown): Promise<T> {
    return this.repository.findOne({
      where: {
        [field]: value,
      } as FindOptionsWhere<T>,
    });
  }

  update(id: string, payload: T): Promise<T> {
    return this.repository.update(
      id,
      payload as QueryDeepPartialEntity<T>,
    ) as Promise<T>;
  }
}
