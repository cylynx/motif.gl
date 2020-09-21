import get from 'lodash/get';
import * as Graph from '../types/Graph';

// Assume we can style an edge by its width, color and label
// Each should be able to map to a edge property e.g. value or length or amount
// There might be additional options passed as well e.g. width can be scaled based on different formulas applied to property
// For each property there should be a default action, if for example there is no edge width option passed

/**
 * Style an edge dataset based on a given method
 *
 * @param {Graph.GraphData} data
 * @param {string} method
 * @param {string} edgeWidth
 * @return {*}  {Graph.Edge[]}
 */
export const styleEdge = (
  data: Graph.GraphData,
  method: string,
  edgeWidth: string,
): Graph.Edge[] => {
  // Scales width based on min, max value of edges
  // mode = eth (scale width from 0.5-5) or fix (default value of 0.5)
  const modEdges = [];
  const { min, max } = getMinMaxValue(data, edgeWidth);
  for (const edge of data.edges) {
    const edgeCopy = { ...edge };
    let w = 2; // default
    if (method === 'value') {
      w =
        (((get(edge, edgeWidth) as number) - min) / (max - min)) * (10 - 2) + 2;
    }
    edgeCopy.style = {
      ...edgeCopy.style,
      line: {
        width: w,
      },
    };
    // Display edge value as default when edges are not grouped for now
    edgeCopy.label = get(edge, edgeWidth).toString();
    modEdges.push(edgeCopy);
  }
  return modEdges;
};

/**
 * Style a group edge dataset based on a given method
 *
 * @param {Graph.GraphData} data
 * @param {string} method
 * @param {string} edgeWidth
 * @return {*}  {Graph.Edge[]}
 */
export const styleGroupedEdge = (
  data: Graph.GraphData,
  method: string,
  edgeWidth: string,
): Graph.Edge[] => {
  const modEdges = [];
  for (const edge of data.edges) {
    const edgeCopy = { ...edge };
    let w = 2; // default
    if (method === 'value') {
      const { min, max } = getMinMaxValue(data, edgeWidth);
      w =
        (((get(edge, edgeWidth) as number[]).reduce((a, b) => a + b, 0) - min) /
          (max - min)) *
          (10 - 2) +
        2;
    }
    edgeCopy.style = {
      ...edgeCopy.style,
      line: {
        width: w,
      },
    };
    modEdges.push(edgeCopy);
  }
  return modEdges;
};

/**
 * Get minimum and maximum value of attribute that maps to edge width
 *
 * @param {Graph.GraphData} data
 * @param {string} edgeWidth accesor string that maps to edge width
 * @return {*}  {MinMax}
 */
export const getMinMaxValue = (
  data: Graph.GraphData,
  edgeWidth: string,
): MinMax => {
  const arrValue = [];
  for (const edge of data.edges) {
    if (isGroupEdges(edge, edgeWidth)) {
      // isGroupEdges ensures that it is of type number[]. Sum all values in array
      arrValue.push(
        (get(edge, edgeWidth) as number[]).reduce((a, b) => a + b, 0),
      );
    } else {
      arrValue.push(get(edge, edgeWidth));
    }
  }
  return {
    min: Math.min(...(arrValue as number[])),
    max: Math.max(...(arrValue as number[])),
  };
};
