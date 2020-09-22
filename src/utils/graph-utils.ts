import inRange from 'lodash/inRange';
import isUndefined from 'lodash/isUndefined';
import get from 'lodash/get';
import shortid from 'shortid';
import * as Graph from '../types/Graph';
import { CATEGORIES_COLOR } from './categories';
import { styleEdges } from './style-edge-utils';

type MinMax = {
  min: number;
  max: number;
};

/**
 * Filter all edges which contains a given node id as source or target
 *
 * @param {Graph.GraphData} data
 * @param {string} id node id
 */
export const findConnectedEdges = (data: Graph.GraphData, id: string) =>
  data.edges.filter((e) => e.source === id || e.target === id);

/**
 * Get degree of a given node id
 *
 * @param {Graph.GraphData} data
 * @param {string} id node id
 */
export const getDegree = (data: Graph.GraphData, id: string) =>
  findConnectedEdges(data, id).length;

/**
 * Get degree of a given graph keyed by node id
 *
 * @param {Graph.GraphData} data
 * @return {*}  {(Record<string | number, number>)}
 */
export const getGraphDegree = (
  data: Graph.GraphData,
): Record<string | number, number> => {
  const nodeIds = [];
  const degree = {};
  for (const item of data.nodes) {
    nodeIds.push(item.id);
  }
  for (const id of nodeIds) {
    // Calculate degree
    degree[id] = getDegree(data, id);
  }
  return degree;
};

/**
 * Adjust node size based on a given method
 *
 * @param {Graph.GraphData} data
 * @param {string} method
 * @return {*}  {Graph.Node[]}
 */
export const adjustNodeSize = (
  data: Graph.GraphData,
  method: string,
): Graph.Node[] => {
  const degree = getGraphDegree(data);
  const min = Math.min(...Object.values(degree));
  const max = Math.max(...Object.values(degree));
  const modNodes = [];
  for (const node of data.nodes) {
    const nodeCopy = { ...node };

    // nodeSize
    if (method === 'degree' && max !== min) {
      // Scale by degree, from 8-30
      nodeCopy.style = {
        ...nodeCopy.style,
        nodeSize: (((degree[node.id] - min) / (max - min)) * (30 - 8) + 8) * 3,
      };
    }
    // nodeLabel
    // default same node size
    nodeCopy.label = `${node.label ? node.label : node.id}`;
    modNodes.push(nodeCopy);
  }
  return modNodes;
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
 * Initial function to process data to required format
 * Use accessors to create access node and edge attributes as required by graphin format
 *
 * @param {Graph.GraphData} data
 * @param {Graph.Accessors} Accessors
 * @return {*}  {Graph.GraphData}
 */
export const processData = (
  data: Graph.GraphData,
  accessors: Graph.Accessors,
): Graph.GraphData => {
  const {
    edgeSource,
    edgeTarget,
    edgeID,
    edgeStyle,
    nodeID,
    nodeStyle,
  } = accessors;
  for (const node of data.nodes) {
    // data property required by graphin
    if (isUndefined(node.data)) node.data = {};
    node.id = isUndefined(nodeID) ? shortid.generate() : get(node, nodeID);
    if (nodeStyle?.label) {
      if (get(node, nodeStyle.label) >= 8) {
        // Assign shortened label to node.label for graph display
        node.label = `${node.label.substring(0, 5)}...`;
      } else {
        node.label = get(node, nodeStyle.label);
      }
    }
  }
  for (const edge of data.edges) {
    // data property required by graphin
    if (isUndefined(edge.data)) edge.data = {};
    // source, target are required
    edge.source = get(edge, edgeSource);
    edge.target = get(edge, edgeTarget);
    edge.id = isUndefined(edgeID) ? shortid.generate() : get(edge, nodeID);
    if (edgeStyle?.label) {
      edge.label = get(edge, edgeStyle.label);
    }
    if (edgeStyle?.width) {
      edge.width = get(edge, edgeStyle.width);
    }
  }
  return data;
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
  const { nodeStyle, edgeStyle } = options;
  const styledEdges = styleEdges(data, edgeStyle, accessors.edgeStyle);
  const styledNodes = adjustNodeSize(data, nodeStyle.size);
  console.log(replaceData(data, styledNodes, styledEdges));
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
