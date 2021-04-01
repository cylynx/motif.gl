import { GraphData, GraphList } from '../types';
import { processJson } from './data';

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
