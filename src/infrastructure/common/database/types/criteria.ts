export type Criteria<T> = {
  [K in keyof T]?: unknown;
};
