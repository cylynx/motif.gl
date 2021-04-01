import { FaGalacticSenate } from 'react-icons/fa';
import {
  Edge,
  GraphData,
  GraphList,
  GroupEdges,
  Metadata,
  Node,
} from '../types';
import { applyGroupEdges, processCsvData, processJson } from './data';

export const processPreviewJson = async (
  json: GraphList | GraphData,
  groupEdges: boolean,
): Promise<GraphList> => {
  const results: GraphList = [];
  const graphList: GraphList = Array.isArray(json) ? json : [json];

  for (const data of graphList) {
    // eslint-disable-next-line no-await-in-loop
    const processedData = await processJson(
      data,
      groupEdges,
      data?.key || data?.metadata?.key,
    );
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
