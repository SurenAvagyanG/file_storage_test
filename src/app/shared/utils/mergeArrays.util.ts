import { BadRequestException } from '@nestjs/common';

export const mergeArraysUtil = <T>(
  array1: Record<string, unknown>[],
  array2: Record<string, unknown>[],
): T[] => {
  if (array1.length !== array2.length) {
    throw new BadRequestException('Trying to join arrays of unequal sizes');
  }

  const mergedArray: Record<string, unknown>[] = [];
  array1.forEach((item, index) => {
    mergedArray.push({ ...item, ...array2[index] });
  });

  return mergedArray as T[];
};
