export type Criteria<T> = {
  [K in keyof T]?: T[K][];
};
