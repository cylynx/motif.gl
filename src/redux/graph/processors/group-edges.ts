import { isEmpty } from 'lodash';
import { Edge, GraphData, GraphList, GroupEdges } from '../types';

type GroupEdgeCandidates = Record<string, Edge[]>;
const duplicateDictionary = (data: GraphData): GroupEdgeCandidates => {
  const dictionary = {};
  data.edges.reduce((acc: Map<string, Edge>, edge: Edge) => {
    const { source, target } = edge;
    const identifier = `${source}-${target}`;

    if (acc.has(identifier)) {
      const matchEdge = acc.get(identifier);
      const groupEdgeCandidate = dictionary[identifier] ?? [matchEdge];

      groupEdgeCandidate.push(edge);
      dictionary[identifier] = groupEdgeCandidate;
    }

    return acc.set(identifier, edge);
  }, new Map());

  return dictionary;
};

const obtainGroupEdgeIds = (
  groupEdgeCandidates: GroupEdgeCandidates,
): string[] => {
  return Object.values(groupEdgeCandidates).reduce(
    (acc: string[], groupEdgeCandidate: Edge[]) => {
      const edgeIds: string[] = groupEdgeCandidate.map((edge) => edge.id);

      return [...acc, ...edgeIds];
    },
    [],
  );
};

const obtainEdgesForGroup = (candidates: GroupEdgeCandidates) => {
  return Object.values(candidates).reduce(
    (acc: Edge[], edgeForGroup: Edge[]) => {
      return [...acc, ...edgeForGroup];
    },
    [],
  );
};

const aggregateGroupEdges = (
  groupEdgesCandidates: GroupEdgeCandidates,
): Edge[] => {
  return Object.entries(groupEdgesCandidates).map((value) => {
    const [uniqueIdentifier, groupEdgeCandidate] = value;
    const [firstEdge] = groupEdgeCandidate as Edge[];
    const { source, target } = firstEdge as Edge;

    return {
      id: uniqueIdentifier,
      source,
      target,
    };
  });
};

const produceGraphWithGroupEdges = (
  data: GraphData,
  edgeIdsForRemoval: string[],
  groupedEdges: Edge[],
): GraphData => {
  const graphWithRemovedEdges = data.edges.filter(
    (edge) => !edgeIdsForRemoval.includes(edge.id),
  );
  const graphWithGroupedEdges: Edge[] = [
    ...graphWithRemovedEdges,
    ...groupedEdges,
  ];
  const modData = { ...data };
  Object.assign(modData, { edges: graphWithGroupedEdges });
  return modData;
};

const produceGraphWithoutGroupEdges = (
  graphFlatten: GraphData,
  edgeIdsForRemoval: string[],
  originalEdges: Edge[],
): GraphData => {
  const withoutGroupedEdges = graphFlatten.edges.filter(
    (edge: Edge) => !edgeIdsForRemoval.includes(edge.id),
  );
  const graphWithOriginalEdges = [...withoutGroupedEdges, ...originalEdges];

  const modData = { ...graphFlatten };
  Object.assign(modData, { edges: graphWithOriginalEdges });
  return modData;
};

/**
 * Combine edges and replace edges with the new one
 *
 * @param {GraphData} data
 * @return {GraphData}
 */
export const groupEdgesForImportation = (data: GraphData): GraphData => {
  const groupEdgesCandidates = duplicateDictionary(data);
  if (isEmpty(groupEdgesCandidates)) return data;

  const edgeIdsForRemoval = obtainGroupEdgeIds(groupEdgesCandidates);
  const groupedEdges = aggregateGroupEdges(groupEdgesCandidates);
  const graphData = produceGraphWithGroupEdges(
    data,
    edgeIdsForRemoval,
    groupedEdges,
  );

  return graphData;
};

const groupEdgesWithConfig = (
  graphData: GraphData,
  graphFlatten: GraphData,
) => {
  const groupEdgesCandidates = duplicateDictionary(graphData);
  if (isEmpty(groupEdgesCandidates)) return graphFlatten;

  const edgeIdsForRemoval = obtainGroupEdgeIds(groupEdgesCandidates);
  const groupedEdges = aggregateGroupEdges(groupEdgesCandidates);
  const combinedGraphData = produceGraphWithGroupEdges(
    graphFlatten,
    edgeIdsForRemoval,
    groupedEdges,
  );

  return combinedGraphData;
};

const revertGroupEdge = (graphData: GraphData, graphFlatten: GraphData) => {
  const groupEdgesCandidates = duplicateDictionary(graphData);
  if (isEmpty(groupEdgesCandidates)) return graphFlatten;

  const groupEdgeIdentifiers: string[] = Object.keys(groupEdgesCandidates);
  const edgesForGroup: Edge[] = obtainEdgesForGroup(groupEdgesCandidates);
  const combinedGraphData: GraphData = produceGraphWithoutGroupEdges(
    graphFlatten,
    groupEdgeIdentifiers,
    edgesForGroup,
  );

  return combinedGraphData;
};

export const groupEdgesWithConfiguration = (
  graphData: GraphData,
  graphFlatten: GraphData,
  groupEdgesConfig: GroupEdges,
): GraphData => {
  const { toggle } = groupEdgesConfig;
  if (toggle) {
    return groupEdgesWithConfig(graphData, graphFlatten);
  }

  return revertGroupEdge(graphData, graphFlatten);
};
