import { isEmpty, get, set } from 'lodash';
import shortid from 'shortid';
import {
  Edge,
  FieldAndAggregation,
  GraphData,
  GroupEdgeFields,
  GroupEdges,
} from '../types';
import {
  average,
  count,
  max,
  min,
  sum,
} from '../../../utils/edge-aggregations/numeric-aggregates';
import {
  first,
  last,
  mostFrequent,
} from '../../../utils/edge-aggregations/string-aggregates';

type GroupEdgeCandidates = Record<string, Edge[]>;
const duplicateDictionary = (
  data: GraphData,
  type = '',
): GroupEdgeCandidates => {
  const generateIdentifier = (edge: Edge, type: string): string => {
    const { source, target } = edge;

    if (type === 'all') {
      return `group-${source}->${target}`;
    }

    const edgeValue = get(edge, type, '');
    if (edgeValue !== '') {
      return `group-${source}->${target}@${type}`;
    }

    return `group-${source}->${target}`;
  };

  const dictionary = {};
  data.edges.reduce((acc: Map<string, Edge>, edge: Edge) => {
    const identifier: string = generateIdentifier(edge, type);

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

const obtainGroupedEdges = (graphFlatten: GraphData) => {
  return graphFlatten.edges
    .filter((edge: Edge) => edge.id.toLowerCase().includes('group'))
    .map((edge: Edge) => edge.id);
};

type AggregationFields = Record<string, number | string>;
const performAggregation = (
  edgeCandidates: Edge[],
  fields: GroupEdgeFields,
): AggregationFields => {
  const aggregations: AggregationFields = {};

  return Object.values(fields).reduce(
    (acc: AggregationFields, aggregationList: FieldAndAggregation) => {
      const { field, aggregation } = aggregationList;

      if (aggregation.includes('min' as never)) {
        const smallestValue: number = min(edgeCandidates, field);
        set(acc, `Min ${field}`, smallestValue);
      }

      if (aggregation.includes('max' as never)) {
        const largestValue: number = max(edgeCandidates, field);
        set(acc, `Max ${field}`, largestValue);
      }

      if (aggregation.includes('sum' as never)) {
        const sumValue: number = sum(edgeCandidates, field);
        set(acc, `Sum ${field}`, sumValue);
      }

      if (aggregation.includes('count' as never)) {
        const countValue: number = count(edgeCandidates, field);
        set(acc, `Count ${field}`, countValue);
      }

      if (aggregation.includes('average' as never)) {
        const averageValue: number = average(edgeCandidates, field);
        set(acc, `Average ${field}`, averageValue);
      }

      if (aggregation.includes('first' as never)) {
        const firstValue: string = first(edgeCandidates, field);
        set(acc, `First ${field}`, firstValue);
      }

      if (aggregation.includes('last' as never)) {
        const lastValue: string = last(edgeCandidates, field);
        set(acc, `Last ${field}`, lastValue);
      }

      if (aggregation.includes('most_frequent' as never)) {
        const lastValue: string = mostFrequent(edgeCandidates, field);
        set(acc, `Most Frequent ${field}`, lastValue);
      }

      return acc;
    },
    aggregations,
  );
};

const aggregateGroupEdges = (
  groupEdgesCandidates: GroupEdgeCandidates,
  fields: GroupEdgeFields = {},
): Edge[] => {
  return Object.entries(groupEdgesCandidates).map((value) => {
    const [uniqueIdentifier, groupEdgeCandidate] = value;
    const [firstEdge] = groupEdgeCandidate as Edge[];
    const { source, target } = firstEdge as Edge;
    const aggregationFields: AggregationFields = performAggregation(
      groupEdgeCandidate,
      fields,
    );

    return {
      id: `${uniqueIdentifier}-${shortid.generate()}`,
      source,
      target,
      ...aggregationFields,
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
  graphData: GraphData,
  graphFlatten: GraphData,
  edgeIdsForRemoval: string[],
): GraphData => {
  const withoutGroupedEdges = graphFlatten.edges.filter(
    (edge: Edge) => !edgeIdsForRemoval.includes(edge.id),
  );
  const graphWithOriginalEdges = [...withoutGroupedEdges, ...graphData.edges];

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

export const groupEdgesWithConfiguration = (
  graphData: GraphData,
  graphFlatten: GraphData,
  groupEdgesConfig: GroupEdges,
): GraphData => {
  const groupEdgesWithConfig = (
    graphData: GraphData,
    graphFlatten: GraphData,
    type: string,
    fields: GroupEdgeFields,
  ) => {
    // clear previous group edges before perform another grouping
    const ungroupedGraph: GraphData = revertGroupEdge(graphData, graphFlatten);

    // create dictionary with the duplicates source and target edges
    const groupEdgesCandidates: GroupEdgeCandidates = duplicateDictionary(
      graphData,
      type,
    );
    if (isEmpty(groupEdgesCandidates)) return ungroupedGraph;

    // obtain edge id for removal from graph flatten.
    const edgeIdsForRemoval: string[] = obtainGroupEdgeIds(
      groupEdgesCandidates,
    );

    // produce grouped edge with aggregations fields.
    const groupedEdges: Edge[] = aggregateGroupEdges(
      groupEdgesCandidates,
      fields,
    );

    // remove duplicate edges and combine the grouped edges with current graph.
    const combinedGraphData: GraphData = produceGraphWithGroupEdges(
      ungroupedGraph,
      edgeIdsForRemoval,
      groupedEdges,
    );

    return combinedGraphData;
  };

  const revertGroupEdge = (graphData: GraphData, graphFlatten: GraphData) => {
    const graphDataEdgeIds = graphData.edges.map((edge: Edge) => edge.id);
    const groupedEdgesId: string[] = obtainGroupedEdges(graphFlatten);
    const edgeIdsForRemoval: string[] = [
      ...graphDataEdgeIds,
      ...groupedEdgesId,
    ];
    const combinedGraphData: GraphData = produceGraphWithoutGroupEdges(
      graphData,
      graphFlatten,
      edgeIdsForRemoval,
    );

    return combinedGraphData;
  };

  const { toggle, type, fields } = groupEdgesConfig;
  if (toggle) {
    return groupEdgesWithConfig(graphData, graphFlatten, type, fields);
  }

  return revertGroupEdge(graphData, graphFlatten);
};
