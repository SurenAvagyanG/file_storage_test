import { OrderEnum } from '@infrastructure/common/database/enums';

export interface OrderInterface {
  value: string[];
  type: OrderEnum;
}
