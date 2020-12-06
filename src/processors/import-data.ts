/* eslint-disable no-nested-ternary */
/* eslint-disable no-param-reassign */
import isUndefined from 'lodash/isUndefined';
import get from 'lodash/get';
import shortid from 'shortid';
import {
  processJson,
  processNodeEdgeCsv,
  processEdgeListCsv,
  validateMotifJson,
} from './data-processors';
import { GraphData, GraphList, Accessors } from '../containers/Graph';

export type ImportFormat = JsonImport | EdgeListCsv | NodeEdgeCsv;

export enum ImportType {
  JSON = 'json',
  EDGE_LIST_CSV = 'edgeListCsv',
  NODE_EDGE_CSV = 'nodeEdgeCsv',
}

export type NodeEdgeDataType = {
  nodeData: string;
  edgeData: string;
};

export type JsonImport = {
  data: GraphData | GraphList | void;
  type: ImportType.JSON;
};

export type EdgeListCsv = {
  data: string;
  type: ImportType.EDGE_LIST_CSV;
};

export type NodeEdgeCsv = {
  data: NodeEdgeDataType;
  type: ImportType.NODE_EDGE_CSV;
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
 * @param {GraphList|GraphData} json
 * @param {Accessors} accessors
 * @return {Promise<GraphList>}
 */
export const importJson = async (
  json: GraphList | GraphData,
  accessors: Accessors,
): Promise<GraphList> => {
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
 * @param {<Accessors} accessors
 * @param {string} metadataKey = null
 *
 * @return {*}  {Promise<GraphData>}
 */
export const importEdgeListCsv = async (
  csv: string,
  accessors: Accessors,
  metadataKey: string = null,
): Promise<GraphData> => {
  const { edgeSource, edgeTarget } = accessors;
  const processedData = await processEdgeListCsv(
    csv,
    edgeSource,
    edgeTarget,
    metadataKey,
  );
  if (processedData.nodes.length < 1 || processedData.edges.length < 1) {
    throw new Error('process Csv Data Failed: CSV is empty');
  }
  return addRequiredFieldsJson(processedData, accessors);
};

/**
 * Initial function to process node edge csv
 * Parse and generates metadata fields
 *
 * @param {string} nodeCsv
 * @param {string} edgeCsv
 * @param {Accessors} accessors
 * @param {string} metadataKey [metadataKey=null]
 *
 * @return {*}  {Promise<GraphData>}
 */
export const importNodeEdgeCsv = async (
  nodeCsv: string,
  edgeCsv: string,
  accessors: Accessors,
  metadataKey: string = null,
): Promise<GraphData> => {
  const processedData = await processNodeEdgeCsv(nodeCsv, edgeCsv, metadataKey);
  if (processedData.nodes.length < 1) {
    throw new Error('process Csv Data Failed: CSV is empty');
  }
  return addRequiredFieldsJson(processedData, accessors);
};

/**
 * Add required node and edge attributes (id, source, target) for json input
 *
 * @param {GraphData} data
 * @param {Accessors} accessors
 * @return {*}
 */
export const addRequiredFieldsJson = (
  data: GraphData,
  accessors: Accessors,
) => {
  for (const node of data.nodes) {
    addNodeFields(node, accessors);
    if (isUndefined(node.data)) node.data = {}; // required by graphin
    if (isUndefined(node.defaultStyle)) node.defaultStyle = {};
  }
  for (const edge of data.edges) {
    addEdgeFields(edge, accessors);
    if (isUndefined(edge.data)) edge.data = {}; // required by graphin
    if (isUndefined(edge.defaultStyle)) edge.defaultStyle = {};
  }
  return data;
};

/**
 * Created id field in the node based on nodeID accessor
 *
 * @param {*} node
 * @param {Accessors} accessors
 */
export const addNodeFields = (node: any, accessors: Accessors) => {
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
 * @param {Accessors} accessors
 */
export const addEdgeFields = (edge: any, accessors: Accessors) => {
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
