import isUndefined from 'lodash/isUndefined';
import get from 'lodash/get';
import shortid from 'shortid';
import * as Graph from '../types/Graph';
import {
  processJson,
  processNodeEdgeCsv,
  processEdgeListCsv,
  validateMotifJson,
} from './data-processors';

export type ImportFormat = JsonImport | EdgeListCsv | NodeEdgeCsv;

export type Csv = string;

export type JsonImport = {
  data: Graph.GraphData | Graph.GraphList;
  type: 'json';
};

export type EdgeListCsv = {
  data: Csv;
  type: 'edgeListCsv';
};

export type NodeEdgeCsv = {
  data: {
    nodeData: Csv;
    edgeData: Csv;
  };
  type: 'nodeEdgeCsv';
};

export const OPTIONS = {
  json: 'json',
  edgeListCsv: 'edgeListCsv',
  nodeEdgeCsv: 'nodeEdgeCsv',
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
export const importJson = async (
  json: Graph.GraphData | Graph.GraphList,
  accessors: Graph.Accessors,
): Promise<Graph.GraphList> => {
  const results = [];
  const jsonArray = Array.isArray(json) ? json : [json];
  for (const data of jsonArray) {
    if (validateMotifJson(data)) return jsonArray;
    // eslint-disable-next-line no-await-in-loop
    const processedData = await processJson(
      data,
      data?.key || data?.metadata?.key,
    );
    results.push(addRequiredFields(processedData, accessors));
  }
  return results;
};

export const addRequiredFields = (
  processedData: Graph.GraphData,
  accessors: Graph.Accessors,
) => {
  const { edgeSource, edgeTarget, edgeID, nodeID } = accessors;
  const data = processedData;
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
