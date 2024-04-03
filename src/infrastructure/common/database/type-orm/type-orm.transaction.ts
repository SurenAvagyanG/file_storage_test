import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { QueryRunner } from 'typeorm/query-runner/QueryRunner';
import { IDBTransactionRunner } from '@infrastructure/common';

@Injectable()
export class TypeOrmTransactionService {
  constructor(private dataSource: DataSource) {}

  async startTransaction(): Promise<QueryRunner> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    return queryRunner;
  }

  async run<T>(callback: (runner: IDBTransactionRunner) => T): Promise<T> {
    const runner = await this.startTransaction();
    const result = await callback(runner);
    await runner.commitTransaction();
    return result;
  }
}
