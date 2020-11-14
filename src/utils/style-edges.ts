/* eslint-disable no-param-reassign */
import get from 'lodash/get';
import * as Graph from '../types/Graph';

// Assume we can style an edge by its width, color and label
// Each should be able to map to a edge property e.g. value or length or amount
// There might be additional options passed as well e.g. width can be scaled based on different formulas applied to property
// For each property there should be a default action, if for example there is no edge width option passed
// Loop through each styling accessor and transform them based on the input option

/**
 * Style an edge dataset based on a given method
 *
 * @param {Graph.GraphData} data
 * @param {Graph.EdgeStyleOptions} edgeStyleOptions
 * @param {Graph.EdgeStyleAccessors} edgeStyleAccessors
 * @return {*}  {Graph.Edge[]}
 */
export const styleEdges = (
  data: Graph.GraphData,
  edgeStyleOptions: Graph.EdgeStyleOptions,
  edgeStyleAccessors: Graph.EdgeStyleAccessors,
) => {
  if (edgeStyleOptions.width) {
    styleEdgeWidth(data, edgeStyleOptions.width);
  }
  if (edgeStyleOptions.pattern) {
    styleEdgePattern(data, edgeStyleOptions.pattern);
  }
  if (edgeStyleOptions.fontSize) {
    styleEdgeFontSize(data, edgeStyleOptions.fontSize);
  }
  styleEdgeLabel(data, edgeStyleAccessors?.label);
};

/**
 * Utility function to map a edge property between a given range
 *
 * @param {Graph.Edge[]} edges
 * @param {string} propertyName
 * @param {[number, number]} visualRange
 */
export const mapEdgeWidth = (
  edges: Graph.Edge[],
  propertyName: string,
  visualRange: [number, number],
) => {
  let minp = 9999999999;
  let maxp = -9999999999;
  edges.forEach((edge) => {
    edge.defaultStyle.width = get(edge, propertyName) ** (1 / 3);
    minp = edge.defaultStyle.width < minp ? edge.defaultStyle.width : minp;
    maxp = edge.defaultStyle.width > maxp ? edge.defaultStyle.width : maxp;
  });
  const rangepLength = maxp - minp;
  const rangevLength = visualRange[1] - visualRange[0];
  edges.forEach((edge) => {
    edge.defaultStyle.width =
      ((get(edge, propertyName) ** (1 / 3) - minp) / rangepLength) *
        rangevLength +
      visualRange[0];
  });
};

export const styleEdgeWidth = (
  data: Graph.GraphData,
  option: Graph.EdgeWidth,
) => {
  if (option.id === 'fixed') {
    for (const edge of data.edges) {
      edge.defaultStyle.width = option.value;
    }
  } else if (option.id === 'property' && option.variable) {
    mapEdgeWidth(data.edges, option.variable, option.range);
  }
};

export const styleEdgeLabel = (
  data: Graph.GraphData,
  accessor: string | undefined,
) => {
  if (typeof accessor === 'string') {
    for (const edge of data.edges) {
      edge.label = get(edge, accessor).toString();
    }
  }
};

export const styleEdgePattern = (data: Graph.GraphData, pattern: string) => {
  for (const edge of data.edges) {
    if (pattern === 'none') {
      delete edge.defaultStyle.pattern;
    } else {
      edge.defaultStyle.pattern = pattern;
    }
  }
};

export const styleEdgeFontSize = (data: Graph.GraphData, fontSize: number) => {
  for (const edge of data.edges) {
    edge.defaultStyle.fontSize = fontSize;
  }
};

type MinMax = {
  min: number;
  max: number;
};

/**
 * Check edge.data.value is array to determine if it is grouped
 *
 * @param {Graph.Edge} edge
 * @param {string} edgeWidth accesor function that maps to edge width
 */
export const isGroupEdges = (edge: Graph.Edge, edgeWidth: string) =>
  Array.isArray(get(edge, edgeWidth));

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
