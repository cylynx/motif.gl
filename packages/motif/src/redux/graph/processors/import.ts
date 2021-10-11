import { get, isUndefined } from 'lodash';
import shortid from 'shortid';
import { MotifImportError } from '../../../components/ImportErrorMessage';
import { Node, Edge, GraphList, GraphData, Accessors } from '../types';
import {
  processJson,
  processNodeEdgeCsv,
  processEdgeListCsv,
  verifySourceAndTargetExistence,
} from './data';
import * as Utils from '../utils';

/**
 * Initial function to process json object with node, edge fields or motif json to required format
 * Parse and generates metadata fields
 *
 * @param {GraphList|GraphData} json
 * @param {Accessors} accessors
 * @param groupEdges - decides whether the graph's edge shall be grouped.
 * @return {Promise<GraphList>}
 */
export const importJson = async (
  json: GraphList | GraphData,
  accessors: Accessors,
  groupEdges: boolean,
): Promise<GraphList> => {
  const results: GraphList = [];
  const graphList: GraphList = Array.isArray(json) ? json : [json];

  try {
    for (const data of graphList) {
      // eslint-disable-next-line no-await-in-loop
      const processedData = await processJson(
        data,
        groupEdges,
        data?.key || data?.metadata?.key,
      );

      const graphData = addRequiredFieldsJson(processedData, accessors);

      // verify whether source and target are valid.
      const { nodes, edges } = graphData;
      verifySourceAndTargetExistence(nodes, edges, accessors);

      // prevent id conflicting with each other.
      Utils.findDuplicateID(graphData, accessors);

      results.push(graphData);
    }
    return results;
  } catch (err: any) {
    if (err instanceof MotifImportError) {
      const { name, message } = err;
      throw new MotifImportError(name as any, message);
    }

    throw new MotifImportError(err.message);
  }
};

/**
 * Initial function to process edge list csv
 * Parse and generates metadata fields
 *
 * @param {string} csv
 * @param {<Accessors} accessors
 * @param {boolean} groupEdges
 * @param {string} metadataKey = null
 *
 * @return {Promise<GraphData>}
 */
export const importEdgeListCsv = async (
  csv: string,
  accessors: Accessors,
  groupEdges: boolean,
  metadataKey: string = null,
): Promise<GraphData> => {
  const { edgeSource, edgeTarget } = accessors;

  try {
    const processedData = await processEdgeListCsv(
      csv,
      edgeSource,
      edgeTarget,
      groupEdges,
      metadataKey,
    );

    processedData.edges.forEach((edge: Edge) => {
      addEdgeFields(edge, accessors);
    });

    const { nodes, edges } = processedData;
    verifySourceAndTargetExistence(nodes, edges, accessors);

    // prevent node ids and edge ids conflicting with each others.
    Utils.findDuplicateID(processedData, accessors);

    return processedData;
  } catch (err: any) {
    if (err instanceof MotifImportError) {
      const { name, message } = err;
      throw new MotifImportError(name as any, message);
    }

    throw new MotifImportError(err.message);
  }
};

/**
 * Initial function to process node edge csv
 * Parse and generates metadata fields
 *
 * @param {string} nodeCsv
 * @param {string} edgeCsv
 * @param {Accessors} accessors
 * @param {boolean} groupEdges
 * @param {string} metadataKey [metadataKey=null]
 *
 * @return {Promise<GraphData>}
 */
export const importNodeEdgeCsv = async (
  nodeCsv: string[],
  edgeCsv: string[],
  accessors: Accessors,
  groupEdges: boolean,
  metadataKey: string = null,
): Promise<GraphData> => {
  try {
    const processedData: GraphData = await processNodeEdgeCsv(
      nodeCsv,
      edgeCsv,
      groupEdges,
      accessors,
      metadataKey,
    );

    const graphData = addRequiredFieldsJson(processedData, accessors);
    const { nodes, edges } = graphData;
    verifySourceAndTargetExistence(nodes, edges, accessors);

    // prevent node ids and edge ids conflicting with each others.
    Utils.findDuplicateID(graphData, accessors);

    return graphData;
  } catch (err: any) {
    if (err instanceof MotifImportError) {
      const { name, message } = err;
      throw new MotifImportError(name as any, message);
    }

    throw new MotifImportError(err.message);
  }
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

  if (!edgeSourceValue) {
    throw new Error('edge-source-value-undefined');
  }

  if (!edgeTargetValue) {
    throw new Error('edge-target-value-undefined');
  }

  Object.assign(edge, {
    source: edgeSourceValue.toString(),
    target: edgeTargetValue.toString(),
  });

  generateIdKey(edge, edgeID);
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
  } else if (isUndefined(get(object, idAccessor))) {
    Object.assign(object, {
      id: shortid.generate(),
    });
  } else if (idAccessor === 'auto-generated') {
    Object.assign(object, {
      id: shortid.generate(),
    });
  } else {
    const id = get(object, idAccessor).toString();
    Object.assign(object, {
      [idAccessor]: id,
    });
  }
};
