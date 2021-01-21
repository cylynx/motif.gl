/* eslint-disable no-param-reassign */
import get from 'lodash/get';
import {
  GraphData,
  EdgeStyleOptions,
  Edge,
  EdgeWidth,
  ArrowOptions,
} from '../redux/graph/types';

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
) => {
  // Separated out as it cannot be done in the loop
  if (edgeStyleOptions.width && edgeStyleOptions.width.id !== 'fixed') {
    styleEdgeWidthByProp(data, edgeStyleOptions.width);
  }

  // For perf reasons, batch style operations which require a single loop through nodes
  for (const edge of data.edges) {
    const edgeStyle = edge.style ?? {};

    if (edgeStyleOptions.width && edgeStyleOptions.width.id === 'fixed') {
      Object.assign(edgeStyle, {
        width: edgeStyleOptions.width.value,
      });
    }

    if (edgeStyleOptions.pattern) {
      styleEdgePattern(edgeStyle, edgeStyleOptions.pattern);
    }
    if (edgeStyleOptions.fontSize) {
      styleEdgeFontSize(edgeStyle, edgeStyleOptions.fontSize);
    }
    if (edgeStyleOptions.label) {
      styleEdgeLabel(edgeStyle, edgeStyleOptions.label);
    }
    if (edgeStyleOptions.arrow) {
      styleEdgeArrow(edgeStyle, edgeStyleOptions.arrow);
    }

    Object.assign(edge, {
      style: edgeStyle,
    });
  }
};

/**
 * Utility function to map a edge property between a given range
 *
 * @param {Edge[]} edges
 * @param {string} propertyName
 * @param {[number, number]} visualRange
 */
export const mapEdgeWidth = (
  edges: Edge[],
  propertyName: string,
  visualRange: [number, number],
) => {
  let minp = 9999999999;
  let maxp = -9999999999;
  edges.forEach((edge) => {
    edge.style.width = Number(get(edge, propertyName)) ** (1 / 3);
    minp = edge.style.width < minp ? edge.style.width : minp;
    maxp = edge.style.width > maxp ? edge.style.width : maxp;
  });
  const rangepLength = maxp - minp;
  const rangevLength = visualRange[1] - visualRange[0];
  edges.forEach((edge) => {
    edge.style.width =
      ((Number(get(edge, propertyName)) ** (1 / 3) - minp) / rangepLength) *
        rangevLength +
      visualRange[0];
  });
};

export const styleEdgeWidthByProp = (data: GraphData, option: EdgeWidth) => {
  if (option.id === 'property' && option.variable) {
    mapEdgeWidth(data.edges, option.variable, option.range);
  }
};

export const styleEdgeLabel = (edge: Edge, label: string) => {
  if (label === 'none') {
    edge.label = '';
  } else if (label !== 'label') {
    edge.label = get(edge, label, '').toString();
  }
};

export const styleEdgePattern = (edgeStyle: Edge, pattern: string) => {
  if (pattern === 'none') {
    delete edgeStyle.stroke;
  } else {
    Object.assign(edgeStyle, { stroke: pattern });
  }
};

export const styleEdgeFontSize = (edge: Edge, fontSize: number) => {
  edge.style.fontSize = fontSize;
};

export const styleEdgeArrow = (edge: Edge, arrow: ArrowOptions) => {
  const isArrowDisplay: boolean = arrow === 'display';
  edge.style.startArrow = isArrowDisplay;
  edge.style.endArrow = isArrowDisplay;
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
