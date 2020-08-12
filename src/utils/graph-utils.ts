import inRange from 'lodash/inRange';
import isUndefined from 'lodash/isUndefined';
import * as Graph from '../types/Graph';
import { CATEGORIES_COLOR } from './categories';

type MinMax = {
  min: number;
  max: number;
};

/**
 * Filter all edges which contains a given node id as source or target
 *
 * @param {Graph.Data} data
 * @param {string} id node id
 */
export const findConnectedEdges = (data: Graph.Data, id: string) =>
  data.edges.filter((e) => e.source === id || e.target === id);

/**
 * Get degree of a given node id
 *
 * @param {Graph.Data} data
 * @param {string} id node id
 */
export const getDegree = (data: Graph.Data, id: string) =>
  findConnectedEdges(data, id).length;

/**
 * Get degree of a given graph keyed by node id
 *
 * @param {Graph.Data} data
 * @return {*}  {(Record<string | number, number>)}
 */
export const getGraphDegree = (
  data: Graph.Data,
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
 * @param {Graph.Data} data
 * @param {string} method
 * @return {*}  {Graph.Node[]}
 */
export const adjustNodeSize = (
  data: Graph.Data,
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
    nodeCopy.label = `${node.label ? node.label : node.data.category}`;
    modNodes.push(nodeCopy);
  }
  return modNodes;
};

/**
 * Check edge.data.value is array to determine if it is grouped
 *
 * @param {Graph.Edge} edge
 * @param {Graph.EdgeAccessor<number | number[]>} getEdgeWidth accesor function that maps to edge width
 */
export const isGroupEdges = (
  edge: Graph.Edge,
  getEdgeWidth: Graph.EdgeAccessor<number | number[]>,
) => Array.isArray(getEdgeWidth(edge));

/**
 * Get minimum and maximum value of attribute that maps to edge width
 *
 * @param {Graph.Data} data
 * @param {Graph.EdgeAccessor<number | number[]>} getEdgeWidth accesor function that maps to edge width
 * @return {*}  {MinMax}
 */
export const getMinMaxValue = (
  data: Graph.Data,
  getEdgeWidth: Graph.EdgeAccessor<number | number[]>,
): MinMax => {
  const arrValue = [];
  for (const edge of data.edges) {
    if (isGroupEdges(edge, getEdgeWidth)) {
      // isGroupEdges ensures that it is of type number[]. Sum all values in array
      arrValue.push(
        (getEdgeWidth(edge) as number[]).reduce((a, b) => a + b, 0),
      );
    } else {
      arrValue.push(getEdgeWidth(edge));
    }
  }
  return {
    min: Math.min(...(arrValue as number[])),
    max: Math.max(...(arrValue as number[])),
  };
};

/**
 * Style a group edge dataset based on a given method
 *
 * @param {Graph.Data} data
 * @param {string} method
 * @param {Graph.EdgeAccessor<number>} getEdgeWidth
 * @return {*}  {Graph.Edge[]}
 */
export const styleGroupedEdge = (
  data: Graph.Data,
  method: string,
  getEdgeWidth: Graph.EdgeAccessor<number | number[]>,
): Graph.Edge[] => {
  const modEdges = [];
  for (const edge of data.edges) {
    const edgeCopy = { ...edge };
    let w = 2; // default
    if (method === 'value') {
      const { min, max } = getMinMaxValue(data, getEdgeWidth);
      w =
        (((getEdgeWidth(edge) as number[]).reduce((a, b) => a + b, 0) - min) /
          (max - min)) *
          (10 - 2) +
        2;
    }
    edgeCopy.style = {
      ...edgeCopy.style,
      line: {
        width: w,
      },
    };
    modEdges.push(edgeCopy);
  }
  return modEdges;
};

/**
 * Style an edge dataset based on a given method
 *
 * @param {Graph.Data} data
 * @param {string} method
 * @param {Graph.EdgeAccessor<number>} getEdgeWidth
 * @return {*}  {Graph.Edge[]}
 */
export const styleEdge = (
  data: Graph.Data,
  method: string,
  getEdgeWidth: Graph.EdgeAccessor<number>,
): Graph.Edge[] => {
  // Scales width based on min, max value of edges
  // mode = eth (scale width from 0.5-5) or fix (default value of 0.5)
  const modEdges = [];
  const { min, max } = getMinMaxValue(data, getEdgeWidth);
  for (const edge of data.edges) {
    const edgeCopy = { ...edge };
    let w = 2; // default
    if (method === 'value') {
      w = (((getEdgeWidth(edge) as number) - min) / (max - min)) * (10 - 2) + 2;
    }
    edgeCopy.style = {
      ...edgeCopy.style,
      line: {
        width: w,
      },
    };
    // Display edge value as default when edges are not grouped for now
    edgeCopy.label = getEdgeWidth(edge).toString();
    modEdges.push(edgeCopy);
  }
  return modEdges;
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
          style: o.style,
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
 * @param {Graph.Data} data
 * @param {number[]} timerange
 * @param {Graph.EdgeAccessor<number>} getEdgeTime
 * @return {*}  {Graph.Data}
 */
export const filterDataByTime = (
  data: Graph.Data,
  timerange: number[],
  getEdgeTime: Graph.EdgeAccessor<number>,
): Graph.Data => {
  if (isUndefined(getEdgeTime)) return data;
  const { nodes, edges } = data;
  // Because our time data is on links, the timebar's filteredData object only contains links.
  // But we need to show nodes in the chart too: so for each link, track the connected nodes
  const filteredEdges = edges.filter((edge) =>
    inRange(getEdgeTime(edge) as number, timerange[0], timerange[1]),
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
 * @param {Graph.Data} data
 * @param {Graph.AccessorFns} AccessorFns
 * @return {*}  {Graph.Data}
 */
export const processData = (
  data: Graph.Data,
  AccessorFns: Graph.AccessorFns,
): Graph.Data => {
  const {
    getEdgeSource,
    getEdgeTarget,
    getEdgeID,
    getEdgeLabel,
    getNodeID,
    getNodeLabel,
  } = AccessorFns;
  for (const node of data.nodes) {
    // Create data property if undefined
    if (isUndefined(node.data)) node.data = {};
    // Node Id is required
    node.id = getNodeID(node);
    // Give the display label of the node
    node.data.label = isUndefined(getNodeLabel) ? node.id : getNodeLabel(node);
    // Assign shortened label to node.label for graph display
    if (node.data.label.length >= 8) {
      node.label = `${node.data.label.substring(0, 5)}...`;
    } else {
      node.label = node.data.label;
    }
    // Label nodes which have no defined category as 'Other'
    node.data = {
      category: node.data.category ? node.data.category : 'Other',
      ...node.data,
    };
    // Add style property to node
    node.style = {
      nodeSize: 20,
      primaryColor: CATEGORIES_COLOR[node.data.category],
    };
  }
  for (const edge of data.edges) {
    // Id, source, target are required
    edge.id = getEdgeID(edge);
    edge.source = getEdgeSource(edge);
    edge.target = getEdgeTarget(edge);
    // Set id as label if undefined
    edge.label = isUndefined(getEdgeLabel) ? edge.id : getEdgeLabel(edge);
    edge.style = {
      endArrow: 'true',
    };
  }
  return data;
};

/**
 * Helper function to replace graph data with modified edges
 *
 * @param {Graph.Data} oldData
 * @param {Graph.Edge[]} newEdges
 * @return {*}  {Graph.Data}
 */
export const replaceEdges = (
  oldData: Graph.Data,
  newEdges: Graph.Edge[],
): Graph.Data => {
  const modData = { ...oldData };
  modData.edges = [...newEdges];
  return modData;
};

/**
 * Helper function to replace graph data with modified nodes and edges
 *
 * @param {Graph.Data} oldData
 * @param {Graph.Node[]} newNodes
 * @param {Graph.Edge[]} newEdges
 * @return {*}  {Graph.Data}
 */
export const replaceData = (
  oldData: Graph.Data,
  newNodes: Graph.Node[],
  newEdges: Graph.Edge[],
): Graph.Data => {
  const modData = { ...oldData };
  modData.edges = [...newEdges];
  modData.nodes = [...newNodes];
  return modData;
};

/**
 * Aggregates a given edge time attribute in the to time series counts, sorted based on time
 *
 * @param {Graph.Data} data
 * @param {Graph.EdgeAccessor<number>} getEdgeTime
 * @return {*}  {Graph.TimeSeries}
 */
export const datatoTS = (
  data: Graph.Data,
  getEdgeTime: Graph.EdgeAccessor<number>,
): Graph.TimeSeries =>
  // @ts-ignore
  isUndefined(getEdgeTime)
    ? []
    : data.edges
        .map((edge) => [getEdgeTime(edge) as number, 1])
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
 * @param {Graph.Data} newData
 * @param {Graph.Data} oldData
 * @return {*}  {Graph.Data}
 */
export const combineProcessedData = (
  newData: Graph.Data,
  oldData: Graph.Data,
): Graph.Data => {
  if (oldData) {
    const modData = { ...oldData };
    modData.nodes = removeDuplicates(
      [...newData.nodes, ...oldData.nodes],
      'id',
    );
    modData.edges = removeDuplicates(
      [...newData.edges, ...oldData.edges],
      'id',
    );
    return modData;
  }
  return newData;
};

/**
 * Main function to apply style.
 * Check if the graph is of group edges or non-group and apply the appropriate styling based on options.
 *
 * @param {Graph.Data} data
 * @param {Graph.StyleOptions} defaultOptions
 * @param {Graph.EdgeAccessor<number>} getEdgeWidth
 * @return {*}  {Graph.Data}
 */
export const applyStyle = (
  data: Graph.Data,
  defaultOptions: Graph.StyleOptions,
  getEdgeWidth: Graph.EdgeAccessor<number>,
): Graph.Data => {
  const { groupEdges, edgeWidth, nodeSize } = defaultOptions;
  if (groupEdges) {
    const styledEdges = styleGroupedEdge(data, edgeWidth, getEdgeWidth);
    const styledNodes = adjustNodeSize(data, nodeSize);
    return replaceData(data, styledNodes, styledEdges);
  }
  const styledEdges = styleEdge(data, edgeWidth, getEdgeWidth);
  const styledNodes = adjustNodeSize(data, nodeSize);
  return replaceData(data, styledNodes, styledEdges);
};

/**
 * Combine edges and replace edges with the new one
 *
 * @param {Graph.Data} data
 * @return {*}  {Graph.Data}
 */
export const groupEdges = (data: Graph.Data): Graph.Data => {
  const newEdges = combineEdges(data.edges);
  return { ...replaceEdges(data, newEdges) };
};

/**
 * Get visible graph by applying appropriate style
 *
 * @param {Graph.Data} graphData
 * @param {Graph.StyleOptions} styleOptions
 * @param {Graph.EdgeAccessor<number>} getEdgeWidth
 * @return {*}  {Graph.Data}
 */
export const deriveVisibleGraph = (
  graphData: Graph.Data,
  styleOptions: Graph.StyleOptions,
  getEdgeWidth: Graph.EdgeAccessor<number>,
): Graph.Data =>
  styleOptions.groupEdges
    ? applyStyle(groupEdges(graphData), styleOptions, getEdgeWidth)
    : applyStyle(graphData, styleOptions, getEdgeWidth);
