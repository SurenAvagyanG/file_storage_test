import { IDBTransactionRunner } from './db.transaction';

export interface DBConnection<T> {
  createWithTransaction(
    entity: Partial<T>,
    queryRunner?: IDBTransactionRunner,
  ): Promise<T>;

  removeWithTransaction(
    entityId: string,
    queryRunner?: IDBTransactionRunner,
  ): Promise<boolean>;

  findBy(field: keyof T, value: unknown): Promise<T | null>;

  update(id: string, payload: Partial<T>): Promise<boolean>;
}
