import { IOrder, ObjectLiteral, OrderInterface } from '../types';

export interface CustomFindOptions<T> {
  select?: (keyof T)[];
  where?: Partial<T>;
  order?: IOrder | ObjectLiteral | OrderInterface;
  skip?: number;
  take?: number;
  isRegExp?: boolean;
  relations?: string[];
}
