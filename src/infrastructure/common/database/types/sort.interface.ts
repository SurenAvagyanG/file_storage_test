import { SortOrder } from '@infrastructure/common/database/types/sort-order';

export interface IOrder {
  type: SortOrder;
  field: string;
}
