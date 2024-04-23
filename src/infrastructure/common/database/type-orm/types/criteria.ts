import { FindOperator } from 'typeorm';

export type Criteria<T> = {
  [K in keyof T]?: T[K][] | FindOperator<T[K]>;
};
