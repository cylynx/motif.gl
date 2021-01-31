/* eslint-disable no-param-reassign */
import get from 'lodash/get';
import isUndefined from 'lodash/isUndefined';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ShapeStyle, ILabelConfig } from '@antv/g6';
import {
  GraphData,
  NodeStyleOptions,
  Node,
  Edge,
  NodeColor,
  NodeSize,
  NodeColorFixed,
  NodeColorLegend,
} from '../../../redux/graph/types';
import { CATEGORICAL_COLOR, DARK_GREY, GREY } from '../../../constants/colors';
import { normalizeColor } from '../../../utils/style-utils';
import { DEFAULT_NODE_STYLE } from '../../../constants/graph-shapes';

/**
 * Main function to style nodes
 *
 * @param {GraphData} data
 * @param {NodeStyleOptions} nodeStyleOptions
 * @return {void}
 */
export const styleNodes = (
  data: GraphData,
  nodeStyleOptions: NodeStyleOptions,
): void => {
  // Separated out as it cannot be done in the loop
  if (nodeStyleOptions.size && nodeStyleOptions.size.id !== 'fixed') {
    styleNodeSizeByProp(data, nodeStyleOptions.size);
  }

  // For perf reasons, batch style operations which require a single loop through nodes
  data.nodes.forEach((node: Node) => {
    const nodeStyle: ShapeStyle = node.style ?? {};

    if (nodeStyleOptions.size && nodeStyleOptions.size.id === 'fixed') {
      styleNodeSize(node, nodeStyleOptions.size.value);
    }
    if (nodeStyleOptions.color) {
      styleNodeColor(node, nodeStyle, nodeStyleOptions.color);
    }
    if (nodeStyleOptions.fontSize) {
      styleNodeFontSize(node, nodeStyleOptions.fontSize);
    }
    if (nodeStyleOptions.label) {
      styleNodeLabel(node, nodeStyleOptions.label);
    }

    Object.assign(node, {
      style: nodeStyle,
    });
  });
};

/**
 * Generate default nodes color map
 *
 * @param {Node[]} nodes
 * @param {NodeColor} options
 *
 * @return {void}
 */
export const generateDefaultColorMap = (
  nodes: Node[],
  options: NodeColor,
): void => {
  const uniqueKeys = [
    ...new Set(
      // @ts-ignore
      nodes.map((node) => get(node, options.variable)),
    ),
  ];
  const mapping = {};
  const MAX_LEGEND_SIZE = CATEGORICAL_COLOR.length;
  for (const [i, value] of uniqueKeys.entries()) {
    // Assign undefined to grey and all others to last of colors
    if (i < MAX_LEGEND_SIZE && !isUndefined(value)) {
      // @ts-ignore
      mapping[value] = CATEGORICAL_COLOR[i];
    } else if (isUndefined(value)) {
      // eslint-disable-next-line @typescript-eslint/dot-notation
      mapping['undefined'] = DARK_GREY;
    } else {
      // eslint-disable-next-line prefer-destructuring
      // @ts-ignore
      mapping[value] = CATEGORICAL_COLOR[MAX_LEGEND_SIZE - 1];
    }
  }
  // @ts-ignore
  options.mapping = mapping;
};

/**
 * Utility function to map a node property between a given range
 *
 * @param {Node[]} nodes
 * @param {string} propertyName
 * @param {[number, number]} visualRange
 *
 * @return {void}
 */
export const mapNodeSize = (
  nodes: Node[],
  propertyName: string,
  visualRange: [number, number],
): void => {
  let minp = 9999999999;
  let maxp = -9999999999;

  nodes.forEach((node: Node) => {
    let nodeStyleSize = Number(get(node, propertyName)) ** (1 / 3);

    minp = nodeStyleSize < minp ? nodeStyleSize : minp;
    maxp = nodeStyleSize > maxp ? nodeStyleSize : maxp;

    nodeStyleSize = Number.isNaN(nodeStyleSize)
      ? DEFAULT_NODE_STYLE.size
      : nodeStyleSize;
    node.size = nodeStyleSize;
  });

  const rangepLength = maxp - minp;
  const rangevLength = visualRange[1] - visualRange[0];
  nodes.forEach((node: Node) => {
    let nodeSize =
      ((Number(get(node, propertyName)) ** (1 / 3) - minp) / rangepLength) *
        rangevLength +
      visualRange[0];
    nodeSize = Number.isNaN(nodeSize) ? DEFAULT_NODE_STYLE.size : nodeSize;

    node.size = nodeSize;
  });
};

/**
 * Style node size based on a given method
 *
 * @param {GraphData} data
 * @param {(string | undefined)} option
 * @param {string} option
 *
 * @return {void}
 */
export const styleNodeSizeByProp = (
  data: GraphData,
  option: NodeSize,
): void => {
  if (option.id === 'degree') {
    data.nodes.forEach((node) => {
      node.degree = 0;
      data.edges.forEach((edge) => {
        if (edge.source === node.id || edge.target === node.id) {
          node.degree = Number(node.degree) + 1;
        }
      });
    });
    mapNodeSize(data.nodes, 'degree', option.range);
  } else if (option.id === 'property' && option.variable) {
    mapNodeSize(data.nodes, option.variable, option.range);
  }
};

/**
 * Style Node Size based on given values.
 *
 * @param node
 * @param size
 *
 * @return {void}
 */
export const styleNodeSize = (node: Node, size: number): void => {
  node.size = size;
};

/**
 * Style Node's Font Size based on given values.
 *
 * @param node
 * @param fontSize
 *
 * @return {void}
 */
export const styleNodeFontSize = (node: Node, fontSize: number): void => {
  const labelConfig: ILabelConfig = node.labelCfg ?? {};
  const labelConfigStyle = labelConfig.style ?? {};

  Object.assign(labelConfigStyle, { fontSize });
  Object.assign(labelConfig, { style: labelConfigStyle });
  Object.assign(node, { labelCfg: labelConfig });
};

/**
 * Style Node Label based on given Node Style Options
 *
 * @param {Node} node
 * @param {ShapeStyle} nodeStyle
 * @param {string} label
 * @return {void}
 */
export const styleNodeLabel = (node: Node, label: string): void => {
  if (label !== 'label') {
    let customLabel = '';
    customLabel = get(node, label, '').toString();
    node.label = customLabel;
  }
};

/**
 * Style Node Color based on values given by:
 * 1. Node Option Filters
 * 2. Legend Selection
 *
 * @param {Node} node
 * @param {ShapeStyle} nodeStyle
 * @param {NodeColor} option
 * @return {void}
 */
export const styleNodeColor = (
  node: Node,
  nodeStyle: ShapeStyle,
  option: NodeColor,
): void => {
  const { id } = option;

  if (id === 'fixed') {
    const { value } = option as NodeColorFixed;
    const fixedNodeColor = normalizeColor(value);

    Object.assign(nodeStyle, {
      fill: fixedNodeColor.dark,
      stroke: fixedNodeColor.normal,
    });

    return;
  }

  const { variable, mapping } = option as NodeColorLegend;
  const variableProperty: string | unknown = get(node, variable);

  if (variableProperty) {
    const nodeColor = normalizeColor(mapping[variableProperty as string]);

    Object.assign(nodeStyle, {
      fill: nodeColor.dark,
      stroke: nodeColor.normal,
    });

    return;
  }

  const grey = normalizeColor(GREY);
  Object.assign(nodeStyle, {
    fill: grey.dark,
    stroke: grey.normal,
  });
};

/**
 * Filter all edges which contains a given node id as source or target
 *
 * @param {GraphData} data
 * @param {string} id node id
 *
 * @return {Edge[]}
 */
export const findConnectedEdges = (data: GraphData, id: string): Edge[] =>
  data.edges.filter((e) => e.source === id || e.target === id);

/**
 * Get degree of a given node id
 *
 * @param {GraphData} data
 * @param {string} id node id
 *
 * @return {number}
 */
export const getDegree = (data: GraphData, id: string): number =>
  findConnectedEdges(data, id).length;

/**
 * Get degree of a given graph keyed by node id
 *
 * @param {GraphData} data
 * @return {*}  {(Record<string | number, number>)}
 */
export const getGraphDegree = (
  data: GraphData,
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
