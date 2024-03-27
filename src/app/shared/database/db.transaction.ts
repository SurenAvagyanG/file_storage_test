export interface IDBTransactionService {
  startTransaction(): Promise<IDBTransactionRunner>;
}

export interface IDBTransactionRunner {
  commitTransaction(): Promise<unknown>;
}
