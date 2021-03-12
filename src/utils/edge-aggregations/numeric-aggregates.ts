import { get } from 'lodash';
import { IUserEdge } from '@antv/graphin';
import { mapCollectionFields } from '../data-utils';

/**
 * Returns the lowest-valued edge fields.
 *
 * @param graphEdges - graph edges
 * @param field - accessors on graph edge's field for mapping
 * @return {number} - select lowest value and return
 */
export const min = (graphEdges: IUserEdge[], field: string): number => {
  const fieldsValues: number[] = mapCollectionFields(graphEdges, field);
  const minimumValue: number = Math.min(...fieldsValues);
  return minimumValue;
};

/**
 * Returns the lowest-valued edge fields.
 *
 * @param graphEdges - graph edges
 * @param field - accessors on graph edge's field for mapping
 * @return {number} - select largest value and return
 */
export const max = (graphEdges: IUserEdge[], field: string): number => {
  const fieldsValues: number[] = mapCollectionFields(graphEdges, field);

  const largestValue: number = Math.max(...fieldsValues);
  return largestValue;
};

/**
 * Compute the sum of values in graph edges with given field.
 *
 * @param graphEdges - graph edges
 * @param field - edge field to perform computations
 * @return {number} - sum of values
 */
export const sum = (graphEdges: IUserEdge[], field: string): number => {
  const fieldsValues: number[] = mapCollectionFields(graphEdges, field);
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
 * @return {number} - average of number collections
 */
export const average = (graphEdges: IUserEdge[], field: string): number => {
  const fieldsValues: number[] = mapCollectionFields(graphEdges, field);

  // cannot perform division with zero
  const sumValues = sum(graphEdges, field);
  if (sumValues === 0) return 0;

  const countValue = fieldsValues.length;
  return sumValues / countValue || 0;
};
