import inRange from 'lodash/inRange';
import isUndefined from 'lodash/isUndefined';
import get from 'lodash/get';
import * as Graph from '../types/Graph';
import { styleEdges } from './style-edges';
import { styleNodes } from './style-nodes';

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
export const combineEdges = (edges: Graph.Edge[]): Graph.Edge[] => {
  const modEdges = [
    ...edges
      .reduce((r, o) => {
        const key = `${o.source}-${o.target}`;
        const item = r.get(key) || {
          id: o.id,
          source: o.source,
          target: o.target,
          data: {
            count: 0,
          },
        };
        if (!isUndefined(o.data)) {
          for (const [prop, value] of Object.entries(o.data)) {
            if (isUndefined(item.data[prop])) item.data[prop] = [];
            item.data[prop].push(value);
          }
        }
        item.data.count += 1;
        item.label = item.data.count.toString();
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
  myArr: Graph.Node[] | Graph.Edge[] | [],
  prop: string,
) =>
  myArr.filter(
    (obj, pos, arr) =>
      arr.map((mapObj) => mapObj[prop]).indexOf(obj[prop]) === pos,
  );

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
 * @param {Graph.Accessors} accessors
 * @return {*}  {Graph.GraphData}
 */
export const applyStyle = (
  data: Graph.GraphData,
  options: Graph.StyleOptions,
  accessors: Graph.Accessors,
): Graph.GraphData => {
  const styledNodes = styleNodes(data, options.nodeStyle, accessors.nodeStyle);
  const styledEdges = styleEdges(data, options.edgeStyle, accessors.edgeStyle);
  return replaceData(data, styledNodes, styledEdges);
};

/**
 * Combine edges and replace edges with the new one
 *
 * @param {Graph.GraphData} data
 * @return {*}  {Graph.GraphData}
 */
export const groupEdges = (data: Graph.GraphData): Graph.GraphData => {
  const newEdges = combineEdges(data.edges);
  return { ...replaceEdges(data, newEdges) };
};

/**
 * Get visible graph by applying appropriate style
 *
 * @param {Graph.GraphData} graphData
 * @param {Graph.StyleOptions} styleOptions
 * @param {Graph.Accessors} accessors
 * @return {*}  {Graph.GraphData}
 */
export const deriveVisibleGraph = (
  graphData: Graph.GraphData,
  styleOptions: Graph.StyleOptions,
  accessors: Graph.Accessors,
): Graph.GraphData =>
  styleOptions.groupEdges
    ? applyStyle(groupEdges(graphData), styleOptions, accessors)
    : applyStyle(graphData, styleOptions, accessors);
