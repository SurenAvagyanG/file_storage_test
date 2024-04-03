export interface IDBTransactionService {
  startTransaction(): Promise<IDBTransactionRunner>;
  run<T>(callback: (runner: IDBTransactionRunner) => T): Promise<T>;
}

export interface IDBTransactionRunner {
  commitTransaction(): Promise<unknown>;
}
