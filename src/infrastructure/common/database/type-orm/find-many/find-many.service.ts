import {
  Criteria,
  CustomFindOptions,
  IOrder,
  RangeInterface,
} from '@infrastructure/common/database/types';
import { QueryRunner } from 'typeorm/query-runner/QueryRunner';
import { FindManyServiceAbstract } from '@infrastructure/common/database/type-orm/find-many/find-many.service.abstract';
import {
  BaseEntity,
  Between,
  FindOptionsWhere,
  In,
  LessThan,
  LessThanOrEqual,
  Like,
  MoreThan,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { RangeEnum } from '@infrastructure/common/database/enums';
import { ObjectLiteral } from 'typeorm/common/ObjectLiteral';

export class FindManyService<
  T extends ObjectLiteral,
> extends FindManyServiceAbstract<T> {
  constructor(repository: Repository<T>) {
    super(repository);
  }

  findManyBy(
    criteria: Criteria<T>,
    options: CustomFindOptions<T> = {},
    entityClass: typeof BaseEntity,
    queryRunner?: QueryRunner,
  ): Promise<T[]> {
    const repo = queryRunner
      ? queryRunner.manager.getRepository(entityClass)
      : this.repository;

    const where = this.buildWhere(criteria, options.isRegExp);

    const findOptions = this.buildOptions(options);

    return repo.find({ where, ...findOptions } as Criteria<T>) as Promise<T[]>;
  }

  buildWhere(criteria: Criteria<T>, isRegExp = false): FindOptionsWhere<T> {
    return Object.entries({
      ...criteria,
      deletedAt: null,
    }).reduce((acc, [key, value]) => {
      if (isRegExp && typeof value === 'string') {
        acc[key] = Like(`${value}%`);
      } else if (Array.isArray(value)) {
        acc[key] = In(value);
      } else if (typeof value === 'object' && value !== null) {
        if (this.whereBetweenCheck(value as RangeInterface)) {
          this.whereBetween(value, acc, key);
        } else {
          acc[key] = this.buildWhere(value);
        }
      } else {
        acc[key] = value;
      }

      return acc;
    }, {});
  }

  private buildOptions(
    options: CustomFindOptions<T> = {},
  ): CustomFindOptions<T> {
    if (options.skip && options.take) {
      options.skip = (options.skip - 1) * options.take;
    }

    if (options.order) {
      const { type, field } = options.order as IOrder;
      options.order = {
        [`${field}`]: type,
      };
    }

    return options;
  }

  private whereBetween(
    criteria: Criteria<T>,
    acc: object,
    key: string,
  ): object {
    const value = criteria as RangeInterface;

    switch (value.type) {
      case RangeEnum.Between:
        if (value.lessThanOrEqual && value.moreThanOrEqual) {
          acc[key] = Between(value.lessThanOrEqual, value.moreThanOrEqual);
        }
        break;
      case RangeEnum.MoreThanOrEqual:
        if (value.moreThanOrEqual) {
          acc[key] = MoreThanOrEqual(value.moreThanOrEqual);
        }
        break;
      case RangeEnum.LessThanOrEqual:
        if (value.lessThanOrEqual) {
          acc[key] = LessThanOrEqual(value.lessThanOrEqual);
        }
        break;
      case RangeEnum.MoreThan:
        if (value.moreThan) {
          acc[key] = MoreThan(value.moreThan);
        }
        break;
      case RangeEnum.LessThan:
        if (value.lessThan) {
          acc[key] = LessThan(value.lessThan);
        }
        break;
      default:
        break;
    }

    return acc;
  }

  private whereBetweenCheck(value: RangeInterface): boolean {
    return value.type && (!!value.lessThanOrEqual || !!value.moreThanOrEqual);
  }
}
