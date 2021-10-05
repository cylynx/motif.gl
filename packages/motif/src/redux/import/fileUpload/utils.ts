import cloneDeep from 'lodash/cloneDeep';
import * as GraphType from '../../graph/types';
import { GraphData, GraphList } from '../../graph/types';
import * as GraphSlice from './slice';

/**
 * Prevent uploaded data set contain node properties "type".
 *  - "type" is a restricted word in node property for Graphin to perform styling
 *
 * @param {GraphType.GraphList} graphList
 * @return {boolean}
 */
export const containRestrictWords = (
  graphList: GraphType.GraphList,
): boolean => {
  const isValidData = graphList.some((graph: GraphType.GraphData) => {
    const { nodes } = graph.metadata.fields;

    const isContainType = nodes.find((field: GraphType.Field) => {
      return field.name === 'type';
    });

    return isContainType;
  });

  return isValidData;
};

export const createPreviewData = (
  graphList: GraphList,
  dispatch: any,
  combineData: any,
) => {
  const emptyGraphData: GraphData = {
    nodes: [],
    edges: [],
    metadata: { fields: { nodes: [], edges: [] } },
  };

  const combinedGraphData = graphList.reduce(
    (acc: GraphData, graphData: GraphData) => {
      const clonedGraphData: GraphData = cloneDeep(graphData);
      const combinedGraph = combineData(acc, clonedGraphData);
      return combinedGraph;
    },
    emptyGraphData,
  );

  dispatch(GraphSlice.setDataPreview(combinedGraphData));
};

export const setEdgeGroupable = (graphList: GraphList, dispatch: any) => {
  const isEdgeGroupable: boolean = graphList.some((graphData: GraphData) => {
    return graphData.metadata.groupEdges.availability === true;
  });
  dispatch(GraphSlice.setIsEdgeGroupable(isEdgeGroupable));
};

export const nextStep = (step: number, dispatch: any) => {
  dispatch(GraphSlice.setStep(step + 1));
};
