import { isEmpty, get, set, cloneDeep } from 'lodash';
import shortid from 'shortid';
import {
  Edge,
  FieldAndAggregation,
  GraphData,
  GroupEdgeFields,
  GroupEdges,
  GroupEdgeCandidates,
  NumericAggregations,
  StringAggregations,
  Field,
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

type AggregationFields = Record<string, number | string>;

const combineEdgeFields = (myArr: Field[], prop: string): Field[] => {
  const seen = new Set();
  const filteredArr = myArr.filter((el) => {
    const duplicate = seen.has(el[prop]);
    seen.add(el[prop]);
    return !duplicate;
  });
  return filteredArr;
};

/**
 * Obtain the duplicate edge connectivity in graph
 *
 * @param {GraphData} data - graph data
 * @param {string} type - group by type
 */
export const duplicateDictionary = (
  data: GraphData,
  type = '',
): GroupEdgeCandidates => {
  const generateIdentifier = (edge: Edge, type: string): string => {
    const { source, target } = edge;

    if (type === 'all') {
      return `${source}->${target}`;
    }

    const edgeValue = get(edge, type, '');
    if (edgeValue !== '') {
      return `${source}->${target}@${type}`;
    }

    return `${source}->${target}`;
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

/**
 * Return edges id as array value from group edge candidates.
 *
 * @param groupEdgeCandidates
 * @return {string[]}
 */
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

/**
 * Return grouped edge found in graph data.
 *
 * @param graphFlatten
 * @return {string[]}
 */
const obtainGroupedEdges = (graphFlatten: GraphData): string[] => {
  return graphFlatten.edges
    .filter((edge: Edge) => edge.id.toLowerCase().includes('group'))
    .map((edge: Edge) => edge.id);
};

/**
 * Perform aggregation on group edges with given fields.
 *
 * @param {Edge[]} edgeCandidates - edge with duplicate connectivity for grouping
 * @param {GroupEdgeFields} fields - property with aggregation methods
 * @return {AggregationFields}
 */
const performAggregation = (
  edgeCandidates: Edge[],
  fields: GroupEdgeFields,
): AggregationFields => {
  const aggregations: AggregationFields = {};

  return Object.values(fields).reduce(
    (acc: AggregationFields, aggregationList: FieldAndAggregation) => {
      const { field, aggregation } = aggregationList;

      if (aggregation.includes('min' as never)) {
        const smallestValue: number | string = min(edgeCandidates, field);

        if (smallestValue !== 'no-values') {
          set(acc, `min ${field}`, smallestValue);
        }
      }

      if (aggregation.includes('max' as never)) {
        const largestValue: number | string = max(edgeCandidates, field);

        if (largestValue !== 'no-values') {
          set(acc, `max ${field}`, largestValue);
        }
      }

      if (aggregation.includes('sum' as never)) {
        const sumValue: number | string = sum(edgeCandidates, field);

        if (sumValue !== 'no-values') {
          set(acc, `sum ${field}`, sumValue);
        }
      }

      if (aggregation.includes('count' as never)) {
        const countValue: number = count(edgeCandidates, field);
        set(acc, `count ${field}`, countValue);
      }

      if (aggregation.includes('average' as never)) {
        let averageValue: number | string = average(edgeCandidates, field);

        if (averageValue !== 'no-values') {
          averageValue = Number(averageValue).toPrecision(5);
          set(acc, `average ${field}`, parseFloat(averageValue));
        }
      }

      if (aggregation.includes('first' as never)) {
        const firstValue: string = first(edgeCandidates, field);

        if (firstValue !== 'no-values') {
          set(acc, `first ${field}`, firstValue);
        }
      }

      if (aggregation.includes('last' as never)) {
        const lastValue: string = last(edgeCandidates, field);

        if (lastValue !== 'no-values') {
          set(acc, `last ${field}`, lastValue);
        }
      }

      if (aggregation.includes('most_frequent' as never)) {
        const mostFrequentValue: string = mostFrequent(edgeCandidates, field);

        if (mostFrequentValue !== 'no-values') {
          set(acc, `most_frequent ${field}`, mostFrequentValue);
        }
      }

      return acc;
    },
    aggregations,
  );
};

/**
 * Aggregate specific edge with given aggregate's field
 *
 * @param groupEdgesCandidates - edges to perform aggregations
 * @param fields - aggregation methods on specific fields
 * @return {Edge[]} - grouped edges
 */
const aggregateGroupEdges = (
  groupEdgesCandidates: GroupEdgeCandidates,
  fields: GroupEdgeFields = {},
): Edge[] => {
  return Object.entries(groupEdgesCandidates).map((value) => {
    const [, groupEdgeCandidate] = value;
    const [firstEdge] = groupEdgeCandidate as Edge[];
    const { source, target } = firstEdge as Edge;
    const aggregationFields: AggregationFields = performAggregation(
      groupEdgeCandidate,
      fields,
    );

    return {
      id: `group-${shortid.generate()}`,
      source,
      target,
      ...aggregationFields,
    };
  });
};

/**
 * 1. Remove existing edge from current graph data with duplicate connectivity (same source and target)
 * 2. Append grouped edge into the graph data
 *
 * @param data - existing graph data
 * @param edgeIdsForRemoval - edge id with duplicate connectivity required to be removed from graph
 * @param groupedEdges - grouped edge ready to append into current graph
 * @return {GraphData} - graph with grouped edges
 */
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

/**
 * 1. Remove grouped edge from graph data.
 * 2. Append edges with duplicate connectivity into the graph
 *
 * @param graphData - original graph list without grouped edges
 * @param graphFlatten - current graph data with combination of graph list
 * @param edgeIdsForRemoval - group edges' id for removal
 * @return {GraphData} - graph data without group edges
 */
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
 * Perform group edges during data importation, used in:
 * 1. Import Sample Data
 * 2. Import Local File
 *
 * Shall Perform Aggregation based on
 * 1. configuration retrieve from the saved files
 * 2. user preferences (toggle) during import data
 *
 * @param {GraphData} data - graph data
 * @param {GroupEdges} groupEdgeConfig [groupEdgeConfig={}] - group edge configuration found in every graph list
 * @return {GraphData} - graph data with grouped edges
 */
export const groupEdgesForImportation = (
  data: GraphData,
  groupEdgeConfig: GroupEdges = {},
): GraphData => {
  const { type, fields } = groupEdgeConfig;

  const groupEdgesCandidates = duplicateDictionary(data, type);
  if (isEmpty(groupEdgesCandidates)) return data;

  const edgeIdsForRemoval = obtainGroupEdgeIds(groupEdgesCandidates);
  const groupedEdges = aggregateGroupEdges(groupEdgesCandidates, fields);
  const graphWithGroupEdges = produceGraphWithGroupEdges(
    data,
    edgeIdsForRemoval,
    groupedEdges,
  );

  if (isEmpty(fields) === false) {
    const edgeAggregateFields: Field[] = aggregateMetadataFields(
      graphWithGroupEdges,
      fields,
    );
    // combine edge fields with aggregate fields
    const combinedEdgeField: Field[] = combineEdgeFields(
      [...data.metadata.fields.edges, ...edgeAggregateFields],
      'name',
    );

    const modData = cloneDeep(graphWithGroupEdges);
    Object.assign(modData.metadata.fields.edges, combinedEdgeField);

    return modData;
  }

  return graphWithGroupEdges;
};

/**
 * Perform group edge based on user preferences in graph list, used in:
 * 1. Toggle in Graph List
 * 2. Aggregation fields
 *
 * Shall perform aggregation based on:
 * 1. toggle value
 * 2. aggregation fields input in data list accordion.
 *
 * This function supports:
 * 1. Convert group edge graph to original graph
 * 2. Convert original graph to group edge graph
 *
 * @param graphData - selected graph list to perform aggregation
 * @param graphFlatten - existing graph with combination of graph list
 * @param groupEdgesConfig - list of aggregations to be perform on graph list
 * @return {GraphData} - graph combined with grouped edges.
 */
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
    const graphWithGroupEdges: GraphData = produceGraphWithGroupEdges(
      ungroupedGraph,
      edgeIdsForRemoval,
      groupedEdges,
    );

    return graphWithGroupEdges;
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

/**
 * Combine graph metadata edge fields with aggregated fields.
 * 1. Variable Inspector
 * 2. Edge Selection
 *
 * @param graphData
 * @param groupEdgeField
 * @return {Field[]}
 */
export const aggregateMetadataFields = (
  graphData: GraphData,
  groupEdgeField: GroupEdgeFields = {},
): Field[] => {
  const { edges: edgeFields } = graphData.metadata.fields;
  if (isEmpty(groupEdgeField)) return edgeFields;

  // compute edge aggregate fields ready to append into graph's edge field
  const edgeAggregateFields: Field[] = Object.values(groupEdgeField).reduce(
    (accumulateField: Field[], fieldsWithAggr: FieldAndAggregation) => {
      const { field, aggregation } = fieldsWithAggr;

      const edgeAggregateField: Field[] = (aggregation as (
        | NumericAggregations
        | StringAggregations
      )[]).map((aggr) => {
        const aggregateField = `${aggr} ${field}`;

        const oriEdgeField: Field = edgeFields.find(
          (edgeField: Field) => edgeField.name === field,
        );

        const { format, type, analyzerType } = oriEdgeField;

        return {
          name: aggregateField,
          format,
          type,
          analyzerType,
        };
      });

      return [...accumulateField, ...edgeAggregateField];
    },
    [],
  );

  return edgeAggregateFields;
};
