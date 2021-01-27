/* eslint-disable no-param-reassign */
import get from 'lodash/get';
import { WritableDraft } from 'immer/dist/types/types-external';
import { EdgeStyle, IUserEdge } from '@antv/graphin/lib/typings/type';
import {
  GraphData,
  EdgeStyleOptions,
  Edge,
  EdgeWidth,
  ArrowOptions,
} from '../redux/graph/types';
import { normalizeColor, NormalizedColor } from './style-utils';
import { DEFAULT_EDGE_STYLE } from '../containers/Graph/shape/constants';
import { EdgePattern, mapEdgePattern } from '../containers/Graph/shape/utils';

/**
 * Style an edge dataset based on a given method
 *
 * @param {GraphData} data
 * @param {EdgeStyleOptions} edgeStyleOptions
 * @return {*}  {Edge[]}
 */
export const styleEdges = (
  data: WritableDraft<GraphData>,
  edgeStyleOptions: EdgeStyleOptions,
): void => {
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

    const edgeLineWidth: number = Number(get(edge, propertyName)) ** (1 / 3);

    Object.assign(edgeStyle, {
      keyshape: Object.assign(keyshapeStyle, {
        lineWidth: edgeLineWidth,
      }),
    });

    Object.assign(edge, { style: edgeStyle });

    minp = edgeLineWidth < minp ? edgeLineWidth : minp;
    maxp = edgeLineWidth > maxp ? edgeLineWidth : maxp;
  });

  const rangepLength = maxp - minp;
  const rangevLength = visualRange[1] - visualRange[0];

  edges.forEach((edge: IUserEdge) => {
    Object.assign(edge.style.keyshape, {
      lineWidth:
        ((Number(get(edge, propertyName)) ** (1 / 3) - minp) / rangepLength) *
          rangevLength +
        visualRange[0],
    });
  });
};

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

export const styleEdgeWidthByProp = (
  data: GraphData,
  option: EdgeWidth,
): void => {
  if (option.id === 'property' && option.variable) {
    mapEdgeWidth(data.edges, option.variable, option.range);
  }
};

export const styleEdgeLabel = (
  edge: IUserEdge,
  edgeStyle: Partial<EdgeStyle>,
  label: string,
): void => {
  const labelStyle: Partial<EdgeStyle['label']> = edge.style?.label ?? {};

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

export const styleEdgeFontSize = (
  edgeStyle: Partial<EdgeStyle>,
  fontSize: number,
): void => {
  const edgeLabelStyle: Partial<EdgeStyle['label']> = edgeStyle.label ?? {};
  Object.assign(edgeLabelStyle, { fontSize });
  Object.assign(edgeStyle, { label: edgeLabelStyle });
};

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
