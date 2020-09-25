import get from 'lodash/get';
import produce from 'immer';
import * as Graph from '../types/Graph';

/**
 * Main function to style nodes
 *
 * @param {Graph.GraphData} data
 * @param {Graph.NodeStyleOptions} nodeStyleOptions
 * @param {Graph.NodeStyleAccessors} nodeStyleAccessors
 * @return {*}  {Graph.Node[]}
 */
export const styleNodes = (
  data: Graph.GraphData,
  nodeStyleOptions: Graph.NodeStyleOptions,
  nodeStyleAccessors: Graph.NodeStyleAccessors,
): Graph.Node[] => {
  // Scales width based on min, max value of edges
  // mode = eth (scale width from 0.5-5) or fix (default value of 0.5)
  const nextData = produce(data, (draftData) => {
    styleNodeSize(draftData, nodeStyleAccessors?.size, nodeStyleOptions.size);
    styleNodeLabel(draftData, nodeStyleAccessors?.label);
  });
  return nextData.nodes;
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
  accessor: string | undefined,
  option: string,
) => {
  if (typeof accessor === 'string') {
    const degree = getGraphDegree(data);
    const min = Math.min(...Object.values(degree));
    const max = Math.max(...Object.values(degree));
    for (const node of data.nodes) {
      // nodeSize
      if (option === 'degree' && max !== min) {
        // Scale by degree, from 8-30
        node.style.nodeSize =
          (((degree[node.id] - min) / (max - min)) * (30 - 8) + 8) * 3;
      }
    }
  }
};

export const styleNodeLabel = (
  data: Graph.GraphData,
  accessor: string | undefined,
) => {
  if (typeof accessor === 'string') {
    for (const node of data.nodes) {
      node.label = get(node, accessor).toString();
    }
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
