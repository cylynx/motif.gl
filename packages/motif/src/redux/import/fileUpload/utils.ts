import * as GraphType from '../../graph/types';

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
