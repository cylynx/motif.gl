import { MotifImportError } from '../../../components/ImportErrorMessage';
import { removeDuplicates } from '../../../utils/graph-utils/utils';
import {
  Edge,
  Field,
  GraphData,
  GraphList,
  GroupEdges,
  Metadata,
  Node,
} from '../types';
import {
  applyGroupEdges,
  processCsvData,
  ProcessedCsv,
  processJson,
} from './data';

export const processPreviewJson = async (
  json: GraphList | GraphData,
  groupEdges: boolean,
): Promise<GraphList> => {
  const results: GraphList = [];
  const graphList: GraphList = Array.isArray(json) ? json : [json];

  if (graphList.length === 0) {
    throw new MotifImportError('empty-dataset');
  }

  for (const data of graphList) {
    // uniquely identify the graph data within the list
    const metadataKey = data?.key || data?.metadata?.key;

    // eslint-disable-next-line no-await-in-loop
    const processedData = await processJson(
      data,
      groupEdges,
      metadataKey,
    ).catch((err) => {
      // error returns from the processor
      // should convert into this format for display
      throw new MotifImportError(err.message);
    });
    results.push(processedData);
  }

  return results;
};

export const processPreviewEdgeList = async (
  edgeList: string,
): Promise<GraphData> => {
  const { fields: edgeFields, json: edgeJson } = await processCsvData(edgeList);
  const nodeJson: Node[] = [];
  const groupEdge = false;

  const groupEdgeConfig: GroupEdges = applyGroupEdges(
    groupEdge,
    nodeJson,
    edgeJson as Edge[],
  );

  const graphMetadata: Metadata = {
    fields: { nodes: [], edges: edgeFields },
    key: 'preview-edge-list',
    groupEdges: groupEdgeConfig,
  };

  const graphData: GraphData = {
    nodes: nodeJson,
    edges: edgeJson as Edge[],
    metadata: graphMetadata,
  };

  return graphData;
};

export const processPreviewNodeEdge = async (
  nodeCsvs: string[],
  edgeCsvs: string[],
): Promise<GraphData> => {
  const combineFieldsAndJson = (
    acc: ProcessedCsv,
    processedNode: ProcessedCsv,
  ): ProcessedCsv => {
    return {
      fields: removeDuplicates(
        [...acc.fields, ...processedNode.fields],
        'name',
      ) as Field[],
      json: [...acc.json, ...processedNode.json] as Node[] | Edge[],
    };
  };

  const emptyFieldsWithJson: ProcessedCsv = { fields: [], json: [] };
  const nodeDataPromises = nodeCsvs.map((nodeCsv: string) =>
    processCsvData(nodeCsv),
  );
  const edgeDataPromises = edgeCsvs.map((edgeCsv: string) =>
    processCsvData(edgeCsv),
  );

  try {
    // obtain node json and node fields from batch uploaded node csv
    const processedNodeDatas: ProcessedCsv[] = await Promise.all(
      nodeDataPromises,
    );
    const { fields: nodeFields, json: nodeJson } = processedNodeDatas.reduce(
      combineFieldsAndJson,
      emptyFieldsWithJson,
    );

    // obtain edge json and edge fields from batch uploaded edge csv
    const processedEdgeDatas: ProcessedCsv[] = await Promise.all(
      edgeDataPromises,
    );
    const { fields: edgeFields, json: edgeJson } = processedEdgeDatas.reduce(
      combineFieldsAndJson,
      emptyFieldsWithJson,
    );

    const groupEdgeConfig: GroupEdges = applyGroupEdges(
      false,
      nodeJson as Node[],
      edgeJson as Edge[],
    );

    const graphMetadata: Metadata = {
      fields: { nodes: nodeFields, edges: edgeFields },
      key: 'preview-node-edge',
      groupEdges: groupEdgeConfig,
    };

    const graphData: GraphData = {
      nodes: nodeJson as Node[],
      edges: edgeJson as Edge[],
      metadata: graphMetadata,
    };

    return graphData;
  } catch (err: any) {
    const { message } = err;
    throw new Error(`Import Node Edge Data Error: ${message}`);
  }
};
