import { QueryRunner } from 'typeorm/query-runner/QueryRunner';
import {
  Criteria,
  CustomFindOptions,
  GetAverageByInterface,
} from '@infrastructure/common/database/types';
import { FindManyEnum } from '@infrastructure/common/database/enums';
import {
  CommonEntity,
  DBConnection,
  IDBTransactionRunner,
} from '@infrastructure/common';

export class BaseService<T extends CommonEntity> {
  constructor(protected repository: DBConnection<T>) {}

  async create(
    createDto: Partial<T>,
    runner?: IDBTransactionRunner,
  ): Promise<T> {
    return this.repository.createWithTransaction(createDto, runner);
  }

  async update(
    id: string,
    dto: Partial<T>,
    runner?: IDBTransactionRunner,
  ): Promise<T> {
    await this.findOrFailBy({ id });

    await this.repository.updateWithTransaction(id as string, dto, runner);

    return this.findOrFailBy({ id }, runner);
  }

  async delete(id: string, runner?: IDBTransactionRunner): Promise<T> {
    const entity = await this.findOrFailBy({ id });

    await this.repository.removeWithTransaction(id, runner);

    return entity;
  }

  async deleteHard(id: string, runner?: IDBTransactionRunner): Promise<T> {
    const entity = await this.findOrFailBy({ id });

    await this.repository.removeHardWithTransaction(id, runner);

    return entity;
  }

  async findBy(
    data: Criteria<T>,
    options?: CustomFindOptions<T>,
    queryRunner?: IDBTransactionRunner,
  ): Promise<T | null> {
    return this.repository.findBy(data, options, queryRunner);
  }

  async findAll(
    data: Criteria<T>,
    options: CustomFindOptions<T> = {},
    queryRunner?: QueryRunner,
    findManyEnum?: FindManyEnum,
  ): Promise<T[]> {
    return this.repository.findManyBy(data, options, queryRunner, findManyEnum);
  }

  async getAll(): Promise<T[]> {
    return this.repository.findManyBy({});
  }

  async getAverageBy(
    criterion: GetAverageByInterface,
    fieldName: string,
    queryRunner?: QueryRunner,
  ): Promise<number> {
    return this.repository.getAverageBy(criterion, fieldName, queryRunner);
  }

  async findOrFailBy(
    data: Criteria<T>,
    runner?: IDBTransactionRunner,
    options?: CustomFindOptions<T>,
  ): Promise<T> {
    return this.repository.findOrFailBy(data, runner, options);
  }

  async findCountBy(data: Criteria<T>): Promise<number> {
    return this.repository.findCountBy(data);
  }

  async bulkInsert(
    entityIds: Partial<T>[],
    queryRunner?: IDBTransactionRunner,
  ): Promise<T[]> {
    return this.repository.bulkInsert(entityIds, queryRunner);
  }

  async bulkDelete(
    entityIds: string[],
    queryRunner?: IDBTransactionRunner,
  ): Promise<boolean> {
    return this.repository.bulkDelete(entityIds, queryRunner);
  }
}
