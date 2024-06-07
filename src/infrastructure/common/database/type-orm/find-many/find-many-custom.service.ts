import {
  Criteria,
  CriteriaRegExp,
  CustomFindOptions,
  GeoLocatable,
  IOrder,
  OrderInterface,
  RangeInterface,
} from '@infrastructure/common/database/types';
import { QueryRunner } from 'typeorm/query-runner/QueryRunner';
import { FindManyServiceAbstract } from '@infrastructure/common/database/type-orm/find-many/find-many.service.abstract';
import { BaseEntity, Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { OrderEnum, RangeEnum } from '@infrastructure/common/database/enums';
import { ObjectLiteral } from 'typeorm/common/ObjectLiteral';

export class FindManyCustomService<
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

    const qb = repo.createQueryBuilder('entity') as SelectQueryBuilder<T>;
    this.applyCriteria(qb, criteria, options.isRegExp);

    this.buildOptions(qb, options);

    return qb.getMany();
  }

  applyCriteria(
    qb: SelectQueryBuilder<T>,
    criteria: Criteria<T> = {},
    isRegExp = false,
  ): void {
    for (const [key, value] of Object.entries({
      ...criteria,
      deletedAt: null,
    })) {
      if (!value) {
        continue;
      }

      if (
        typeof value === 'object' &&
        !this.geoLocationCheck(value as GeoLocatable) &&
        !this.whereBetweenCheck(value as RangeInterface)
      ) {
        this.applyCriteria(qb, this.getNestedCriteria(key, value), isRegExp);
        continue;
      }

      if (this.geoLocationCheck(value as GeoLocatable)) {
        this.applyGeoLocationCriteria(qb, key, value as GeoLocatable);
      } else if (this.whereBetweenCheck(value as RangeInterface)) {
        this.applyWhereBetweenCriteria(qb, key, value as RangeInterface);
      } else {
        this.applyStandardCriteria(qb, key, value as Criteria<T>, isRegExp);
      }
    }
  }

  private applyOrderByCriteria(
    qb: SelectQueryBuilder<T>,
    orderValue: OrderInterface,
  ): void {
    const { value, type } = orderValue;
    const orderQuery = value
      .map((id, index) => `WHEN '${id}' THEN ${index + 1}`)
      .join(' ');

    qb.addOrderBy(
      `CASE entity.id ${orderQuery} ELSE ${value.length} END`,
      type === OrderEnum.ASC ? 'ASC' : 'DESC',
    );
  }

  private applyGeoLocationCriteria(
    qb: SelectQueryBuilder<T>,
    key: string,
    geoCriteria: GeoLocatable,
  ): void {
    const { radius, long, lat, ...rest } = geoCriteria;

    qb.innerJoinAndSelect(`entity.${key}`, key);

    qb.andWhere(
      new Brackets((qb1) => {
        qb1.where(
          `(3959 * acos(cos(radians(:lat)) * cos(radians(${key}.lat)) *
        cos(radians(${key}.long) - radians(:long)) + sin(radians(:lat)) *
        sin(radians(${key}.lat)))) < :radius`,
          {
            lat,
            long,
            radius,
          },
        );
      }),
    );

    Object.entries(rest).forEach(([subKey, subValue]) => {
      const criteriaValue = subValue as CriteriaRegExp;
      this.applyStandardCriteria(
        qb as SelectQueryBuilder<T>,
        `${key}.${subKey}`,
        criteriaValue.value,
        criteriaValue.isRegExp,
      );
    });
  }

  private applyWhereBetweenCriteria(
    qb: SelectQueryBuilder<T>,
    key: string,
    value: RangeInterface,
  ): void {
    const k = this.keyCheck(key);

    qb.innerJoinAndSelect(`entity.${k}`, k);
    switch (value.type) {
      case RangeEnum.Between:
        if (value.lessThanOrEqual && value.moreThanOrEqual) {
          qb.andWhere(`${key} BETWEEN :lessThanOrEqual AND :moreThanOrEqual`, {
            lessThanOrEqual: value.lessThanOrEqual,
            moreThanOrEqual: value.moreThanOrEqual,
          });
        }
        break;
      case RangeEnum.MoreThanOrEqual:
        if (value.moreThanOrEqual) {
          qb.andWhere(`${key} >= :moreThanOrEqual`, {
            moreThanOrEqual: value.moreThanOrEqual,
          });
        }
        break;
      case RangeEnum.LessThanOrEqual:
        if (value.lessThanOrEqual) {
          qb.andWhere(`${key} <= :lessThanOrEqual`, {
            lessThanOrEqual: value.lessThanOrEqual,
          });
        }
        break;
      default:
        break;
    }
  }

  private applyStandardCriteria(
    qb: SelectQueryBuilder<T>,
    key: string,
    value: Criteria<T> | string,
    isRegExp: boolean,
  ): void {
    if (isRegExp && typeof value === 'string') {
      qb.andWhere(`${key} LIKE :value`, { value: `${value}%` });
    } else if (Array.isArray(value)) {
      qb.andWhere(`${key} IN (:...value)`, { value });
    } else {
      qb.andWhere(`${key} = :value`, { value });
    }
  }

  private buildOptions(
    qb: SelectQueryBuilder<T>,
    options: CustomFindOptions<T> = {},
  ): CustomFindOptions<T> {
    if (options.skip && options.take) {
      options.skip = (options.skip - 1) * options.take;
      qb.skip(options.skip).take(options.take);
    }

    if (options.relations) {
      this.applyRelations(qb, options.relations);
    }

    if (options.order) {
      const { order } = options;
      if (this.whereOrderBy(order as OrderInterface)) {
        this.applyOrderByCriteria(qb, options.order as OrderInterface);
      } else {
        const { type, field } = order as IOrder;
        options.order = { [`${field}`]: type };
      }
    }

    return options;
  }

  private applyRelations(qb: SelectQueryBuilder<T>, relations: string[]): void {
    relations.forEach((relation) => {
      const nestedRelations = relation.split('.');
      let currentAlias = 'entity';
      nestedRelations.forEach((rel, index) => {
        const nextAlias = nestedRelations.slice(0, index + 1).join('_');
        if (
          !qb.expressionMap.aliases.some((alias) => alias.name === nextAlias)
        ) {
          qb.leftJoinAndSelect(`${currentAlias}.${rel}`, nextAlias);
        }
        currentAlias = nextAlias;
      });
    });
  }

  private whereBetweenCheck(value: RangeInterface): boolean {
    return value.type && (!!value.lessThanOrEqual || !!value.moreThanOrEqual);
  }

  private whereOrderBy(orderValue: OrderInterface): boolean {
    return orderValue?.type && Array.isArray(orderValue.value);
  }

  private geoLocationCheck(value: GeoLocatable): boolean {
    return !!value.lat && !!value.long && !!value.radius;
  }

  private keyCheck(key: string): string {
    const [value] = key.split('.');

    return value;
  }

  private getNestedCriteria(key: string, value: object): Criteria<T> {
    return Object.entries(value).reduce((acc, [subKey, subValue]) => {
      acc[`${key}.${subKey}`] = subValue;
      return acc;
    }, {});
  }
}
