import {
  Repository,
  BaseEntity,
  FindOptionsWhere,
  SelectQueryBuilder,
} from 'typeorm';
import { QueryRunner } from 'typeorm/query-runner/QueryRunner';
import { DBConnection } from '../db.connection';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { ObjectLiteral } from 'typeorm/common/ObjectLiteral';
import { NotFoundException } from '@nestjs/common';
import {
  Criteria,
  CustomFindOptions,
  GetAverageByInterface,
} from '@infrastructure/common/database/types';
import {
  FindManyCustomService,
  FindManyService,
} from '@infrastructure/common/database/type-orm/find-many';
import { FindManyEnum } from '@infrastructure/common/database/enums';

export abstract class BaseTypeOrmRepository<T extends ObjectLiteral>
  implements DBConnection<T>
{
  protected entityClass: typeof BaseEntity;
  private findManyService: FindManyService<T>;
  private findManyCustomService: FindManyCustomService<T>;

  protected constructor(protected repository: Repository<T>) {
    this.findManyService = new FindManyService(repository);
    this.findManyCustomService = new FindManyCustomService(repository);
  }

  async bulkInsert(
    entities: Partial<T>[],
    queryRunner?: QueryRunner,
  ): Promise<T[]> {
    const repo = queryRunner
      ? queryRunner.manager.getRepository(this.entityClass)
      : this.repository;

    const insertResult = await repo.insert(entities as T[]);

    const ids = insertResult.identifiers.map((identifier) => identifier.id);

    return await this.findManyBy(
      {
        id: ids,
      },
      {},
      queryRunner,
    );
  }

  findManyBy(
    criteria: Criteria<T>,
    options: CustomFindOptions<T> = {},
    queryRunner?: QueryRunner,
    findManyEnum?: FindManyEnum,
  ): Promise<T[]> {
    return findManyEnum === FindManyEnum.Custom
      ? this.findManyCustomService.findManyBy(
          criteria,
          options,
          this.entityClass,
          queryRunner,
        )
      : this.findManyService.findManyBy(
          criteria,
          options,
          this.entityClass,
          queryRunner,
        );
  }

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

    const result = await repo.softDelete(entityId);

    return Boolean(result.affected);
  }

  async removeHardWithTransaction(
    entityId: string,
    queryRunner?: QueryRunner,
  ): Promise<boolean> {
    const repo = queryRunner
      ? queryRunner.manager.getRepository(this.entityClass)
      : this.repository;

    const result = await repo.delete(entityId);

    return Boolean(result.affected);
  }

  findBy(
    criteria: Criteria<T>,
    options?: FindOptionsWhere<T>,
    queryRunner?: QueryRunner,
  ): Promise<T | null> {
    const repo = queryRunner
      ? queryRunner.manager.getRepository(this.entityClass)
      : this.repository;

    const where = this.findManyService.buildWhere(criteria);

    return repo.findOne({
      where,
      ...options,
    } as Criteria<T>) as Promise<T | null>;
  }

  async findOrFailBy(
    criteria: Criteria<T>,
    queryRunner?: QueryRunner,
    options: FindOptionsWhere<T> = {},
  ): Promise<T> {
    const item = await this.findBy(criteria, options, queryRunner);

    if (!item) {
      throw new NotFoundException('Entity not found');
    }

    return item;
  }

  async bulkDelete(
    entities: string[],
    queryRunner?: QueryRunner,
  ): Promise<boolean> {
    const repo = queryRunner
      ? queryRunner.manager.getRepository(this.entityClass)
      : this.repository;

    const result = await repo.delete(entities);

    return Boolean(result.affected);
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

  async getMax(fieldName: string, conditions: ObjectLiteral): Promise<number> {
    const queryBuilder = this.repository.createQueryBuilder('entity');

    queryBuilder.select(`MAX("${fieldName}")`, 'maxValue');

    this.findManyCustomService.applyCriteria(queryBuilder);

    Object.keys(conditions).forEach((key) => {
      queryBuilder.andWhere(`${key} = :value`, { value: conditions[key] });
    });

    const result = await queryBuilder.getRawOne();
    return result.maxValue || 0;
  }

  async findCountBy(
    criteria: Criteria<T>,
    queryRunner?: QueryRunner,
  ): Promise<number> {
    const repo = queryRunner
      ? queryRunner.manager.getRepository(this.entityClass)
      : this.repository;

    const where = this.findManyService.buildWhere(criteria);

    return repo.count({ where });
  }

  async getAverageBy(
    criterion: GetAverageByInterface,
    fieldName: string,
    queryRunner?: QueryRunner,
  ): Promise<number> {
    const repo = queryRunner
      ? queryRunner.manager.getRepository(this.entityClass)
      : this.repository;

    const queryBuilder = repo
      .createQueryBuilder('entity')
      .where(`entity.${criterion.key} = :${criterion.key}`, {
        [criterion.key]: criterion.value,
      });

    this.findManyCustomService.applyCriteria(
      queryBuilder as SelectQueryBuilder<T>,
    );

    queryBuilder.select(`AVG(entity.${fieldName})`, 'avg');

    const result = await queryBuilder.getRawOne();
    return +parseFloat(result.avg || 0).toFixed(1);
  }
}
