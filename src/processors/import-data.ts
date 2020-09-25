import isUndefined from 'lodash/isUndefined';
import get from 'lodash/get';
import shortid from 'shortid';
import * as Graph from '../types/Graph';

/**
 * Initial function to process data to required format
 * Use accessors to create access node and edge attributes as required by graphin format
 * Generates metadata fields
 *
 * @param {Graph.GraphData} data
 * @param {Graph.Accessors} Accessors
 * @return {*}  {Graph.GraphData}
 */
export const processData = (
  data: Graph.GraphData,
  accessors: Graph.Accessors,
): Graph.GraphData => {
  const { edgeSource, edgeTarget, edgeID, nodeID } = accessors;
  for (const node of data.nodes) {
    // data property required by graphin
    if (isUndefined(node.data)) node.data = {};
    node.id = isUndefined(nodeID) ? shortid.generate() : get(node, nodeID);
  }
  for (const edge of data.edges) {
    // data property required by graphin
    if (isUndefined(edge.data)) edge.data = {};
    // source, target are required
    edge.source = get(edge, edgeSource);
    edge.target = get(edge, edgeTarget);
    edge.id = isUndefined(edgeID) ? shortid.generate() : get(edge, nodeID);
  }
  return data;
};
