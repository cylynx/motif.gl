/* eslint-disable no-param-reassign */
import get from 'lodash/get';
import * as Graph from '../types/Graph';

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
  if (nodeStyleOptions.size) {
    styleNodeSize(data, nodeStyleOptions.size);
  }
  if (nodeStyleOptions.color) {
    styleNodeColor(data, nodeStyleOptions.color);
  }
  if (nodeStyleOptions.fontSize) {
    styleFontSize(data, nodeStyleOptions.fontSize);
  }
  if (nodeStyleOptions.label) {
    styleNodeLabel(data, nodeStyleOptions.label);
  }
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
export const styleNodeSize = (
  data: Graph.GraphData,
  option: Graph.NodeSize,
) => {
  if (option.id === 'fixed') {
    for (const node of data.nodes) {
      node.defaultStyle.size = option.value;
    }
  } else if (option.id === 'degree') {
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

export const styleNodeLabel = (data: Graph.GraphData, label: string) => {
  for (const node of data.nodes) {
    if (label === 'none') {
      node.label = '';
    } else if (label !== 'label') {
      node.label = get(node, label, '').toString();
    }
  }
};

export const styleNodeColor = (data: Graph.GraphData, color: string) => {
  for (const node of data.nodes) {
    node.defaultStyle.color = color;
  }
};

export const styleFontSize = (data: Graph.GraphData, fontSize: number) => {
  for (const node of data.nodes) {
    node.defaultStyle.fontSize = fontSize;
  }
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
