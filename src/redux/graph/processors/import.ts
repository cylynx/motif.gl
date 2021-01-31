import isUndefined from 'lodash/isUndefined';
import get from 'lodash/get';
import shortid from 'shortid';
import has from 'lodash/has';
import {
  Node,
  Edge,
  GraphList,
  GraphData,
  Accessors,
  EdgeNode,
} from '../types';
import {
  processJson,
  processNodeEdgeCsv,
  processEdgeListCsv,
  validateMotifJson,
} from './data';

import { defaultEdge, defaultNode } from '../../../constants/graph-styles';

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
 * @return {Promise<GraphData>}
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
 * @return {Promise<GraphData>}
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
 * @return {GraphData}
 */
export const addRequiredFieldsJson = (
  data: GraphData,
  accessors: Accessors,
): GraphData => {
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
 * @param {Node} node
 * @param {Accessors} accessors
 */
export const addNodeFields = (node: Node, accessors: Accessors): void => {
  const { nodeID } = accessors;
  generateIdKey(node, nodeID);
  addNodeStyleField(node);
  formatLabelStyle(node);
};

/**
 * Create id, source, target field in edge based on accessors
 *
 * @param {Edge} edge
 * @param {Accessors} accessors
 */
export const addEdgeFields = (edge: Edge, accessors: Accessors): void => {
  const { edgeSource, edgeTarget, edgeID } = accessors;

  const edgeSourceValue = get(edge, edgeSource);
  const edgeTargetValue = get(edge, edgeTarget);

  if (isUndefined(edgeSourceValue) || isUndefined(edgeTargetValue)) {
    throw new Error('Invalid Source and Target fields.');
  }

  Object.assign(edge, {
    source: edgeSourceValue.toString(),
    target: edgeTargetValue.toString(),
  });

  generateIdKey(edge, edgeID);
  addEdgeStyleField(edge);
  formatLabelStyle(edge);
};

/**
 * Generate ID with the given object if following conditions are satisfied:
 * 1. accessor's id is not provided and object doesn't contain id
 * 2. unable to obtain the value with given accessor's id
 *
 * Convert object's id to string if above condition are not satisfied.
 *
 * @param object
 * @param idAccessor
 */
const generateIdKey = (object: any, idAccessor: string | undefined): void => {
  if (isUndefined(idAccessor)) {
    if (isUndefined(object.id)) {
      Object.assign(object, {
        id: shortid.generate(),
      });
    }
    // else edge.id = edge.id
  } else if (isUndefined(get(object, idAccessor))) {
    Object.assign(object, {
      id: shortid.generate(),
    });
  } else {
    Object.assign(object, {
      id: get(object, idAccessor).toString(),
    });
  }
};

/**
 * Add Default Node Style into Node's object.
 *
 * @param {Node} obj
 * @return {void}
 */
const addNodeStyleField = (obj: Node): void => {
  // TODO: Determine best way to inject defaultStyles
  // if (isUndefined(obj.style)) {
  //   Object.assign(obj, defaultNode);
  // }
  Object.assign(obj, defaultNode);
};

/**
 * Add Default Edge Style into User's edge object.
 *
 * @param {Edge} obj
 * @return {void}
 */
const addEdgeStyleField = (obj: Edge): void => {
  // TODO: Determine best way to inject defaultStyles
  // if (isUndefined(obj.style)) {
  //   Object.assign(obj, defaultEdge);
  // }
  Object.assign(obj, defaultEdge);
};

const formatLabelStyle = (obj: EdgeNode): void => {
  const LABEL_KEY = 'label';
  const isObjHasLabel: boolean = has(obj, LABEL_KEY);

  if (isObjHasLabel) {
    Object.assign(obj.style, {
      label: {
        value: obj[LABEL_KEY],
      },
    });
  }
};
