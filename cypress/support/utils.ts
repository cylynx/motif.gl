/**
 * Find the `testid` of specific element
 * @param {string} strings
 * @param {any[]} values
 *
 * @return {string}
 */
export const testid = (strings: string[], ...values: any[]): string => {
  const id = strings
    .map((str: string, index: number) => str + (values[index] || ''))
    .join('');
  return `[data-testid="${id}"]`;
};
