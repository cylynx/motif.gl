/**
 * Find the `testid` of specific element
 * @param {TemplateStringsArray} strings
 * @param {any[]} values
 *
 * @return {string}
 */
export const testid = (
  strings: TemplateStringsArray,
  ...values: any[]
): string => {
  const id = strings
    .map((str: string, index: number) => str + (values[index] || ''))
    .join('');
  return `[data-testid="${id}"]`;
};
