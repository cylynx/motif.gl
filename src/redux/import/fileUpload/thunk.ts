import flatten from 'lodash/flatten';
import cloneDeep from 'lodash/cloneDeep';
import { TFileContent } from './types';
import { GraphData, GraphList, TLoadFormat } from '../../graph';
import { processPreviewJson } from '../../graph/processors/import-preview';
import { combineProcessedData } from '../../../containers/Graph/styles/utils';
import { setDataPreview, setIsEdgeGroupable } from './slice';
import { show } from '../../ui/thunks';

export const previewJson = (attachments: TFileContent[]) => (dispatch: any) => {
  const contentPromises: Promise<GraphList>[] = attachments.map(
    (attachment: TFileContent) => {
      const { data: dataWithStyle } = attachment.content as TLoadFormat;

      if (dataWithStyle) {
        return processPreviewJson(dataWithStyle, false);
      }

      const simpleGraphFormat = attachment.content as GraphData;
      return processPreviewJson(simpleGraphFormat, false);
    },
  );

  return Promise.all(contentPromises)
    .then((graphDataArr: GraphList[]) => {
      const graphList: GraphList = flatten(graphDataArr);
      const emptyGraphData: GraphData = {
        nodes: [],
        edges: [],
        metadata: { fields: { nodes: [], edges: [] } },
      };

      const combinedGraphData = graphList.reduce(
        (acc: GraphData, graphData: GraphData) => {
          const clonedGraphData: GraphData = cloneDeep(graphData);
          const combinedGraph = combineProcessedData(acc, clonedGraphData);
          return combinedGraph;
        },
        emptyGraphData,
      );

      dispatch(setDataPreview(combinedGraphData));

      // if one of the graph edge is groupable, allow user to make choice on group edge preferences
      const isEdgeGroupable: boolean = graphList.some(
        (graphData: GraphData) => {
          return graphData.metadata.groupEdges.availability === true;
        },
      );
      dispatch(setIsEdgeGroupable(isEdgeGroupable));
    })
    .catch((err: Error) => {
      const { message } = err;
      dispatch(show(message, 'negative'));
    });
};
