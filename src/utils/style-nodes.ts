/* eslint-disable no-param-reassign */
import get from 'lodash/get';
import isUndefined from 'lodash/isUndefined';
import * as Graph from '../containers/Graph/types';
import { CATEGORICAL_COLOR, DARK_GREY } from '../constants/colors';

/**
 * Main function to style nodes
 *
 * @param {Graph.GraphData} data
 * @param {Graph.NodeStyleOptions} nodeStyleOptions
 * @return {*}  {Graph.Node[]}
 */
export const styleNodes = (
  data: Graph.GraphData,
  nodeStyleOptions: Graph.NodeStyleOptions,
) => {
  // Separated out as it cannot be done in the loop
  if (nodeStyleOptions.size && nodeStyleOptions.size.id !== 'fixed') {
    styleNodeSizeByProp(data, nodeStyleOptions.size);
  }

  // For perf reasons, batch style operations which require a single loop through nodes
  for (const node of data.nodes) {
    if (nodeStyleOptions.size && nodeStyleOptions.size.id === 'fixed') {
      node.defaultStyle.size = nodeStyleOptions.size.value;
    }
    if (nodeStyleOptions.color) {
      styleNodeColor(node, nodeStyleOptions.color);
    }
    if (nodeStyleOptions.fontSize) {
      styleFontSize(node, nodeStyleOptions.fontSize);
    }
    if (nodeStyleOptions.label) {
      styleNodeLabel(node, nodeStyleOptions.label);
    }
  }
};

/**
 * Generate default nodes color map
 *
 * @param {Graph.Node[]} nodes
 * @param {Graph.NodeColor} options
 */
export const generateDefaultColorMap = (
  nodes: Graph.Node[],
  options: Graph.NodeColor,
) => {
  const uniqueKeys = [
    ...new Set(
      // @ts-ignore
      nodes.map((node) => get(node, options.variable)),
    ),
  ];
  const mapping = {};
  const MAX_LEGEND_SIZE = CATEGORICAL_COLOR.length;
  for (const [i, value] of uniqueKeys.entries()) {
    // Assign undefined to grey and all others to last of colors
    if (i < MAX_LEGEND_SIZE && !isUndefined(value)) {
      mapping[value] = CATEGORICAL_COLOR[i];
    } else if (isUndefined(value)) {
      // eslint-disable-next-line @typescript-eslint/dot-notation
      mapping['undefined'] = DARK_GREY;
    } else {
      // eslint-disable-next-line prefer-destructuring
      mapping[value] = CATEGORICAL_COLOR[MAX_LEGEND_SIZE - 1];
    }
  }
  // @ts-ignore
  options.mapping = mapping;
};

/**
 * Utility function to map a node property between a given range
 *
 * @param {Graph.Node[]} nodes
 * @param {string} propertyName
 * @param {[number, number]} visualRange
 */
export const mapNodeSize = (
  nodes: Graph.Node[],
  propertyName: string,
  visualRange: [number, number],
) => {
  let minp = 9999999999;
  let maxp = -9999999999;
  nodes.forEach((node) => {
    node.defaultStyle.size = get(node, propertyName) ** (1 / 3);
    minp = node.defaultStyle.size < minp ? node.defaultStyle.size : minp;
    maxp = node.defaultStyle.size > maxp ? node.defaultStyle.size : maxp;
  });
  const rangepLength = maxp - minp;
  const rangevLength = visualRange[1] - visualRange[0];
  nodes.forEach((node) => {
    node.defaultStyle.size =
      ((get(node, propertyName) ** (1 / 3) - minp) / rangepLength) *
        rangevLength +
      visualRange[0];
  });
};

/**
 * Style node size based on a given method
 *
 * @param {Graph.GraphData} data
 * @param {(string | undefined)} accessor
 * @param {string} option
 */
export const styleNodeSizeByProp = (
  data: Graph.GraphData,
  option: Graph.NodeSize,
) => {
  if (option.id === 'degree') {
    data.nodes.forEach((node) => {
      node.degree = 0;
      data.edges.forEach((edge) => {
        if (edge.source === node.id || edge.target === node.id) {
          node.degree++;
        }
      });
    });
    mapNodeSize(data.nodes, 'degree', option.range);
  } else if (option.id === 'property' && option.variable) {
    mapNodeSize(data.nodes, option.variable, option.range);
  }
};

export const styleNodeLabel = (node: Graph.Node, label: string) => {
  if (label === 'none') {
    node.label = '';
  } else if (label !== 'label') {
    node.label = get(node, label, '').toString();
  }
};

export const styleNodeColor = (node: Graph.Node, option: Graph.NodeColor) => {
  if (option.id === 'fixed') {
    node.defaultStyle.color = option.value;
  } else if (option.id === 'legend') {
    const variable = get(node, option.variable);
    if (variable) {
      node.defaultStyle.color = option.mapping[variable];
    } else {
      node.defaultStyle.color = 'grey';
    }
  }
};

export const styleFontSize = (node: Graph.Node, fontSize: number) => {
  node.defaultStyle.fontSize = fontSize;
};

/**
 * Filter all edges which contains a given node id as source or target
 *
 * @param {Graph.GraphData} data
 * @param {string} id node id
 */
export const findConnectedEdges = (data: Graph.GraphData, id: string) =>
  data.edges.filter((e) => e.source === id || e.target === id);

/**
 * Get degree of a given node id
 *
 * @param {Graph.GraphData} data
 * @param {string} id node id
 */
export const getDegree = (data: Graph.GraphData, id: string) =>
  findConnectedEdges(data, id).length;

/**
 * Get degree of a given graph keyed by node id
 *
 * @param {Graph.GraphData} data
 * @return {*}  {(Record<string | number, number>)}
 */
export const getGraphDegree = (
  data: Graph.GraphData,
): Record<string | number, number> => {
  const nodeIds = [];
  const degree = {};
  for (const item of data.nodes) {
    nodeIds.push(item.id);
  }
  for (const id of nodeIds) {
    // Calculate degree
    degree[id] = getDegree(data, id);
  }
  return degree;
};
