import {
  Criteria,
  CustomFindOptions,
} from '@infrastructure/common/database/types';
import { QueryRunner } from 'typeorm/query-runner/QueryRunner';
import { BaseEntity, Repository } from 'typeorm';
import { ObjectLiteral } from 'typeorm/common/ObjectLiteral';

export abstract class FindManyServiceAbstract<T extends ObjectLiteral> {
  protected constructor(protected repository: Repository<T>) {}

  abstract findManyBy(
    criteria: Criteria<T>,
    options: CustomFindOptions<T>,
    entityClass: typeof BaseEntity,
    queryRunner?: QueryRunner,
  ): Promise<T[]>;
}
