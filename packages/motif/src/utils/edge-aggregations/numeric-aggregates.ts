import { IUserEdge } from '@cylynx/graphin';
import { mapCollectionFields } from '../data-utils/data-utils';

const noValueString = 'no-values';
/**
 * Returns the lowest-valued edge fields.
 *
 * @param graphEdges - graph edges
 * @param field - accessors on graph edge's field for mapping
 * @return {string | number} - select lowest value and return
 */
export const min = (
  graphEdges: IUserEdge[],
  field: string,
): number | string => {
  const fieldsValues: number[] = mapCollectionFields(graphEdges, field);

  if (fieldsValues.length === 0) {
    return noValueString;
  }

  const minimumValue: number = Math.min(...fieldsValues);
  return minimumValue;
};

/**
 * Returns the lowest-valued edge fields.
 *
 * @param graphEdges - graph edges
 * @param field - accessors on graph edge's field for mapping
 * @return {string | number} - select largest value and return
 */
export const max = (
  graphEdges: IUserEdge[],
  field: string,
): number | string => {
  const fieldsValues: number[] = mapCollectionFields(graphEdges, field);

  if (fieldsValues.length === 0) {
    return noValueString;
  }

  const largestValue: number = Math.max(...fieldsValues);
  return largestValue;
};

/**
 * Compute the sum of values in graph edges with given field.
 *
 * @param graphEdges - graph edges
 * @param field - edge field to perform computations
 * @return {string | number} - sum of values
 */
export const sum = (
  graphEdges: IUserEdge[],
  field: string,
): number | string => {
  const fieldsValues: number[] = mapCollectionFields(graphEdges, field);

  if (fieldsValues.length === 0) {
    return noValueString;
  }

  const sumValue: number = fieldsValues.reduce(
    (acc: number, value: number) => acc + value,
    0,
  );

  return sumValue;
};

/**
 * Calculate the number of value in edge collections
 *
 * @param graphEdges - graph edges
 * @param field - edge field to perform computations
 * @return {number} - count of values
 */
export const count = (graphEdges: IUserEdge[], field: string): number => {
  const fieldsValues: number[] = mapCollectionFields(graphEdges, field);
  const countValues: number = fieldsValues.length;

  return countValues;
};

/**
 * Calculate the average of numeric value in edge collections
 *
 * @param graphEdges - graph edges
 * @param field - edge field to perform computations
 * @return {string | number} - average of number collections
 */
export const average = (
  graphEdges: IUserEdge[],
  field: string,
): string | number => {
  const fieldsValues: number[] = mapCollectionFields(graphEdges, field);

  if (fieldsValues.length === 0) {
    return noValueString;
  }

  // cannot perform division with zero
  const sumValues = sum(graphEdges, field) as number;
  if (sumValues === 0) return 0;

  const countValue = fieldsValues.length;
  return sumValues / countValue || 0;
};
