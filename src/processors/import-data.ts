/* eslint-disable no-nested-ternary */
/* eslint-disable no-param-reassign */
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

export type JsonImport = {
  data: Graph.GraphData | Graph.GraphList;
  type: 'json';
};

export type EdgeListCsv = {
  data: string;
  type: 'edgeListCsv';
};

export type NodeEdgeCsv = {
  data: {
    nodeData: string;
    edgeData: string;
  };
  type: 'nodeEdgeCsv';
};

export const OPTIONS = {
  json: { label: 'Json', id: 'json' },
  edgeListCsv: { label: 'Edge List Csv', id: 'edgeListCsv' },
  nodeEdgeCsv: { label: 'Node Edge Csv (2 Files)', id: 'nodeEdgeCsv' },
};

/**
 * Initial function to process json object with node, edge fields or motif json to required format
 * Parse and generates metadata fields
 *
 * @param {Graph.GraphData} data
 * @param {Graph.Accessors} accessors
 * @return {*} {Promise<Graph.GraphList>}
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
    results.push(addRequiredFieldsJson(processedData, accessors));
  }
  return results;
};

/**
 * Initial function to process edge list csv
 * Parse and generates metadata fields
 *
 * @param {string} csv
 * @param {Graph.Accessors} accessors
 * @return {*}  {Promise<Graph.GraphData>}
 */
export const importEdgeListCsv = async (
  csv: string,
  accessors: Graph.Accessors,
): Promise<Graph.GraphData> => {
  const { edgeSource, edgeTarget } = accessors;
  const processedData = await processEdgeListCsv(csv, edgeSource, edgeTarget);
  return addRequiredFieldsJson(processedData, accessors);
};

/**
 * Initial function to process node edge csv
 * Parse and generates metadata fields
 *
 * @param {string} nodeCsv
 * @param {string} edgeCsv
 * @param {Graph.Accessors} accessors
 * @return {*}  {Promise<Graph.GraphData>}
 */
export const importNodeEdgeCsv = async (
  nodeCsv: string,
  edgeCsv: string,
  accessors: Graph.Accessors,
): Promise<Graph.GraphData> => {
  const processedData = await processNodeEdgeCsv(nodeCsv, edgeCsv);
  return addRequiredFieldsJson(processedData, accessors);
};

/**
 * Add required node and edge attributes (id, source, target) for json input
 *
 * @param {Graph.GraphData} data
 * @param {Graph.Accessors} accessors
 * @return {*}
 */
export const addRequiredFieldsJson = (
  data: Graph.GraphData,
  accessors: Graph.Accessors,
) => {
  for (const node of data.nodes) {
    addNodeFields(node, accessors);
    if (isUndefined(node.data)) node.data = {}; // required by graphin
  }
  for (const edge of data.edges) {
    addEdgeFields(edge, accessors);
    if (isUndefined(edge.data)) edge.data = {};
  }
  return data;
};

/**
 * Created id field in the node based on nodeID accessor
 *
 * @param {*} node
 * @param {Graph.Accessors} accessors
 */
export const addNodeFields = (node: any, accessors: Graph.Accessors) => {
  const { nodeID } = accessors;
  if (isUndefined(nodeID)) {
    if (isUndefined(node.id)) {
      node.id = shortid.generate();
    }
    // else node.id = node.id
  } else if (isUndefined(get(node, nodeID))) {
    node.id = shortid.generate();
  } else {
    node.id = get(node, nodeID).toString();
  }
};

/**
 * Create id, source, target field in edge based on accessors
 *
 * @param {*} edge
 * @param {Graph.Accessors} accessors
 */
export const addEdgeFields = (edge: any, accessors: Graph.Accessors) => {
  const { edgeSource, edgeTarget, edgeID } = accessors;
  edge.source = get(edge, edgeSource).toString();
  edge.target = get(edge, edgeTarget).toString();
  if (isUndefined(edgeID)) {
    if (isUndefined(edge.id)) {
      edge.id = shortid.generate();
    }
    // else edge.id = edge.id
  } else if (isUndefined(get(edge, edgeID))) {
    edge.id = shortid.generate();
  } else {
    edge.id = get(edge, edgeID).toString();
  }
};
