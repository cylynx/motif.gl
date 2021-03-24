/* eslint-disable no-param-reassign */
import get from 'lodash/get';
import isUndefined from 'lodash/isUndefined';
import { NodeStyle } from '@antv/graphin/lib/typings/type';
import {
  GraphData,
  NodeStyleOptions,
  Node,
  NodeColor,
  NodeSize,
  NodeColorFixed,
  NodeColorLegend,
  Edge,
  NodeSizeFixed,
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
    styleNodeSizeByProp(data, nodeStyleOptions);
  }

  data.nodes.forEach((node: Node) => {
    const nodeStyle: Partial<NodeStyle> = node.style ?? {};

    const { size, color, fontSize, label } = nodeStyleOptions;

    if (nodeStyleOptions.size && nodeStyleOptions.size.id === 'fixed') {
      const { value } = size as NodeSizeFixed;
      styleNodeSize(nodeStyle, value);
      styleNodeIcon(node, nodeStyle, color, value);
    }
    if (nodeStyleOptions.color) {
      styleNodeColor(node, nodeStyle, color);
    }
    if (nodeStyleOptions.fontSize) {
      styleNodeFontSize(nodeStyle, fontSize);
    }
    if (nodeStyleOptions.label) {
      styleNodeLabel(node, nodeStyle, label);
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
  nodeStyleOptions: NodeStyleOptions,
): void => {
  let minp = 9999999999;
  let maxp = -9999999999;

  nodes.forEach((node: Node) => {
    const nodeStyle: Partial<NodeStyle> = node.style ?? {};
    const keyshapeStyle: Partial<NodeStyle['keyshape']> =
      nodeStyle?.keyshape ?? {};

    let nodeStyleSize = Number(get(node, propertyName)) ** (1 / 3);

    minp = nodeStyleSize < minp ? nodeStyleSize : minp;
    maxp = nodeStyleSize > maxp ? nodeStyleSize : maxp;

    nodeStyleSize = Number.isNaN(nodeStyleSize)
      ? DEFAULT_NODE_STYLE.keyshape.size
      : nodeStyleSize;

    Object.assign(nodeStyle, {
      keyshape: Object.assign(keyshapeStyle, {
        size: nodeStyleSize,
      }),
    });

    Object.assign(node, { style: nodeStyle });
  });

  const rangepLength = maxp - minp;
  const rangevLength = visualRange[1] - visualRange[0];
  nodes.forEach((node: Node) => {
    const nodeStyle: Partial<NodeStyle> = node.style ?? {};
    const { color } = nodeStyleOptions;
    let nodeSize =
      ((Number(get(node, propertyName)) ** (1 / 3) - minp) / rangepLength) *
        rangevLength +
      visualRange[0];
    nodeSize = Number.isNaN(nodeSize)
      ? DEFAULT_NODE_STYLE.keyshape.size
      : nodeSize;

    Object.assign(node.style.keyshape, {
      size: nodeSize,
    });

    styleNodeIcon(node, nodeStyle, color, nodeSize);
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
  nodeStyleOptions: NodeStyleOptions,
): void => {
  const option = nodeStyleOptions.size;
  if (option.id === 'degree') {
    data.nodes.forEach((node) => {
      node.degree = 0;
      data.edges.forEach((edge) => {
        if (edge.source === node.id || edge.target === node.id) {
          node.degree = Number(node.degree) + 1;
        }
      });
    });
    mapNodeSize(data.nodes, 'degree', option.range, nodeStyleOptions);
  } else if (option.id === 'property' && option.variable) {
    mapNodeSize(data.nodes, option.variable, option.range, nodeStyleOptions);
  }
};

/**
 * Style Node Size based on given values.
 *
 * @param nodeStyle
 * @param size
 *
 * @return {void}
 */
export const styleNodeSize = (
  nodeStyle: Partial<NodeStyle>,
  size: number,
): void => {
  const keyShapeStyle: Partial<NodeStyle['keyshape']> =
    nodeStyle.keyshape ?? {};

  Object.assign(keyShapeStyle, {
    size,
  });

  const labelStyle: Partial<NodeStyle['label']> = nodeStyle.label ?? {};

  Object.assign(nodeStyle, {
    keyshape: keyShapeStyle,
    label: labelStyle,
  });
};

/**
 * Style Node's Font Size based on given values.
 *
 * @param nodeStyle
 * @param fontSize
 *
 * @return {void}
 */
export const styleNodeFontSize = (
  nodeStyle: Partial<NodeStyle>,
  fontSize: number,
): void => {
  const labelStyle: Partial<NodeStyle['label']> = nodeStyle.label ?? {
    position: 'bottom',
  };
  Object.assign(labelStyle, { fontSize });
  Object.assign(nodeStyle, { label: labelStyle });
};

/**
 * Style Node Label based on given Node Style Options
 *
 * @param {Node} node
 * @param {Partial<NodeStyle>} nodeStyle
 * @param {string} label
 * @return {void}
 */
export const styleNodeLabel = (
  node: Node,
  nodeStyle: Partial<NodeStyle>,
  label: string,
): void => {
  const labelStyle: Partial<NodeStyle['label']> = nodeStyle.label ?? {};
  const customLabel = get(node, label, '').toString();

  if (label === 'none') {
    Object.assign(labelStyle, { visible: false });
    Object.assign(nodeStyle, { label: labelStyle });
    return;
  }

  Object.assign(labelStyle, {
    value: customLabel,
    visible: true,
  });
  Object.assign(nodeStyle, { label: labelStyle });
};

/**
 * Style Node Color based on values given by:
 * 1. Node Option Filters
 * 2. Legend Selection
 *
 * @param {Node} node
 * @param {Partial<NodeStyle>} nodeStyle
 * @param {NodeColor} option
 * @return {void}
 */
export const styleNodeColor = (
  node: Node,
  nodeStyle: Partial<NodeStyle>,
  option: NodeColor,
): void => {
  const { id } = option;
  const nodeKeyShape: Partial<NodeStyle['keyshape']> = nodeStyle.keyshape ?? {};
  const nodeHalo: Partial<NodeStyle['halo']> = nodeStyle.halo ?? {};

  if (id === 'fixed') {
    const { value } = option as NodeColorFixed;
    const fixedNodeColor = normalizeColor(value);

    Object.assign(nodeStyle, {
      keyshape: Object.assign(nodeKeyShape, {
        fill: fixedNodeColor.dark,
        stroke: fixedNodeColor.normal,
      }),
      halo: Object.assign(nodeHalo, {
        fill: fixedNodeColor.normal,
        stroke: fixedNodeColor.reflect,
      }),
    });

    return;
  }

  const { variable, mapping } = option as NodeColorLegend;
  const variableProperty: string | unknown = get(node, variable);
  const grey = normalizeColor(GREY);

  if (variableProperty) {
    const nodeColor = normalizeColor(mapping[variableProperty as string]);

    Object.assign(nodeStyle, {
      keyshape: Object.assign(nodeKeyShape, {
        fill: nodeColor.dark,
        stroke: nodeColor.normal,
      }),
      halo: Object.assign(nodeHalo, {
        fill: nodeColor.normal,
        stroke: nodeColor.reflect,
      }),
    });

    return;
  }

  Object.assign(nodeStyle, {
    keyshape: Object.assign(nodeKeyShape, {
      fill: grey.dark,
      stroke: grey.normal,
    }),
    halo: Object.assign(nodeHalo, {
      fill: grey.normal,
      stroke: grey.reflect,
    }),
  });
};

export const styleNodeIcon = (
  node: Node,
  nodeStyle: Partial<NodeStyle>,
  color: NodeColor,
  keyshapeSize: number = DEFAULT_NODE_STYLE.keyshape.size,
) => {
  const nodePadding = Math.round(keyshapeSize / 3);
  const iconStyle = nodeStyle.icon ?? {
    type: 'font',
    size: keyshapeSize - nodePadding,
    fontFamily: 'Material Icons',
  };

  const iconProperty = node.icon ?? get(node, 'style.icon.value', '');
  iconStyle.value = iconProperty;
  iconStyle.size = keyshapeSize - nodePadding;

  const { id } = color;
  if (id === 'fixed') {
    const { value } = color as NodeColorFixed;
    const fixedNodeColor = normalizeColor(value);
    iconStyle.fill = fixedNodeColor.normal;
    Object.assign(nodeStyle, { icon: iconStyle });
    return;
  }

  const { variable, mapping } = color as NodeColorLegend;
  const variableProperty: string | unknown = get(node, variable);

  if (variableProperty) {
    const nodeColor = normalizeColor(mapping[variableProperty as string]);
    iconStyle.fill = nodeColor.normal;
    Object.assign(nodeStyle, { icon: iconStyle });

    return;
  }

  const grey = normalizeColor(GREY);
  iconStyle.fill = grey.normal;
  Object.assign(nodeStyle, { icon: iconStyle });
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
