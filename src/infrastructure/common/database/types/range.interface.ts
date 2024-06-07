import { RangeEnum } from '@infrastructure/common/database/enums';

export interface RangeInterface {
  type: RangeEnum;
  moreThanOrEqual: Date | number;
  lessThanOrEqual: Date | number;
  moreThan: Date | number;
  lessThan: Date | number;
}
