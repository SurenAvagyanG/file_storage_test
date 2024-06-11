import { IDBTransactionRunner } from './db.transaction';
import {
  Criteria,
  CustomFindOptions,
  GetAverageByInterface,
} from '@infrastructure/common/database/types';
import { ObjectLiteral } from 'typeorm/common/ObjectLiteral';
import { QueryRunner } from 'typeorm/query-runner/QueryRunner';
import { FindManyEnum } from '@infrastructure/common/database/enums';

export interface DBConnection<T> {
  createWithTransaction(
    entity: Partial<T>,
    queryRunner?: IDBTransactionRunner,
  ): Promise<T>;

  bulkInsert(
    entities: Partial<T>[],
    queryRunner?: IDBTransactionRunner,
  ): Promise<T[]>;

  bulkDelete(
    entities: string[],
    queryRunner?: IDBTransactionRunner,
  ): Promise<boolean>;

  removeWithTransaction(
    entityId: string,
    queryRunner?: IDBTransactionRunner,
  ): Promise<boolean>;

  removeHardWithTransaction(
    entityId: string,
    queryRunner?: IDBTransactionRunner,
  ): Promise<boolean>;

  findManyBy(
    criteria: Criteria<T>,
    options?: CustomFindOptions<T>,
    queryRunner?: QueryRunner,
    findManyEnum?: FindManyEnum,
  ): Promise<T[]>;

  findBy(
    data: Criteria<T>,
    options?: CustomFindOptions<T>,
    queryRunner?: IDBTransactionRunner,
  ): Promise<T | null>;

  findOrFailBy(
    data: Criteria<T>,
    queryRunner?: IDBTransactionRunner,
    options?: CustomFindOptions<T>,
  ): Promise<T>;

  updateWithTransaction(
    id: string,
    payload: Partial<T>,
    queryRunner?: IDBTransactionRunner,
  ): Promise<boolean>;

  findCountBy(
    criteria: Criteria<T>,
    queryRunner?: QueryRunner,
  ): Promise<number>;

  getMax(fieldName: string, conditions: ObjectLiteral): Promise<number>;

  getAverageBy(
    criterion: GetAverageByInterface,
    fieldName: string,
    queryRunner?: QueryRunner,
  ): Promise<number>;
}
