/* eslint-disable no-param-reassign */
import get from 'lodash/get';
import groupBy from 'lodash/groupBy';
import { EdgeStyle, IUserEdge } from '@antv/graphin/lib/typings/type';
import {
  GraphData,
  EdgeStyleOptions,
  Edge,
  EdgeWidth,
  ArrowOptions,
} from '../../../redux/graph/types';
import { normalizeColor, NormalizedColor } from '../../../utils/style-utils';
import { DEFAULT_EDGE_STYLE } from '../../../constants/graph-shapes';
import { EdgePattern, mapEdgePattern } from '../shape/utils';

const edgeColor = normalizeColor(DEFAULT_EDGE_STYLE.color);

/**
 * Style an edge dataset based on a given method
 *
 * @param {GraphData} data
 * @param {EdgeStyleOptions} edgeStyleOptions
 * @return {*}  {Edge[]}
 */
export const styleEdges = (
  data: GraphData,
  edgeStyleOptions: EdgeStyleOptions,
): void => {
  // Assign edge type - line, loop or quadratic
  // deriveEdgeType(data);

  // Separated out as it cannot be done in the loop
  if (edgeStyleOptions.width && edgeStyleOptions.width.id !== 'fixed') {
    styleEdgeWidthByProp(data, edgeStyleOptions.width);
  }

  // For perf reasons, batch style operations which require a single loop through nodes
  data.edges.forEach((edge: IUserEdge) => {
    const edgeStyle: Partial<EdgeStyle> = edge.style ?? {};

    if (edgeStyleOptions.width && edgeStyleOptions.width.id === 'fixed') {
      styleLineWidth(edgeStyle, edgeStyleOptions.width.value);
    }

    if (edgeStyleOptions.pattern) {
      styleEdgePattern(edgeStyle, edgeStyleOptions.pattern);
    }
    if (edgeStyleOptions.fontSize) {
      styleEdgeFontSize(edgeStyle, edgeStyleOptions.fontSize);
    }
    if (edgeStyleOptions.label) {
      styleEdgeLabel(edge, edgeStyle, edgeStyleOptions.label);
    }
    if (edgeStyleOptions.arrow) {
      // styleEdgeArrow(edgeStyle, edgeStyleOptions.arrow);
    }

    Object.assign(edge, {
      style: edgeStyle,
    });
  });
};

/**
 * Utility function to map a edge property between a given range
 *
 * @param {Edge[]} edges
 * @param {string} propertyName
 * @param {[number, number]} visualRange
 */
export const mapEdgeWidth = (
  edges: IUserEdge[],
  propertyName: string,
  visualRange: [number, number],
): void => {
  let minp = 9999999999;
  let maxp = -9999999999;

  edges.forEach((edge: IUserEdge) => {
    const edgeStyle: Partial<EdgeStyle> = edge.style ?? {};
    const keyshapeStyle: Partial<EdgeStyle['keyshape']> =
      edgeStyle.keyshape ?? {};

    let edgeLineWidth = Number(get(edge, propertyName)) ** (1 / 3);

    minp = edgeLineWidth < minp ? edgeLineWidth : minp;
    maxp = edgeLineWidth > maxp ? edgeLineWidth : maxp;

    edgeLineWidth = Number.isNaN(edgeLineWidth)
      ? DEFAULT_EDGE_STYLE.width
      : edgeLineWidth;

    Object.assign(edgeStyle, {
      keyshape: Object.assign(keyshapeStyle, {
        lineWidth: edgeLineWidth,
        stroke: keyshapeStyle.stroke ?? edgeColor.normal,
      }),
    });

    Object.assign(edge, { style: edgeStyle });
  });

  const rangepLength = maxp - minp;
  const rangevLength = visualRange[1] - visualRange[0];

  edges.forEach((edge: IUserEdge) => {
    let edgeLineWidth =
      ((Number(get(edge, propertyName)) ** (1 / 3) - minp) / rangepLength) *
        rangevLength +
      visualRange[0];

    edgeLineWidth = Number.isNaN(edgeLineWidth)
      ? DEFAULT_EDGE_STYLE.width
      : edgeLineWidth;

    Object.assign(edge.style.keyshape, {
      lineWidth: edgeLineWidth,
    });
  });
};

/**
 * Style Line Width based on Edge Filter Options
 *
 * @param {Partial<EdgeStyle>} edgeStyle
 * @param {number} lineWidth
 * @return {void}
 */
export const styleLineWidth = (
  edgeStyle: Partial<EdgeStyle>,
  lineWidth: number,
): void => {
  const keyShapeStyle: Partial<EdgeStyle['keyshape']> =
    edgeStyle.keyshape ?? {};

  const edgeFontColor: NormalizedColor = normalizeColor(
    DEFAULT_EDGE_STYLE.fontColor,
  );

  Object.assign(keyShapeStyle, {
    lineWidth,
    stroke: edgeFontColor.dark,
  });

  Object.assign(edgeStyle, { keyshape: keyShapeStyle });
};

/**
 * Style Edge width based on given value in Edge Filter Options
 *
 * @param {GraphData} data
 * @param {EdgeWidth} option
 * @return {void}
 */
export const styleEdgeWidthByProp = (
  data: GraphData,
  option: EdgeWidth,
): void => {
  if (option.id === 'property' && option.variable) {
    mapEdgeWidth(data.edges, option.variable, option.range);
  }
};

/**
 * Style Edge Label based on given value in Edge Filter Options
 * @param {IUserEdge} edge
 * @param {Partial<EdgeStyle>} edgeStyle
 * @param {string} label
 * @return {void}
 */
export const styleEdgeLabel = (
  edge: IUserEdge,
  edgeStyle: Partial<EdgeStyle>,
  label: string,
): void => {
  const labelStyle: Partial<EdgeStyle['label']> = edgeStyle.label ?? {};

  let customLabel = '';

  if (label !== 'label') {
    customLabel = get(edge, label, '').toString();
  }

  Object.assign(labelStyle, {
    value: customLabel,
  });

  Object.assign(edgeStyle, {
    label: labelStyle,
  });
};

export const styleEdgePattern = (
  edgeStyle: Partial<EdgeStyle>,
  pattern: EdgePattern,
): void => {
  const edgeKeyshape: Partial<EdgeStyle['keyshape']> = edgeStyle.keyshape ?? {};

  if (pattern === 'none') {
    delete edgeKeyshape.lineDash;
    return;
  }

  Object.assign(edgeKeyshape, { lineDash: mapEdgePattern(pattern) });
  Object.assign(edgeStyle, { keyshape: edgeKeyshape });
};

/**
 * Style Edge Font Size with given value by Edge Style Filter
 *
 * @param edgeStyle
 * @param fontSize
 * @return {void}
 */
export const styleEdgeFontSize = (
  edgeStyle: Partial<EdgeStyle>,
  fontSize: number,
): void => {
  const edgeLabelStyle: Partial<EdgeStyle['label']> = edgeStyle.label ?? {};
  Object.assign(edgeLabelStyle, { fontSize });
  Object.assign(edgeStyle, { label: edgeLabelStyle });
};

/**
 * Style Edge's arrow with given value by Edge Style Filter
 * @param edgeStyle
 * @param arrow
 * @return {void}
 */
export const styleEdgeArrow = (
  edgeStyle: Partial<EdgeStyle>,
  arrow: ArrowOptions,
): void => {
  const isArrowDisplay: boolean = arrow === 'display';
  Object.assign(edgeStyle, {
    startArrow: isArrowDisplay,
    endArrow: isArrowDisplay,
  });
};

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
export const isGroupEdges = (edge: Edge, edgeWidth: string): boolean =>
  Array.isArray(get(edge, edgeWidth));

/**
 * Get minimum and maximum value of attribute that maps to edge width
 *
 * @param {GraphData} data
 * @param {string} edgeWidth accesor string that maps to edge width
 * @return  {MinMax}
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
 * Derive edge type (line, loop or quadratic) based on a given GraphData.
 * Assign type = loop if edges have the same source and target.
 * Assign type = line if the edge is the only edge connecting the two nodes.
 * Assign type = quadratic if the edge is one of many connecting the two nodes.
 * Quadratic edges are assigned an offset and bundled based on their source and target.
 *
 * @param {GraphData} data
 */
export const deriveEdgeType = (data: GraphData): void => {
  const noLoopEdges = data.edges.filter((edge) => edge.source !== edge.target);
  const loopEdges = data.edges.filter((edge) => edge.source === edge.target);
  const groups = groupBy(noLoopEdges, (edge) => {
    // a => b !== b => a
    return `${edge.source}-${edge.target}`;
  });

  for (const edge of loopEdges) {
    edge.type = 'loop';
  }

  for (const edge of noLoopEdges) {
    const group = groups[`${edge.source}-${edge.target}`];
    const revGroup = groups[`${edge.target}-${edge.source}`] || [];
    const isBidirection = revGroup.length > 0;
    if (group.length === 1 && !isBidirection) {
      edge.type = 'line';
    } else if (group.length > 1 && !isBidirection) {
      // If single direction, alternate the edges offset e.g. 20, -20, 40, -40
      edge.type = 'quadratic';
      const index = group.findIndex((e) => e.id === edge.id);
      const EVEN_OFFSET = group.length % 2 === 0 ? 1 : 0;
      const OFFSET = Math.round((index + EVEN_OFFSET) / 2) * 20;
      edge.curveOffset = index % 2 === 0 ? OFFSET : -OFFSET;
    } else {
      // If bidirectional, each direction will have it's own distinct group
      edge.type = 'quadratic';
      const index = group.findIndex((e) => e.id === edge.id);
      const OFFSET = (index + 1) * 20;
      edge.curveOffset = -OFFSET;
    }
  }
};
