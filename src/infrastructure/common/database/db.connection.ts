import { IDBTransactionRunner } from './db.transaction';
import { Criteria } from '@infrastructure/common/database/type-orm/types';

export interface DBConnection<T> {
  createWithTransaction(
    entity: Partial<T>,
    queryRunner?: IDBTransactionRunner,
  ): Promise<T>;

  removeWithTransaction(
    entityId: string,
    queryRunner?: IDBTransactionRunner,
  ): Promise<boolean>;

  findManyByCriteria(criteria: Criteria<T>): Promise<T[]>;

  findBy(data: Partial<T>): Promise<T | null>;
  findOrFailBy(data: Partial<T>): Promise<T>;

  updateWithTransaction(
    id: string,
    payload: Partial<T>,
    queryRunner?: IDBTransactionRunner,
  ): Promise<boolean>;
}
