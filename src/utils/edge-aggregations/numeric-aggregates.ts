import { get } from 'lodash';
import { Edge } from '../../redux/graph/types';

/**
 * Returns the lowest-valued edge fields.
 * 1. Eliminates undefined values with given fields.
 * 2. Convert edge list to number collection for Math.min
 * 3. The lowest value will be selected and returned.
 *
 * Attempt to perform Step 1. and 2. with single loop
 * results in violates eslint.
 *
 * @param graphEdges - graph edges
 * @param field - accessors on graph edge's field for mapping
 * @return {number} - select lowest value and return
 */
export const min = (graphEdges: Edge[], field: string): number => {
  // eslint-disable-next-line array-callback-return,consistent-return
  const fieldsValues: number[] = graphEdges.map((edge: Edge) => {
    const property = get(edge, field);
    if (property) return property;
  });

  const minimumValue: number = Math.min(...fieldsValues);
  return minimumValue;
};

/**
 * Returns the lowest-valued edge fields.
 * 1. Eliminates undefined values with given fields.
 * 2. Convert edge list to number collection
 * 3. The largest value will be selected and returned.
 *
 * Attempt to perform Step 1. and 2. with single loop
 * results in violates eslint.
 *
 * @param graphEdges - graph edges
 * @param field - accessors on graph edge's field for mapping
 * @return {number} - select largest value and return
 */
export const max = (graphEdges: Edge[], field: string): number => {
  // eslint-disable-next-line array-callback-return,consistent-return
  const fieldsValues: number[] = graphEdges.map((edge: Edge) => {
    const property = get(edge, field);
    if (property) return property;
  });

  const largestValue: number = Math.max(...fieldsValues);
  return largestValue;
};

/**
 * Compute the sum of values in graph edges with given field.
 * 1. Eliminates undefined values with given fields.
 * 2. Convert edge list to number collection
 * 3. The sum of value will be return.
 *
 * @param graphEdges - graph edges
 * @param field - edge field to perform computations
 * @return {number} - sum of values
 */
export const sum = (graphEdges: Edge[], field: string): number => {
  const sumValue: number = graphEdges
    // eslint-disable-next-line array-callback-return,consistent-return
    .map((edge: Edge) => {
      const property = get(edge, field);
      if (property) return property;
    })
    .reduce((acc: number, value: number) => acc + value, 0);

  return sumValue;
};

/**
 * Calculate the number of value in edge collections
 * 1. Eliminates undefined values with given fields
 * 2. Convert edge list to number collection
 * 3. The count of values will be return
 *
 * @param graphEdges - graph edges
 * @param field - edge field to perform computations
 * @return {number} - count of values
 */
export const count = (graphEdges: Edge[], field: string): number => {
  const countValues: number = graphEdges
    // eslint-disable-next-line array-callback-return,consistent-return
    .map((edge: Edge) => {
      const property = get(edge, field);
      if (property) return property;
    }).length;

  return countValues;
};

/**
 * Calculate the average of numeric value in edge collections
 * 1. Eliminates undefined values with given fields
 * 2. Convert edge list to number collection
 * 3. The average of number collection will be return
 *
 * @param graphEdges - graph edges
 * @param field - edge field to perform computations
 * @return {number} - average of number collections
 */
export const average = (graphEdges: Edge[], field: string): number => {
  const numberValues: number[] = graphEdges
    // eslint-disable-next-line array-callback-return,consistent-return
    .map((edge: Edge) => {
      const property = get(edge, field);
      if (property) return property;
    });

  // cannot perform division with zero
  const sumValues = sum(graphEdges, field);
  if (sumValues === 0) return 0;

  const countValue = numberValues.length;
  return sumValues / countValue || 0;
};
