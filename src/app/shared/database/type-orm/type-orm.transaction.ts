import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { QueryRunner } from 'typeorm/query-runner/QueryRunner';

@Injectable()
export class TypeOrmTransactionService {
  constructor(private dataSource: DataSource) {}

  async startTransaction(): Promise<QueryRunner> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    return queryRunner;
  }
}
