import inRange from 'lodash/inRange';
import isUndefined from 'lodash/isUndefined';
import get from 'lodash/get';
import set from 'lodash/set';

import { Option } from 'baseui/select';
import { isWithinInterval } from 'date-fns';
import * as Graph from '../containers/Graph/types';
import { flattenObject, ALL_FIELD_TYPES } from '../processors/data-processors';
import { styleEdges } from './style-edges';
import { styleNodes } from './style-nodes';
import { unixTimeConverter } from './data-utils';

type MinMax = {
  min: number;
  max: number;
};

/**
 * Check edge.data.value is array to determine if it is grouped
 *
 * @param {Graph.Edge} edge
 * @param {string} edgeWidth accesor function that maps to edge width
 */
export const isGroupEdges = (edge: Graph.Edge, edgeWidth: string) =>
  Array.isArray(get(edge, edgeWidth));

/**
 * Get minimum and maximum value of attribute that maps to edge width
 *
 * @param {Graph.GraphData} data
 * @param {string} edgeWidth accesor string that maps to edge width
 * @return {*}  {MinMax}
 */
export const getMinMaxValue = (
  data: Graph.GraphData,
  edgeWidth: string,
): MinMax => {
  const arrValue = [];
  for (const edge of data.edges) {
    if (isGroupEdges(edge, edgeWidth)) {
      // isGroupEdges ensures that it is of type number[]. Sum all values in array
      arrValue.push(
        (get(edge, edgeWidth) as number[]).reduce((a, b) => a + b, 0),
      );
    } else {
      arrValue.push(get(edge, edgeWidth));
    }
  }
  return {
    min: Math.min(...(arrValue as number[])),
    max: Math.max(...(arrValue as number[])),
  };
};

/**
 * Group edges based on common source, target into a single edge with the attributes as arrays
 *
 * @param {Graph.Edge[]} edges
 * @return {*}  {Graph.Edge[]}
 */
export const combineEdges = (
  edges: Graph.Edge[],
  fields: Graph.Field[],
): Graph.Edge[] => {
  const modEdges = [
    ...edges
      .reduce((r, o) => {
        const key = `${o.source}-${o.target}`;
        const item = r.get(key) || {
          id: o.id,
          source: o.source,
          target: o.target,
          defaultStyle: {},
          data: {},
          // count underlying edges
          edgeCount: 0,
        };
        // combine edge properties to array
        fields
          .map((field) => field.name)
          .forEach((field) => {
            if (isUndefined(get(item, field))) set(item, field, []);
            get(item, field).push(get(o, field));
          });
        item.edgeCount += 1;
        return r.set(key, item);
      }, new Map())
      .values(),
  ];
  return modEdges;
};

/**
 * Filter dataset by timerange based on time attribute on the edges
 *
 * @param {Graph.GraphData} data
 * @param {number[]} timerange
 * @param {string} edgeTime
 * @return {*}  {Graph.GraphData}
 */
export const filterDataByTime = (
  data: Graph.GraphData,
  timerange: number[],
  edgeTime: string,
): Graph.GraphData => {
  if (isUndefined(edgeTime)) return data;
  const { nodes, edges } = data;
  // Because our time data is on links, the timebar's filteredData object only contains links.
  // But we need to show nodes in the chart too: so for each link, track the connected nodes
  const filteredEdges = edges.filter((edge) =>
    inRange(get(edge, edgeTime), timerange[0], timerange[1]),
  );
  // Filter nodes which are connected to the edges
  const filteredNodesId: any[] = [];
  filteredEdges.forEach((edge) => {
    filteredNodesId.push(edge.source);
    filteredNodesId.push(edge.target);
  });

  const filteredNodes = nodes.filter((node) =>
    filteredNodesId.includes(node.id),
  );

  const newFilteredData = {
    nodes: [...filteredNodes],
    edges: [...filteredEdges],
  };
  return newFilteredData;
};

/**
 * Helper function to replace graph data with modified edges
 *
 * @param {Graph.GraphData} oldData
 * @param {Graph.Edge[]} newEdges
 * @return {*}  {Graph.GraphData}
 */
export const replaceEdges = (
  oldData: Graph.GraphData,
  newEdges: Graph.Edge[],
): Graph.GraphData => {
  const modData = { ...oldData };
  modData.edges = [...newEdges];
  return modData;
};

/**
 * Helper function to replace graph data with modified nodes and edges
 *
 * @param {Graph.GraphData} oldData
 * @param {Graph.Node[]} newNodes
 * @param {Graph.Edge[]} newEdges
 * @return {*}  {Graph.GraphData}
 */
export const replaceData = (
  oldData: Graph.GraphData,
  newNodes: Graph.Node[],
  newEdges: Graph.Edge[],
): Graph.GraphData => {
  const modData = { ...oldData };
  modData.edges = [...newEdges];
  modData.nodes = [...newNodes];
  return modData;
};

/**
 * Aggregates a given edge time attribute in the to time series counts, sorted based on time
 *
 * @param {Graph.GraphData} data
 * @param {string} edgeTime
 * @return {*}  {Graph.TimeSeries}
 */
export const datatoTS = (
  data: Graph.GraphData,
  edgeTime: string,
): Graph.TimeSeries =>
  // @ts-ignore
  isUndefined(edgeTime)
    ? []
    : data.edges
        .map((edge) => [get(edge, edgeTime), 1])
        .sort((a, b) => a[0] - b[0]);

/**
 * Gets time series range
 *
 * @param {Graph.TimeRange} timeRange
 * @return {*}  {Graph.TimeRange}
 */
export const chartRange = (timeRange: Graph.TimeRange): Graph.TimeRange => {
  const range = Math.max((timeRange[1] - timeRange[0]) / 8, 1000 * 60 * 60 * 1);
  return [timeRange[0] - range, timeRange[1] + range];
};

/**
 * Remove duplicates from array by checking on prop
 *
 * @param {(Graph.Node[] | Graph.Edge[] | [])} myArr
 * @param {string} prop
 */
export const removeDuplicates = (
  myArr: Graph.Node[] | Graph.Edge[] | Graph.Field[] | [],
  prop: string,
) => {
  const seen = new Set();
  const filteredArr = myArr.filter((el) => {
    const duplicate = seen.has(el[prop]);
    seen.add(el[prop]);
    return !duplicate;
  });
  return filteredArr;
};

/**
 * Combines processed data by removing duplicate nodes and edges
 *
 * @param {Graph.GraphData} newData
 * @param {Graph.GraphData} oldData
 * @return {*}  {Graph.GraphData}
 */
export const combineProcessedData = (
  newData: Graph.GraphData,
  oldData: Graph.GraphData,
): Graph.GraphData => {
  if (oldData) {
    const modData = { ...oldData };
    modData.nodes = removeDuplicates(
      [...newData.nodes, ...oldData.nodes],
      'id',
    ) as Graph.Node[];
    modData.edges = removeDuplicates(
      [...newData.edges, ...oldData.edges],
      'id',
    ) as Graph.Edge[];
    // Get unique fields metadata
    modData.metadata.fields.nodes = removeDuplicates(
      [...newData.metadata.fields.nodes, ...oldData.metadata.fields.nodes],
      'name',
    ) as Graph.Field[];
    modData.metadata.fields.edges = removeDuplicates(
      [...newData.metadata.fields.edges, ...oldData.metadata.fields.edges],
      'name',
    ) as Graph.Field[];
    return modData;
  }
  return newData;
};

/**
 * Main function to apply style.
 * Check if the graph is of group edges or non-group and apply the appropriate styling based on options.
 *
 * @param {Graph.GraphData} data
 * @param {Graph.StyleOptions} options
 * @return {*}  {Graph.GraphData}
 */
export const applyStyle = (
  data: Graph.GraphData,
  options: Graph.StyleOptions,
) => {
  styleNodes(data, options.nodeStyle);
  styleEdges(data, options.edgeStyle);
};

/**
 * Combine edges and replace edges with the new one
 *
 * @param {Graph.GraphData} data
 * @return {*}  {Graph.GraphData}
 */
export const groupEdges = (data: Graph.GraphData): Graph.GraphData => {
  // const newEdges = combineEdges(data.edges);
  // eslint-disable-next-line no-param-reassign
  data.edges = combineEdges(data.edges, data.metadata.fields.edges);
  return data;
};

/**
 * Get visible graph by applying appropriate style
 *
 * @param {Graph.GraphData} graphData
 * @param {Graph.StyleOptions} styleOptions
 * @return {*}  {Graph.GraphData}
 */
export const deriveVisibleGraph = (
  graphData: Graph.GraphData,
  styleOptions: Graph.StyleOptions,
): Graph.GraphData => {
  if (styleOptions.groupEdges) {
    applyStyle(groupEdges(graphData), styleOptions);
  } else {
    applyStyle(graphData, styleOptions);
  }

  return graphData;
};
/**
 * Check is value is truthy and if it is an array, it should be length > 0
 *
 * @param {*} value
 * @return {*}  {boolean}
 */
export const isValidValue = (value: any): boolean =>
  (Array.isArray(value) && value.length > 0) ||
  (!Array.isArray(value) && value);

/**
 * Helper function to retrieve relevant node properties.
 * Also removes non-truthy values and arrays of length 0
 *
 * @param {Graph.Node} node
 * @param {('all' | 'style' | 'data')} [kind='all'] set to 'style' to get only style fields and 'data' to exclude style fields
 * @param {string[]} filter list of items to filter out
 * @return {*} object sorted by id, data fields followed by style fields
 */
export const getNodeProperties = (
  node: Graph.Node,
  kind: 'all' | 'style' | 'data' = 'all',
  filter: string[],
) => {
  const flattenInfo = flattenObject(node);
  const dataKeys = Object.keys(flattenInfo).filter(
    (k) => k !== 'id' && !k.includes('style.') && !k.includes('defaultStyle.'),
  );
  const styleKeys = Object.keys(flattenInfo).filter(
    (k) => k !== 'id' && (k.includes('style.') || k.includes('defaultStyle.')),
  );
  const newObj = {};
  // @ts-ignore
  newObj.id = flattenInfo.id;

  if (kind === 'data' || kind === 'all') {
    dataKeys.forEach((k) => {
      if (isValidValue(flattenInfo[k]) && !filter.includes(k))
        newObj[k] = flattenInfo[k];
    });
  }

  if (kind === 'style' || kind === 'all') {
    styleKeys.forEach((k) => {
      if (isValidValue(flattenInfo[k]) && !filter.includes(k))
        newObj[k] = flattenInfo[k];
    });
  }
  return newObj;
};

/**
 * Helper function to retrieve relevant edge properties.
 * Also removes non-truthy values and arrays of length 0
 *
 * @param {Graph.Edge} edge
 * @param {('all' | 'style' | 'data')} [kind='all'] set to 'style' to get only style fields and 'data' to exclude style fields
 * @param {string[]} filter list of items to filter out
 * @return {*} object sorted by id, source, target, data fields followed by style fields
 */
export const getEdgeProperties = (
  edge: Graph.Edge,
  kind: 'all' | 'style' | 'data' = 'all',
  filter: string[],
) => {
  const flattenInfo = flattenObject(edge);
  const restrictedTerms = ['id', 'source', 'target'];
  const dataKeys = Object.keys(flattenInfo).filter(
    (k) =>
      !restrictedTerms.includes(k) &&
      !k.includes('style.') &&
      !k.includes('defaultStyle.'),
  );
  const styleKeys = Object.keys(flattenInfo).filter(
    (k) =>
      !restrictedTerms.includes(k) &&
      (k.includes('style.') || k.includes('defaultStyle.')),
  );
  const newObj = {};
  // @ts-ignore
  newObj.id = flattenInfo.id;
  // @ts-ignore
  newObj.source = flattenInfo.source;
  // @ts-ignore
  newObj.target = flattenInfo.target;

  if (kind === 'data' || kind === 'all') {
    dataKeys.forEach((k) => {
      if (isValidValue(flattenInfo[k]) && !filter.includes(k))
        newObj[k] = flattenInfo[k];
    });
  }

  if (kind === 'style' || kind === 'all') {
    styleKeys.forEach((k) => {
      if (isValidValue(flattenInfo[k]) && !filter.includes(k))
        newObj[k] = flattenInfo[k];
    });
  }
  return newObj;
};

/**
 * For a given accessor and node / edge dataset, the function creates a dictionary of value / count pairs
 *
 * @param {(Graph.Node[] | Graph.Edge[])} data
 * @param {string} accessor
 * @return {*} map of property: counts
 */
export const countProperty = (
  data: Graph.Node[] | Graph.Edge[],
  accessor: string,
) => {
  const map = {};
  data.forEach((o: any) => {
    if (!Object.prototype.hasOwnProperty.call(map, get(o, accessor))) {
      map[get(o, accessor)] = 1;
    } else {
      map[get(o, accessor)] = map[get(o, accessor)] + 1;
    }
  });
  return map;
};

type FieldTypes = (keyof typeof ALL_FIELD_TYPES)[];
const allFields = Object.keys(ALL_FIELD_TYPES) as FieldTypes;

/**
 * Returns field name of which has type which matches the given type array
 *
 * @param {Graph.Field[]} fields
 * @param {FieldTypes} [typeArray=allFields]
 */
export const getFieldNames = (
  fields: Graph.Field[],
  typeArray: FieldTypes = allFields,
) =>
  // @ts-ignore
  fields.filter((f) => typeArray.includes(f.type)).map((f) => f.name);

type FilterArray = [string, Graph.FilterCriteria];

/**
 * Filter graph with given dynamic options on graph data
 *
 * @param {GraphData} graphFlatten
 * @param {FilterOptions} filterOptions
 *
 * @return {GraphData}
 */
export const filterGraph = (
  graphFlatten: Graph.GraphData,
  filterOptions: Graph.FilterOptions,
): Graph.GraphData => {
  if (Object.keys(filterOptions).length === 0) {
    return graphFlatten;
  }

  const filtersArray: FilterArray[] = Object.entries(filterOptions);
  const filteredGraph: Graph.GraphData = {
    nodes: [],
    edges: [],
    metadata: graphFlatten.metadata,
    key: graphFlatten.key,
  };

  const hasNodeFilters:
    | FilterArray
    | undefined = filtersArray.find((value: FilterArray) =>
    hasGraphFilters(value, 'nodes'),
  );

  const hasEdgeFilters:
    | FilterArray
    | undefined = filtersArray.find((value: FilterArray) =>
    hasGraphFilters(value, 'edges'),
  );

  if (hasNodeFilters === undefined && hasEdgeFilters === undefined) {
    return graphFlatten;
  }

  if (hasEdgeFilters) {
    const { nodes, edges } = graphFlatten;
    const filteredEdges: Graph.Edge[] = filterGraphEdgeNodes(
      edges,
      filtersArray,
      'edges',
    );

    const connectedNodes: Graph.Node[] = connectNodes(filteredEdges, nodes);
    // const combinedNodes: Graph.Node[] = removeDuplicates(
    //   [...graphFlatten.nodes, ...connectedNodes],
    //   'id',
    // );
    // const combinedEdges: Graph.Edge[] = removeDuplicates(
    //   [...graphFlatten.edges, ...filteredEdges],
    //   'id',
    // );

    Object.assign(graphFlatten, {
      nodes: connectedNodes,
      edges: filteredEdges,
    });
  }

  if (hasNodeFilters) {
    const { nodes, edges } = graphFlatten;
    const filteredNodes: Graph.Node[] = filterGraphEdgeNodes(
      nodes,
      filtersArray,
      'nodes',
    );

    const connectedEdges: Graph.Edge[] = connectEdges(filteredNodes, edges);

    Object.assign(graphFlatten, {
      nodes: filteredNodes,
      edges: connectedEdges,
    });
  }

  // Object.assign(graphFlatten, {
  //   nodes: filteredGraph.nodes,
  //   edges: filteredGraph.edges,
  // });

  return filteredGraph;
};

const hasGraphFilters = (value: FilterArray, type: Graph.GraphAttribute) => {
  const { 1: criteria } = value;
  const { isFilterReady, from } = criteria as Graph.FilterCriteria;
  return from === type && isFilterReady;
};

/**
 * Filter Edges and Nodes in graph with given dynamic filters
 *  1. construct filter objects
 *  2. preform filtering with dynamic options in OR conditions
 *
 * @param {EdgeNode[]} nodes
 * @param {FilterArray[]} filtersArray
 * @param {Graph.GraphAttribute} type
 *
 * @return {Node[]}
 */
const filterGraphEdgeNodes = (
  nodes: Graph.EdgeNode[],
  filtersArray: FilterArray[],
  type: Graph.GraphAttribute,
): Graph.EdgeNode[] => {
  const dynamicFilters: any[] = [];

  // 1. construct filter objects
  filtersArray
    .filter((value: FilterArray) => hasGraphFilters(value, type))
    .reduce((accFilter: any[], value: FilterArray) => {
      const { 1: criteria } = value;
      const {
        id,
        caseSearch,
        analyzerType,
        range,
      } = criteria as Graph.FilterCriteria;

      if (analyzerType === 'STRING') {
        const stringCases: (string | number)[] = caseSearch.map(
          (option: Option) => option.id,
        );

        accFilter.push((node: Graph.EdgeNode) =>
          stringCases.includes(get(node, id)),
        );
        return accFilter;
      }

      if (analyzerType === 'DATETIME' || analyzerType === 'DATE') {
        const isDateTimeWithinRange = (node: Graph.EdgeNode): boolean => {
          const [startDate, endDate] = range;
          const dateTime: Date = new Date(get(node, id));
          const startInterval: Date = new Date(startDate);
          const endInterval: Date = new Date(endDate);
          const isWithinRange: boolean = isWithinInterval(dateTime, {
            start: startInterval,
            end: endInterval,
          });

          return isWithinRange;
        };
        accFilter.push(isDateTimeWithinRange);
        return accFilter;
      }

      if (analyzerType === 'TIME') {
        const isTimeWithinRange = (node: Graph.EdgeNode): boolean => {
          const [startDate, endDate] = range;
          const timeInUnix: number = unixTimeConverter(
            get(node, id),
            analyzerType,
          );
          const dateTime: Date = new Date(timeInUnix);
          const startInterval: Date = new Date(startDate);
          const endInterval: Date = new Date(endDate);

          const isWithinRange: boolean = isWithinInterval(dateTime, {
            start: startInterval,
            end: endInterval,
          });

          return isWithinRange;
        };

        accFilter.push(isTimeWithinRange);
        return accFilter;
      }

      // analyzerType ("INT", "FLOAT", "NUMBER")
      const isNumericWithinRange = (node: Graph.EdgeNode): boolean => {
        const [min, max] = range;
        return min <= get(node, id) && max >= get(node, id);
      };
      accFilter.push(isNumericWithinRange);
      return accFilter;
    }, dynamicFilters);

  // 2. perform filtering with dynamic options in AND conditions
  const filteredGraphNodes: Graph.EdgeNode[] = nodes.filter(
    (node: Graph.EdgeNode) => dynamicFilters.every((f) => f(node)),
  );

  return filteredGraphNodes;
};

/**
 * Connect edges on the filtered nodes to establish relationships
 * 1. perform nothing if nodes is empty
 * 2. find edges if source and target are presents
 *
 * @param {Node[]} filteredNodes
 * @param {Edge[]} edges
 * @return {Edge[]}
 */
const connectEdges = (
  filteredNodes: Graph.Node[],
  edges: Graph.Edge[],
): Graph.Edge[] => {
  if (filteredNodes.length === 0) return [];

  const idsArr: string[] = filteredNodes.map((nodes: Graph.Node) => nodes.id);

  const associatedEdges: Graph.Edge[] = edges.filter((edge: Graph.Edge) => {
    const { source, target } = edge;
    return idsArr.includes(source) && idsArr.includes(target);
  });

  return associatedEdges;
};

/**
 * Obtain the associated nodes with the given edges.
 * 1. obtain nodes based on source and targets
 *
 * @param {Graph.Edge[]} filteredEdges
 * @param {Graph.Node[]} nodes
 *
 * @return {Graph.Node[]}
 */
const connectNodes = (
  filteredEdges: Graph.Edge[],
  nodes: Graph.Node[],
): Graph.Node[] => {
  if (filteredEdges.length === 0) return [];

  const sourceTargetIds: Set<string> = new Set();

  filteredEdges.reduce((acc: Set<string>, edge: Graph.Edge) => {
    const { source, target } = edge;

    if (acc.has(source) === false) acc.add(source);

    if (acc.has(target) === false) acc.add(target);

    return acc;
  }, sourceTargetIds);

  const sourceTargetIdArr: string[] = [...sourceTargetIds];

  const associatedNodes = nodes.filter((node: Graph.Node) =>
    sourceTargetIdArr.includes(node.id),
  );
  return associatedNodes;
};
