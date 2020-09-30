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
  csv2json,
  json2csv,
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
    const correctData = addRequiredFieldsJson(data, accessors);
    // eslint-disable-next-line no-await-in-loop
    const processedData = await processJson(
      correctData,
      correctData?.key || correctData?.metadata?.key,
    );
    results.push(addRequiredDataFields(processedData));
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
  const mappedCsv = await addRequiredFieldsCsv(csv, accessors, 'edge');
  const processedData = await processEdgeListCsv(mappedCsv);
  const results = addRequiredDataFields(processedData);
  return results;
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
  const mappedNodeCsv = await addRequiredFieldsCsv(nodeCsv, accessors, 'node');
  const mappedEdgeCsv = await addRequiredFieldsCsv(edgeCsv, accessors, 'edge');
  const processedData = await processNodeEdgeCsv(mappedNodeCsv, mappedEdgeCsv);
  const results = addRequiredDataFields(processedData);
  return results;
};

/**
 * Add required node and edge attributes (id, source, target) for csv input based on given type
 *
 * @param {string} csv
 * @param {Graph.Accessors} accessors
 * @param {('node' | 'edge')} type
 * @return {*}
 */
export const addRequiredFieldsCsv = async (
  csv: string,
  accessors: Graph.Accessors,
  type: 'node' | 'edge',
) => {
  const parsedJson = (await csv2json(csv)) as any[];
  if (type === 'node') {
    for (const node of parsedJson) {
      addNodeFields(node, accessors);
    }
  }
  if (type === 'edge') {
    for (const edge of parsedJson) {
      addEdgeFields(edge, accessors);
    }
  }
  const patchedCsv = await json2csv(parsedJson);
  return patchedCsv as string;
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
  }
  for (const edge of data.edges) {
    addEdgeFields(edge, accessors);
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
  node.id = isUndefined(nodeID)
    ? isUndefined(node.id)
      ? shortid.generate()
      : node.id
    : get(node, nodeID);
};

/**
 * Create id, source, target field in edge based on accessors
 *
 * @param {*} edge
 * @param {Graph.Accessors} accessors
 */
export const addEdgeFields = (edge: any, accessors: Graph.Accessors) => {
  const { edgeSource, edgeTarget, edgeID } = accessors;
  edge.source = get(edge, edgeSource);
  edge.target = get(edge, edgeTarget);
  edge.id = isUndefined(edgeID)
    ? isUndefined(edge.id)
      ? shortid.generate()
      : edge.id
    : get(edge, edgeID);
};

/**
 * Add data field in nodes and edges
 *
 * @param {Graph.GraphData} data
 * @return {*}
 */
export const addRequiredDataFields = (data: Graph.GraphData) => {
  for (const node of data.nodes) {
    // data property required by graphin
    if (isUndefined(node.data)) node.data = {};
  }
  for (const edge of data.edges) {
    // data property required by graphin
    if (isUndefined(edge.data)) edge.data = {};
  }
  return data;
};
