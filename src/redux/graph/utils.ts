import inRange from 'lodash/inRange';
import isUndefined from 'lodash/isUndefined';
import get from 'lodash/get';
import set from 'lodash/set';
import has from 'lodash/has';

import { Option } from 'baseui/select';
import { isWithinInterval } from 'date-fns';
import { WritableDraft } from 'immer/dist/internal';
import { IUserEdge, IUserNode } from '@antv/graphin/lib/typings/type';
import { flattenObject, ALL_FIELD_TYPES } from './processors/data';
import { styleEdges } from '../../utils/style-edges';
import { styleNodes } from '../../utils/style-nodes';
import { unixTimeConverter } from '../../utils/data-utils';
import {
  Edge,
  Field,
  FilterOptions,
  FilterCriteria,
  GraphData,
  StyleOptions,
  Node,
  EdgeNode,
  TimeRange,
  GraphAttribute,
  TimeSeries,
} from './types';
import {
  defaultEdgeStyle,
  defaultNodeStyle,
  defaultEdgeStateStyle,
  defaultNodeStateStyle,
} from '../../containers/Graph/styles';

type MinMax = {
  min: number;
  max: number;
};

/**
 * Check edge.data.value is array to determine if it is grouped
 *
 * @param {Edge} edge
 * @param {string} edgeWidth accesor function that maps to edge width
 */
export const isGroupEdges = (edge: Edge, edgeWidth: string) =>
  Array.isArray(get(edge, edgeWidth));

/**
 * Get minimum and maximum value of attribute that maps to edge width
 *
 * @param {GraphData} data
 * @param {string} edgeWidth accesor string that maps to edge width
 * @return {*}  {MinMax}
 */
export const getMinMaxValue = (data: GraphData, edgeWidth: string): MinMax => {
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
 * @param {Edge[]} edges
 * @param {Field[]} fields
 * @return {*}  {Edge[]}
 */
export const combineEdges = (edges: Edge[], fields: Field[]): Edge[] => {
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
        // combine edge properties to array exclude id, source and target
        fields
          .filter((field) => !['id', 'source', 'target'].includes(field.name))
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
 * @param {GraphData} data
 * @param {number[]} timerange
 * @param {string} edgeTime
 * @return {*}  {GraphData}
 */
export const filterDataByTime = (
  data: GraphData,
  timerange: number[],
  edgeTime: string,
): GraphData => {
  if (isUndefined(edgeTime)) return data;
  const { nodes, edges } = data;
  // Because our time data is on links, the timebar's filteredData object only contains links.
  // But we need to show nodes in the chart too: so for each link, track the connected nodes
  const filteredEdges = edges.filter((edge) =>
    inRange(Number(get(edge, edgeTime)), timerange[0], timerange[1]),
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
 * @param {GraphData} oldData
 * @param {Edge[]} newEdges
 * @return {*}  {GraphData}
 */
export const replaceEdges = (
  oldData: GraphData,
  newEdges: Edge[],
): GraphData => {
  const modData = { ...oldData };
  modData.edges = [...newEdges];
  return modData;
};

/**
 * Helper function to replace graph data with modified nodes and edges
 *
 * @param {GraphData} oldData
 * @param {Node[]} newNodes
 * @param {Edge[]} newEdges
 * @return {*}  {GraphData}
 */
export const replaceData = (
  oldData: GraphData,
  newNodes: Node[],
  newEdges: Edge[],
): GraphData => {
  const modData = { ...oldData };
  modData.edges = [...newEdges];
  modData.nodes = [...newNodes];
  return modData;
};

/**
 * Aggregates a given edge time attribute in the to time series counts, sorted based on time
 *
 * @param {GraphData} data
 * @param {string} edgeTime
 * @return {*}  {TimeSeries}
 */
export const datatoTS = (data: GraphData, edgeTime: string): TimeSeries =>
  // @ts-ignore
  isUndefined(edgeTime)
    ? []
    : data.edges
        .map((edge) => [get(edge, edgeTime), 1])
        .sort((a, b) => Number(a[0]) - Number(b[0]));

/**
 * Gets time series range
 *
 * @param {TimeRange} timeRange
 * @return {*}  {TimeRange}
 */
export const chartRange = (timeRange: TimeRange): TimeRange => {
  const range = Math.max((timeRange[1] - timeRange[0]) / 8, 1000 * 60 * 60);
  return [timeRange[0] - range, timeRange[1] + range];
};

/**
 * Remove duplicates from array by checking on prop
 *
 * @param {(Node[] | Edge[] | [])} myArr
 * @param {string} prop
 * @return {Node[] | Edge[] | Field[]}
 */
export const removeDuplicates = (
  myArr: Node[] | Edge[] | Field[] | [],
  prop: string,
): Node[] | Edge[] | Field[] => {
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
 * @param {GraphData} newData
 * @param {GraphData} oldData
 * @return {*}  {GraphData}
 */
export const combineProcessedData = (
  newData: GraphData,
  oldData: GraphData,
): GraphData => {
  if (oldData) {
    const modData = { ...oldData };
    modData.nodes = removeDuplicates(
      [...newData.nodes, ...oldData.nodes],
      'id',
    ) as Node[];
    modData.edges = removeDuplicates(
      [...newData.edges, ...oldData.edges],
      'id',
    ) as Edge[];
    // Get unique fields metadata
    modData.metadata.fields.nodes = removeDuplicates(
      [...newData.metadata.fields.nodes, ...oldData.metadata.fields.nodes],
      'name',
    ) as Field[];
    modData.metadata.fields.edges = removeDuplicates(
      [...newData.metadata.fields.edges, ...oldData.metadata.fields.edges],
      'name',
    ) as Field[];
    return modData;
  }
  return newData;
};

/**
 * Main function to apply style.
 * Check if the graph is of group edges or non-group and apply the appropriate styling based on options.
 *
 * @param {WritableDraft<GraphData>} data
 * @param {StyleOptions} options
 * @return {void}
 */
export const applyStyle = (
  data: WritableDraft<GraphData>,
  options: StyleOptions,
): void => {
  styleNodes(data, options.nodeStyle);
  styleEdges(data, options.edgeStyle);
};

/**
 * Combine edges and replace edges with the new one
 *
 * @param {GraphData} data
 * @return {*}  {GraphData}
 */
export const groupEdges = (data: GraphData): GraphData => {
  // const newEdges = combineEdges(data.edges);
  // eslint-disable-next-line no-param-reassign
  data.edges = combineEdges(data.edges, data.metadata.fields.edges);
  return data;
};

/**
 * Get visible graph by applying appropriate style
 *
 * @param {GraphData} graphData
 * @param {StyleOptions} styleOptions
 * @return {*}  {GraphData}
 */
export const deriveVisibleGraph = (
  graphData: WritableDraft<GraphData>,
  styleOptions: StyleOptions,
): GraphData => {
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
 * @param {Node} node
 * @param {('all' | 'style' | 'data')} [kind='all'] set to 'style' to get only style fields and 'data' to exclude style fields
 * @param {string[]} filter list of items to filter out
 * @return {*} object sorted by id, data fields followed by style fields
 */
export const getNodeProperties = (
  node: Node,
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
 * @param {Edge} edge
 * @param {('all' | 'style' | 'data')} [kind='all'] set to 'style' to get only style fields and 'data' to exclude style fields
 * @param {string[]} filter list of items to filter out
 * @return {*} object sorted by id, source, target, data fields followed by style fields
 */
export const getEdgeProperties = (
  edge: Edge,
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
 * @param {(Node[] | Edge[])} data
 * @param {string} accessor
 * @return {*} map of property: counts
 */
export const countProperty = (data: Node[] | Edge[], accessor: string) => {
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
 * @param {Field[]} fields
 * @param {FieldTypes} [typeArray=allFields]
 */
export const getFieldNames = (
  fields: Field[],
  typeArray: FieldTypes = allFields,
) =>
  // @ts-ignore
  fields.filter((f) => typeArray.includes(f.type)).map((f) => f.name);

type FilterArray = [string, FilterCriteria];

/**
 * Filter graph with given dynamic options on graph data
 *
 * @param {GraphData} graphFlatten
 * @param {FilterOptions} filterOptions
 *
 * @return {GraphData}
 */
export const filterGraph = (
  graphFlatten: GraphData,
  filterOptions: FilterOptions,
): GraphData => {
  if (Object.keys(filterOptions).length === 0) {
    return graphFlatten;
  }

  const filtersArray: FilterArray[] = Object.entries(filterOptions);

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

  if (hasNodeFilters) {
    const { nodes, edges } = graphFlatten;
    const filteredNodes: EdgeNode[] = filterGraphEdgeNodes(
      nodes,
      filtersArray,
      'nodes',
    );

    const connectedEdges: Edge[] = connectEdges(filteredNodes as Node[], edges);

    Object.assign(graphFlatten, {
      nodes: filteredNodes,
      edges: connectedEdges,
    });
  }

  if (hasEdgeFilters) {
    const { nodes, edges } = graphFlatten;
    const filteredEdges = filterGraphEdgeNodes(
      edges,
      filtersArray,
      'edges',
    ) as Edge[];

    const connectedNodes: Node[] = connectNodes(filteredEdges, nodes);

    Object.assign(graphFlatten, {
      nodes: connectedNodes,
      edges: filteredEdges,
    });
  }

  return graphFlatten;
};

const hasGraphFilters = (value: FilterArray, type: GraphAttribute): boolean => {
  const { 1: criteria } = value;
  const { isFilterReady, from } = criteria as FilterCriteria;
  return from === type && isFilterReady;
};

/**
 * Filter Edges and Nodes in graph with given dynamic filters
 *  1. construct filter objects
 *  2. preform filtering with dynamic options in OR conditions
 *
 * @param {EdgeNode[]} nodes
 * @param {FilterArray[]} filtersArray
 * @param {GraphAttribute} type
 *
 * @return {Node[]}
 */
const filterGraphEdgeNodes = (
  nodes: EdgeNode[],
  filtersArray: FilterArray[],
  type: GraphAttribute,
): EdgeNode[] => {
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
      } = criteria as FilterCriteria;

      if (analyzerType === 'STRING') {
        const stringCases: (string | number)[] = caseSearch.map(
          (option: Option) => option.id,
        );

        accFilter.push((node: EdgeNode) =>
          stringCases.includes(get(node, id) as string | number),
        );
        return accFilter;
      }

      if (analyzerType === 'DATETIME' || analyzerType === 'DATE') {
        const isDateTimeWithinRange = (node: EdgeNode): boolean => {
          const [startDate, endDate] = range;
          const dateTime: Date = new Date(get(node, id) as number);
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
        const isTimeWithinRange = (node: EdgeNode): boolean => {
          const [startDate, endDate] = range;
          const timeInUnix: number = unixTimeConverter(
            get(node, id) as string,
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
      const isNumericWithinRange = (node: EdgeNode): boolean => {
        const [min, max] = range;
        return min <= get(node, id) && max >= get(node, id);
      };
      accFilter.push(isNumericWithinRange);
      return accFilter;
    }, dynamicFilters);

  // 2. perform filtering with dynamic options in AND conditions
  const filteredGraphNodes: EdgeNode[] = nodes.filter((node: EdgeNode) =>
    dynamicFilters.every((f) => f(node)),
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
const connectEdges = (filteredNodes: Node[], edges: Edge[]): Edge[] => {
  if (filteredNodes.length === 0) return [];

  const idsArr: string[] = filteredNodes.map((nodes: Node) => nodes.id);

  const associatedEdges: Edge[] = edges.filter((edge: Edge) => {
    const { source, target } = edge;
    return idsArr.includes(source) && idsArr.includes(target);
  });

  return associatedEdges;
};

/**
 * Obtain the associated nodes with the given edges.
 * 1. obtain nodes based on source and targets
 *
 * @param {Edge[]} filteredEdges
 * @param {Node[]} nodes
 *
 * @return {Node[]}
 */
const connectNodes = (filteredEdges: Edge[], nodes: Node[]): Node[] => {
  if (filteredEdges.length === 0) return [];

  const sourceTargetIds: Set<string> = new Set();

  filteredEdges.reduce((acc: Set<string>, edge: Edge) => {
    const { source, target } = edge;

    if (acc.has(source) === false) acc.add(source);

    if (acc.has(target) === false) acc.add(target);

    return acc;
  }, sourceTargetIds);

  const sourceTargetIdArr: string[] = [...sourceTargetIds];

  const associatedNodes = nodes.filter((node: Node) =>
    sourceTargetIdArr.includes(node.id),
  );
  return associatedNodes;
};

export const addNodeStyleField = (obj: IUserNode): void => {
  if (isUndefined(obj.style)) {
    Object.assign(obj, {
      style: defaultNodeStyle.style,
    });
  }
};

export const addEdgeStyleField = (obj: IUserEdge): void => {
  if (isUndefined(obj.style)) {
    Object.assign(obj, {
      style: defaultEdgeStyle.style,
    });
  }
};

export const formatLabelStyle = (obj: EdgeNode): void => {
  const LABEL_KEY = 'label';
  const isObjHasLabel: boolean = has(obj, LABEL_KEY);

  if (isObjHasLabel) {
    Object.assign(obj.style, {
      label: {
        value: obj[LABEL_KEY],
      },
    });
  }
};
