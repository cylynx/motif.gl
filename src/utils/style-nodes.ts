/* eslint-disable no-param-reassign */
import get from 'lodash/get';
import has from 'lodash/has';
import isUndefined from 'lodash/isUndefined';
import {
  GraphData,
  NodeStyleOptions,
  Node,
  NodeColor,
  NodeSize,
} from '../redux/graph/types';
import { CATEGORICAL_COLOR, DARK_GREY } from '../constants/colors';

/**
 * Main function to style nodes
 *
 * @param {GraphData} data
 * @param {NodeStyleOptions} nodeStyleOptions
 * @return {*}  {Node[]}
 */
export const styleNodes = (
  data: GraphData,
  nodeStyleOptions: NodeStyleOptions,
) => {
  // Separated out as it cannot be done in the loop
  if (nodeStyleOptions.size && nodeStyleOptions.size.id !== 'fixed') {
    styleNodeSizeByProp(data, nodeStyleOptions.size);
  }

  // For perf reasons, batch style operations which require a single loop through nodes
  for (const node of data.nodes) {
    if (nodeStyleOptions.size && nodeStyleOptions.size.id === 'fixed') {
      node.style.size = nodeStyleOptions.size.value;
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
 * @param {Node[]} nodes
 * @param {NodeColor} options
 */
export const generateDefaultColorMap = (nodes: Node[], options: NodeColor) => {
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
      // @ts-ignore
      mapping[value] = CATEGORICAL_COLOR[i];
    } else if (isUndefined(value)) {
      // eslint-disable-next-line @typescript-eslint/dot-notation
      mapping['undefined'] = DARK_GREY;
    } else {
      // eslint-disable-next-line prefer-destructuring
      // @ts-ignore
      mapping[value] = CATEGORICAL_COLOR[MAX_LEGEND_SIZE - 1];
    }
  }
  // @ts-ignore
  options.mapping = mapping;
};

/**
 * Utility function to map a node property between a given range
 *
 * @param {Node[]} nodes
 * @param {string} propertyName
 * @param {[number, number]} visualRange
 */
export const mapNodeSize = (
  nodes: Node[],
  propertyName: string,
  visualRange: [number, number],
) => {
  let minp = 9999999999;
  let maxp = -9999999999;

  nodes.forEach((node: Node) => {
    node.style.size = Number(get(node, propertyName)) ** (1 / 3);
    minp = node.style.size < minp ? node.style.size : minp;
    maxp = node.style.size > maxp ? node.style.size : maxp;
  });
  const rangepLength = maxp - minp;
  const rangevLength = visualRange[1] - visualRange[0];
  nodes.forEach((node) => {
    node.style.size =
      ((Number(get(node, propertyName)) ** (1 / 3) - minp) / rangepLength) *
        rangevLength +
      visualRange[0];
  });
};

/**
 * Style node size based on a given method
 *
 * @param {GraphData} data
 * @param {(string | undefined)} option
 * @param {string} option
 */
export const styleNodeSizeByProp = (data: GraphData, option: NodeSize) => {
  if (option.id === 'degree') {
    data.nodes.forEach((node) => {
      node.degree = 0;
      data.edges.forEach((edge) => {
        if (edge.source === node.id || edge.target === node.id) {
          node.degree = Number(node.degree) + 1;
        }
      });
    });
    mapNodeSize(data.nodes, 'degree', option.range);
  } else if (option.id === 'property' && option.variable) {
    mapNodeSize(data.nodes, option.variable, option.range);
  }
};

export const styleNodeLabel = (node: Node, label: string) => {
  if (label === 'none') {
    node.label = '';
  } else if (label !== 'label') {
    node.label = get(node, label, '').toString();
  }
};

export const styleNodeColor = (node: Node, option: NodeColor) => {
  if (option.id === 'fixed') {
    node.color = option.value;
  } else if (option.id === 'legend') {
    const variable: string | unknown = get(node, option.variable);
    if (variable) {
      node.color = option.mapping[variable as string];
    } else {
      node.color = 'grey';
    }
  }
};

export const styleFontSize = (node: Node, fontSize: number) => {
  node.style.fontSize = fontSize;
};

/**
 * Filter all edges which contains a given node id as source or target
 *
 * @param {GraphData} data
 * @param {string} id node id
 */
export const findConnectedEdges = (data: GraphData, id: string) =>
  data.edges.filter((e) => e.source === id || e.target === id);

/**
 * Get degree of a given node id
 *
 * @param {GraphData} data
 * @param {string} id node id
 */
export const getDegree = (data: GraphData, id: string) =>
  findConnectedEdges(data, id).length;

/**
 * Get degree of a given graph keyed by node id
 *
 * @param {GraphData} data
 * @return {*}  {(Record<string | number, number>)}
 */
export const getGraphDegree = (
  data: GraphData,
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
