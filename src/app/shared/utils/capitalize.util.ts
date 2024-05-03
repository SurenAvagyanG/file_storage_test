const capitalizeFirstWord = (s: string): string => {
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const capitalizeParams = (params = {}): Record<string, unknown> => {
  if (!params) return {};

  return Object.keys(params).reduce((newParams, currentKey) => {
    const capitalizedKey = capitalizeFirstWord(currentKey);
    newParams[capitalizedKey] = params[currentKey];
    return newParams;
  }, {});
};

export { capitalizeFirstWord, capitalizeParams };
