/**
 * Find the `testid` of specific element
 * @param strings
 * @param values
 *
 * @return {string}
 */
export const testid = (strings: string, ...values): string => {
  const id = strings.map((str, index) => str + (values[index] || '')).join('');
  return `[data-testid="${id}"]`;
};
