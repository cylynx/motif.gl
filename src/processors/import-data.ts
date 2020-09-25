import isUndefined from 'lodash/isUndefined';
import get from 'lodash/get';
import shortid from 'shortid';
import * as Graph from '../types/Graph';

export type ImportFormat = MotifJson | JsonImport | EdgeListCsv | NodeEdgeCsv;

export type Csv = string;

// TODO: Add stronger checking for metadata for MotifJson
export type MotifJson = {
  data: Graph.GraphData | Graph.GraphList;
  type: 'motif-json';
};

export type JsonImport = {
  data: Graph.GraphData | Graph.GraphList;
  type: 'json';
};

export type EdgeListCsv = {
  data: Csv;
  type: 'edge-list-csv';
};

export type NodeEdgeCsv = {
  data: {
    nodeData: Csv;
    edgeData: Csv;
  };
  type: 'node-edge-csv';
};

export type ImportData = {
  data: string;
  id?: string;
  name: string;
  format: string;
  type: string;
  filterProps?: any;
};

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
